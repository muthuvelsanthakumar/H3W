import sqlite3

db_path = r"e:\Project\backend\h3w_platform.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE insight ADD COLUMN predictive_outlook TEXT;")
    print("Added predictive_outlook")
except Exception as e:
    print(e)
    
try:
    cursor.execute("ALTER TABLE insight ADD COLUMN prescriptive_action TEXT;")
    print("Added prescriptive_action")
except Exception as e:
    print(e)

conn.commit()
conn.close()
