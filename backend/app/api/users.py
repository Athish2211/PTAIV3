"""
Stub API routers — to be fully implemented in subsequent phases.
These stubs ensure the FastAPI app starts without import errors.
"""
from fastapi import APIRouter

# ── Users ─────────────────────────────────────────────────────────
users_router = APIRouter(prefix="/users")

@users_router.get("/me")
async def get_me():
    return {"detail": "Implement in Phase 1"}

router = users_router
