"""Analytics models: AnalyticsRun, AnalyticsResult, AnalyticsEvidence, ModelRun."""
import uuid
from datetime import datetime, date
from sqlalchemy import String, ForeignKey, Text, Boolean, Integer, Float, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import TimeStampedModel


class AnalyticsRun(TimeStampedModel):
    """Represents one execution of an analytics pipeline."""
    __tablename__ = "analytics_runs"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    triggered_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # What was run
    run_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # monthly, yearly, adhoc, trend, anomaly, pattern, cohort, risk

    agents_used: Mapped[list | None] = mapped_column(JSONB)

    # Data period covered
    data_period_start: Mapped[date | None] = mapped_column(Date)
    data_period_end: Mapped[date | None] = mapped_column(Date)

    # Status
    status: Mapped[str] = mapped_column(String(30), default="pending")
    # pending, running, completed, failed, partial

    # External dataset (if used)
    external_dataset_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("external_datasets.id", ondelete="SET NULL"), nullable=True)
    data_source: Mapped[str] = mapped_column(String(30), default="ehr")
    # ehr, external, combined

    # Records info
    records_analyzed: Mapped[int | None] = mapped_column(Integer)
    dataset_version: Mapped[str | None] = mapped_column(String(100))

    # Execution
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    error_message: Mapped[str | None] = mapped_column(Text)

    # Relationships
    results: Mapped[list["AnalyticsResult"]] = relationship(back_populates="run", cascade="all, delete-orphan")
    evidence: Mapped[list["AnalyticsEvidence"]] = relationship(back_populates="run", cascade="all, delete-orphan")
    model_runs: Mapped[list["ModelRun"]] = relationship(back_populates="analytics_run", cascade="all, delete-orphan")
    external_dataset: Mapped["ExternalDataset"] = relationship(back_populates="analytics_runs")  # type: ignore


class AnalyticsResult(TimeStampedModel):
    """Stores one result from an analytics agent."""
    __tablename__ = "analytics_results"

    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("analytics_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)

    agent: Mapped[str] = mapped_column(String(50), nullable=False)  # trend, anomaly, pattern, cohort, risk
    result_type: Mapped[str] = mapped_column(String(50), nullable=False)  # summary, chart_data, table, insight
    title: Mapped[str | None] = mapped_column(String(300))
    summary: Mapped[str | None] = mapped_column(Text)
    data: Mapped[dict | None] = mapped_column(JSONB)  # Structured result payload
    metrics: Mapped[dict | None] = mapped_column(JSONB)  # Performance metrics
    limitations: Mapped[list | None] = mapped_column(JSONB)
    is_significant: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    run: Mapped["AnalyticsRun"] = relationship(back_populates="results")


class AnalyticsEvidence(TimeStampedModel):
    """Evidence items backing an analytics claim."""
    __tablename__ = "analytics_evidence"

    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("analytics_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    claim: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # database_record, analytics_result, model_output, calculation, source_document
    evidence_data: Mapped[dict | None] = mapped_column(JSONB)

    # Relationships
    run: Mapped["AnalyticsRun"] = relationship(back_populates="evidence")


class ModelRun(TimeStampedModel):
    """Records a single ML model execution for reproducibility."""
    __tablename__ = "model_runs"

    analytics_run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("analytics_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    algorithm: Mapped[str] = mapped_column(String(100), nullable=False)
    parameters: Mapped[dict | None] = mapped_column(JSONB)
    input_schema: Mapped[dict | None] = mapped_column(JSONB)
    metrics: Mapped[dict | None] = mapped_column(JSONB)  # precision, recall, F1, etc.
    features_used: Mapped[list | None] = mapped_column(JSONB)
    execution_time_ms: Mapped[int | None] = mapped_column(Integer)

    # Relationships
    analytics_run: Mapped["AnalyticsRun"] = relationship(back_populates="model_runs")
