"""
Risk Agent
Analyzes clinical markers to stratify patient risk (e.g., readmission risk, adverse drug event risk).
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class RiskAgent:
    PROMPT = """
You are the Risk Agent, specialized in clinical risk stratification.
Given the patient's data profile below, identify potential risk factors (e.g., polypharmacy, high-risk diagnoses).
You MUST clearly state that this is a statistical risk assessment and NOT a definitive clinical diagnosis.

Data:
{data}
"""

    async def analyze(self, query: str, patient_data: List[Dict[str, Any]]) -> str:
        """Analyze risk factors in the provided data."""
        context_str = json.dumps(patient_data, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.1
        )
        return response

risk_agent = RiskAgent()
