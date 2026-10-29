"""
Authentication API endpoints.
Implements: login, refresh, logout, MFA setup/verify, password reset.
"""
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import (
    verify_password, create_access_token, create_refresh_token,
    decode_refresh_token, generate_mfa_secret, get_mfa_totp_uri,
    verify_mfa_token, generate_secure_token, hash_password, validate_password_strength
)
from app.core.rbac import get_current_user
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository

router = APIRouter(prefix="/auth")

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


# ── Schemas ───────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MFAVerifyRequest(BaseModel):
    mfa_code: str
    temp_token: str  # Short-lived token issued after password is verified


class RefreshRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str


class MFASetupRequest(BaseModel):
    mfa_code: str  # Must verify before enabling


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    requires_mfa: bool = False
    temp_token: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────

def _hash_ip(request: Request) -> str:
    ip = request.client.host if request.client else "unknown"
    return hashlib.sha256(ip.encode()).hexdigest()[:16]


async def _log_auth_event(
    db: AsyncSession,
    action: str,
    user_id: str | None,
    request: Request,
    success: bool = True,
    metadata: dict | None = None,
):
    repo = AuditRepository(db)
    await repo.log(
        action=action,
        user_id=user_id,
        resource_type="auth",
        ip_hash=_hash_ip(request),
        request_id=getattr(request.state, "request_id", None),
        success=success,
        metadata=metadata,
    )


# ── Endpoints ─────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str = "doctor" # "doctor" or "admin"
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None

@router.post("/signup", response_model=TokenResponse, summary="Register a new user")
async def signup(
    payload: SignupRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    valid, msg = validate_password_strength(payload.password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    repo = UserRepository(db)
    existing = await repo.get_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    from app.models.user import User
    new_user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role if payload.role in ["doctor", "admin"] else "doctor",
        specialization=payload.specialization,
        license_number=payload.license_number,
        phone=payload.phone,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token_data = {
        "sub": str(new_user.id),
        "org": None,
        "role": new_user.role,
        "email": new_user.email,
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    await repo.store_refresh_token(
        user_id=str(new_user.id),
        token_hash=token_hash,
        expires_days=7,
        ip_hash=_hash_ip(request),
    )

    await _log_auth_event(db, "signup.success", str(new_user.id), request)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)

@router.post("/login", response_model=TokenResponse, summary="Login with email/password")
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    user = await repo.get_by_email(payload.email)

    # Generic error — don't reveal if user exists
    INVALID_CREDS = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

    if not user or not user.is_active:
        await _log_auth_event(db, "login.failed", None, request, False, {"reason": "user_not_found"})
        raise INVALID_CREDS

    # Check lockout
    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        await _log_auth_event(db, "login.blocked", str(user.id), request, False, {"reason": "account_locked"})
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Account temporarily locked. Try again after {user.locked_until.strftime('%H:%M UTC')}",
        )

    if not verify_password(payload.password, user.hashed_password):
        # Increment failed attempts
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
        await repo.save(user)
        await _log_auth_event(db, "login.failed", str(user.id), request, False, {"reason": "wrong_password"})
        raise INVALID_CREDS

    # Reset failed attempts on success
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.now(timezone.utc)
    await repo.save(user)

    token_data = {
        "sub": str(user.id),
        "org": str(user.organization_id) if user.organization_id else None,
        "role": user.role,
        "email": user.email,
    }

    if user.mfa_enabled:
        # Issue a short-lived temp token — user must pass MFA to get real tokens
        temp_token = create_access_token({**token_data, "mfa_pending": True})
        await _log_auth_event(db, "login.mfa_required", str(user.id), request)
        return TokenResponse(
            access_token="",
            refresh_token="",
            requires_mfa=True,
            temp_token=temp_token,
        )

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Store refresh token hash
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    await repo.store_refresh_token(
        user_id=str(user.id),
        token_hash=token_hash,
        expires_days=7,
        ip_hash=_hash_ip(request),
    )

    await _log_auth_event(db, "login.success", str(user.id), request)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/mfa/verify", response_model=TokenResponse, summary="Verify MFA code")
async def verify_mfa(
    payload: MFAVerifyRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    from app.core.security import decode_access_token
    temp_payload = decode_access_token(payload.temp_token)
    if not temp_payload or not temp_payload.get("mfa_pending"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    repo = UserRepository(db)
    user = await repo.get_by_id(temp_payload["sub"])
    if not user or not user.mfa_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="MFA not configured")

    if not verify_mfa_token(user.mfa_secret, payload.mfa_code):
        await _log_auth_event(db, "mfa.failed", str(user.id), request, False)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid MFA code")

    token_data = {
        "sub": str(user.id),
        "org": str(user.organization_id) if user.organization_id else None,
        "role": user.role,
        "email": user.email,
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    await repo.store_refresh_token(str(user.id), token_hash, 7, _hash_ip(request))

    await _log_auth_event(db, "mfa.success", str(user.id), request)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh_token(
    payload: RefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    token_payload = decode_refresh_token(payload.refresh_token)
    if not token_payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    repo = UserRepository(db)
    token_hash = hashlib.sha256(payload.refresh_token.encode()).hexdigest()
    is_valid = await repo.validate_refresh_token(token_hash)

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked or expired")

    # Rotate: revoke old token, issue new pair
    await repo.revoke_refresh_token(token_hash)

    user = await repo.get_by_id(token_payload["sub"])
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    token_data = {"sub": str(user.id), "org": str(user.organization_id) if user.organization_id else None, "role": user.role, "email": user.email}
    new_access = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    new_hash = hashlib.sha256(new_refresh.encode()).hexdigest()
    await repo.store_refresh_token(str(user.id), new_hash, 7, _hash_ip(request))

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


@router.post("/logout", summary="Logout (revoke refresh token)")
async def logout(
    payload: RefreshRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    token_hash = hashlib.sha256(payload.refresh_token.encode()).hexdigest()
    await repo.revoke_refresh_token(token_hash)
    await _log_auth_event(db, "logout", str(current_user.id), request)
    return {"message": "Logged out successfully"}


@router.post("/mfa/setup", summary="Set up MFA — get QR URI")
async def setup_mfa(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="MFA is already enabled")
    secret = generate_mfa_secret()
    # Store secret temporarily (encrypted)
    repo = UserRepository(db)
    await repo.set_pending_mfa_secret(str(current_user.id), secret)
    uri = get_mfa_totp_uri(secret, current_user.email)
    return {"totp_uri": uri, "secret": secret}  # Return secret once for manual entry


@router.post("/mfa/enable", summary="Confirm and enable MFA")
async def enable_mfa(
    payload: MFASetupRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    user = await repo.get_by_id(str(current_user.id))
    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="Call /mfa/setup first")
    if not verify_mfa_token(user.mfa_secret, payload.mfa_code):
        raise HTTPException(status_code=400, detail="Invalid MFA code")
    user.mfa_enabled = True
    await repo.save(user)
    return {"message": "MFA enabled successfully"}


@router.post("/password-reset/request", summary="Request password reset email")
async def request_password_reset(
    payload: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
):
    # Always return success to prevent email enumeration
    repo = UserRepository(db)
    user = await repo.get_by_email(payload.email)
    if user and user.is_active:
        token = generate_secure_token()
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        await repo.create_password_reset_token(str(user.id), token_hash)
        # TODO: Send email with token
    return {"message": "If the email is registered, a reset link has been sent"}


@router.post("/password-reset/confirm", summary="Confirm password reset")
async def confirm_password_reset(
    payload: PasswordResetConfirmRequest,
    db: AsyncSession = Depends(get_db),
):
    valid, msg = validate_password_strength(payload.new_password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    repo = UserRepository(db)
    import hashlib
    token_hash = hashlib.sha256(payload.token.encode()).hexdigest()
    user = await repo.get_user_by_reset_token(token_hash)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user.hashed_password = hash_password(payload.new_password)
    await repo.mark_reset_token_used(token_hash)
    await repo.save(user)
    return {"message": "Password reset successfully"}
