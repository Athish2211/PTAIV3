from fastapi import APIRouter

router = APIRouter(prefix="/follow-ups")

@router.get("")
async def list_items():
    return []
