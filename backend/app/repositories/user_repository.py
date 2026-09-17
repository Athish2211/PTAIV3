"""User repository."""
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, RefreshToken, PasswordResetToken
import hashlib


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == uuid.UUID(user_id)))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email.lower()))
        return result.scalar_one_or_none()

    async def save(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def store_refresh_token(self, user_id: str, token_hash: str, expires_days: int, ip_hash: str = None):
        token = RefreshToken(
            user_id=uuid.UUID(user_id),
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(days=expires_days),
            ip_hash=ip_hash,
        )
        self.db.add(token)
        await self.db.commit()

    async def validate_refresh_token(self, token_hash: str) -> bool:
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.is_revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
        )
        return result.scalar_one_or_none() is not None

    async def revoke_refresh_token(self, token_hash: str):
        result = await self.db.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        token = result.scalar_one_or_none()
        if token:
            token.is_revoked = True
            await self.db.commit()

    async def set_pending_mfa_secret(self, user_id: str, secret: str):
        user = await self.get_by_id(user_id)
        if user:
            user.mfa_secret = secret
            await self.db.commit()

    async def create_password_reset_token(self, user_id: str, token_hash: str):
        token = PasswordResetToken(
            user_id=uuid.UUID(user_id),
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        self.db.add(token)
        await self.db.commit()

    async def get_user_by_reset_token(self, token_hash: str) -> Optional[User]:
        result = await self.db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.is_used == False,
                PasswordResetToken.expires_at > datetime.now(timezone.utc),
            )
        )
        token = result.scalar_one_or_none()
        if not token:
            return None
        return await self.get_by_id(str(token.user_id))

    async def mark_reset_token_used(self, token_hash: str):
        result = await self.db.execute(
            select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash)
        )
        token = result.scalar_one_or_none()
        if token:
            token.is_used = True
            await self.db.commit()
