"""
PTAI v3 — Background Task Worker
Handles asynchronous ML agent execution, document ingestion, and batch RAG vector indexing.
"""
import time
import structlog
import redis
from rq import Worker, Queue, Connection
from app.core.config import settings

logger = structlog.get_logger()

listen_queues = ['high', 'default', 'low']

def start_worker():
    logger.info("Starting PTAI v3 Background Worker", redis_url=settings.REDIS_URL, queues=listen_queues)
    try:
        redis_conn = redis.from_url(settings.REDIS_URL)
        with Connection(redis_conn):
            worker = Worker(map(Queue, listen_queues))
            worker.work()
    except Exception as e:
        logger.error("Worker encountered an error", error=str(e))
        time.sleep(5)

if __name__ == '__main__':
    start_worker()
