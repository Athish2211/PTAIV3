"""
PTAI v3 — RBAC: Roles, Permissions, and FastAPI dependencies.
"""
from enum import Enum
from typing import Callable
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token

bearer_scheme = HTTPBearer()


class Role(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    DOCTOR = "DOCTOR"
    NURSE = "NURSE"
    ANALYST = "ANALYST"
    RECEPTIONIST = "RECEPTIONIST"


class Permission(str, Enum):
    PATIENT_READ = "patient.read"
    PATIENT_CREATE = "patient.create"
    PATIENT_UPDATE = "patient.update"
    PATIENT_DELETE = "patient.delete"
    PRESCRIPTION_CREATE = "prescription.create"
    PRESCRIPTION_READ = "prescription.read"
    PRESCRIPTION_FINALIZE = "prescription.finalize"
    PRESCRIPTION_UPLOAD = "prescription.upload"
    ANALYTICS_READ = "analytics.read"
    ANALYTICS_RUN = "analytics.run"
    DATASET_UPLOAD = "dataset.upload"
    AI_QUERY = "ai.query"
    AUDIT_READ = "audit.read"
    USER_MANAGE = "user.manage"
    DOCUMENT_UPLOAD = "document.upload"
    DOCUMENT_READ = "document.read"


# Permissions by role
ROLE_PERMISSIONS: dict[Role, list[Permission]] = {
    Role.SUPER_ADMIN: list(Permission),
    Role.ADMIN: [
        Permission.PATIENT_READ, Permission.PATIENT_CREATE, Permission.PATIENT_UPDATE,
        Permission.PRESCRIPTION_CREATE, Permission.PRESCRIPTION_READ, Permission.PRESCRIPTION_FINALIZE,
        Permission.PRESCRIPTION_UPLOAD, Permission.ANALYTICS_READ, Permission.ANALYTICS_RUN,
        Permission.DATASET_UPLOAD, Permission.AI_QUERY, Permission.AUDIT_READ, Permission.USER_MANAGE,
        Permission.DOCUMENT_UPLOAD, Permission.DOCUMENT_READ,
    ],
    Role.DOCTOR: [
        Permission.PATIENT_READ, Permission.PATIENT_CREATE, Permission.PATIENT_UPDATE,
        Permission.PRESCRIPTION_CREATE, Permission.PRESCRIPTION_READ, Permission.PRESCRIPTION_FINALIZE,
        Permission.PRESCRIPTION_UPLOAD, Permission.ANALYTICS_READ, Permission.AI_QUERY,
        Permission.DOCUMENT_UPLOAD, Permission.DOCUMENT_READ,
    ],
    Role.NURSE: [
        Permission.PATIENT_READ, Permission.PATIENT_UPDATE,
        Permission.PRESCRIPTION_READ, Permission.AI_QUERY,
        Permission.DOCUMENT_READ,
    ],
    Role.ANALYST: [
        Permission.PATIENT_READ, Permission.ANALYTICS_READ, Permission.ANALYTICS_RUN,
        Permission.DATASET_UPLOAD, Permission.AI_QUERY, Permission.DOCUMENT_READ,
    ],
    Role.RECEPTIONIST: [
        Permission.PATIENT_READ, Permission.PATIENT_CREATE, Permission.PRESCRIPTION_READ,
    ],
}


async def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
):
    """Decode and validate JWT, return payload dict."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


async def get_current_user(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """Get the current authenticated user from DB."""
    from app.repositories.user_repository import UserRepository
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return user


def require_permission(permission: Permission) -> Callable:
    """Dependency factory that requires a specific permission."""
    async def dependency(current_user=Depends(get_current_user)):
        user_role = Role(current_user.role)
        allowed_perms = ROLE_PERMISSIONS.get(user_role, [])
        if permission not in allowed_perms:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission.value} required",
            )
        return current_user
    return dependency


def require_role(*roles: Role) -> Callable:
    """Dependency factory that requires one of the given roles."""
    async def dependency(current_user=Depends(get_current_user)):
        if Role(current_user.role) not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role for this operation",
            )
        return current_user
    return dependency
