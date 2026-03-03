# Ravana 1.0 - Advanced AI Intelligence Platform
## Complete Technical Documentation

---

### **Table of Contents**

1.  [Executive Summary](#1-executive-summary)
2.  [System Architecture](#2-system-architecture)
3.  [Technology Stack](#3-technology-stack)
4.  [Directory Structure](#4-directory-structure)
5.  [Core Modules & Logic](#5-core-modules--logic)
    *   [Backend Services](#backend-services)
    *   [AI Intelligence Engine (Ravana 1.0)](#ai-intelligence-engine)
    *   [Frontend Dashboard](#frontend-dashboard)
6.  [Database Schema](#6-database-schema)
7.  [API Reference](#7-api-reference)
8.  [Deployment Guide](#8-deployment-guide)
9.  [Configuration](#9-configuration)

---

### **1. Executive Summary**

**Ravana 1.0** is an advanced, enterprise-grade AI intelligence platform designed to ingest multi-modal business data streams (Sales, Marketing, Operations, Finance) and generate actionable strategic insights.

Unlike traditional dashboards that only visualize past data, Ravana 1.0 employs a cognitive reasoning engine to:
*   **Diagnose** root causes of anomalies (e.g., "Why is churn increasing?").
*   **Predict** future trends based on historical patterns.
*   **Prescribe** actionable steps to mitigate risks or capitalize on opportunities.

The platform is built as a scalable SaaS application, ready for cloud deployment, with a focus on high-fidelity user experience and executive-level reporting.

---

### **2. System Architecture**

The system follows a modern **Microservices-ready Monolithic Architecture**, ensuring simplicity in development while maintaining scalability for production.

*   **Client Layer**: A React-based Single Page Application (SPA) providing a responsive, interactive interface.
*   **API Layer**: A high-performance FastAPI backend serving RESTful endpoints.
*   **Intelligence Layer**: A dedicated AI service module that interfaces with the **QSLM Cloud Hosted API** for cognitive processing.
*   **Data Layer**: A relational database (SQLite for dev, PostgreSQL for prod) managed via SQLAlchemy ORM.

---

### **3. Technology Stack**

**Frontend:**
*   **Framework**: React 18 (Vite)
*   **Styling**: Tailwind CSS v4, Custom Glassmorphism UI
*   **Visualization**: Recharts (Responsive, Interactive Charts)
*   **State Management**: React Query (TanStack Query)
*   **Motion**: Framer Motion (Animations)
*   **Icons**: Lucide React

**Backend:**
*   **Framework**: FastAPI (Python 3.11)
*   **Server**: Uvicorn (ASGI) / Gunicorn (Process Manager)
*   **ORM**: SQLAlchemy 2.0
*   **Validation**: Pydantic v2
*   **Database**: SQLite (Local), PostgreSQL (Production ready)
*   **Authentication**: OAuth2 with JWT (JSON Web Tokens)

**AI Engine:**
*   **Provider**: **QSLM Cloud Hosted API**
*   **Model**: Enterprise-grade Large Language Model (LLM) optimized for business logic.

**DevOps:**
*   **Containerization**: Docker, Docker Compose (Multi-stage builds)
*   **Package Management**: pip (Python), npm (Node.js)

---

### **4. Directory Structure**

#### **Root Directory**
*   `docker-compose.yml`: (Production) Orchestrates Backend and Frontend services.
*   `README.md`: Quick start guide.

#### **Backend (`/backend`)**
*   `app/`: Main application package.
    *   `main.py`: Entry point. Initializes FastAPI app, CORS, and routers.
    *   `api/v1/`: API route definitions.
        *   `endpoints/`: Individual resource controllers (`auth.py`, `insights.py`, `data_sources.py`).
    *   `core/`: Core configuration.
        *   `config.py`: Loads environment variables (`.env`).
        *   `security.py`: Password hashing and JWT token generation.
    *   `db/`: Database connectivity.
        *   `session.py`: Database session manager.
        *   `base.py`: Import hub for all models.
    *   `models/`: SQLAlchemy database models (`user.py`, `insight.py`, `organization.py`).
    *   `schemas/`: Pydantic data schemas for request/response validation.
    *   `services/`: Business logic.
        *   `ai_service.py`: **CRITICAL**. Handles prompt engineering and communication with QSLM Cloud API.
*   `Dockerfile`: (Production) Python environment setup.
*   `requirements.txt`: Pinned dependencies.

#### **Frontend (`/frontend`)**
*   `src/`: Source code.
    *   `components/`: Reusable UI blocks (`Layout`, `Sidebar`, `Header`).
    *   `pages/`: Main views.
        *   `Dashboard.tsx`: **CORE**. The central command center visualizing Ravana 1.0 insights.
        *   `Insights.tsx`: Detailed list view of AI findings.
        *   `DataSources.tsx`: Data ingestion management.
    *   `services/`: API client (`api.ts`) using Axios.
    *   `hooks/`: Custom React hooks (`useInsights`, `useDashboard`).
    *   `index.css`: Global styles, Tailwind directives, and custom animations.
*   `Dockerfile`: (Production) Multi-stage Node.js build & Nginx serve.
*   `vite.config.ts`: Vite build configuration.

---

### **5. Core Modules & Logic**

#### **Backend Services**

**1. Data Ingestion & Processing:**
*   The system accepts CSV/JSON data uploads via `/api/v1/data-sources/upload`.
*   Data is parsed (using Pandas), validated against schemas, and stored.
*   Basic statistics (missing values, cardinality) are calculated immediately.

**2. Insight Generation Algorithm (`generate_global_insights`):**
*   Triggered on-demand or periodic schedule.
*   Aggregates data summaries from all active data sources.
*   Constructs a simplified context string (JSON-like) representing the current business state.
*   Sends this context to the **AI Intelligence Engine**.

#### **AI Intelligence Engine (Ravana 1.0)**

Located in `backend/app/services/ai_service.py`.

*   **Prompt Engineering**: Uses a sophisticated system prompt that instructs the QSLM Cloud API to act as a "Senior Business Analyst".
*   **Constraint Enforcement**: The AI is strictly instructed to return response in **JSON format only**, adhering to a specific schema (Title, Impact, Confidence, Root Cause, Visualization Data).
*   **Visualization Logic**: The AI generates the *data points* for charts (e.g., `{"month": "Jan", "sales": 100}`). The frontend renders this using Recharts. This "Generative UI" approach allows the dashboard to adapt to any data story.

#### **Frontend Dashboard**

Located in `frontend/src/pages/Dashboard.tsx`.

*   **Dual View Mode**:
    1.  **Executive Summary**: A high-level text summary of business health.
    2.  **Deep Dive**: Interactive charts (Area, Bar, Pie) for specific insights.
*   **Real-time Feedback**: Uses React Query to poll for status updates (e.g., "Scanning...", "Analyzing Streams").
*   **Executive Reporting**: A clean, printable report view (accessible via the browser's print function) formatted for A4 PDF export.

---

### **6. Database Schema**

The database is normalized to support multi-tenancy (Organizations).

**Key Tables:**

1.  **`organization`**:
    *   `id` (PK), `name`, `settings` (JSON).
    *   Root entity. All data belongs to an organization.

2.  **`user`**:
    *   `id` (PK), `email`, `hashed_password`, `organization_id` (FK).
    *   RBAC (Role Based Access Control) support via `is_superuser`.

3.  **`data_source`**:
    *   `id` (PK), `name`, `file_path`, `schema_info` (JSON), `health_score`.
    *   Stores metadata about ingested files.

4.  **`insight`**:
    *   `id` (PK), `title`, `description`, `impact_level` (High/Medium/Low).
    *   `ai_root_cause`: The text explanation generated by Ravana 1.0.
    *   `visualization_data` (JSON): The raw data for frontend charts.
    *   `status`: (active/dismissed/resolved).

---

### **7. API Reference**

**Base URL**: `/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/login` | Authenticate user & get JWT token. |
| **GET** | `/dashboard/summary` | Get high-level stats (Health Score, Risks). |
| **POST** | `/insights/generate` | **Trigger Ravana 1.0** to analyze data. |
| **GET** | `/insights` | List all generated insights. |
| **POST** | `/data-sources` | Upload a new dataset (CSV). |
| **GET** | `/data-sources/{id}` | Get detailed metadata for a file. |

---

### **8. Deployment Guide**

#### **Prerequisites**
*   Docker & Docker Compose installed.
*   **QSLM Cloud Hosted API Key**.

#### **Steps**

1.  **Configuration**:
    *   Copy `.env.example` to `.env`.
    *   Set `QSLM_API_KEY` to your valid key.
    *   Set `DATABASE_URL` (default: SQLite).

2.  **Build & Run (Production)**:
    ```bash
    docker-compose up --build -d
    ```
    *   Backend runs on port `8000`.
    *   Frontend runs on port `80`.

3.  **Access**:
    *   Open browser to `http://localhost`.
    *   Login with default admin credentials (if seeded).

#### **Local Development**
1.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

### **9. Configuration**

**Environment Variables (`.env`)**

```ini
# Application Settings
PROJECT_NAME="Ravana 1.0 Platform"
API_V1_STR="/api/v1"

# Security
SECRET_KEY="<YOUR_SECRET_KEY>"
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Database
# Use SQLite for local, PostgreSQL for prod
DATABASE_URL=sqlite:///./h3w_platform.db

# AI Engine Configuration
# Replaced Groq with QSLM Cloud Hosted API
QSLM_API_KEY="<YOUR_QSLM_CLOUD_KEY>"
QSLM_MODEL="ravana-3.3-70b-versatile"
QSLM_API_BASE="https://api.qslm-cloud.com/v1"
```
