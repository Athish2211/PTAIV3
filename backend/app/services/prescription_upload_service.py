"""
Prescription Upload Service — NEW FEATURE.
Handles OCR, text extraction, structured data extraction, and RAG indexing
for uploaded historical prescription documents.
"""
import os
import uuid
import filetype
import structlog
from datetime import datetime, timezone
from typing import Optional

from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.prescription_upload import PrescriptionUpload
from app.models.document import Document, DocumentChunk

logger = structlog.get_logger()

ALLOWED_TYPES = {"pdf", "png", "jpg", "jpeg", "docx", "doc"}
ALLOWED_MIMES = {
    "application/pdf", "image/png", "image/jpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}
MAX_SIZE_BYTES = settings.MAX_UPLOAD_MB * 1024 * 1024


class PrescriptionUploadService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_upload(
        self,
        patient_id: str,
        organization_id: str,
        uploaded_by: str,
        file: UploadFile,
        description: Optional[str] = None,
        original_prescriber: Optional[str] = None,
        original_prescription_date: Optional[str] = None,
    ) -> PrescriptionUpload:
        """Validate, store the file, and create the DB record."""
        # Read file content
        content = await file.read()
        file_size = len(content)

        if file_size > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_MB}MB",
            )

        # MIME/type validation
        detected = filetype.guess(content)
        ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""

        if ext not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_TYPES)}",
            )

        if detected and detected.mime not in ALLOWED_MIMES:
            # For DOCX/DOC, filetype may not detect correctly — allow by extension for office files
            if ext not in {"docx", "doc"}:
                raise HTTPException(status_code=400, detail="File MIME type mismatch — possible invalid file")

        # Save file to disk
        upload_dir = os.path.join(settings.UPLOAD_DIR, "prescription_uploads", patient_id)
        os.makedirs(upload_dir, exist_ok=True)

        unique_filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as f:
            f.write(content)

        # Parse original_prescription_date
        orig_date = None
        if original_prescription_date:
            try:
                from dateutil import parser as dateutil_parser
                orig_date = dateutil_parser.parse(original_prescription_date)
            except Exception:
                pass

        # Create DB record
        upload = PrescriptionUpload(
            organization_id=uuid.UUID(organization_id),
            patient_id=uuid.UUID(patient_id),
            uploaded_by=uuid.UUID(uploaded_by),
            filename=unique_filename,
            original_filename=file.filename or unique_filename,
            file_path=file_path,
            file_type=ext,
            file_size_bytes=file_size,
            mime_type=detected.mime if detected else None,
            status="uploaded",
            description=description,
            original_prescriber=original_prescriber,
            original_prescription_date=orig_date,
        )
        self.db.add(upload)
        await self.db.commit()
        await self.db.refresh(upload)
        logger.info("prescription_upload.created", upload_id=str(upload.id), patient_id=patient_id)
        return upload

    async def process_upload(self, upload_id: str):
        """Background task: OCR → extract → embed → index."""
        try:
            result = await self.db.execute(
                select(PrescriptionUpload).where(PrescriptionUpload.id == uuid.UUID(upload_id))
            )
            upload = result.scalar_one_or_none()
            if not upload:
                return

            upload.status = "processing"
            await self.db.commit()

            # 1. Extract text
            text = await self._extract_text(upload)
            upload.ocr_text = text
            upload.ocr_applied = upload.file_type in {"png", "jpg", "jpeg"}

            # 2. Try to extract structured data
            if text:
                extracted = await self._extract_structured_data(text)
                upload.extracted_data = extracted
                upload.extraction_confidence = extracted.get("confidence", "low")

            # 3. Create Document record for RAG indexing
            doc = Document(
                organization_id=upload.organization_id,
                patient_id=upload.patient_id,
                uploaded_by=upload.uploaded_by,
                filename=upload.filename,
                original_filename=upload.original_filename,
                file_path=upload.file_path,
                file_type=upload.file_type,
                file_size_bytes=upload.file_size_bytes,
                mime_type=upload.mime_type,
                document_type="uploaded_prescription",
                status="processing",
                extracted_text=text,
                ocr_applied=upload.ocr_applied,
            )
            self.db.add(doc)
            await self.db.flush()

            # 4. Chunk and embed
            if text:
                await self._chunk_and_embed(doc, text, upload)

            doc.status = "indexed"
            upload.document_id = doc.id
            upload.status = "indexed"
            upload.indexed_at = datetime.now(timezone.utc)
            await self.db.commit()

            logger.info("prescription_upload.indexed", upload_id=upload_id)

        except Exception as e:
            logger.error("prescription_upload.failed", upload_id=upload_id, error=str(e))
            try:
                result = await self.db.execute(
                    select(PrescriptionUpload).where(PrescriptionUpload.id == uuid.UUID(upload_id))
                )
                upload = result.scalar_one_or_none()
                if upload:
                    upload.status = "failed"
                    upload.error_message = str(e)
                    await self.db.commit()
            except Exception:
                pass

    async def _extract_text(self, upload: PrescriptionUpload) -> str:
        """Extract text from the uploaded file."""
        ext = upload.file_type.lower()
        file_path = upload.file_path

        try:
            if ext == "pdf":
                return self._extract_from_pdf(file_path)
            elif ext in {"png", "jpg", "jpeg"}:
                return self._extract_from_image(file_path)
            elif ext in {"docx", "doc"}:
                return self._extract_from_docx(file_path)
            elif ext == "txt":
                with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                    return f.read()
        except Exception as e:
            logger.error("text_extraction.failed", file_path=file_path, error=str(e))
            return ""
        return ""

    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using pdfplumber."""
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                texts = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        texts.append(text)
            return "\n".join(texts)
        except Exception:
            # Fallback to PyPDF2
            try:
                import PyPDF2
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    return "\n".join(
                        page.extract_text() or "" for page in reader.pages
                    )
            except Exception:
                return ""

    def _extract_from_image(self, file_path: str) -> str:
        """OCR image using Tesseract."""
        try:
            import pytesseract
            from PIL import Image
            img = Image.open(file_path)
            return pytesseract.image_to_string(img)
        except Exception as e:
            logger.warning("ocr.failed", file=file_path, error=str(e))
            return ""

    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX."""
        try:
            from docx import Document
            doc = Document(file_path)
            return "\n".join(para.text for para in doc.paragraphs if para.text.strip())
        except Exception:
            return ""

    async def _extract_structured_data(self, text: str) -> dict:
        """
        Attempt to extract structured prescription fields from OCR text.
        Uses simple heuristics; for production this would use a fine-tuned extractor.
        """
        import re
        result = {
            "medicines": [],
            "prescriber_name": None,
            "prescription_date": None,
            "clinic_name": None,
            "patient_name": None,
            "confidence": "low",
        }

        # Look for common prescription patterns
        lines = text.split("\n")

        # Try to find prescriber (Dr. pattern)
        for line in lines:
            if re.search(r"\bDr\.?\s+\w+", line, re.IGNORECASE):
                result["prescriber_name"] = line.strip()
                result["confidence"] = "medium"
                break

        # Try to find dates
        date_pattern = r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})\b"
        dates = re.findall(date_pattern, text)
        if dates:
            result["prescription_date"] = dates[0]

        # Try to find medicine names (Rx pattern, mg patterns)
        med_pattern = r"\b([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+\s*mg|\d+\s*ml|\d+\s*mcg)"
        medicines = re.findall(med_pattern, text)
        for med_name, dose in medicines[:10]:  # Limit to 10
            result["medicines"].append({
                "name": med_name.strip(),
                "dosage": dose.strip(),
            })

        if medicines:
            result["confidence"] = "medium" if result["prescriber_name"] else "low"

        return result

    async def _chunk_and_embed(self, doc: Document, text: str, upload: PrescriptionUpload):
        """Chunk text and create embeddings for RAG."""
        # Simple sentence-based chunking
        chunk_size = 500
        overlap = 50
        words = text.split()
        chunks = []

        for i in range(0, len(words), chunk_size - overlap):
            chunk_text = " ".join(words[i:i + chunk_size])
            if chunk_text.strip():
                chunks.append(chunk_text)

        for idx, chunk_text in enumerate(chunks):
            chunk = DocumentChunk(
                document_id=doc.id,
                patient_id=upload.patient_id,
                organization_id=upload.organization_id,
                chunk_index=idx,
                content=chunk_text,
                document_type="uploaded_prescription",
                author_id=upload.uploaded_by,
                record_date=upload.original_prescription_date,
                # Embedding will be set by the embedding service
            )
            self.db.add(chunk)

        # Try to embed
        try:
            from app.ai.llm.embeddings import EmbeddingClient
            embedder = EmbeddingClient()
            for chunk in chunks:
                pass  # Embedding is async — done in worker
        except Exception as e:
            logger.warning("embedding.skipped", error=str(e))

    async def list_by_patient(self, patient_id: str) -> list[PrescriptionUpload]:
        result = await self.db.execute(
            select(PrescriptionUpload)
            .where(PrescriptionUpload.patient_id == uuid.UUID(patient_id))
            .order_by(PrescriptionUpload.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, upload_id: str, patient_id: str) -> Optional[PrescriptionUpload]:
        result = await self.db.execute(
            select(PrescriptionUpload).where(
                PrescriptionUpload.id == uuid.UUID(upload_id),
                PrescriptionUpload.patient_id == uuid.UUID(patient_id),
            )
        )
        return result.scalar_one_or_none()

    async def mark_reviewed(
        self, upload_id: str, patient_id: str, organization_id: str, review_notes: Optional[str]
    ) -> Optional[PrescriptionUpload]:
        upload = await self.get_by_id(upload_id, patient_id)
        if not upload or str(upload.organization_id) != organization_id:
            return None
        upload.is_reviewed = True
        upload.review_notes = review_notes
        await self.db.commit()
        await self.db.refresh(upload)
        return upload

    async def delete(self, upload_id: str, patient_id: str) -> bool:
        upload = await self.get_by_id(upload_id, patient_id)
        if not upload:
            return False
        # Delete file from disk
        if os.path.exists(upload.file_path):
            os.remove(upload.file_path)
        await self.db.delete(upload)
        await self.db.commit()
        return True
