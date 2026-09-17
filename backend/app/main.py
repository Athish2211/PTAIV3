"""
PTAI v3 — FastAPI Main Application
"""
import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan events."""
    logger.info("Starting PTAI v3", version=settings.APP_VERSION, env=settings.APP_ENV)
    try:
        await init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.warning(f"Database initialization failed, continuing without DB: {e}")
    yield
    logger.info("Shutting down PTAI v3")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Native EHR + Multi-Agent Prescription Trend Intelligence",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next) -> Response:
    """Attach a unique request ID to every request."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()

    response = await call_next(request)

    duration_ms = int((time.time() - start_time) * 1000)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration_ms}ms"

    logger.info(
        "request",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration_ms,
        request_id=request_id,
    )
    return response


# ── API Routers ───────────────────────────────────────────────────

from app.api import (
    auth,
    users,
    organizations,
    patients,
    encounters,
    vitals,
    diagnoses,
    medications,
    prescriptions,
    prescription_uploads,
    documents,
    follow_ups,
    ai_query,
    analytics,
    datasets,
    reports,
    search,
    audit,
    health,
)

API_PREFIX = "/api/v1"

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth.router, prefix=API_PREFIX, tags=["Authentication"])
app.include_router(users.router, prefix=API_PREFIX, tags=["Users"])
app.include_router(organizations.router, prefix=API_PREFIX, tags=["Organizations"])
app.include_router(patients.router, prefix=API_PREFIX, tags=["Patients"])
app.include_router(encounters.router, prefix=API_PREFIX, tags=["Encounters"])
app.include_router(vitals.router, prefix=API_PREFIX, tags=["Vitals"])
app.include_router(diagnoses.router, prefix=API_PREFIX, tags=["Diagnoses"])
app.include_router(medications.router, prefix=API_PREFIX, tags=["Medications"])
app.include_router(prescriptions.router, prefix=API_PREFIX, tags=["Prescriptions"])
app.include_router(prescription_uploads.router, prefix=API_PREFIX, tags=["Prescription Uploads"])
app.include_router(documents.router, prefix=API_PREFIX, tags=["Documents"])
app.include_router(follow_ups.router, prefix=API_PREFIX, tags=["Follow-Ups"])
app.include_router(ai_query.router, prefix=API_PREFIX, tags=["AI"])
app.include_router(analytics.router, prefix=API_PREFIX, tags=["Analytics"])
app.include_router(datasets.router, prefix=API_PREFIX, tags=["External Datasets"])
app.include_router(reports.router, prefix=API_PREFIX, tags=["Reports"])
app.include_router(search.router, prefix=API_PREFIX, tags=["Search"])
app.include_router(audit.router, prefix=API_PREFIX, tags=["Audit"])


# ── Global exception handler ─────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error("unhandled_exception", error=str(exc), request_id=request_id, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred. Please try again.",
            "request_id": request_id,
        },
    )
