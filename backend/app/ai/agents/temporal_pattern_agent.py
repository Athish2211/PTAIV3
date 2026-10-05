"""
Temporal Pattern Agent
Analyzes time-series clinical data for disease progression or longitudinal care gaps.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class TemporalPatternAgent:
    PROMPT = """
You are the Temporal Pattern Agent.
Review the time-series clinical data below to identify disease progression, escalating dosages, or gaps in longitudinal care.
Keep your analysis objective and based strictly on the provided timeline.

Timeline Data:
{data}
"""

    async def analyze(self, query: str, time_series_data: List[Dict[str, Any]]) -> str:
        """Analyze temporal progression in the data."""
        context_str = json.dumps(time_series_data, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.2
        )
        return response

temporal_pattern_agent = TemporalPatternAgent()
