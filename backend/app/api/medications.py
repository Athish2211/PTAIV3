from fastapi import APIRouter

router = APIRouter(prefix="/medications")

@router.get("")
async def list_items():
    return []
