"""Vitals model."""
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, Float, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class Vitals(TimeStampedModel):
    __tablename__ = "vitals"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("encounters.id", ondelete="CASCADE"), nullable=True)
    recorded_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Measurements
    temperature: Mapped[float | None] = mapped_column(Float)  # Celsius
    temperature_unit: Mapped[str | None] = mapped_column(String(1))  # C or F
    pulse: Mapped[float | None] = mapped_column(Float)  # bpm
    respiratory_rate: Mapped[float | None] = mapped_column(Float)  # breaths/min
    blood_pressure_systolic: Mapped[float | None] = mapped_column(Float)  # mmHg
    blood_pressure_diastolic: Mapped[float | None] = mapped_column(Float)  # mmHg
    oxygen_saturation: Mapped[float | None] = mapped_column(Float)  # %
    weight: Mapped[float | None] = mapped_column(Float)  # kg
    height: Mapped[float | None] = mapped_column(Float)  # cm
    bmi: Mapped[float | None] = mapped_column(Float)
    blood_glucose: Mapped[float | None] = mapped_column(Float)  # mg/dL
    notes: Mapped[str | None] = mapped_column(String(500))

    # Relationships
    encounter: Mapped["Encounter"] = relationship(back_populates="vitals")  # type: ignore
