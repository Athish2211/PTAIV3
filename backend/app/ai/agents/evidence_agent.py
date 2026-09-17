"""
Evidence Agent
Cross-references AI outputs against medical literature or internal clinical guidelines to reduce hallucinations.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class EvidenceAgent:
    PROMPT = """
You are the Evidence Agent.
Your role is to verify the clinical claims or patterns identified by other agents against established medical knowledge.
Provide a "Confidence Score" and cite whether the pattern is known in typical literature (e.g., Metformin + Glimepiride is a standard combination for T2DM).
Do not provide medical advice.

Agent Output to Verify:
{data}
"""

    async def analyze(self, query: str, agent_output: str) -> str:
        """Verify the output from another agent."""
        formatted_prompt = self.PROMPT.format(data=agent_output)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.1
        )
        return response

evidence_agent = EvidenceAgent()
