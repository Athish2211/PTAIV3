"""
PrescriptionUpload model — NEW FEATURE.
Allows doctors to upload historical/external prescription documents per patient.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, Text, Boolean, DateTime, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import TimeStampedModel


class PrescriptionUpload(TimeStampedModel):
    """
    Stores uploaded prescription documents (PDFs, images, DOCX).
    These are previous/external prescriptions that the doctor uploads
    to include in the patient's longitudinal medical history.
    
    The document is OCR'd, structured data extracted, and indexed in RAG.
    """
    __tablename__ = "prescription_uploads"

    # Scope
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # File info
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)  # pdf, png, jpg, docx
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String(100))

    # Processing status
    status: Mapped[str] = mapped_column(String(30), default="uploaded", nullable=False)
    # uploaded → processing → indexed | failed

    # OCR / Text extraction
    ocr_text: Mapped[str | None] = mapped_column(Text)  # Full raw OCR text
    ocr_applied: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Structured data extracted from the prescription
    # { medicines: [], prescriber_name, prescription_date, clinic_name, notes }
    extracted_data: Mapped[dict | None] = mapped_column(JSONB)
    extraction_confidence: Mapped[float | None] = mapped_column(String(10))  # low/medium/high

    # Doctor review
    is_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    review_notes: Mapped[str | None] = mapped_column(Text)

    # RAG link — once indexed this points to the Document record
    document_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)

    # When the prescription was originally written (extracted or manually entered)
    original_prescription_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    original_prescriber: Mapped[str | None] = mapped_column(String(300))

    # Description provided by the uploader
    description: Mapped[str | None] = mapped_column(Text)

    # Error info (if processing failed)
    error_message: Mapped[str | None] = mapped_column(Text)
    indexed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="prescription_uploads")  # type: ignore
    document: Mapped["Document"] = relationship()  # type: ignore
