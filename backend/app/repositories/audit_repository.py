"""Audit repository — logs all sensitive operations."""
import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog, SecurityEvent


class AuditRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log(
        self,
        action: str,
        user_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_hash: Optional[str] = None,
        request_id: Optional[str] = None,
        success: bool = True,
        error_code: Optional[str] = None,
        metadata: Optional[dict] = None,
    ):
        """Log a sensitive operation. Never log PHI, passwords, or raw tokens."""
        log = AuditLog(
            user_id=uuid.UUID(user_id) if user_id else None,
            organization_id=uuid.UUID(organization_id) if organization_id else None,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_hash=ip_hash,
            request_id=request_id,
            success=success,
            error_code=error_code,
            metadata=metadata,
        )
        self.db.add(log)
        try:
            await self.db.commit()
        except Exception:
            await self.db.rollback()

    async def log_security_event(
        self,
        event_type: str,
        user_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        severity: str = "info",
        ip_hash: Optional[str] = None,
        request_id: Optional[str] = None,
        details: Optional[dict] = None,
    ):
        event = SecurityEvent(
            user_id=uuid.UUID(user_id) if user_id else None,
            organization_id=uuid.UUID(organization_id) if organization_id else None,
            event_type=event_type,
            severity=severity,
            ip_hash=ip_hash,
            request_id=request_id,
            details=details,
        )
        self.db.add(event)
        try:
            await self.db.commit()
        except Exception:
            await self.db.rollback()
