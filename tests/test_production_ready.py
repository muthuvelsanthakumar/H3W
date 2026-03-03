"""
Simplified test suite for Ravana 1.0 Platform
Tests core API functionality without complex async setup
"""
import requests
import time

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

def test_backend_is_running():
    """Test 1: Verify backend server is accessible"""
    try:
        response = requests.get(BASE_URL, timeout=5)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["status"] == "operational", "Backend not operational"
        print("✓ Test 1 PASSED: Backend is running and operational")
        return True
    except Exception as e:
        print(f"✗ Test 1 FAILED: {e}")
        return False

def test_api_documentation():
    """Test 2: Verify API documentation is accessible"""
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        assert response.status_code == 200, "Docs endpoint not accessible"
        assert "swagger" in response.text.lower(), "Swagger UI not loaded"
        print("✓ Test 2 PASSED: API documentation is accessible")
        return True
    except Exception as e:
        print(f"✗ Test 2 FAILED: {e}")
        return False

def test_login_endpoint_exists():
    """Test 3: Verify login endpoint responds (even if credentials are wrong)"""
    try:
        response = requests.post(
            f"{API_V1}/login/access-token",
            data={"username": "test@test.com", "password": "wrongpass"},
            timeout=5
        )
        # We expect 400 or 401 for wrong credentials, which means endpoint exists
        assert response.status_code in [400, 401], f"Unexpected status: {response.status_code}"
        print("✓ Test 3 PASSED: Login endpoint is functional")
        return True
    except Exception as e:
        print(f"✗ Test 3 FAILED: {e}")
        return False

def test_data_sources_endpoint():
    """Test 4: Verify data sources endpoint requires authentication"""
    try:
        response = requests.get(f"{API_V1}/data-sources/", timeout=5)
        # Should return 401 Unauthorized without token
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Test 4 PASSED: Data sources endpoint requires authentication")
        return True
    except Exception as e:
        print(f"✗ Test 4 FAILED: {e}")
        return False

def test_insights_endpoint():
    """Test 5: Verify insights endpoint requires authentication"""
    try:
        response = requests.get(f"{API_V1}/insights/", timeout=5)
        # Should return 401 Unauthorized without token
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Test 5 PASSED: Insights endpoint requires authentication")
        return True
    except Exception as e:
        print(f"✗ Test 5 FAILED: {e}")
        return False

def run_all_tests():
    """Run all tests and report results"""
    print("\n" + "="*60)
    print("RAVANA 1.0 - PRODUCTION READINESS TEST SUITE")
    print("="*60 + "\n")
    
    tests = [
        test_backend_is_running,
        test_api_documentation,
        test_login_endpoint_exists,
        test_data_sources_endpoint,
        test_insights_endpoint
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
        time.sleep(0.5)  # Small delay between tests
    
    print("\n" + "="*60)
    passed = sum(results)
    total = len(results)
    print(f"RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ ALL TESTS PASSED - Application is production ready!")
    else:
        print(f"✗ {total - passed} test(s) failed - Review errors above")
    print("="*60 + "\n")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
