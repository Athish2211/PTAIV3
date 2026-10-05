"""FollowUp model."""
import uuid
from datetime import date
from sqlalchemy import String, ForeignKey, Date, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class FollowUp(TimeStampedModel):
    __tablename__ = "follow_ups"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("encounters.id"), nullable=True)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    reason: Mapped[str] = mapped_column(String(500), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="pending")
    # pending, completed, missed, cancelled

    completed_date: Mapped[date | None] = mapped_column(Date)
    completion_notes: Mapped[str | None] = mapped_column(Text)
    is_urgent: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="follow_ups")  # type: ignore
