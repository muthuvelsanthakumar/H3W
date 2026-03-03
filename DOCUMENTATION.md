
# Ravana 1.0 - Unified Intelligence Platform Documentation

## 1. Executive Overview

**Ravana 1.0** is an enterprise-grade AI-powered intelligence platform designed to ingest, process, and analyze complex business data streams. By combining rigorous data validation with a proprietary "Reasoning" engine, Ravana converts raw operational metrics into actionable executive insights.

### Core Capabilities
*   **Unified Data Ingestion:** Supports high-volume CSV and structured data streams.
*   **Ravana Reasoning Engine:** A custom-built AI module that identifies hidden anomalies, correlations, and growth opportunities.
*   **Visual Intelligence Dashboard:** A premium, executive-first interface for real-time decision making.
*   **Diagnostic Integrity:** Calculates confidence scores and provides verifiable root-cause analysis for every insight.

---

## 2. System Architecture

The platform follows a modern microservices-oriented architecture, containerized for scalability and security.

### Backend (Python/FastAPI)
*   **FastAPI:** High-performance async web framework handling API requests and data validation.
*   **SQLAlchemy ORM:** Database abstraction layer for robust data modeling.
*   **Pydantic:** Data validation ensuring type safety across the entire pipeline.
*   **Pandas/NumPy:** High-velocity data processing for statistical analysis.

### Frontend (React/TypeScript)
*   **Vite:** Next-generation build tool for lightning-fast development and optimized production builds.
*   **React 18:** Component-based UI rendering.
*   **TailwindCSS:** Utility-first CSS framework for rapid, custom design systems.
*   **Framer Motion:** Production-ready animation library for premium user interactions.
*   **Recharts:** Composable charting library for data visualization.

### Database
*   **Primary:** SQLite (Development/Embedded) / PostgreSQL (Production Ready).
*   **Schema:** Relational schema optimized for multi-tenant data isolation (Organization -> User -> DataSource -> Insight).

### Intelligence Engine (Ravana 1.0)
The core of the platform is the Ravana Reasoning Engine, powered by state-of-the-art Large Language Models (LLMs) hosted on a secure, high-throughput cloud infrastructure.

**Comparison w/ Standard Analytics:**
| Feature | Standard Analytics | Ravana 1.0 |
| :--- | :--- | :--- |
| **Analysis** | Descriptive (What happened?) | Diagnostic & Prescriptive (Why & What next?) |
| **Speed** | Batch / Delayed | Real-time Stream Processing |
| **Output** | Raw Charts | Causal Narratives + Action Plans |

---

## 3. Installation & Deployment

### Prerequisites
*   **Docker & Docker Compose:** Required for containerized deployment.
*   **Python 3.11+:** For local backend development.
*   **Node.js 20+:** For local frontend development.

### Quick Start (Docker)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-org/ravana-platform.git
    cd ravana-platform
    ```

2.  **Configure Environment:**
    Ensure your `.env` file is present in `backend/` with the required keys (see Configuration section).

3.  **Launch Stack:**
    ```bash
    docker-compose up --build -d
    ```
    *   Frontend will be available at `http://localhost:80`
    *   Backend API will be available at `http://localhost:8000`

### Local Development Setup

#### Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Configuration

The application is configured via environment variables.

### Key Variables (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PROJECT_NAME` | Application Name | `H3W Intelligence` |
| `API_V1_STR` | API Version Prefix | `/api/v1` |
| `SECRET_KEY` | JWT Encryption Key | `your-secure-secret-key` |
| `DATABASE_URL` | Database Connection String | `sqlite:///./h3w_platform.db` |
| `LLAMA_API_KEY` | **(Critical)** Cloud API Key | `gsk_...` |
| `LLAMA_MODEL` | AI Model ID | `llama-3.3-70b-versatile` |
| `LLAMA_API_BASE` | **Cloud API Base URL** | `https://api.qslm-cloud.com/v1` |

> **Note:** The `LLAMA_API_BASE` points to the `qslm cloud hosted API` by default for enterprise stability and compliance.

---

## 5. Database Schema Reference

The core relational model consists of four primary entities designed for scalability.

### `organization`
*   **id:** `INTEGER` (Primary Key)
*   **name:** `VARCHAR` - Company Name
*   **slug:** `VARCHAR` - Unique Identifier (e.g., `h3w-default`)
*   **settings:** `JSON` - Configurable org-level preferences

### `user`
*   **id:** `INTEGER` (Primary Key)
*   **email:** `VARCHAR` - Unique Login
*   **hashed_password:** `VARCHAR` - Securely hashed credentials
*   **organization_id:** `INTEGER` (Foreign Key) - Multi-tenant linkage

### `data_source`
*   **id:** `INTEGER` (Primary Key)
*   **name:** `VARCHAR` - Source Name (e.g., `sales_q1.csv`)
*   **source_type:** `VARCHAR` - Type (CSV, JSON, SQL)
*   **health_score:** `FLOAT` - Data Quality Metric (0-100)
*   **quality_report:** `JSON` - Detailed metadata analysis (missing values, cardinality)
*   **settings:** `JSON` - Parsing rules (thresholds, sensitivity)

### `insight`
*   **id:** `INTEGER` (Primary Key)
*   **title:** `VARCHAR` - Insight Headline
*   **description:** `VARCHAR` - Executive Summary
*   **impact_level:** `VARCHAR` - `High` | `Medium` | `Low`
*   **confidence_score:** `FLOAT` - Agentic Evaluation (0-100)
*   **ai_root_cause:** `VARCHAR` - Diagnostic Reasoning
*   **visualization_data:** `JSON` - Chart Configuration & Data Points
*   **status:** `VARCHAR` - `active` | `resolved` | `dismissed`

---

## 6. Frontend: Ravana Dashboard Guide

The frontend is designed to be an **"Executive Intelligence Report"** rather than a traditional operations dashboard.

### Key Sections

1.  **Unified Command Center:**
    *   Displays real-time Business Health Score.
    *   Tracks Data Integrity & Live Insight counts.

2.  **Ravana 1.0 Executive Summary:**
    *   AI-generated narrative summary of the current ecosystem state.
    *   Highlights major wins and critical threats in natural language.

3.  **Deep-Dive Analysis:**
    *   Interactive drill-down into specific insights.
    *   **Root Cause Analysis:** "Why did this happen?"
    *   **Impact Assessment:** "What is the financial/operational cost?"
    *   **Visual Proof:** Auto-generated Area, Bar, and Pie charts validating the claim.

4.  **Premium Aesthetics:**
    *   Glassmorphism UI for modern appeal.
    *   Dynamic, responsive animations (`Framer Motion`).
    *   "Print-Ready" report capabilities for stakeholder meetings.

---

## 7. Troubleshooting

*   **Database Locked:** If using SQLite, ensure no other process (like a DB browser) has the file open during writes.
*   **AI Timeout:** Check `LLAMA_API_BASE` connectivity to `qslm cloud`. Increase timeout in `ai_service.py` for large datasets.
*   **Docker Build Failures:** Ensure `backend/requirements.txt` is up to date and compatible with `python:3.11-slim`.

---
*Generated: 2026-02-17 | Ravana 1.0 Technical Documentation*
