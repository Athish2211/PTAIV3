from fastapi import APIRouter

router = APIRouter(prefix="/organizations")

@router.get("")
async def list_items():
    return []
