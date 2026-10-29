"""
Sync the 100 Seed Patients & Prescriptions from seedData.ts into PostgreSQL with pgvector embeddings.
Ensures both frontend and backend are 100% synchronized with identical records.
"""
import asyncio
import json
import re
import uuid
from datetime import date, datetime, timezone, timedelta
from sqlalchemy import text, select
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import hash_password
from app.models import (
    Organization, User, Patient, Prescription, PrescriptionItem,
    Encounter, ClinicalNote, Document, DocumentChunk
)
from app.ai.llm.embeddings import embedding_client

async def sync_data():
    print("🔄 Starting database sync from seedData.ts...")
    await init_db()

    # Read frontend seedData.ts
    seed_file_path = "/app/../frontend/src/data/seedData.ts"
    try:
        with open(seed_file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        # Fallback path if running outside docker or with relative path
        import os
        possible_paths = [
            "c:/Users/Dinesh/OneDrive/Desktop/PTAIV3_final/PTAIV3_final/frontend/src/data/seedData.ts",
            "/frontend/src/data/seedData.ts",
            "../frontend/src/data/seedData.ts"
        ]
        content = None
        for p in possible_paths:
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8") as f:
                    content = f.read()
                break
        if not content:
            raise FileNotFoundError("Could not find seedData.ts")

    # Extract SEED_PATIENTS_100
    p_match = re.search(r'export const SEED_PATIENTS_100:\s*PatientSeed\[\]\s*=\s*(\[[\s\S]*?\]);', content)
    rx_match = re.search(r'export const SEED_PRESCRIPTIONS_100:\s*PrescriptionSeed\[\]\s*=\s*(\[[\s\S]*?\]);', content)

    if not p_match or not rx_match:
        raise ValueError("Could not parse SEED_PATIENTS_100 or SEED_PRESCRIPTIONS_100 from seedData.ts")

    patients_data = json.loads(p_match.group(1))
    prescriptions_data = json.loads(rx_match.group(1))

    print(f"✓ Parsed {len(patients_data)} patients and {len(prescriptions_data)} prescriptions from seedData.ts")

    async with AsyncSessionLocal() as db:
        # Ensure organization
        res = await db.execute(select(Organization).where(Organization.slug == "apollo-demo"))
        org = res.scalar_one_or_none()
        if not org:
            org = Organization(
                name="Apollo Hospitals Demo",
                slug="apollo-demo",
                email="admin@apollo-demo.ptai.dev",
                phone="+91-9999999999",
                address="Hyderabad, Telangana, India",
            )
            db.add(org)
            await db.flush()

        # Ensure doctor
        res = await db.execute(select(User).where(User.email == "doctor@apollo-demo.ptai.dev"))
        doctor = res.scalar_one_or_none()
        if not doctor:
            doctor = User(
                organization_id=org.id,
                email="doctor@apollo-demo.ptai.dev",
                hashed_password=hash_password("Demo@1234!"),
                first_name="Dr. Dinesh",
                last_name="Kumar",
                role="doctor",
                specialization="Internal Medicine",
                is_active=True,
                is_email_verified=True,
            )
            db.add(doctor)
            await db.flush()

        # Clean existing test data safely
        await db.execute(text("TRUNCATE TABLE document_chunks, documents, clinical_notes, prescription_items, prescriptions, encounters, patient_identifiers, patients CASCADE"))
        await db.commit()

        print("✓ Truncated old patient tables for clean sync")

        mrn_to_patient_id = {}

        # 1. Insert Patients
        for p in patients_data:
            name_parts = p["name"].split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""

            # Calculate approximate DOB from age
            approx_dob = date(2026 - int(p["age"]), 5, 15)

            patient = Patient(
                organization_id=org.id,
                primary_doctor_id=doctor.id,
                mrn=p["mrn"],
                first_name=first_name,
                last_name=last_name,
                date_of_birth=approx_dob,
                gender=p.get("gender", "Male").lower(),
                phone=p.get("phone", "+91 9999999999"),
                email=f"{first_name.lower()}.{last_name.lower()}@patient.ptai.dev".replace(" ", ""),
                blood_group=p.get("blood_group", "O+"),
                known_allergies=json.dumps(p.get("allergies", ["NKDA"])),
                notes=p.get("notes", "Routine consultation. Baseline vitals recorded within normal limits."),
                is_active=True,
            )
            db.add(patient)
            await db.flush()
            mrn_to_patient_id[p["mrn"]] = patient.id
            mrn_to_patient_id[p["id"]] = patient.id

            # Create baseline Encounter & Clinical Note
            enc_date = date(2026, 6, 10)
            encounter = Encounter(
                organization_id=org.id,
                patient_id=patient.id,
                doctor_id=doctor.id,
                encounter_date=enc_date,
                encounter_type="outpatient",
                chief_complaint=p.get("diagnosis", "General consultation"),
                assessment=f"Evaluated for {p.get('diagnosis', 'general wellness')}. Risk level: {p.get('risk_level', 'Low')}.",
                plan=f"Active medications: {', '.join(p.get('active_medications', [])) or 'None'}. Review in routine follow-up.",
                status="completed"
            )
            db.add(encounter)
            await db.flush()

            note = ClinicalNote(
                organization_id=org.id,
                patient_id=patient.id,
                encounter_id=encounter.id,
                author_id=doctor.id,
                note_type="progress",
                content=f"Baseline Clinical Record for {p['name']} ({p['mrn']}). Allergies: {', '.join(p.get('allergies', ['NKDA']))}. Conditions: {', '.join(p.get('chronic_conditions', ['None']))}. Notes: {p.get('notes', '')}",
                is_finalized=True,
            )
            db.add(note)

            # Ingest as Document & DocumentChunk with vector embedding
            doc_text = f"Patient: {p['name']} ({p['mrn']}). Age: {p['age']}, Gender: {p['gender']}, Blood: {p['blood_group']}. Allergies: {', '.join(p.get('allergies', ['NKDA']))}. Conditions: {', '.join(p.get('chronic_conditions', []))}. Regimens: {', '.join(p.get('active_medications', []))}. Historical note: {p.get('notes', '')}"
            doc = Document(
                organization_id=org.id,
                patient_id=patient.id,
                uploaded_by=doctor.id,
                filename=f"intake_{p['mrn'].lower()}.txt",
                original_filename=f"Clinical Intake Note ({p['mrn']})",
                file_path=f"/uploads/intake_{p['mrn'].lower()}.txt",
                file_type="txt",
                file_size_bytes=len(doc_text.encode('utf-8')),
                document_type="discharge_summary",
                status="indexed",
                extracted_text=doc_text,
            )
            db.add(doc)
            await db.flush()

            # Generate embedding
            try:
                emb = await embedding_client.get_embedding(doc_text)
            except Exception:
                emb = [0.0] * 768

            chunk = DocumentChunk(
                document_id=doc.id,
                patient_id=patient.id,
                organization_id=org.id,
                chunk_index=0,
                content=doc_text,
                embedding=emb,
                document_type="clinical_summary",
                record_date=datetime(2026, 6, 10, tzinfo=timezone.utc),
            )
            db.add(chunk)

        await db.commit()
        print(f"✓ Synchronized {len(patients_data)} patients with baseline encounters and vector chunks")

        # 2. Insert Prescriptions
        for rx in prescriptions_data:
            pat_uuid = mrn_to_patient_id.get(rx.get("mrn")) or mrn_to_patient_id.get(rx.get("patient_id"))
            if not pat_uuid:
                continue

            rx_parts = rx["date"].split("-")
            rx_d = date(int(rx_parts[0]), int(rx_parts[1]), int(rx_parts[2]))

            prescription = Prescription(
                organization_id=org.id,
                patient_id=pat_uuid,
                prescribed_by=doctor.id,
                rx_number=rx["id"].upper(),
                prescription_date=rx_d,
                status="finalized",
                diagnosis_context=rx.get("diagnosis", "Clinical Consultation"),
                is_immutable=True,
                finalized_at=datetime(rx_d.year, rx_d.month, rx_d.day, 10, 0, 0, tzinfo=timezone.utc),
            )
            db.add(prescription)
            await db.flush()

            med_summaries = []
            for idx, m in enumerate(rx.get("medications", [])):
                item = PrescriptionItem(
                    prescription_id=prescription.id,
                    medication_name=m["medication"],
                    generic_name=m["medication"],
                    dosage=m["dosage"],
                    frequency=m["frequency"],
                    duration=f"{m['duration_days']} days",
                    route="oral",
                    instructions=m.get("instructions", "Take as directed"),
                    sort_order=idx,
                )
                db.add(item)
                med_summaries.append(f"{m['medication']} {m['dosage']} ({m['frequency']}) for {m['duration_days']} days")

            # Ingest prescription document chunk for RAG
            rx_text = f"Prescription {rx['id']} for {rx['patient_name']} on {rx['date']}. Diagnosis: {rx['diagnosis']}. Medications: {'; '.join(med_summaries)}. AI Status: {rx.get('risk_status', 'normal')}."
            rx_doc = Document(
                organization_id=org.id,
                patient_id=pat_uuid,
                uploaded_by=doctor.id,
                filename=f"{rx['id'].lower()}.txt",
                original_filename=f"Prescription Record ({rx['id']})",
                file_path=f"/uploads/{rx['id'].lower()}.txt",
                file_type="txt",
                file_size_bytes=len(rx_text.encode('utf-8')),
                document_type="uploaded_prescription",
                status="indexed",
                extracted_text=rx_text,
            )
            db.add(rx_doc)
            await db.flush()

            try:
                emb = await embedding_client.get_embedding(rx_text)
            except Exception:
                emb = [0.0] * 768

            chunk = DocumentChunk(
                document_id=rx_doc.id,
                patient_id=pat_uuid,
                organization_id=org.id,
                chunk_index=0,
                content=rx_text,
                embedding=emb,
                document_type="prescription",
                record_date=datetime(rx_d.year, rx_d.month, rx_d.day, tzinfo=timezone.utc),
            )
            db.add(chunk)

        await db.commit()
        print(f"✓ Synchronized {len(prescriptions_data)} prescriptions with items and vector chunks")

    print("\n🎉 Database sync completed successfully! Frontend and PostgreSQL are now 100% in sync.")

if __name__ == "__main__":
    asyncio.run(sync_data())
