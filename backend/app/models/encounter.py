"""Encounter/Visit model."""
import uuid
from datetime import datetime, date
from sqlalchemy import String, ForeignKey, DateTime, Date, Text, Float, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class Encounter(TimeStampedModel):
    __tablename__ = "encounters"

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True
    )
    doctor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    encounter_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    encounter_type: Mapped[str] = mapped_column(String(50), default="outpatient")  # outpatient, inpatient, emergency, follow_up
    chief_complaint: Mapped[str | None] = mapped_column(Text)
    history_of_present_illness: Mapped[str | None] = mapped_column(Text)
    physical_examination: Mapped[str | None] = mapped_column(Text)
    assessment: Mapped[str | None] = mapped_column(Text)
    plan: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="open")  # open, completed, cancelled

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="encounters")  # type: ignore
    vitals: Mapped[list["Vitals"]] = relationship(back_populates="encounter", cascade="all, delete-orphan")  # type: ignore
    diagnoses: Mapped[list["Diagnosis"]] = relationship(back_populates="encounter", cascade="all, delete-orphan")  # type: ignore
    prescriptions: Mapped[list["Prescription"]] = relationship(back_populates="encounter")  # type: ignore
    notes: Mapped[list["ClinicalNote"]] = relationship(back_populates="encounter", cascade="all, delete-orphan")  # type: ignore
