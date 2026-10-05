# PTAI v3 - AI-Native EHR Platform

**PTAI v3** is a premium, privacy-first AI healthcare platform featuring a 12-agent orchestration layer designed to analyze prescriptions, extract clinical trends, flag statistical anomalies, and intelligently parse unstructured medical notes.

## 🚀 Features

- **Multi-Agent AI Symphony**: A 12-agent orchestration framework (Patient Memory, Trend, Anomaly, Pattern, Risk, Cohort, Temporal, Data Intelligence, Evidence, Report, Safety Guardrail, and Orchestrator).
- **AI Documentation Assistant**: Translates raw, unstructured physician notes into formal SOAP-structured clinical documentation while flagging missing medical context.
- **Prescription Builder with AI Safety**: Real-time cross-checking of prescriptions against a patient's historical data to prevent contraindications or dosage anomalies.
- **Executive Reporting Hub**: AI-generated monthly analytics and high-risk patient cohort reports.
- **Premium UI/UX**: Built with Next.js, Framer Motion, and Radix UI to deliver a stunning dark-mode healthcare interface.
- **Privacy-First (Local SLMs)**: Designed to integrate with local Small Language Models (e.g., Llama 3) via Ollama for zero-trust PII compliance.

## 🏗️ Architecture

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Recharts, Radix UI.
- **Backend**: FastAPI, Async SQLAlchemy, PostgreSQL (`pgvector` for embeddings), JWT Auth, Celery/Redis (for background tasks).
- **AI Core**: LangChain, local SLM integration via Ollama.

## ⚙️ Quick Start Guide

### Prerequisites
1. **Node.js** (v18+)
2. **Python** (3.12+)
3. **Docker Desktop** (For PostgreSQL/pgvector and Redis)
4. **Ollama** (For local AI models)

### 1. Database Setup
The application relies on PostgreSQL with the `pgvector` extension.
```bash
docker-compose up -d
```

### 2. Backend Setup
Create a Python virtual environment and install the dependencies:
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate # On Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
Run the database migrations and start the server:
```bash
alembic upgrade head
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
Install Node modules and run the development server:
```bash
cd frontend
npm install
npm run dev
```

### 4. AI Setup
Ensure Ollama is running on your machine and pull your preferred model (as defined in `.env` or `backend/app/core/config.py`):
```bash
ollama pull llama3.2:3b
```

## 🌐 Access
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)


# Start all containers in the background
docker-compose up -d

# Stop all containers
docker-compose down

# View real-time logs
docker-compose logs -f
