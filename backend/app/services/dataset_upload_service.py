"""
Dataset Upload Service — NEW FEATURE.
Handles external dataset upload, profiling, schema intelligence, and analytics routing.
"""
import os
import uuid
import json
import structlog
from datetime import datetime, timezone
from typing import Optional

import pandas as pd
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.external_dataset import ExternalDataset
from app.models.analytics import AnalyticsRun

logger = structlog.get_logger()

ALLOWED_TYPES = {"csv", "xlsx", "xls", "json"}
MAX_SIZE_BYTES = settings.MAX_DATASET_MB * 1024 * 1024

# Canonical analytics schema fields
CANONICAL_FIELDS = {
    "patient_id", "encounter_id", "date", "diagnosis", "medication",
    "dosage", "frequency", "age", "gender", "region", "risk_score",
    "prescriber", "visit_count", "quantity",
}

# Common aliases for canonical fields
FIELD_ALIASES: dict[str, list[str]] = {
    "patient_id": ["patient_id", "patientid", "patient", "pid", "record_id", "id"],
    "encounter_id": ["encounter_id", "encounterid", "visit_id", "visitid", "encounter"],
    "date": ["date", "visit_date", "prescription_date", "encounter_date", "created_at", "timestamp"],
    "diagnosis": ["diagnosis", "diagnosis_name", "icd_code", "disease", "condition", "dx"],
    "medication": ["medication", "drug", "medicine", "drug_name", "med_name", "prescription"],
    "dosage": ["dosage", "dose", "strength", "amount"],
    "frequency": ["frequency", "freq", "dosing_schedule"],
    "age": ["age", "patient_age", "age_years"],
    "gender": ["gender", "sex", "patient_gender"],
    "region": ["region", "city", "state", "area", "location", "district"],
    "risk_score": ["risk_score", "risk", "severity_score"],
    "prescriber": ["prescriber", "doctor", "physician", "prescribed_by", "dr_name"],
    "quantity": ["quantity", "qty", "amount", "units"],
}


class DatasetUploadService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dataset(
        self,
        organization_id: str,
        uploaded_by: str,
        file: UploadFile,
        name: str,
        description: Optional[str] = None,
    ) -> ExternalDataset:
        """Validate, store, and create the dataset record."""
        content = await file.read()
        file_size = len(content)

        if file_size > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Dataset too large. Maximum size is {settings.MAX_DATASET_MB}MB",
            )

        ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
        if ext not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_TYPES)}",
            )

        # Save file
        upload_dir = os.path.join(settings.UPLOAD_DIR, "datasets", organization_id)
        os.makedirs(upload_dir, exist_ok=True)

        unique_filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, "wb") as f:
            f.write(content)

        dataset = ExternalDataset(
            organization_id=uuid.UUID(organization_id),
            uploaded_by=uuid.UUID(uploaded_by),
            name=name,
            description=description,
            filename=unique_filename,
            original_filename=file.filename or unique_filename,
            file_path=file_path,
            file_type=ext,
            file_size_bytes=file_size,
            status="uploaded",
        )
        self.db.add(dataset)
        await self.db.commit()
        await self.db.refresh(dataset)
        logger.info("dataset.created", dataset_id=str(dataset.id))
        return dataset

    async def profile_dataset(self, dataset_id: str):
        """Background task: load, profile, and run Data Intelligence Agent."""
        try:
            result = await self.db.execute(
                select(ExternalDataset).where(ExternalDataset.id == uuid.UUID(dataset_id))
            )
            dataset = result.scalar_one_or_none()
            if not dataset:
                return

            dataset.status = "profiling"
            await self.db.commit()

            # Load dataset
            df = self._load_dataframe(dataset.file_path, dataset.file_type)

            # Basic stats
            dataset.row_count = len(df)
            dataset.column_count = len(df.columns)

            # Profile each column
            column_profiles = []
            for col in df.columns:
                profile = self._profile_column(df, col)
                column_profiles.append(profile)

            dataset.column_profiles = column_profiles

            # Schema detection (raw)
            schema_detected = {
                col: str(df[col].dtype) for col in df.columns
            }
            dataset.schema_detected = schema_detected

            # Schema mapping (canonical)
            mapping_result = self._map_schema(df.columns.tolist(), column_profiles)
            dataset.schema_mapped = mapping_result["mapped"]
            dataset.mapping_confidence = mapping_result["overall_confidence"]

            # Data quality
            quality_score, quality_notes = self._assess_data_quality(df, column_profiles)
            dataset.data_quality_score = quality_score
            dataset.quality_notes = quality_notes

            dataset.status = "ready"
            dataset.profiled_at = datetime.now(timezone.utc)
            await self.db.commit()

            logger.info("dataset.profiled", dataset_id=dataset_id, rows=len(df), cols=len(df.columns))

        except Exception as e:
            logger.error("dataset.profiling_failed", dataset_id=dataset_id, error=str(e))
            try:
                result = await self.db.execute(
                    select(ExternalDataset).where(ExternalDataset.id == uuid.UUID(dataset_id))
                )
                dataset = result.scalar_one_or_none()
                if dataset:
                    dataset.status = "failed"
                    dataset.error_message = str(e)
                    await self.db.commit()
            except Exception:
                pass

    def _load_dataframe(self, file_path: str, file_type: str) -> pd.DataFrame:
        """Load file into a pandas DataFrame."""
        if file_type == "csv":
            return pd.read_csv(file_path, low_memory=False)
        elif file_type in {"xlsx", "xls"}:
            return pd.read_excel(file_path)
        elif file_type == "json":
            return pd.read_json(file_path)
        raise ValueError(f"Unsupported file type: {file_type}")

    def _profile_column(self, df: pd.DataFrame, col: str) -> dict:
        """Profile a single column."""
        series = df[col]
        total = len(series)
        null_count = series.isna().sum()

        profile = {
            "name": col,
            "dtype": str(series.dtype),
            "null_count": int(null_count),
            "null_pct": round(float(null_count / total * 100), 2) if total > 0 else 0,
            "unique_count": int(series.nunique()),
            "cardinality": "low" if series.nunique() < 20 else "medium" if series.nunique() < 200 else "high",
            "sample_values": series.dropna().head(5).tolist(),
            "canonical_field": None,
            "mapping_confidence": "none",
        }

        # Try to infer canonical field
        col_lower = col.lower().replace(" ", "_").replace("-", "_")
        for canonical, aliases in FIELD_ALIASES.items():
            if col_lower in aliases:
                profile["canonical_field"] = canonical
                profile["mapping_confidence"] = "high"
                break
            elif any(alias in col_lower for alias in aliases):
                profile["canonical_field"] = canonical
                profile["mapping_confidence"] = "medium"
                break

        return profile

    def _map_schema(self, columns: list[str], profiles: list[dict]) -> dict:
        """Create canonical schema mapping."""
        mapped = {}
        missing = []
        ambiguous = []

        for profile in profiles:
            if profile["canonical_field"]:
                canonical = profile["canonical_field"]
                if canonical in mapped:
                    ambiguous.append(canonical)
                else:
                    mapped[canonical] = {
                        "source_column": profile["name"],
                        "confidence": profile["mapping_confidence"],
                    }

        # Check for missing required fields
        required = {"patient_id", "date", "medication"}
        missing = list(required - set(mapped.keys()))

        # Overall confidence
        high_count = sum(1 for v in mapped.values() if v["confidence"] == "high")
        total_mapped = len(mapped)
        if total_mapped == 0:
            confidence = "low"
        elif high_count / max(total_mapped, 1) > 0.7:
            confidence = "high"
        elif high_count / max(total_mapped, 1) > 0.4:
            confidence = "medium"
        else:
            confidence = "low"

        return {
            "mapped": mapped,
            "missing_required": missing,
            "ambiguous": ambiguous,
            "total_mapped": total_mapped,
            "overall_confidence": confidence,
        }

    def _assess_data_quality(self, df: pd.DataFrame, profiles: list[dict]) -> tuple[float, list]:
        """Compute a data quality score (0-100) and notes."""
        notes = []
        scores = []

        # Completeness
        avg_null_pct = sum(p["null_pct"] for p in profiles) / max(len(profiles), 1)
        completeness = max(0, 100 - avg_null_pct)
        scores.append(completeness)
        if avg_null_pct > 20:
            notes.append(f"High missing data rate: {avg_null_pct:.1f}% average null values")

        # Size check
        if len(df) < 10:
            notes.append("Very small dataset — analytics may not be meaningful")
            scores.append(20)
        elif len(df) < 100:
            notes.append("Small dataset — treat results with caution")
            scores.append(60)
        else:
            scores.append(100)

        # Duplicate check
        dup_pct = df.duplicated().sum() / max(len(df), 1) * 100
        if dup_pct > 10:
            notes.append(f"High duplicate rate: {dup_pct:.1f}%")
            scores.append(50)
        else:
            scores.append(100)

        return round(sum(scores) / len(scores), 1), notes

    async def update_mapping(
        self,
        dataset_id: str,
        organization_id: str,
        manual_mapping: dict,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Optional[ExternalDataset]:
        dataset = await self.get_by_id(dataset_id, organization_id)
        if not dataset:
            return None
        dataset.manual_mapping = manual_mapping
        dataset.mapping_reviewed = True
        dataset.analytics_enabled = True
        if name:
            dataset.name = name
        if description:
            dataset.description = description
        await self.db.commit()
        await self.db.refresh(dataset)
        return dataset

    async def trigger_analytics(
        self,
        dataset_id: str,
        organization_id: str,
        triggered_by: str,
        analysis_types: list[str],
    ) -> str:
        """Create an AnalyticsRun for the dataset."""
        run = AnalyticsRun(
            organization_id=uuid.UUID(organization_id),
            triggered_by=uuid.UUID(triggered_by),
            run_type="adhoc",
            agents_used=analysis_types,
            external_dataset_id=uuid.UUID(dataset_id),
            data_source="external",
            status="pending",
        )
        self.db.add(run)
        await self.db.commit()
        await self.db.refresh(run)
        logger.info("analytics.triggered", run_id=str(run.id), dataset_id=dataset_id)
        return str(run.id)

    async def list_by_org(self, organization_id: str) -> list[ExternalDataset]:
        result = await self.db.execute(
            select(ExternalDataset)
            .where(ExternalDataset.organization_id == uuid.UUID(organization_id))
            .order_by(ExternalDataset.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, dataset_id: str, organization_id: str) -> Optional[ExternalDataset]:
        result = await self.db.execute(
            select(ExternalDataset).where(
                ExternalDataset.id == uuid.UUID(dataset_id),
                ExternalDataset.organization_id == uuid.UUID(organization_id),
            )
        )
        return result.scalar_one_or_none()

    async def delete(self, dataset_id: str, organization_id: str) -> bool:
        dataset = await self.get_by_id(dataset_id, organization_id)
        if not dataset:
            return False
        if os.path.exists(dataset.file_path):
            os.remove(dataset.file_path)
        await self.db.delete(dataset)
        await self.db.commit()
        return True
