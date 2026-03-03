import httpx
import os
from app.core.config import settings
from typing import List, Dict, Any, Optional

class AIService:
    def __init__(self):
        self.api_key = settings.LLAMA_API_KEY
        self.model = settings.LLAMA_MODEL
        # Defaulting to an OpenAI-compatible endpoint if not specified
        self.base_url = os.getenv("LLAMA_API_BASE", "https://api.groq.com/openai/v1") 

    async def generate_explanation(self, insight_data: Dict[str, Any], context: str = "") -> str:
        """
        Generates a natural language explanation for a validated insight.
        """
        if not self.api_key:
            return "AI explanation unavailable (API key not configured)."

        prompt = f"""
        You are the Intelligence Engine of a Unified Business Operations Platform.
        Your task is to explain a validated business insight to a professional user.
        
        INSIGHT DATA:
        {insight_data}
        
        BUSINESS CONTEXT:
        {context}
        
        RULES:
        1. Only explain the provided metrics. Do NOT hallucinate new metrics.
        2. Provide clear, concise root cause analysis based on the data.
        3. Suggest a safe operational action.
        4. Maintain a professional, trust-first tone.
        5. Absolute NO technical jargon. Do NOT use terms like 'column', 'cardinality', 'null values', or 'data types'.
        6. Translate data symptoms into business impact (e.g., instead of 'nulls in revenue', say 'incomplete transaction records affecting financial visibility').
        7. If confidence is low, admit it.
        """

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are a conservative, evidence-based business intelligence assistant."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.1 # Low temperature for consistency
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error generating explanation: {str(e)}"

    async def analyze_streams(self, sources_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Analyzes multiple data streams to find hidden business trends and anomalies.
        Returns a list of structured insights.
        """
        if not self.api_key:
            return []

        prompt = f"""
        Analyze these data streams for a business organization. Find critical anomalies, risks, or opportunities.
        
        DATA STREAMS SUMMARY:
        {sources_data}
        
        TASK:
        Generate 2-3 significant business insights. Return them ONLY as a valid JSON list of objects with the following keys:
        - title: Short impact-focused title
        - description: One sentence explanation
        - impact_level: 'High' or 'Medium'
        - confidence_score: Number between 70 and 100
        - category: One of 'Operations', 'Marketing', 'Finance', 'Sales'
        - ai_root_cause: Reasoning based on business logic. Strictly NO technical jargon.
        - visualization_data: A list of 2 chart objects for deep-analysis. Each chart object must have:
            - type: 'area', 'bar', or 'pie'
            - title: Analysis title
            - data: List of objects (e.g., [{{"name": "Jan", "val": 10}}, {{"name": "Feb", "val": 20}}])
            - metrics: (REQUIRED for area/bar) List of objects {{"key": "metric_name", "color": "hex_color", "name": "Display"}}. **IMPORTANT: The "key" MUST match a key in the data objects.**
        
        Example visualization_data structure:
        [
            {{"type": "area", "title": "Trend Analysis", "data": [{{"name": "Jan", "val": 10}}, {{"name": "Feb", "val": 20}}], "metrics": [{{"key": "val", "color": "#4f46e5", "name": "Value"}}]}},
            {{"type": "pie", "title": "Distribution", "data": [{{"name": "A", "value": 40}}, {{"name": "B", "value": 60}}]}}
        ]
        
        JSON ONLY. NO TEXT BEFORE OR AFTER.
        """

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are a senior data scientist. You MUST output ONLY a valid JSON array of objects. No markdown formatting, no code blocks, no preamble."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.4,
                        "response_format": { "type": "json_object" } if "gpt" in self.model else None 
                    },
                    timeout=45.0
                )
                response.raise_for_status()
                content = response.json()["choices"][0]["message"]["content"]
                print(f"DEBUG: AI RAW RESPONSE: {content[:200]}...")
                
                # Strip markdown code blocks if present
                content = content.replace("```json", "").replace("```", "").strip()
                
                # Basic JSON cleanup
                import json
                try:
                    data = json.loads(content)
                    if isinstance(data, dict) and "insights" in data:
                        return data["insights"]
                    return data if isinstance(data, list) else []
                except:
                    # Fallback for weird formatting
                    import re
                    match = re.search(r'\[.*\]', content, re.DOTALL)
                    if match:
                        return json.loads(match.group())
                    return []
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return []

ai_service = AIService()
