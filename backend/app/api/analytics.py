from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from pydantic import BaseModel
from app.core.rbac import get_current_user
from app.models.user import User
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics")


class DashboardStatsResponse(BaseModel):
    total_patients: int
    patients_today: int
    prescriptions_this_month: int
    encounters_this_month: int
    active_patients: int
    month_start: str
    today: str
    last_month_start: Optional[str] = None


class PrescriptionTrendResponse(BaseModel):
    month: str
    year: int
    prescriptions: int
    patients: int
    month_start: str
    month_end: str


class PrescriptionTrendsResponse(BaseModel):
    trends: list[PrescriptionTrendResponse]
    analysis: dict


class DiagnosisDistributionResponse(BaseModel):
    name: str
    count: int


class DiagnosisResponse(BaseModel):
    diagnoses: list[DiagnosisDistributionResponse]
    summary: dict


@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics for the current user's organization."""
    try:
        service = AnalyticsService(db)
        stats = await service.get_dashboard_statistics(str(current_user.organization_id))
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")


@router.get("/prescription-trends", response_model=PrescriptionTrendsResponse)
async def get_prescription_trends(
    months: int = Query(6, ge=1, le=24, description="Number of months to analyze"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get prescription volume trends over time."""
    try:
        service = AnalyticsService(db)
        trends = await service.get_prescription_trends(str(current_user.organization_id), months)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch prescription trends: {str(e)}")


@router.get("/diagnosis-distribution", response_model=DiagnosisResponse)
async def get_diagnosis_distribution(
    limit: int = Query(10, ge=1, le=50, description="Number of top diagnoses to return"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get top diagnoses by frequency."""
    try:
        service = AnalyticsService(db)
        distribution = await service.get_diagnosis_distribution(str(current_user.organization_id), limit)
        return distribution
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch diagnosis distribution: {str(e)}")


@router.get("/patient-activity")
async def get_patient_activity(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get patient activity over time."""
    try:
        service = AnalyticsService(db)
        activity = await service.get_patient_activity(str(current_user.organization_id), days)
        return activity
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch patient activity: {str(e)}")


class V2AdvancedRequest(BaseModel):
    patients: list[dict]
    prescriptions: list[dict]


@router.post("/v2-advanced")
async def run_v2_advanced_agents(request: V2AdvancedRequest):
    """
    Add-on endpoint to run heavy V2 ML Agents on the provided data payload.
    Converts frontend state to pandas DataFrame and executes XGBoost/PyTorch VAE agents.
    """
    try:
        import pandas as pd
        from app.agents.risk_agent_improved import run_risk_agent_improved
        from app.agents.anomaly_agent_improved import run_anomaly_agent_improved

        patients_df = pd.DataFrame(request.patients) if request.patients else pd.DataFrame()
        prescriptions_df = pd.DataFrame(request.prescriptions) if request.prescriptions else pd.DataFrame()

        # Merge them to create a combined dataset for the agents
        if not patients_df.empty and not prescriptions_df.empty:
            if 'mrn' in patients_df.columns and 'mrn' in prescriptions_df.columns:
                df = pd.merge(prescriptions_df, patients_df, on='mrn', how='left')
            else:
                df = prescriptions_df
        elif not prescriptions_df.empty:
            df = prescriptions_df
        elif not patients_df.empty:
            df = patients_df
        else:
            df = pd.DataFrame()

        if len(df) < 2:
            return {"status": "error", "message": "Not enough data to run ML agents. Need at least 2 records."}

        col_map = {
            'patient_id': 'mrn',
            'age': 'age',
            'risk_score': 'risk_level',
            'date': 'prescription_date',
            'drug_name': 'medication'
        }

        # Run Agents
        risk_result = run_risk_agent_improved(df, col_map)
        
        # Prevent crash if anomaly agent needs specific columns
        try:
            anomaly_result = run_anomaly_agent_improved(df, col_map)
        except Exception as e:
            anomaly_result = {"status": "error", "error": str(e), "figures": []}

        return {
            "status": "success",
            "risk_agent": risk_result,
            "anomaly_agent": anomaly_result
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to run V2 agents: {str(e)}")
