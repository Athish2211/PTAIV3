"""
Embedding client using Ollama or a local sentence-transformers model.
Used for pgvector RAG implementation.
"""
import httpx
import os
from typing import List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingClient:
    def __init__(self, base_url: Optional[str] = None):
        self.explicit_base_url = base_url
        self.model = getattr(settings, "EMBEDDING_MODEL", "nomic-embed-text")

    def _get_candidate_urls(self) -> List[str]:
        candidates = []
        if self.explicit_base_url:
            candidates.append(self.explicit_base_url)
        env_url = os.getenv("OLLAMA_BASE_URL")
        if env_url:
            candidates.append(env_url)
        setting_url = getattr(settings, "OLLAMA_BASE_URL", None)
        if setting_url:
            candidates.append(setting_url)
        candidates.extend([
            "http://ollama:11434",
            "http://host.docker.internal:11434",
            "http://127.0.0.1:11434",
            "http://localhost:11434",
        ])
        seen = set()
        unique = []
        for u in candidates:
            if u and u not in seen:
                seen.add(u)
                unique.append(u)
        return unique

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for a single text chunk with multi-endpoint fallback."""
        payload = {
            "model": self.model,
            "prompt": text
        }
        
        last_error = None
        for base_url in self._get_candidate_urls():
            url = f"{base_url}/api/embeddings"
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(url, json=payload)
                    response.raise_for_status()
                    data = response.json()
                    return data.get("embedding", [])
            except Exception as e:
                last_error = e
                continue

        logger.error(f"Embedding failed across all endpoints: {last_error}")
        raise last_error or RuntimeError("Embedding service unreachable")

embedding_client = EmbeddingClient()
