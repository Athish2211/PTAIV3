"""
RAG Retriever — queries pgvector to find relevant document chunks for context.
"""
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.models.document import Document, DocumentChunk
from app.ai.llm.embeddings import embedding_client

class RAGRetriever:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def retrieve_context(self, query: str, patient_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks for a specific patient using vector similarity."""
        query_embedding = await embedding_client.get_embedding(query)
        
        # Format embedding array for pgvector
        embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"
        
        # Use pgvector <-> operator for L2 distance (or <=> for cosine distance)
        # We join Document to ensure we only search chunks belonging to the specified patient
        stmt = text("""
            SELECT c.content, c.chunk_index, d.original_filename, 
                   (c.embedding <=> :embedding::vector) as distance
            FROM document_chunks c
            JOIN documents d ON c.document_id = d.id
            WHERE d.patient_id = :patient_id
            ORDER BY distance ASC
            LIMIT :limit
        """)
        
        result = await self.db.execute(stmt, {
            "embedding": embedding_str,
            "patient_id": patient_id,
            "limit": limit
        })
        
        rows = result.fetchall()
        
        context = []
        for row in rows:
            context.append({
                "content": row.content,
                "source": row.original_filename,
                "relevance_score": 1.0 - float(row.distance) # Convert cosine distance to similarity
            })
            
        return context
