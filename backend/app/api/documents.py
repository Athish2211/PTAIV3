from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.core.rbac import get_current_user
from app.models.user import User
from app.ai.agents.documentation_agent import documentation_agent
import uuid

router = APIRouter(prefix="/documents", tags=["Documents"])

class RoughNotesRequest(BaseModel):
    patient_id: str
    raw_notes: str

class StructuredNoteResponse(BaseModel):
    chief_complaint: str
    history_of_present_illness: str
    observations_and_vitals: str
    assessment: str
    plan: str
    missing_information_warnings: List[str]

@router.get("")
async def list_documents():
    """Stub for document listing."""
    return []

@router.post("/assistant", response_model=StructuredNoteResponse)
async def ai_documentation_assistant(
    request: RoughNotesRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Takes rough clinical notes and returns structured SOAP notes.
    Always requires human review before saving (enforced by UI).
    """
    if not request.raw_notes.strip():
        raise HTTPException(status_code=400, detail="Notes cannot be empty")
        
    try:
        structured_data = await documentation_agent.structure_notes(request.raw_notes)
        return StructuredNoteResponse(**structured_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
