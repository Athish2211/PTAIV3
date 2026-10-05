"""
Cohort Agent for segmenting and analyzing patient populations.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class CohortAgent:
    PROMPT = """
You are the Cohort Agent.
Given the following aggregated patient cohort data, provide a comparative analysis.
Highlight differences in prescription volumes, common diagnoses, or risk scores across the different demographic groups.

Cohort Data:
{data}

Provide a concise, analytical summary in markdown.
"""

    async def analyze(self, query: str, cohort_data: List[Dict[str, Any]]) -> str:
        """Analyze demographic segments and patient cohorts."""
        context_str = json.dumps(cohort_data, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.2
        )
        return response

cohort_agent = CohortAgent()
