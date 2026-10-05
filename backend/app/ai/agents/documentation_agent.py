"""
Documentation Agent (AI Documentation Assistant)
Organizes rough clinical notes into structured formats (SOAP) without hallucinating facts.
"""
from typing import Dict, Any, List
from app.ai.llm.client import llm_client
import json

class DocumentationAgent:
    PROMPT = """
You are the AI Clinical Documentation Assistant.
Your task is to take rough, unstructured clinical notes provided by a doctor and organize them into a structured format (e.g., SOAP note format).

Rules:
1. NEVER invent or hallucinate clinical facts, diagnoses, or symptoms that are not present in the rough notes.
2. If the notes are too sparse to fill a section, leave it blank or explicitly state "Not documented".
3. Highlight or call out any missing critical information (e.g., "Note: Patient temperature is missing").
4. Maintain a highly professional, clinical tone.

Format the output strictly as a JSON object with the following keys:
{
    "chief_complaint": "...",
    "history_of_present_illness": "...",
    "observations_and_vitals": "...",
    "assessment": "...",
    "plan": "...",
    "missing_information_warnings": ["..."]
}

Rough Notes:
{notes}
"""

    async def structure_notes(self, raw_notes: str) -> Dict[str, Any]:
        """Convert raw clinical notes into structured JSON."""
        formatted_prompt = self.PROMPT.format(notes=raw_notes)
        
        try:
            response_text = await llm_client.generate(
                prompt="Organize these notes into the requested JSON structure.",
                system=formatted_prompt,
                json_format=True,
                temperature=0.1
            )
            structured_data = json.loads(response_text)
            return structured_data
        except Exception as e:
            # Fallback for LLM parsing failures
            return {
                "chief_complaint": "Failed to parse structured notes.",
                "history_of_present_illness": raw_notes,
                "observations_and_vitals": "",
                "assessment": "",
                "plan": "",
                "missing_information_warnings": ["Error communicating with LLM model."]
            }

documentation_agent = DocumentationAgent()
