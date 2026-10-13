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


## 🔄 Git Synchronization & Docker

The project automatically synchronizes code with Git whenever Docker runs:

### Option 1: Automatic Sync Inside Docker (Default)
When you start Docker via `docker-compose up -d`:
1. The **`auto_sync`** container starts first and **immediately pulls the latest code** from GitHub.
2. A container healthcheck guarantees that `backend` and `worker` only start after the initial `git pull` is complete.
3. Every 15 seconds, the container fetches new changes from GitHub and automatically commits local modifications.
4. *(Optional)* Set `GITHUB_TOKEN=your_token` in `.env` if you want the Docker container to also automatically push commits back to GitHub.

### Option 2: Launch via PowerShell Script
To pull with your host Windows Git credentials and start Docker in one command:
```powershell
.\run-docker.ps1
```

### Option 3: Host Auto-Sync Background Script
To keep committing and pushing in the background while developing on Windows:
```powershell
.\auto-sync.ps1
```

### 🐳 Docker Commands
```bash
# Start all containers in the background (with automatic git pull)
docker-compose up -d

# Stop all containers
docker-compose down

# View real-time logs (including auto-sync)
docker-compose logs -f
```
