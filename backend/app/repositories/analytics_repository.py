"""Analytics repository for dashboard statistics and trends."""
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.sql import text
from app.models.patient import Patient
from app.models.prescription import Prescription
from app.models.encounter import Encounter
from app.models.diagnosis import Diagnosis
import uuid


class AnalyticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_stats(self, organization_id: str) -> Dict[str, Any]:
        """Get dashboard statistics for an organization."""
        org_id = uuid.UUID(organization_id)
        today = date.today()
        month_start = today.replace(day=1)

        # Total active patients
        total_patients_result = await self.db.execute(
            select(func.count(Patient.id)).where(
                Patient.organization_id == org_id,
                Patient.is_active == True
            )
        )
        total_patients = total_patients_result.scalar() or 0

        # Patients with visits today
        patients_today_result = await self.db.execute(
            select(func.count(func.distinct(Encounter.patient_id))).where(
                Encounter.organization_id == org_id,
                Encounter.date == today
            )
        )
        patients_today = patients_today_result.scalar() or 0

        # Prescriptions this month
        prescriptions_month_result = await self.db.execute(
            select(func.count(Prescription.id)).where(
                Prescription.organization_id == org_id,
                Prescription.created_at >= month_start
            )
        )
        prescriptions_month = prescriptions_month_result.scalar() or 0

        # Total encounters this month
        encounters_month_result = await self.db.execute(
            select(func.count(Encounter.id)).where(
                Encounter.organization_id == org_id,
                Encounter.date >= month_start
            )
        )
        encounters_month = encounters_month_result.scalar() or 0

        return {
            "total_patients": total_patients,
            "patients_today": patients_today,
            "prescriptions_this_month": prescriptions_month,
            "encounters_this_month": encounters_month,
            "month_start": month_start.isoformat(),
            "today": today.isoformat()
        }

    async def get_prescription_trends(
        self, 
        organization_id: str, 
        months: int = 6
    ) -> List[Dict[str, Any]]:
        """Get prescription volume trends for the last N months."""
        org_id = uuid.UUID(organization_id)
        today = date.today()
        trends = []

        for i in range(months):
            month_start = (today.replace(day=1) - timedelta(days=30*i)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)

            # Count prescriptions in this month
            prescriptions_result = await self.db.execute(
                select(func.count(Prescription.id)).where(
                    Prescription.organization_id == org_id,
                    Prescription.created_at >= month_start,
                    Prescription.created_at <= month_end
                )
            )
            prescription_count = prescriptions_result.scalar() or 0

            # Count unique patients with prescriptions
            patients_result = await self.db.execute(
                select(func.count(func.distinct(Prescription.patient_id))).where(
                    Prescription.organization_id == org_id,
                    Prescription.created_at >= month_start,
                    Prescription.created_at <= month_end
                )
            )
            patient_count = patients_result.scalar() or 0

            trends.append({
                "month": month_start.strftime("%b"),
                "year": month_start.year,
                "prescriptions": prescription_count,
                "patients": patient_count,
                "month_start": month_start.isoformat(),
                "month_end": month_end.isoformat()
            })

        return list(reversed(trends))

    async def get_diagnosis_distribution(
        self, 
        organization_id: str, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get top diagnoses by frequency."""
        org_id = uuid.UUID(organization_id)
        month_start = date.today().replace(day=1)

        result = await self.db.execute(
            select(
                Diagnosis.name,
                func.count(Diagnosis.id).label('count')
            )
            .where(
                Diagnosis.organization_id == org_id,
                Diagnosis.created_at >= month_start
            )
            .group_by(Diagnosis.name)
            .order_by(func.count(Diagnosis.id).desc())
            .limit(limit)
        )

        diagnoses = []
        for row in result:
            diagnoses.append({
                "name": row.name or "Unknown",
                "count": row.count
            })

        return diagnoses

    async def get_patient_activity(
        self, 
        organization_id: str, 
        days: int = 30
    ) -> List[Dict[str, Any]]:
        """Get patient activity over time."""
        org_id = uuid.UUID(organization_id)
        today = date.today()
        activities = []

        for i in range(days):
            activity_date = today - timedelta(days=i)
            
            # Count encounters on this day
            encounters_result = await self.db.execute(
                select(func.count(Encounter.id)).where(
                    Encounter.organization_id == org_id,
                    Encounter.date == activity_date
                )
            )
            encounter_count = encounters_result.scalar() or 0

            activities.append({
                "date": activity_date.isoformat(),
                "encounters": encounter_count
            })

        return list(reversed(activities))