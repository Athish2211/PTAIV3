"""Prescription and PrescriptionItem models with lifecycle management."""
import uuid
from datetime import date, datetime
from sqlalchemy import String, ForeignKey, Date, DateTime, Text, Boolean, Integer, Float, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class Prescription(TimeStampedModel):
    __tablename__ = "prescriptions"

    # Scope
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("encounters.id"), nullable=True)
    prescribed_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    finalized_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Reference
    rx_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    prescription_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    # Status lifecycle
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)
    # draft → reviewed → finalized | cancelled

    # Clinical context
    diagnosis_context: Mapped[str | None] = mapped_column(Text)
    general_instructions: Mapped[str | None] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text)
    followup_date: Mapped[date | None] = mapped_column(Date)

    # Finalization
    finalized_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_immutable: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Amendment (for corrections after finalization)
    is_amendment: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    amended_prescription_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("prescriptions.id"), nullable=True)
    amendment_reason: Mapped[str | None] = mapped_column(Text)

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="prescriptions")  # type: ignore
    encounter: Mapped["Encounter"] = relationship(back_populates="prescriptions")  # type: ignore
    items: Mapped[list["PrescriptionItem"]] = relationship(back_populates="prescription", cascade="all, delete-orphan")


class PrescriptionItem(TimeStampedModel):
    __tablename__ = "prescription_items"

    prescription_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    medication_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("medications.id"), nullable=True)

    # The doctor may type a custom name if not in catalogue
    medication_name: Mapped[str] = mapped_column(String(500), nullable=False)
    generic_name: Mapped[str | None] = mapped_column(String(500))

    dosage: Mapped[str] = mapped_column(String(100), nullable=False)  # "500mg", "1 tablet"
    frequency: Mapped[str] = mapped_column(String(100), nullable=False)  # "twice daily", "BD"
    duration: Mapped[str] = mapped_column(String(100), nullable=False)  # "7 days", "2 weeks"
    route: Mapped[str | None] = mapped_column(String(50))  # oral, iv, topical
    quantity: Mapped[str | None] = mapped_column(String(50))  # "14 tablets"
    refills: Mapped[int] = mapped_column(Integer, default=0)
    instructions: Mapped[str | None] = mapped_column(Text)  # "Take with food"
    notes: Mapped[str | None] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    prescription: Mapped["Prescription"] = relationship(back_populates="items")
    medication: Mapped["Medication"] = relationship()  # type: ignore
