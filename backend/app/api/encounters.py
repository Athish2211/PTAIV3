from fastapi import APIRouter

router = APIRouter(prefix="/encounters")

@router.get("")
async def list_items():
    return []
