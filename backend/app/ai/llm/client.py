"""
Ollama SLM client for private, local LLM execution.
Ensures zero data leakage outside the infrastructure.
"""
import httpx
import json
import os
from typing import Dict, Any, List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url: Optional[str] = None):
        self.explicit_base_url = base_url
        self.model = getattr(settings, "LLM_MODEL", "phi4-mini:latest")

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
        # Deduplicate preserving order
        seen = set()
        unique = []
        for u in candidates:
            if u and u not in seen:
                seen.add(u)
                unique.append(u)
        return unique

    async def generate(self, prompt: str, system: Optional[str] = None, json_format: bool = False, temperature: float = 0.1) -> str:
        """Single prompt generation with automatic multi-endpoint fallback."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }
        if system:
            payload["system"] = system
        if json_format:
            payload["format"] = "json"

        last_error = None
        for base_url in self._get_candidate_urls():
            url = f"{base_url}/api/generate"
            try:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    response = await client.post(url, json=payload)
                    response.raise_for_status()
                    data = response.json()
                    return data.get("response", "")
            except Exception as e:
                last_error = e
                continue

        logger.error(f"Ollama generate failed across all endpoints: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

    async def chat(self, messages: List[Dict[str, str]], json_format: bool = False, temperature: float = 0.1) -> str:
        """Multi-turn chat interaction with automatic multi-endpoint fallback."""
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }
        if json_format:
            payload["format"] = "json"
            
        last_error = None
        for base_url in self._get_candidate_urls():
            url = f"{base_url}/api/chat"
            try:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    response = await client.post(url, json=payload)
                    response.raise_for_status()
                    data = response.json()
                    return data.get("message", {}).get("content", "")
            except Exception as e:
                last_error = e
                continue

        logger.error(f"Ollama chat failed across all endpoints: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

llm_client = OllamaClient()
