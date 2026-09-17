"""Patient and PatientIdentifier models."""
import uuid
from datetime import date
from sqlalchemy import String, Boolean, ForeignKey, Date, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import TimeStampedModel


class Patient(TimeStampedModel):
    __tablename__ = "patients"

    # Scope
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Identity
    mrn: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # Medical Record Number
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    gender: Mapped[str | None] = mapped_column(String(20))  # male, female, other, prefer_not_to_say
    # Contact
    phone: Mapped[str | None] = mapped_column(String(50))
    email: Mapped[str | None] = mapped_column(String(255))
    address: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(100))
    country: Mapped[str | None] = mapped_column(String(100))
    # Medical metadata
    blood_group: Mapped[str | None] = mapped_column(String(10))
    known_allergies: Mapped[str | None] = mapped_column(Text)  # JSON array
    emergency_contact_name: Mapped[str | None] = mapped_column(String(200))
    emergency_contact_phone: Mapped[str | None] = mapped_column(String(50))
    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="patients")  # type: ignore
    identifiers: Mapped[list["PatientIdentifier"]] = relationship(back_populates="patient", cascade="all, delete-orphan")
    encounters: Mapped[list["Encounter"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore
    prescriptions: Mapped[list["Prescription"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore
    documents: Mapped[list["Document"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore
    prescription_uploads: Mapped[list["PrescriptionUpload"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore
    follow_ups: Mapped[list["FollowUp"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore
    ai_conversations: Mapped[list["AIConversation"]] = relationship(back_populates="patient", cascade="all, delete-orphan")  # type: ignore

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class PatientIdentifier(TimeStampedModel):
    __tablename__ = "patient_identifiers"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False
    )
    identifier_type: Mapped[str] = mapped_column(String(50), nullable=False)  # aadhar, pan, passport, etc.
    identifier_value: Mapped[str] = mapped_column(String(255), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="identifiers")
