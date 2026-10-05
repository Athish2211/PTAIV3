"""
Data Intelligence Agent
Automatically infers schemas from raw uploaded datasets and maps them to canonical EHR definitions.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class DataIntelligenceAgent:
    PROMPT = """
You are the Data Intelligence Agent.
Your task is to review the schema and column profiles of an uploaded external dataset and map them to our canonical EHR fields:
[patient_id, encounter_id, date, diagnosis, medication, dosage, frequency, age, gender, region, risk_score, prescriber, quantity].

Provide your response as a structured JSON object mapping the canonical field to the source column name and a confidence score ("high", "medium", "low").

Column Profiles:
{data}
"""

    async def analyze(self, query: str, schema_profiles: List[Dict[str, Any]]) -> str:
        """Analyze dataset schema and propose mappings."""
        context_str = json.dumps(schema_profiles, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            json_format=True,
            temperature=0.1
        )
        return response

data_intelligence_agent = DataIntelligenceAgent()
