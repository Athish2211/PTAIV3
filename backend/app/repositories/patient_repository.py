"""Patient repository with IDOR protection."""
import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.patient import Patient


class PatientRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id_and_org(self, patient_id: str, organization_id: str) -> Optional[Patient]:
        """IDOR-safe: always verify organization_id."""
        result = await self.db.execute(
            select(Patient).where(
                Patient.id == uuid.UUID(patient_id),
                Patient.organization_id == uuid.UUID(organization_id),
                Patient.is_active == True,
            )
        )
        return result.scalar_one_or_none()

    async def list_by_org(self, organization_id: str, limit: int = 50, offset: int = 0):
        result = await self.db.execute(
            select(Patient)
            .where(Patient.organization_id == uuid.UUID(organization_id), Patient.is_active == True)
            .order_by(Patient.created_at.desc())
            .limit(limit).offset(offset)
        )
        return result.scalars().all()

    async def create(self, **kwargs) -> Patient:
        patient = Patient(**kwargs)
        self.db.add(patient)
        await self.db.commit()
        await self.db.refresh(patient)
        return patient

    async def save(self, patient: Patient) -> Patient:
        self.db.add(patient)
        await self.db.commit()
        await self.db.refresh(patient)
        return patient
