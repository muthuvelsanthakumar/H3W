import requests
import os
import pandas as pd
import numpy as np

BASE_URL = "http://localhost:8000/api/v1"
ADMIN_EMAIL = "admin@h3w.com"
ADMIN_PASS = "admin123"

def test_platform():
    print("--- 🛡️ PHASE 1: AUTHENTICATION ---")
    
    # 1. Successful Login
    print("[1.1] Attempting login...")
    try:
        response = requests.post(
            f"{BASE_URL}/login/access-token",
            data={"username": ADMIN_EMAIL, "password": ADMIN_PASS},
            timeout=5
        )
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("✅ Login successful.")
        else:
            print(f"❌ Login failed: {response.status_code} {response.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Unauthorized access check
    print("[1.2] Checking unauthorized access...")
    no_auth_resp = requests.get(f"{BASE_URL}/dashboard/summary")
    if no_auth_resp.status_code in [401, 403]:
        print("✅ Unauthorized access correctly blocked.")
    else:
        print(f"❌ Security Flaw: Unauthorized access possible ({no_auth_resp.status_code})")

    print("\n--- 📊 PHASE 2: DASHBOARD & STATE ---")
    
    # 3. Initial Dashboard Status
    print("[2.1] Fetching initial dashboard summary...")
    summary = requests.get(f"{BASE_URL}/dashboard/summary", headers=headers).json()
    print(f"Dashboard Stats: {summary}")
    initial_sources = summary.get("total_sources", 0)

    print("\n--- 📥 PHASE 3: DATA INGESTION ---")
    
    # 4. Create and Upload Test Case
    print("[3.1] Creating test CSV...")
    df = pd.DataFrame({
        'id': [1, 2, 3, 4, 5],
        'name': ['Test1', 'Test2', 'Test3', 'Test3', 'Test5'], # One duplicate
        'score': [80.0, 90.0, 85.0, 85.0, np.nan] # One missing
    })
    df.to_csv("test_ingest.csv", index=False)
    
    print("[3.2] Uploading test CSV...")
    with open("test_ingest.csv", "rb") as f:
        files = {"file": ("test_ingest.csv", f, "text/csv")}
        upload_resp = requests.post(f"{BASE_URL}/data/upload", headers=headers, files=files)
    
    if upload_resp.status_code == 200:
        upload_data = upload_resp.json()
        print(f"✅ Ingestion successful. Health Score: {upload_data['health_score']}")
        print(f"Report Alerts: {upload_data['quality_report']['alerts']}")
    else:
        print(f"❌ Ingestion failed: {upload_resp.status_code} {upload_resp.text}")

    # 5. Verify Dashboard Increment
    print("[3.3] Verifying dashboard updates...")
    new_summary = requests.get(f"{BASE_URL}/dashboard/summary", headers=headers).json()
    if new_summary.get("total_sources") == initial_sources + 1:
        print("✅ Dashboard counter incremented correctly.")
    else:
        print(f"❌ Dashboard sync failed ({new_summary.get('total_sources')} != {initial_sources + 1})")

    print("\n--- 💡 PHASE 4: INTELLIGENCE & INSIGHTS ---")
    
    # 6. Fetch Insights
    print("[4.1] Fetching insights...")
    insights_resp = requests.get(f"{BASE_URL}/insights/", headers=headers)
    if insights_resp.status_code == 200:
        insights = insights_resp.json()
        print(f"Fetched {len(insights)} insights.")
        if insights:
            print(f"First Insight: {insights[0]['title']} (Impact: {insights[0]['impact_level']})")
    else:
        print(f"❌ Insights fetch failed: {insights_resp.status_code}")

    print("\n--- 🏁 TEST COMPLETE ---")

if __name__ == "__main__":
    test_platform()
