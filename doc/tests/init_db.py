import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

# Add backend to path
sys.path.append(os.path.abspath('e:/Project/backend'))

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.organization import Organization
from app.core.security import get_password_hash

def init_db():
    try:
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully.")
        
        with Session(engine) as session:
            # Check if organization exists
            org = session.query(Organization).first()
            if not org:
                print("Creating default organization...")
                org = Organization(name="H3W Default Org", slug="h3w-default")
                session.add(org)
                session.commit()
                session.refresh(org)
            
            # Check if admin user exists
            user = session.query(User).filter(User.email == "admin@h3w.com").first()
            if not user:
                print("Creating default admin user...")
                user = User(
                    email="admin@h3w.com",
                    hashed_password=get_password_hash("admin123"),
                    is_active=True,
                    is_superuser=True,
                    organization_id=org.id
                )
                session.add(user)
                session.commit()
                print("Default user created (admin@h3w.com / admin123)")
            else:
                print("Admin user already exists. Updating password...")
                user.hashed_password = get_password_hash("admin123")
                session.commit()
                print("Password updated for admin@h3w.com.")
                
    except Exception as e:
        print(f"Error initializing DB: {e}")

if __name__ == "__main__":
    init_db()
