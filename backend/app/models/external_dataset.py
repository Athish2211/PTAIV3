"""
ExternalDataset model — NEW FEATURE.
Allows doctors/analysts to upload external datasets (CSV/Excel/JSON)
to be used for analytics alongside native EHR data.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, Text, Boolean, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import TimeStampedModel


class ExternalDataset(TimeStampedModel):
    """
    Stores uploaded external datasets for analytics.
    The Data Intelligence Agent analyzes the schema and maps it
    to the canonical analytics schema, enabling Trend/Anomaly/Pattern/Cohort agents
    to run on external data alongside native EHR data.
    """
    __tablename__ = "external_datasets"

    # Scope
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Dataset identity
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    tags: Mapped[list | None] = mapped_column(JSONB)  # ["cardiology", "2024", ...]

    # File info
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)  # csv, xlsx, json
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    # Dataset statistics (populated during profiling)
    row_count: Mapped[int | None] = mapped_column(Integer)
    column_count: Mapped[int | None] = mapped_column(Integer)

    # Schema intelligence (from Data Intelligence Agent)
    schema_detected: Mapped[dict | None] = mapped_column(JSONB)    # Raw detected schema
    schema_mapped: Mapped[dict | None] = mapped_column(JSONB)       # Canonical mapped schema
    mapping_confidence: Mapped[str | None] = mapped_column(String(10))  # low/medium/high

    # Detailed profiling results
    column_profiles: Mapped[list | None] = mapped_column(JSONB)
    # [{ name, type, cardinality, null_pct, sample_values, canonical_field, confidence }]

    # Doctor/analyst can override the auto-mapping
    manual_mapping: Mapped[dict | None] = mapped_column(JSONB)
    mapping_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Processing status
    status: Mapped[str] = mapped_column(String(30), default="uploaded", nullable=False)
    # uploaded → profiling → ready | failed

    # Analytics options
    analytics_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Enabled after doctor reviews and confirms the mapping

    # Error info
    error_message: Mapped[str | None] = mapped_column(Text)
    profiled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_analyzed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Data quality info
    data_quality_score: Mapped[float | None] = mapped_column(Float)
    quality_notes: Mapped[list | None] = mapped_column(JSONB)

    # Analytics runs associated with this dataset
    analytics_runs: Mapped[list["AnalyticsRun"]] = relationship(back_populates="external_dataset", cascade="all, delete-orphan")  # type: ignore
