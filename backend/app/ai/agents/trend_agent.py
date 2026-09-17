"""
Trend Agent for analyzing longitudinal prescription data.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class TrendAgent:
    PROMPT = """
You are the Trend Agent, a clinical data analyst.
Given the following aggregated longitudinal prescription data, generate a natural language summary of the trends.
Identify any significant spikes, drops, or consistent upward/downward trajectories.
Do NOT provide clinical advice. State that this is a statistical observation.

Data:
{data}

Provide your response in clear, concise markdown.
"""

    async def analyze(self, query: str, data_context: List[Dict[str, Any]]) -> str:
        """Analyze temporal trends in the provided data context."""
        # In a real implementation, this agent would first convert the query to SQL 
        # using a Text-to-SQL approach, execute it against the DB, and pass the results 
        # into the prompt below. For this Phase, we assume data_context is the DB result.
        
        context_str = json.dumps(data_context, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.2
        )
        return response

trend_agent = TrendAgent()
