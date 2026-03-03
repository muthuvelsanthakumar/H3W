# Ravana 1.0 - Testing & Validation Guide

## Test Suite Overview

This directory contains production-ready tests for the Ravana 1.0 Intelligence Platform.

## Test Files

### 1. `test_production_ready.py`
**Purpose:** End-to-end validation of running application  
**Type:** Integration tests using `requests` library  
**Prerequisites:** Backend server must be running on `http://localhost:8000`

**Tests Included:**
- ✓ Backend availability and operational status
- ✓ API documentation accessibility (`/docs`)
- ✓ Authentication endpoint functionality
- ✓ Protected endpoints require authentication
- ✓ Data sources endpoint security
- ✓ Insights endpoint security

**How to Run:**
```bash
# 1. Start the backend server first
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload

# 2. In a new terminal, run the tests
python tests/test_production_ready.py
```

**Expected Output:**
```
============================================================
RAVANA 1.0 - PRODUCTION READINESS TEST SUITE
============================================================

✓ Test 1 PASSED: Backend is running and operational
✓ Test 2 PASSED: API documentation is accessible
✓ Test 3 PASSED: Login endpoint is functional
✓ Test 4 PASSED: Data sources endpoint requires authentication
✓ Test 5 PASSED: Insights endpoint requires authentication

============================================================
RESULTS: 5/5 tests passed
✓ ALL TESTS PASSED - Application is production ready!
============================================================
```

### 2. `test_health.py`
**Purpose:** Basic API endpoint validation  
**Type:** Async unit tests using `pytest` and `httpx`  
**Prerequisites:** None (tests the app directly without running server)

**How to Run:**
```bash
cd backend
venv\Scripts\activate
pip install pytest httpx pytest-asyncio
cd ..
python -m pytest tests/test_health.py -v
```

### 3. `test_auth.py`
**Purpose:** Authentication and security validation  
**Type:** Async unit tests  

**Tests Included:**
- JWT token creation
- Login flow validation
- Security utilities

### 4. `test_integration.py`
**Purpose:** API integration tests  
**Type:** Async integration tests  

**Tests Included:**
- Metrics endpoint
- API documentation endpoint

## Manual Testing Checklist

### Backend Validation
- [ ] Backend starts without errors: `uvicorn app.main:app --reload`
- [ ] Database initializes correctly
- [ ] API documentation loads at `http://localhost:8000/docs`
- [ ] Root endpoint returns operational status

### Frontend Validation
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Login page loads correctly
- [ ] Dashboard displays after login
- [ ] Data upload functionality works
- [ ] Ravana 1.0 branding displays correctly
- [ ] Charts render properly

### Full Stack Integration
- [ ] Login with credentials: `admin@h3w.com` / (check .env for password)
- [ ] Upload a CSV file
- [ ] Trigger "Generate Intelligence Scan"
- [ ] Verify insights appear in dashboard
- [ ] Click on an insight to view deep-dive analysis
- [ ] Verify charts display correctly

### Docker Deployment
- [ ] `docker-compose up --build` runs without errors
- [ ] Frontend accessible at `http://localhost:80`
- [ ] Backend accessible at `http://localhost:8000`
- [ ] Services can communicate with each other

## Debugging Failed Tests

### "Unable to connect to the remote server"
**Cause:** Backend is not running  
**Solution:** Start the backend server first:
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### "ModuleNotFoundError: No module named 'app'"
**Cause:** Python path not configured correctly  
**Solution:** Run tests from project root or use conftest.py

### "Database is locked"
**Cause:** Multiple processes accessing SQLite  
**Solution:** Close any database browsers or other connections

### "AI Timeout" or "API Key Error"
**Cause:** LLAMA_API_KEY not configured or qslm cloud API unavailable  
**Solution:** Check `.env` file has valid `LLAMA_API_KEY` and `LLAMA_API_BASE`

## Production Deployment Checklist

Before deploying to production:

- [ ] All tests in `test_production_ready.py` pass
- [ ] Environment variables configured in `.env`
- [ ] Database migrations applied
- [ ] Static files built for frontend (`npm run build`)
- [ ] Docker images build successfully
- [ ] CORS origins configured for production domain
- [ ] Rate limiting configured appropriately
- [ ] Logging configured for production
- [ ] Backup strategy in place for database

## Performance Benchmarks

Expected performance metrics:

- **API Response Time:** < 200ms for standard endpoints
- **AI Analysis Time:** 5-15 seconds for small datasets (< 1000 rows)
- **Dashboard Load Time:** < 2 seconds
- **Concurrent Users:** Tested up to 10 simultaneous users

## Security Validation

- [ ] JWT tokens expire correctly
- [ ] Protected endpoints require authentication
- [ ] SQL injection prevention (parameterized queries)
- [ ] CORS configured correctly
- [ ] Rate limiting active on public endpoints
- [ ] Passwords hashed with bcrypt
- [ ] No sensitive data in logs

---

**Last Updated:** 2026-02-17  
**Test Coverage:** Core API endpoints, Authentication, Integration  
**Status:** Production Ready ✓
