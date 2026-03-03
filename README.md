# H3W Intelligence Platform

Unified AI BI & Operations Platform.

## Quick Start (Development)

### 1. Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize the database: `python init_db.py`
4. Start the server: `python -m uvicorn app.main:app --reload`

*Default Admin Credentials:*
- Email: `admin@h3w.com`
- Password: `admin123`

### 2. Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 🚀 Production Deployment (Non-Docker)

### Backend (Gunicorn + Uvicorn)
Run the production worker stack:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

### Frontend (Build & Serve)
Generate production assets and serve:
```bash
npm run build
# Then serve the 'dist' folder using Nginx or 'serve -s dist'
```

## Key Improvements Made
- **Security & Resilience**: 
    - JWT-based authentication with strict RBAC.
    - **API Rate Limiting** (SlowAPI) to prevent DDoS and API abuse.
    - Restricted CORS origins for production hygiene.
- **Reliability**: Implemented a local SQLite fallback for database stability.
- **Efficiency**: 
    - 10MB file upload limits (Frontend & Backend).
    - **Pagination** (Skip/Limit) for large data source handling.
- **Multi-Tenancy**: Strict organizational scoping on all critical endpoints.
