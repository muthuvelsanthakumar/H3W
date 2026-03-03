from sqlalchemy import text
from app.db.session import engine

def patch_db():
    with engine.connect() as conn:
        try:
            # Use JSON if JSONB is not supported (standard Postgres supports JSONB)
            conn.execute(text("ALTER TABLE organization ADD COLUMN IF NOT EXISTS settings JSON DEFAULT '{}'"))
            conn.commit()
            print("Successfully checked/added settings column.")
        except Exception as e:
            print(f"Error patching DB: {e}")

if __name__ == "__main__":
    patch_db()
