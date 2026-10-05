"""
PTAI v3 — Application Configuration
All settings are loaded from environment variables.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────
    APP_ENV: str = "development"
    APP_NAME: str = "PTAI v3"
    APP_VERSION: str = "3.0.0"
    DEBUG: bool = False

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://ptai_user:ptai_dev_secret_123@localhost:5433/ptai_db"
    DATABASE_SYNC_URL: str = "postgresql://ptai_user:ptai_dev_secret_123@localhost:5433/ptai_db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # ── Redis ────────────────────────────────────────────────────
    REDIS_URL: str = "redis://:ptai_redis_dev_secret_456@localhost:6380/0"

    # ── Security ─────────────────────────────────────────────────
    JWT_SECRET: str = "change-me-in-production"
    JWT_REFRESH_SECRET: str = "change-me-refresh-in-production"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"
    SESSION_SECRET: str = "change-me-session-in-production"
    MFA_ENCRYPTION_KEY: str = "change-me-mfa-in-production"

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str) -> str:
        return v

    def get_cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # ── AI / Ollama ───────────────────────────────────────────────
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_PROVIDER: str = "ollama"
    LLM_MODEL: str = "phi4-mini:latest"
    FAST_MODEL: str = "phi4-mini:latest"
    QUALITY_MODEL: str = "phi4-mini:latest"
    EMBEDDING_MODEL: str = "nomic-embed-text"
    VECTOR_DIMENSION: int = 768
    LLM_TIMEOUT_SECONDS: int = 60
    STREAMING_TIMEOUT_SECONDS: int = 120

    # ── File Upload ───────────────────────────────────────────────
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 50
    MAX_DATASET_MB: int = 100
    ALLOWED_DOCUMENT_TYPES: str = "pdf,docx,doc,txt,png,jpg,jpeg"
    ALLOWED_DATASET_TYPES: str = "csv,xlsx,xls,json"

    def get_allowed_document_types(self) -> List[str]:
        return [t.strip() for t in self.ALLOWED_DOCUMENT_TYPES.split(",")]

    def get_allowed_dataset_types(self) -> List[str]:
        return [t.strip() for t in self.ALLOWED_DATASET_TYPES.split(",")]

    # ── Analytics ─────────────────────────────────────────────────
    ANALYTICS_MIN_RECORDS: int = 10
    ANALYTICS_CACHE_HOURS: int = 24

    # ── Rate Limiting ─────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60
    AUTH_RATE_LIMIT_PER_MINUTE: int = 10

    # ── Logging ───────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
