import requests
import os
import pandas as pd
import numpy as np
import time

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
ADMIN_EMAIL = "admin@h3w.com"
ADMIN_PASS = "admin123"

class PlatformTester:
    def __init__(self):
        self.token = None
        self.headers = {}
        self.results = []

    def log_result(self, step, status, details=""):
        self.results.append({"step": step, "status": status, "details": details})
        icon = "✅" if status == "PASS" else "❌"
        print(f"{icon} {step}: {status} {details}")

    def run_tests(self):
        print("\n" + "="*50)
        print("🚀 STARTING PROFESSIONAL PLATFORM INTEGRATION TEST")
        print("="*50 + "\n")

        # Step 1: Authentication
        self.test_authentication()

        if not self.token:
            print("🛑 Testing halted: Authentication required for further steps.")
            return

        # Step 2: Session Security
        self.test_session_security()

        # Step 3: Data Ingestion (CSV)
        source_id = self.test_data_ingestion()

        # Step 4: AI Intelligence Check
        if source_id:
            self.test_ai_explanation(source_id)

        # Step 5: Insight Retrieval
        if source_id:
            self.test_insights_retrieval()

        # Step 6: Dashboard Integrity
        self.test_dashboard_integrity()

        self.summary()

    def test_ai_explanation(self, source_id):
        try:
            print(f"⏳ Requesting AI Explanation for Source ID: {source_id}...")
            resp = requests.post(f"{BASE_URL}/insights/{source_id}/explain", headers=self.headers, timeout=30)
            if resp.status_code == 200:
                explanation = resp.json()["explanation"]
                if "Error" in explanation or "unavailable" in explanation:
                    self.log_result("AI: Root Cause Analysis", "FAIL", "AI returned an error message.")
                else:
                    self.log_result("AI: Root Cause Analysis", "PASS", "Natural language explanation generated.")
            else:
                self.log_result("AI: Root Cause Analysis", "FAIL", f"Status: {resp.status_code}")
        except Exception as e:
            self.log_result("AI: Root Cause Analysis", "FAIL", str(e))

    def test_authentication(self):
        try:
            resp = requests.post(
                f"{BASE_URL}/login/access-token",
                data={"username": ADMIN_EMAIL, "password": ADMIN_PASS},
                timeout=5
            )
            if resp.status_code == 200:
                self.token = resp.json()["access_token"]
                self.headers = {"Authorization": f"Bearer {self.token}"}
                self.log_result("Auth: Admin Login", "PASS")
            else:
                self.log_result("Auth: Admin Login", "FAIL", f"Status: {resp.status_code}")
        except Exception as e:
            self.log_result("Auth: Admin Login", "FAIL", str(e))

    def test_session_security(self):
        resp = requests.get(f"{BASE_URL}/dashboard/summary")
        if resp.status_code in [401, 403]:
            self.log_result("Security: Protected Routes", "PASS", "Unauthorized access blocked.")
        else:
            self.log_result("Security: Protected Routes", "FAIL", f"Status: {resp.status_code}")

    def test_data_ingestion(self):
        csv_file = "platform_test_data.csv"
        df = pd.DataFrame({
            'transaction_id': range(100),
            'amount': np.random.uniform(10, 1000, 100),
            'category': np.random.choice(['Retail', 'SaaS', 'Services'], 100),
            'status': np.random.choice(['Completed', 'Pending'], 100)
        })
        # Introduce some data quality issues
        df.loc[0, 'amount'] = 50000  # Outlier
        df.loc[1, 'category'] = np.nan # Missing value
        df.to_csv(csv_file, index=False)

        try:
            with open(csv_file, "rb") as f:
                files = {"file": (csv_file, f, "text/csv")}
                resp = requests.post(f"{BASE_URL}/data/upload", headers=self.headers, files=files)
            
            if resp.status_code == 200:
                data = resp.json()
                self.log_result("Data: Ingestion & Quality", "PASS", f"Health Score: {data['health_score']}")
                return data["id"]
            else:
                self.log_result("Data: Ingestion & Quality", "FAIL", f"Status: {resp.status_code}")
        except Exception as e:
            self.log_result("Data: Ingestion & Quality", "FAIL", str(e))
        finally:
            if os.path.exists(csv_file): os.remove(csv_file)
        return None

    def test_insights_retrieval(self):
        try:
            resp = requests.get(f"{BASE_URL}/insights/", headers=self.headers)
            if resp.status_code == 200:
                insights = resp.json()
                self.log_result("Insights: Retrieval", "PASS", f"Found {len(insights)} signals.")
            else:
                self.log_result("Insights: Retrieval", "FAIL", f"Status: {resp.status_code}")
        except Exception as e:
            self.log_result("Insights: Retrieval", "FAIL", str(e))

    def test_dashboard_integrity(self):
        try:
            resp = requests.get(f"{BASE_URL}/dashboard/summary", headers=self.headers)
            if resp.status_code == 200:
                data = resp.json()
                if data["total_sources"] > 0:
                    self.log_result("Dashboard: KPI Verification", "PASS", "Counters synced.")
                else:
                    self.log_result("Dashboard: KPI Verification", "FAIL", "Source count mismatch.")
            else:
                self.log_result("Dashboard: KPI Verification", "FAIL", f"Status: {resp.status_code}")
        except Exception as e:
            self.log_result("Dashboard: KPI Verification", "FAIL", str(e))

    def summary(self):
        passed = sum(1 for r in self.results if r["status"] == "PASS")
        total = len(self.results)
        print("\n" + "="*50)
        print(f"🏁 TEST SUMMARY: {passed}/{total} PASSED")
        print("="*50 + "\n")

if __name__ == "__main__":
    tester = PlatformTester()
    tester.run_tests()
