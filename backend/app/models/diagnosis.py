"""Diagnosis model."""
import uuid
from datetime import date
from sqlalchemy import String, ForeignKey, Date, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class Diagnosis(TimeStampedModel):
    __tablename__ = "diagnoses"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("encounters.id", ondelete="CASCADE"), nullable=True)
    diagnosed_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    icd_code: Mapped[str | None] = mapped_column(String(20), index=True)  # ICD-10 code
    diagnosis_name: Mapped[str] = mapped_column(String(500), nullable=False)
    diagnosis_type: Mapped[str] = mapped_column(String(50), default="primary")  # primary, secondary, differential
    severity: Mapped[str | None] = mapped_column(String(30))  # mild, moderate, severe
    status: Mapped[str] = mapped_column(String(30), default="active")  # active, resolved, chronic, suspected
    onset_date: Mapped[date | None] = mapped_column(Date)
    resolved_date: Mapped[date | None] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)
    is_chronic: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    encounter: Mapped["Encounter"] = relationship(back_populates="diagnoses")  # type: ignore
