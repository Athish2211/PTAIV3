"""
Ollama SLM client for private, local LLM execution.
Ensures zero data leakage outside the infrastructure with fast, targeted endpoint resolution.
"""
import httpx
import os
from typing import Dict, Any, List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url: Optional[str] = None):
        self.explicit_base_url = base_url
        self.model = getattr(settings, "LLM_MODEL", "phi4-mini:latest")

    def _get_targets(self) -> List[tuple[str, str]]:
        """Return list of (base_url, model_name) targets in priority order."""
        targets = []
        if self.explicit_base_url:
            targets.append((self.explicit_base_url, self.model))
        
        env_url = os.getenv("OLLAMA_BASE_URL") or getattr(settings, "OLLAMA_BASE_URL", None)
        if env_url:
            targets.append((env_url, self.model))
            targets.append((env_url, "medgemma:latest"))

        # Container Ollama
        targets.append(("http://ollama:11434", self.model))
        targets.append(("http://ollama:11434", "medgemma:latest"))

        # Host Windows Ollama with phi4-mini:latest
        targets.append(("http://host.docker.internal:11434", self.model))
        targets.append(("http://localhost:11434", self.model))

        # Deduplicate preserving order
        seen = set()
        unique = []
        for t in targets:
            if t not in seen:
                seen.add(t)
                unique.append(t)
        return unique

    async def generate(self, prompt: str, system: Optional[str] = None, json_format: bool = False, temperature: float = 0.1, timeout: float = 35.0) -> str:
        """Single prompt generation with fast, prioritized fallback."""
        payload = {
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
        for base_url, model_name in self._get_targets():
            url = f"{base_url}/api/generate"
            call_payload = {**payload, "model": model_name}

            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(url, json=call_payload)
                    if response.status_code == 404:
                        continue
                    response.raise_for_status()
                    data = response.json()
                    resp_text = data.get("response", "")
                    if resp_text and len(resp_text.strip()) > 0:
                        return resp_text
            except Exception as e:
                last_error = e
                continue

        logger.warning(f"Ollama generate failed across targets: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

    async def chat(self, messages: List[Dict[str, str]], json_format: bool = False, temperature: float = 0.1, timeout: float = 35.0) -> str:
        """Multi-turn chat interaction with fast, prioritized fallback."""
        payload = {
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }
        if json_format:
            payload["format"] = "json"

        last_error = None
        for base_url, model_name in self._get_targets():
            url = f"{base_url}/api/chat"
            call_payload = {**payload, "model": model_name}

            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(url, json=call_payload)
                    if response.status_code == 404:
                        continue
                    response.raise_for_status()
                    data = response.json()
                    return data.get("message", {}).get("content", "")
            except Exception as e:
                last_error = e
                continue

        logger.warning(f"Ollama chat failed across targets: {last_error}")
        raise last_error or RuntimeError("Ollama service unreachable")

llm_client = OllamaClient()
