from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from app.core.rbac import get_current_user
from app.models.user import User
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from datetime import date
from app.models.prescription import Prescription, PrescriptionItem

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

class PrescriptionResponse(BaseModel):
    id: uuid.UUID
    rx_number: str
    patient_id: uuid.UUID
    prescribed_by: uuid.UUID
    prescription_date: date
    status: str
    diagnosis_context: Optional[str]

    class Config:
        from_attributes = True

class PrescriptionItemCreate(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None

class PrescriptionCreate(BaseModel):
    patient_id: str
    diagnosis_context: Optional[str] = None
    items: List[PrescriptionItemCreate]

@router.get("", response_model=List[PrescriptionResponse])
async def list_prescriptions(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List prescriptions within the user's organization."""
    result = await db.execute(
        select(Prescription)
        .where(Prescription.organization_id == current_user.organization_id)
        .order_by(Prescription.created_at.desc())
        .limit(limit).offset(offset)
    )
    prescriptions = result.scalars().all()
    return prescriptions

@router.post("", response_model=PrescriptionResponse)
async def create_prescription(
    request: PrescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new prescription."""
    import time
    
    # Generate Rx number
    rx_num = f"RX-{uuid.uuid4().hex[:6].upper()}"
    
    new_rx = Prescription(
        id=uuid.uuid4(),
        organization_id=current_user.organization_id,
        patient_id=uuid.UUID(request.patient_id),
        prescribed_by=current_user.id,
        rx_number=rx_num,
        prescription_date=date.today(),
        status="draft",
        diagnosis_context=request.diagnosis_context
    )
    
    db.add(new_rx)
    
    for item in request.items:
        new_item = PrescriptionItem(
            id=uuid.uuid4(),
            prescription_id=new_rx.id,
            medication_name=item.medication_name,
            dosage=item.dosage,
            frequency=item.frequency,
            duration=item.duration,
            instructions=item.instructions
        )
        db.add(new_item)
        
    await db.commit()
    await db.refresh(new_rx)
    return new_rx

@router.get("/{prescription_id}", response_model=PrescriptionResponse)
async def get_prescription(
    prescription_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Prescription)
        .where(
            Prescription.id == uuid.UUID(prescription_id),
            Prescription.organization_id == current_user.organization_id
        )
    )
    prescription = result.scalar_one_or_none()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return prescription
