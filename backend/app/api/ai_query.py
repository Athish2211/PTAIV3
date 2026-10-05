from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.rbac import get_current_user
from app.models.user import User
from app.ai.supervisor.orchestrator import orchestrator

router = APIRouter(prefix="/ai", tags=["AI Command Center"])

class AIQueryRequest(BaseModel):
    query: str
    patient_id: Optional[str] = None
    patient: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

class AIQueryResponse(BaseModel):
    response: str
    intent: str
    agents_used: List[str]
    latency_ms: int
    evidence: Optional[List[Dict[str, Any]]] = None
    conversation_id: Optional[str] = None

@router.post("", response_model=AIQueryResponse)
async def query_ai(
    request: AIQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Main endpoint for the AI Command Center.
    Routes the query through the multi-agent orchestrator.
    """
    try:
        result = await orchestrator.route_query(
            query=request.query,
            patient_id=request.patient_id,
            patient_context=request.patient,
            db=db
        )
        
        return AIQueryResponse(
            response=result["response"],
            intent=result["intent"],
            agents_used=result["agents_used"],
            latency_ms=result["latency_ms"],
            evidence=result.get("evidence", []),
            conversation_id=request.conversation_id or "new-conv-123" # Stub conversation ID
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
