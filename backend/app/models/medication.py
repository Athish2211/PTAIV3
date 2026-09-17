"""Medication master list model."""
import uuid
from sqlalchemy import String, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import TimeStampedModel


class Medication(TimeStampedModel):
    """Master medication catalogue (shared across the platform)."""
    __tablename__ = "medications"

    name: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    generic_name: Mapped[str | None] = mapped_column(String(500), index=True)
    brand_name: Mapped[str | None] = mapped_column(String(500))
    drug_class: Mapped[str | None] = mapped_column(String(200))
    dosage_forms: Mapped[str | None] = mapped_column(Text)  # JSON: ["tablet", "syrup"]
    standard_dosages: Mapped[str | None] = mapped_column(Text)  # JSON: ["5mg", "10mg"]
    common_routes: Mapped[str | None] = mapped_column(Text)  # JSON: ["oral", "iv"]
    controlled_substance: Mapped[bool] = mapped_column(Boolean, default=False)
    schedule: Mapped[str | None] = mapped_column(String(10))  # H, X, etc.
    contraindications: Mapped[str | None] = mapped_column(Text)
    common_side_effects: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
