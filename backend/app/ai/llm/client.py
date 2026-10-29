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
        # Prioritize host.docker.internal where the local host Ollama runs with GPU/phi4
        candidates.append("http://host.docker.internal:11434")
        candidates.append("http://ollama:11434")
        env_url = os.getenv("OLLAMA_BASE_URL")
        if env_url:
            candidates.append(env_url)
        setting_url = getattr(settings, "OLLAMA_BASE_URL", None)
        if setting_url:
            candidates.append(setting_url)
        candidates.extend([
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

    async def generate(self, prompt: str, system: Optional[str] = None, json_format: bool = False, temperature: float = 0.1, timeout: float = 45.0) -> str:
        """Single prompt generation with automatic multi-endpoint and multi-model fallback."""
        model_candidates = [self.model, "phi4-mini:latest", "phi4-mini", "medgemma:latest"]
        # Deduplicate preserving order
        seen_models = []
        for m in model_candidates:
            if m not in seen_models:
                seen_models.append(m)

        last_error = None
        for base_url in self._get_candidate_urls():
            for model_name in seen_models:
                url = f"{base_url}/api/generate"
                payload = {
                    "model": model_name,
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

                try:
                    async with httpx.AsyncClient(timeout=timeout) as client:
                        response = await client.post(url, json=payload)
                        if response.status_code == 404:
                            # Model not on this endpoint, try next model or endpoint
                            continue
                        response.raise_for_status()
                        data = response.json()
                        resp_text = data.get("response", "")
                        if resp_text and len(resp_text.strip()) > 0:
                            return resp_text
                except Exception as e:
                    last_error = e
                    continue

        logger.error(f"Ollama generate failed across all endpoints: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

    async def chat(self, messages: List[Dict[str, str]], json_format: bool = False, temperature: float = 0.1, timeout: float = 45.0) -> str:
        """Multi-turn chat interaction with automatic multi-endpoint fallback."""
        model_candidates = [self.model, "phi4-mini:latest", "phi4-mini", "medgemma:latest"]
        seen_models = []
        for m in model_candidates:
            if m not in seen_models:
                seen_models.append(m)

        last_error = None
        for base_url in self._get_candidate_urls():
            for model_name in seen_models:
                url = f"{base_url}/api/chat"
                payload = {
                    "model": model_name,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": temperature
                    }
                }
                if json_format:
                    payload["format"] = "json"
                    
                try:
                    async with httpx.AsyncClient(timeout=timeout) as client:
                        response = await client.post(url, json=payload)
                        if response.status_code == 404:
                            continue
                        response.raise_for_status()
                        data = response.json()
                        return data.get("message", {}).get("content", "")
                except Exception as e:
                    last_error = e
                    continue

        logger.error(f"Ollama chat failed across all endpoints: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

llm_client = OllamaClient()
