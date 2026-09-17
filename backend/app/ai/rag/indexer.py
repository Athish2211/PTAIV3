"""
RAG Indexer — handles chunking and embedding documents into pgvector.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, DocumentChunk
from app.ai.llm.embeddings import embedding_client
import re

class RAGIndexer:
    def __init__(self, db: AsyncSession):
        self.db = db

    def chunk_text(self, text: str, max_words: int = 150) -> List[str]:
        """Simple word-based chunking."""
        words = re.findall(r'\S+', text)
        chunks = []
        for i in range(0, len(words), max_words):
            chunk = " ".join(words[i:i + max_words])
            chunks.append(chunk)
        return chunks

    async def index_document(self, document: Document):
        """Chunk document text, get embeddings, and store in DB."""
        if not document.content_text:
            return

        chunks = self.chunk_text(document.content_text)
        
        for idx, chunk_text in enumerate(chunks):
            # Get embedding vector from Ollama/local model
            embedding_vector = await embedding_client.get_embedding(chunk_text)
            
            chunk = DocumentChunk(
                document_id=document.id,
                chunk_index=idx,
                content=chunk_text,
                embedding=embedding_vector
            )
            self.db.add(chunk)
            
        document.status = "indexed"
        await self.db.commit()
