from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

try:
    url = os.getenv("DATABASE_URL")
    print(f"Testing URL: {url}")
    engine = create_engine(url)
    with engine.connect() as conn:
        print("Successfully connected to Supabase!")
except Exception as e:
    print(f"Connection failed: {e}")
