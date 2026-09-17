from fastapi import APIRouter

router = APIRouter(prefix="/audit")

@router.get("")
async def list_items():
    return []
