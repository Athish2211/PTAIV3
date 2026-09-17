from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from app.core.rbac import get_current_user
from app.models.user import User
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.patient_repository import PatientRepository
import uuid
from datetime import date

router = APIRouter(prefix="/patients", tags=["Patients"])

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    mrn: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    blood_group: Optional[str] = None

class PatientResponse(PatientCreate):
    id: uuid.UUID
    organization_id: uuid.UUID

    class Config:
        from_attributes = True

@router.post("", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = PatientRepository(db)
    
    # In a real app, generate MRN if missing
    mrn = patient.mrn or f"MRN-{uuid.uuid4().hex[:8].upper()}"
    
    new_patient = await repo.create(
        organization_id=current_user.organization_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        mrn=mrn,
        email=patient.email,
        phone=patient.phone,
        blood_group=patient.blood_group,
        is_active=True
    )
    return new_patient

@router.get("", response_model=List[PatientResponse])
async def list_patients(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = PatientRepository(db)
    # Scope to user's organization
    patients = await repo.list_by_org(str(current_user.organization_id), limit=limit, offset=offset)
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = PatientRepository(db)
    patient = await repo.get_by_id_and_org(patient_id, str(current_user.organization_id))
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
