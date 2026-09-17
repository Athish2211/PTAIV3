"""
Embedding client using Ollama or a local sentence-transformers model.
Used for pgvector RAG implementation.
"""
import httpx
from typing import List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = getattr(settings, "EMBEDDING_MODEL", "nomic-embed-text")  # e.g., 'nomic-embed-text'

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for a single text chunk."""
        url = f"{self.base_url}/api/embeddings"
        payload = {
            "model": self.model,
            "prompt": text
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("embedding", [])
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            # Fallback to zero vector if required, but better to fail loudly
            raise e

embedding_client = EmbeddingClient()
