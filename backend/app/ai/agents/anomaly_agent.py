"""
Anomaly Agent for identifying statistical outliers in clinical data.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class AnomalyAgent:
    PROMPT = """
You are the Anomaly Agent, an AI designed to flag unusual statistical patterns in clinical prescriptions.
Review the following dataset of potential outliers identified by our Isolation Forest model.
Summarize the findings, explaining WHY they were flagged (e.g., unusual dosage, rare combination, duration outlier).
Emphasize that these are statistical anomalies and DO NOT constitute clinical diagnosis or error alerts.

Data:
{data}

Provide your response in clear, professional markdown.
"""

    async def analyze(self, query: str, anomaly_data: List[Dict[str, Any]]) -> str:
        """Analyze and explain identified statistical anomalies."""
        context_str = json.dumps(anomaly_data, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.2
        )
        return response

anomaly_agent = AnomalyAgent()
