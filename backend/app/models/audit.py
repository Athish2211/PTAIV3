"""AuditLog and SecurityEvent models."""
import uuid
from sqlalchemy import String, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import TimeStampedModel


class AuditLog(TimeStampedModel):
    """Every sensitive operation is logged here."""
    __tablename__ = "audit_logs"

    # Who
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    organization_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)

    # What
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    # patient.viewed, prescription.created, prescription.finalized, ai.queried, login, etc.
    resource_type: Mapped[str | None] = mapped_column(String(50), index=True)
    resource_id: Mapped[str | None] = mapped_column(String(100))

    # Context
    ip_hash: Mapped[str | None] = mapped_column(String(64))  # Hashed IP — never raw IP
    user_agent_hash: Mapped[str | None] = mapped_column(String(64))
    request_id: Mapped[str | None] = mapped_column(String(100))
    success: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    error_code: Mapped[str | None] = mapped_column(String(50))
    event_metadata: Mapped[dict | None] = mapped_column(JSONB)  # Safe additional context
    # NEVER log: passwords, raw tokens, PHI beyond identifiers


class SecurityEvent(TimeStampedModel):
    """Security-specific events (auth failures, lockouts, MFA changes)."""
    __tablename__ = "security_events"

    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    organization_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)

    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    # failed_login, account_locked, mfa_enabled, mfa_disabled, password_reset, suspicious_activity
    severity: Mapped[str] = mapped_column(String(20), default="info")
    # info, warning, critical
    ip_hash: Mapped[str | None] = mapped_column(String(64))
    request_id: Mapped[str | None] = mapped_column(String(100))
    details: Mapped[dict | None] = mapped_column(JSONB)
