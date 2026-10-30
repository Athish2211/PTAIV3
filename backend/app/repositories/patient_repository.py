"""Patient repository with IDOR protection."""
import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, String, cast
from app.models.patient import Patient


class PatientRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id_and_org(self, patient_id: str, organization_id: str, doctor_id: Optional[str] = None) -> Optional[Patient]:
        """IDOR-safe: resolves UUID, MRN (MRN-2026-XXXX), or frontend ID (p-XXXX)."""
        conditions = [
            Patient.organization_id == uuid.UUID(organization_id),
            Patient.is_active == True,
        ]

        parsed_uuid = None
        try:
            parsed_uuid = uuid.UUID(str(patient_id).strip())
        except (ValueError, TypeError, AttributeError):
            pass

        if parsed_uuid:
            conditions.append(Patient.id == parsed_uuid)
        else:
            mrn_raw = str(patient_id).strip()
            mrn_clean = f"MRN-2026-{mrn_raw.replace('p-', '')}" if mrn_raw.startswith("p-") else mrn_raw
            conditions.append(
                or_(
                    Patient.mrn.ilike(mrn_clean),
                    Patient.mrn.ilike(mrn_raw),
                    cast(Patient.id, String) == mrn_raw
                )
            )

        if doctor_id:
            try:
                doc_uuid = uuid.UUID(doctor_id)
                conditions.append(
                    or_(
                        Patient.primary_doctor_id == doc_uuid,
                        Patient.primary_doctor_id.is_(None)
                    )
                )
            except (ValueError, TypeError):
                pass

        result = await self.db.execute(select(Patient).where(*conditions))
        return result.scalar_one_or_none()

    async def list_by_org(self, organization_id: str, limit: int = 50, offset: int = 0, doctor_id: Optional[str] = None):
        conditions = [
            Patient.organization_id == uuid.UUID(organization_id),
            Patient.is_active == True
        ]
        if doctor_id:
            try:
                doc_uuid = uuid.UUID(doctor_id)
                conditions.append(
                    or_(
                        Patient.primary_doctor_id == doc_uuid,
                        Patient.primary_doctor_id.is_(None)
                    )
                )
            except (ValueError, TypeError):
                pass

        result = await self.db.execute(
            select(Patient)
            .where(*conditions)
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
