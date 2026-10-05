"""
Patient Memory Agent
Synthesizes a patient's entire medical history from RAG context into a clinical summary.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class PatientMemoryAgent:
    PROMPT = """
You are the Patient Memory Agent, an AI designed to synthesize a patient's medical history.
Using the following context retrieved from the patient's EHR records, prescriptions, and clinical documents:
{context}

Provide a comprehensive, accurate clinical summary. 
Do NOT invent details. If a piece of information is missing, do not speculate.
Focus on chronic conditions, active medications, and recent significant encounters.
"""

    async def analyze(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """Synthesize patient context based on RAG retrieval."""
        context_str = json.dumps(context_chunks, indent=2)
        formatted_prompt = self.PROMPT.format(context=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.1
        )
        return response

patient_memory_agent = PatientMemoryAgent()
