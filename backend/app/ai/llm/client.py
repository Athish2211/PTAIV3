"""
Ollama SLM client for private, local LLM execution.
Ensures zero data leakage outside the infrastructure.
"""
import httpx
import json
from typing import Dict, Any, List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = settings.LLM_MODEL  # e.g., 'llama3.1' or 'medllama2'

    async def generate(self, prompt: str, system: Optional[str] = None, json_format: bool = False, temperature: float = 0.1) -> str:
        """Single prompt generation."""
        url = f"{self.base_url}/api/generate"
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

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
        except Exception as e:
            logger.error(f"Ollama generate error: {e}")
            raise e

    async def chat(self, messages: List[Dict[str, str]], json_format: bool = False, temperature: float = 0.1) -> str:
        """Multi-turn chat interaction."""
        url = f"{self.base_url}/api/chat"
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
            
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("message", {}).get("content", "")
        except Exception as e:
            logger.error(f"Ollama chat error: {e}")
            raise e

llm_client = OllamaClient()
