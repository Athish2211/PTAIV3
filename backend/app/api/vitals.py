from fastapi import APIRouter

router = APIRouter(prefix="/vitals")

@router.get("")
async def list_items():
    return []
