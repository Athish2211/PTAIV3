"""
External Dataset Upload API — NEW FEATURE.
Allows doctors/analysts to upload CSV/Excel/JSON datasets for analytics.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.rbac import get_current_user, require_permission, Permission
from app.services.dataset_upload_service import DatasetUploadService

router = APIRouter(prefix="/datasets")


class DatasetResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    filename: str
    file_type: str
    file_size_bytes: int
    row_count: Optional[int]
    column_count: Optional[int]
    status: str
    analytics_enabled: bool
    schema_detected: Optional[dict]
    schema_mapped: Optional[dict]
    mapping_confidence: Optional[str]
    column_profiles: Optional[list]
    data_quality_score: Optional[float]
    mapping_reviewed: bool

    class Config:
        from_attributes = True


class UpdateMappingRequest(BaseModel):
    manual_mapping: dict
    name: Optional[str] = None
    description: Optional[str] = None


@router.post(
    "/upload",
    response_model=DatasetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload an external dataset for analytics",
)
async def upload_dataset(
    file: UploadFile = File(..., description="CSV, XLSX, XLS, or JSON file up to 100MB"),
    name: str = Form(..., description="Dataset display name"),
    description: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user=Depends(require_permission(Permission.DATASET_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload an external dataset (CSV/Excel/JSON) for analytics.

    The Data Intelligence Agent will:
    1. Profile the dataset (row count, column types, cardinality, missingness)
    2. Detect and map fields to canonical analytics schema
    3. Report detected, mapped, missing, and ambiguous fields
    4. Allow you to review/edit the mapping before enabling analytics

    Allowed types: CSV, XLSX, XLS, JSON
    Max size: 100MB
    """
    service = DatasetUploadService(db)
    dataset = await service.create_dataset(
        organization_id=str(current_user.organization_id),
        uploaded_by=str(current_user.id),
        file=file,
        name=name,
        description=description,
    )

    # Run profiling in background
    background_tasks.add_task(service.profile_dataset, str(dataset.id))

    return dataset


@router.get("", response_model=list[DatasetResponse], summary="List all datasets")
async def list_datasets(
    current_user=Depends(require_permission(Permission.ANALYTICS_READ)),
    db: AsyncSession = Depends(get_db),
):
    service = DatasetUploadService(db)
    return await service.list_by_org(str(current_user.organization_id))


@router.get("/{dataset_id}", response_model=DatasetResponse, summary="Get dataset details")
async def get_dataset(
    dataset_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.ANALYTICS_READ)),
    db: AsyncSession = Depends(get_db),
):
    service = DatasetUploadService(db)
    dataset = await service.get_by_id(str(dataset_id), str(current_user.organization_id))
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.get("/{dataset_id}/schema", summary="Get detected schema and mapping")
async def get_dataset_schema(
    dataset_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.ANALYTICS_READ)),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns the schema intelligence report:
    - Detected fields (raw column names/types)
    - Mapped fields (canonical analytics schema)
    - Missing fields
    - Ambiguous fields with confidence scores
    """
    service = DatasetUploadService(db)
    dataset = await service.get_by_id(str(dataset_id), str(current_user.organization_id))
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    return {
        "dataset_id": str(dataset_id),
        "status": dataset.status,
        "row_count": dataset.row_count,
        "column_count": dataset.column_count,
        "schema_detected": dataset.schema_detected,
        "schema_mapped": dataset.schema_mapped,
        "mapping_confidence": dataset.mapping_confidence,
        "column_profiles": dataset.column_profiles,
        "manual_mapping": dataset.manual_mapping,
        "mapping_reviewed": dataset.mapping_reviewed,
        "data_quality_score": dataset.data_quality_score,
        "quality_notes": dataset.quality_notes if hasattr(dataset, "quality_notes") else None,
    }


@router.put("/{dataset_id}/mapping", summary="Update field mapping and enable analytics")
async def update_mapping(
    dataset_id: uuid.UUID,
    payload: UpdateMappingRequest,
    current_user=Depends(require_permission(Permission.DATASET_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    """
    Doctor/analyst reviews the auto-detected mapping and confirms or overrides it.
    After reviewing, the dataset is enabled for analytics.
    """
    service = DatasetUploadService(db)
    dataset = await service.update_mapping(
        dataset_id=str(dataset_id),
        organization_id=str(current_user.organization_id),
        manual_mapping=payload.manual_mapping,
        name=payload.name,
        description=payload.description,
    )
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"message": "Mapping updated and analytics enabled", "dataset_id": str(dataset_id)}


@router.post("/{dataset_id}/analyze", summary="Run analytics on an external dataset")
async def analyze_dataset(
    dataset_id: uuid.UUID,
    analysis_types: list[str] = ["trend", "anomaly", "pattern"],
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user=Depends(require_permission(Permission.ANALYTICS_RUN)),
    db: AsyncSession = Depends(get_db),
):
    """
    Run analytics agents on the uploaded dataset.
    Agents: trend, anomaly, pattern, cohort, risk (select which to run).
    """
    service = DatasetUploadService(db)
    dataset = await service.get_by_id(str(dataset_id), str(current_user.organization_id))
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if not dataset.analytics_enabled:
        raise HTTPException(
            status_code=400,
            detail="Dataset mapping not reviewed. Please review the schema mapping first.",
        )

    run_id = await service.trigger_analytics(
        dataset_id=str(dataset_id),
        organization_id=str(current_user.organization_id),
        triggered_by=str(current_user.id),
        analysis_types=analysis_types,
    )

    return {
        "message": "Analytics started",
        "analytics_run_id": run_id,
        "dataset_id": str(dataset_id),
        "analysis_types": analysis_types,
    }


@router.delete(
    "/{dataset_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an external dataset",
)
async def delete_dataset(
    dataset_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.DATASET_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    service = DatasetUploadService(db)
    deleted = await service.delete(str(dataset_id), str(current_user.organization_id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Dataset not found")
