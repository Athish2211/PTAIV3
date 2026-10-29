"""
RAG Retriever — queries pgvector and longitudinal EHR database tables to find relevant context.
Supports patient UUID, MRN (MRN-2026-XXXX), and frontend IDs (p-XXXX).
"""
import uuid
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.ai.llm.embeddings import embedding_client

logger = logging.getLogger(__name__)

class RAGRetriever:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _resolve_patient_uuid(self, patient_id: str) -> Optional[uuid.UUID]:
        """Resolves patient_id (which could be UUID, MRN-2026-XXXX, or p-XXXX) to DB UUID."""
        if not patient_id:
            return None
        
        # 1. Try direct UUID parse
        try:
            return uuid.UUID(str(patient_id).strip())
        except (ValueError, TypeError, AttributeError):
            pass

        # 2. Try lookup by MRN
        mrn_raw = str(patient_id).strip()
        mrn_clean = f"MRN-2026-{mrn_raw.replace('p-', '')}" if mrn_raw.startswith("p-") else mrn_raw

        try:
            res = await self.db.execute(text("""
                SELECT id FROM patients 
                WHERE mrn ILIKE :mrn_clean OR mrn ILIKE :mrn_raw OR id::text = :mrn_raw
                LIMIT 1
            """), {"mrn_clean": mrn_clean, "mrn_raw": mrn_raw})
            row = res.fetchone()
            if row:
                return row[0]
        except Exception as e:
            logger.warning(f"Failed to resolve patient UUID for {patient_id}: {e}")

        return None

    async def retrieve_context(self, query: str, patient_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks and longitudinal records for a specific patient."""
        resolved_uuid = await self._resolve_patient_uuid(patient_id)
        if not resolved_uuid:
            logger.info(f"Could not resolve patient UUID for ID: {patient_id}")
            return []

        context: List[Dict[str, Any]] = []

        # 1. Vector similarity search in pgvector
        try:
            query_embedding = await embedding_client.get_embedding(query)
            if query_embedding and len(query_embedding) == 768:
                embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"
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
                    "patient_id": resolved_uuid,
                    "limit": limit
                })
                
                rows = result.fetchall()
                for row in rows:
                    context.append({
                        "content": row.content,
                        "source": row.original_filename,
                        "relevance_score": round(max(0.0, 1.0 - float(row.distance)), 3)
                    })
        except Exception as e:
            logger.warning(f"Vector search failed (falling back to relational records): {e}")

        # 2. Query longitudinal relational prescriptions if vector didn't return enough
        try:
            rx_stmt = text("""
                SELECT p.rx_number, p.prescription_date, p.diagnosis_context, p.status,
                       COALESCE(string_agg(i.medication_name || ' ' || i.dosage || ' (' || i.frequency || ')', '; '), 'Routine regimen') as medications
                FROM prescriptions p
                LEFT JOIN prescription_items i ON i.prescription_id = p.id
                WHERE p.patient_id = :patient_id
                GROUP BY p.id, p.rx_number, p.prescription_date, p.diagnosis_context, p.status
                ORDER BY p.prescription_date DESC
                LIMIT 5
            """)
            rx_res = await self.db.execute(rx_stmt, {"patient_id": resolved_uuid})
            rx_rows = rx_res.fetchall()
            for r in rx_rows:
                source_name = f"Prescription Record ({r.rx_number})"
                # Avoid duplicate if vector search already included it
                if not any(source_name in c["source"] for c in context):
                    context.append({
                        "content": f"Prescription {r.rx_number} on {r.prescription_date} for {r.diagnosis_context}. Prescribed: {r.medications}. Status: {r.status}.",
                        "source": source_name,
                        "date": str(r.prescription_date),
                        "relevance_score": 0.95
                    })
        except Exception as e:
            logger.warning(f"Prescriptions query failed: {e}")

        # 3. Query clinical encounter notes
        try:
            enc_stmt = text("""
                SELECT e.encounter_date, e.chief_complaint, e.assessment, e.plan, c.content as note_text
                FROM encounters e
                LEFT JOIN clinical_notes c ON c.encounter_id = e.id
                WHERE e.patient_id = :patient_id
                ORDER BY e.encounter_date DESC
                LIMIT 3
            """)
            enc_res = await self.db.execute(enc_stmt, {"patient_id": resolved_uuid})
            enc_rows = enc_res.fetchall()
            for er in enc_rows:
                source_name = f"Clinical Encounter ({er.encounter_date})"
                note_content = er.note_text or f"Consultation for {er.chief_complaint}. Assessment: {er.assessment}. Plan: {er.plan}."
                if not any(source_name in c["source"] for c in context):
                    context.append({
                        "content": note_content,
                        "source": source_name,
                        "date": str(er.encounter_date),
                        "relevance_score": 0.90
                    })
        except Exception as e:
            logger.warning(f"Encounters query failed: {e}")

        return context
