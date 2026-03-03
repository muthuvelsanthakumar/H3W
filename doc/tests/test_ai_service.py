import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.abspath('e:/Project/backend'))

from app.services.ai_service import ai_service
from dotenv import load_dotenv

# Load env manually as ai_service might have initialized before I changed the file in this process if I imported it earlier
# But here we are a new process
load_dotenv('e:/Project/backend/.env')

async def test_ai_connection():
    print("🚀 Testing Groq AI Connection...")
    
    test_data = {
        "metrics": {
            "missing_values": "15%",
            "outliers": "2.4%",
            "duplicates": "0.5%"
        },
        "health_score": 82.5
    }
    
    context = "Dataset: Customer Transactions 2024. Source: CSV Upload."
    
    print("⏳ Requesting explanation from Llama 3.3 (Groq)...")
    explanation = await ai_service.generate_explanation(test_data, context)
    
    print("\n" + "="*50)
    print("🤖 AI RESPONSE:")
    print("="*50)
    print(explanation)
    print("="*50 + "\n")
    
    if "Error" in explanation or "unavailable" in explanation:
        print("❌ AI Connection Failed.")
    else:
        print("✅ AI Connection Successful!")

if __name__ == "__main__":
    asyncio.run(test_ai_connection())
