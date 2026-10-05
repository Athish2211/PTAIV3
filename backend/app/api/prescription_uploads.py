"""
Prescription Upload API — NEW FEATURE.
Allows doctors to upload previous prescription documents (PDF/image/DOCX) per patient.
"""
import uuid
from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.rbac import get_current_user, require_permission, Permission
from app.services.prescription_upload_service import PrescriptionUploadService
from app.repositories.patient_repository import PatientRepository

router = APIRouter(prefix="/patients/{patient_id}/prescription-uploads")


class PrescriptionUploadResponse(BaseModel):
    id: str
    patient_id: str
    filename: str
    file_type: str
    status: str
    ocr_text: Optional[str] = None
    extracted_data: Optional[dict] = None
    extraction_confidence: Optional[str] = None
    is_reviewed: bool
    original_prescription_date: Optional[datetime] = None
    original_prescriber: Optional[str] = None
    description: Optional[str] = None
    uploaded_at: datetime
    indexed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.post(
    "",
    response_model=PrescriptionUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a previous prescription document for a patient",
)
async def upload_prescription(
    patient_id: uuid.UUID,
    file: UploadFile = File(..., description="PDF, PNG, JPG, DOCX up to 50MB"),
    description: Optional[str] = Form(None),
    original_prescriber: Optional[str] = Form(None),
    original_prescription_date: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user=Depends(require_permission(Permission.PRESCRIPTION_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a previous prescription document for a patient.

    The document will be:
    1. Validated (type, size, MIME)
    2. Stored securely
    3. OCR'd (if image/PDF)
    4. Structured data extracted (medicine names, dosages, dates)
    5. Indexed in RAG for AI-powered queries

    Allowed types: PDF, PNG, JPG, JPEG, DOCX
    """
    # Verify patient belongs to the doctor's organization (IDOR protection)
    patient_repo = PatientRepository(db)
    patient = await patient_repo.get_by_id_and_org(
        str(patient_id), str(current_user.organization_id)
    )
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    service = PrescriptionUploadService(db)
    upload = await service.create_upload(
        patient_id=str(patient_id),
        organization_id=str(current_user.organization_id),
        uploaded_by=str(current_user.id),
        file=file,
        description=description,
        original_prescriber=original_prescriber,
        original_prescription_date=original_prescription_date,
    )

    # Process asynchronously in background
    background_tasks.add_task(service.process_upload, str(upload.id))

    return upload


@router.get(
    "",
    response_model=list[PrescriptionUploadResponse],
    summary="List all uploaded prescriptions for a patient",
)
async def list_prescription_uploads(
    patient_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.PRESCRIPTION_READ)),
    db: AsyncSession = Depends(get_db),
):
    """List all uploaded historical prescriptions for a patient."""
    patient_repo = PatientRepository(db)
    patient = await patient_repo.get_by_id_and_org(str(patient_id), str(current_user.organization_id))
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    service = PrescriptionUploadService(db)
    return await service.list_by_patient(str(patient_id))


@router.get(
    "/{upload_id}",
    response_model=PrescriptionUploadResponse,
    summary="Get a specific prescription upload",
)
async def get_prescription_upload(
    patient_id: uuid.UUID,
    upload_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.PRESCRIPTION_READ)),
    db: AsyncSession = Depends(get_db),
):
    patient_repo = PatientRepository(db)
    patient = await patient_repo.get_by_id_and_org(str(patient_id), str(current_user.organization_id))
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    service = PrescriptionUploadService(db)
    upload = await service.get_by_id(str(upload_id), str(patient_id))
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    return upload


@router.post(
    "/{upload_id}/review",
    summary="Mark a prescription upload as reviewed by doctor",
)
async def review_prescription_upload(
    patient_id: uuid.UUID,
    upload_id: uuid.UUID,
    review_notes: Optional[str] = None,
    current_user=Depends(require_permission(Permission.PRESCRIPTION_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    """Doctor reviews the extracted prescription data and confirms it."""
    service = PrescriptionUploadService(db)
    upload = await service.mark_reviewed(str(upload_id), str(patient_id), str(current_user.organization_id), review_notes)
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    return {"message": "Prescription upload reviewed", "upload_id": str(upload_id)}


@router.delete(
    "/{upload_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a prescription upload",
)
async def delete_prescription_upload(
    patient_id: uuid.UUID,
    upload_id: uuid.UUID,
    current_user=Depends(require_permission(Permission.PRESCRIPTION_UPLOAD)),
    db: AsyncSession = Depends(get_db),
):
    patient_repo = PatientRepository(db)
    patient = await patient_repo.get_by_id_and_org(str(patient_id), str(current_user.organization_id))
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    service = PrescriptionUploadService(db)
    deleted = await service.delete(str(upload_id), str(patient_id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Upload not found")
