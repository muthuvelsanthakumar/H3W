
import sqlite3
import os

db_path = "e:/Project/backend/h3w_platform.db"

def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Checking for 'visualization_data' column in 'insight' table...")
    cursor.execute("PRAGMA table_info(insight)")
    columns = [col[1] for col in cursor.fetchall()]

    if 'visualization_data' not in columns:
        print("Adding 'visualization_data' column to 'insight' table...")
        try:
            cursor.execute("ALTER TABLE insight ADD COLUMN visualization_data JSON")
            conn.commit()
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")
    else:
        print("Column 'visualization_data' already exists.")

    conn.close()

if __name__ == "__main__":
    migrate()
