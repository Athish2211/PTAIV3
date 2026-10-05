FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=120

# 1. Upgrade pip & install pre-built PyTorch CPU wheel
RUN pip install --upgrade pip setuptools wheel && \
    pip install torch==2.4.1 --index-url https://download.pytorch.org/whl/cpu

# 2. Install dependencies using pre-compiled binary wheels
COPY requirements.txt .
RUN pip install --prefer-binary -r requirements.txt

# 3. Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
