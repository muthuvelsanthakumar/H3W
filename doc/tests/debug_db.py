import sys
import os
from sqlalchemy import create_all, inspect

# Add backend to path
sys.path.append(os.path.abspath('e:/Project/backend'))

from app.db.session import engine
from app.db.base import Base

def check_db():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables in DB: {tables}")
        
        from app.models.user import User
        from sqlalchemy.orm import Session
        
        with Session(engine) as session:
            user_count = session.query(User).count()
            print(f"User count: {user_count}")
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
