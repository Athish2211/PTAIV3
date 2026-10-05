"""
Report Agent
Consolidates insights from all agents into a polished, comprehensive markdown report for the user.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class ReportAgent:
    PROMPT = """
You are the Report Agent.
Take the raw outputs from the Trend, Anomaly, Pattern, and Cohort agents and synthesize them into a cohesive, highly professional executive summary report.
Use markdown tables, bolding, and bullet points to make the report scannable.

Agent Outputs:
{data}
"""

    async def analyze(self, query: str, agent_outputs: Dict[str, str]) -> str:
        """Synthesize multiple agent outputs into a report."""
        context_str = json.dumps(agent_outputs, indent=2)
        formatted_prompt = self.PROMPT.format(data=context_str)
        
        response = await llm_client.generate(
            prompt=query,
            system=formatted_prompt,
            temperature=0.3
        )
        return response

report_agent = ReportAgent()
