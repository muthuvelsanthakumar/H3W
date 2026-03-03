
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_calibration_flow():
    # 1. Login to get token
    print("Login - Logging in...")
    login_data = {
        "username": "admin@h3w.com",
        "password": "hashed_password_placeholder" # We know the real one from init_db is 'admin123' usually
    }
    # Re-checking init_db or previous context... usually it's admin@h3w.com / admin123
    response = requests.post(f"{BASE_URL}/login/access-token", data={"username": "admin@h3w.com", "password": "admin123"})
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Get Data Sources
    print("Data Sources - Fetching data sources...")
    sources_resp = requests.get(f"{BASE_URL}/data/sources", headers=headers)
    if sources_resp.status_code != 200:
        print(f"Fetch failed: {sources_resp.status_code} - {sources_resp.text}")
        return
        
    try:
        sources = sources_resp.json()
    except Exception as e:
        print(f"JSON Decode Error: {e}")
        print(f"Response Text: {sources_resp.text}")
        return
    
    if not sources:
        print("No data sources found. Cannot test calibration.")
        return
    
    target_source = sources[0]
    source_id = target_source["id"]
    print(f"Target Source: {target_source['name']} (ID: {source_id})")
    print(f"Current Settings: {target_source.get('settings')}")

    # 3. Update Calibration Settings
    new_settings = {
        "missing_threshold": 25.0,
        "duplicate_threshold": 15.0,
        "sensitivity": "low"
    }
    print(f"Updating calibration to: {new_settings}...")
    
    update_resp = requests.patch(
        f"{BASE_URL}/data/{source_id}", 
        headers=headers, 
        json={"settings": new_settings}
    )
    
    if update_resp.status_code == 200:
        updated_source = update_resp.json()
        print("Calibration update SUCCESS.")
        print(f"Verified Settings in DB: {updated_source.get('settings')}")
        
        # Verify specific values
        assert updated_source["settings"]["missing_threshold"] == 25.0
        assert updated_source["settings"]["sensitivity"] == "low"
        print("TEST PASSED: Database persistence verified.")
    else:
        print(f"Update failed: {update_resp.status_code} - {update_resp.text}")

if __name__ == "__main__":
    test_calibration_flow()
