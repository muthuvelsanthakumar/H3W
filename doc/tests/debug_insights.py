import sys
import os
from sqlalchemy.orm import Session

# Add backend to path
sys.path.append(os.path.abspath('e:/Project/backend'))

from app.db.session import engine
# Import everything from base to ensure all models are in metadata
import app.db.base 
from app.models.insight import Insight
from app.models.user import User
from app.api.v1.endpoints.insights import get_insights

def debug_insights():
    with Session(engine) as db:
        user = db.query(User).filter(User.email == "admin@h3w.com").first()
        if not user:
            print("Admin user not found!")
            return
            
        print(f"Testing for user: {user.email}, Org ID: {user.organization_id}")
        
        try:
            # Manually run the logic
            res = get_insights(db, user)
            print(f"Success: {len(res)} insights found.")
        except Exception as e:
            import traceback
            print(f"Caught Error: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    debug_insights()
