from fastapi import APIRouter

router = APIRouter(prefix="/search")

@router.get("")
async def list_items():
    return []
