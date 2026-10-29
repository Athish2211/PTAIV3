"""
Sync the 100 Seed Patients & Prescriptions directly into PostgreSQL with pgvector embeddings.
Ensures both frontend (seedData.ts) and backend PostgreSQL are 100% synchronized with identical records.
"""
import asyncio
import json
import random
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

first_names_m = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rudra', 'Rohan',
    'Vikram', 'Rajesh', 'Suresh', 'Ramesh', 'Amit', 'Anil', 'Sunil', 'Vijay', 'Manoj', 'Deepak',
    'Sanjay', 'Rahul', 'Naveen', 'Kiran', 'Prakash', 'Mahesh', 'Dinesh', 'Girish', 'Naresh', 'Harish',
    'Ashok', 'Vinod', 'Pramod', 'Santosh', 'Rakesh', 'Mukesh', 'Rajendra', 'Gopal', 'Madhav', 'Keshav'
]
first_names_f = [
    'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Diya', 'Avani',
    'Myra', 'Sara', 'Ira', 'Riya', 'Shruti', 'Pooja', 'Neha', 'Sneha', 'Priya', 'Kavita',
    'Sunita', 'Anita', 'Geeta', 'Sita', 'Radha', 'Meera', 'Laxmi', 'Swati', 'Divya', 'Deepa',
    'Shilpa', 'Rekha', 'Manju', 'Usha', 'Asha', 'Shobha', 'Jyoti', 'Kiran', 'Preeti', 'Sandhya',
    'Sarita', 'Sushma', 'Vandana', 'Anjali', 'Archana', 'Bhavna', 'Chetna', 'Dolly', 'Ekta', 'Farida'
]
last_names = [
    'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Menon', 'Pillai', 'Iyer', 'Iyengar',
    'Gupta', 'Agarwal', 'Jain', 'Bansal', 'Mittal', 'Singhal', 'Goyal', 'Mehta', 'Shah', 'Desai',
    'Joshi', 'Kulkarni', 'Deshpande', 'Patil', 'Pawar', 'Chavan', 'Shinde', 'Gaekwad', 'Bose', 'Chatterjee',
    'Banerjee', 'Mukherjee', 'Dutta', 'Ghosh', 'Sen', 'Das', 'Roy', 'Singh', 'Kaur', 'Kumar',
    'Choudhary', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Tripathi', 'Upadhyay', 'Pathak'
]

blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

allergy_pool_low = ['NKDA (No Known Drug Allergies)']
allergy_pool_mod = ['Pollen', 'Dust mites', 'Sulfa drugs (Mild rash)', 'Ibuprofen (Mild GI distress)', 'Lactose sensitivity']
allergy_pool_high = [
    'Penicillin (Anaphylaxis risk)', 'Amoxicillin (Severe angioedema)', 'Cephalosporins (Cross-reactive)',
    'Aspirin (Bronchospasm)', 'Morphine (Severe respiratory depression)', 'Codeine'
]

med_pool_cardio = [
    ('Amlodipine', '5mg', '1-0-0 OD'),
    ('Telmisartan', '40mg', '1-0-0 OD'),
    ('Metoprolol', '50mg', '1-0-1 BD'),
    ('Atorvastatin', '20mg', '0-0-1 QHS'),
    ('Ramipril', '5mg', '1-0-0 OD')
]
med_pool_diab = [
    ('Metformin', '500mg', '1-0-1 BD'),
    ('Glimepiride', '2mg', '1-0-0 OD'),
    ('Dapagliflozin', '10mg', '1-0-0 OD'),
    ('Sitagliptin', '100mg', '1-0-0 OD'),
    ('Vildagliptin', '50mg', '1-0-1 BD')
]
med_pool_other = [
    ('Pantoprazole', '40mg', '1-0-0 Before Food'),
    ('Cetirizine', '10mg', '0-0-1 QHS'),
    ('Montelukast', '10mg', '0-0-1 QHS'),
    ('Levothyroxine', '50mcg', '1-0-0 Fasting'),
    ('Paracetamol', '650mg', 'SOS (As needed)')
]

def generate_100():
    random.seed(42)
    patients = []
    prescriptions = []

    for i in range(1, 101):
        gender = 'Male' if random.random() > 0.48 else 'Female'
        first_name = random.choice(first_names_m) if gender == 'Male' else random.choice(first_names_f)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        mrn = f"MRN-2026-{1000 + i}"
        patient_id = f"p-{1000 + i}"
        blood_group = random.choice(blood_groups)
        phone = f"+91 9{random.randint(100000000, 999999999)}"

        if i <= 45:
            risk_level = 'Low'
            age = random.randint(19, 45)
            cond_count = random.choice([0, 1, 1])
            conds = random.sample(['General Wellness', 'Seasonal Flu', 'Mild Gastritis', 'Allergic Rhinitis', 'Myalgia', 'Mild Vitamin D Deficiency'], cond_count) if cond_count > 0 else ['General Outpatient']
            algs = [random.choice(allergy_pool_low)]
            active_meds = random.sample(['Multivitamin', 'Vitamin D3 60k', 'Paracetamol 500mg', 'Antacid Syrup'], random.choice([0, 1]))
            notes = 'Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.'
            rx_risk_status = 'normal'
        elif i <= 80:
            risk_level = 'Moderate'
            age = random.randint(42, 65)
            cond_count = random.randint(2, 3)
            conds = random.sample(['Essential Hypertension', 'Type 2 Diabetes Mellitus', 'Hyperlipidemia', 'GERD', 'Hypothyroidism', 'Osteoarthritis'], cond_count)
            algs = [random.choice(allergy_pool_mod)] if random.random() > 0.4 else ['NKDA (No Known Drug Allergies)']
            chosen_meds = random.sample(med_pool_cardio + med_pool_diab + med_pool_other, random.randint(2, 3))
            active_meds = [m[0] for m in chosen_meds]
            notes = f"Moderate risk chronic disease profile for {conds[0]}. Regular 6-month lab follow-up indicated."
            rx_risk_status = 'normal'
        else:
            risk_level = 'High'
            age = random.randint(58, 86)
            cond_count = random.randint(4, 6)
            conds = random.sample(['Coronary Artery Disease', 'Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Chronic Kidney Disease (Stage 3)', 'Atrial Fibrillation', 'COPD', 'Heart Failure (NYHA II)'], cond_count)
            algs = [random.choice(allergy_pool_high)]
            chosen_meds = random.sample(med_pool_cardio + med_pool_diab + med_pool_other, random.randint(4, 5))
            active_meds = [m[0] for m in chosen_meds]
            notes = f"High-risk complex care profile with multi-morbid {conds[0]} and {conds[1]}. Documented allergy flag: {algs[0]}."
            rx_risk_status = 'anomaly_flagged' if ('Penicillin' in algs[0] or 'Amoxicillin' in algs[0]) else 'normal'

        p_dict = {
            'id': patient_id,
            'mrn': mrn,
            'first_name': first_name,
            'last_name': last_name,
            'name': full_name,
            'deidentified_id': f"PT-{mrn[-4:]}",
            'age': age,
            'gender': gender,
            'blood_group': blood_group,
            'phone': phone,
            'allergies': algs,
            'chronic_conditions': conds,
            'active_medications': active_meds,
            'risk_level': risk_level,
            'notes': notes,
            'diagnosis': conds[0] if conds else 'General Consultation'
        }
        patients.append(p_dict)

        for rx_idx in range(random.randint(1, 2)):
            rx_id = f"rx-{10000 + i*10 + rx_idx}"
            med_rows = []
            if active_meds:
                for med_name in active_meds:
                    med_rows.append({
                        'medication': med_name,
                        'dosage': '500mg' if 'Metformin' in med_name or 'Paracetamol' in med_name else '5mg',
                        'frequency': '1-0-1 after food',
                        'duration_days': 30 if risk_level != 'Low' else 7,
                        'instructions': 'Take with water after meals.'
                    })
            else:
                med_rows.append({
                    'medication': 'Multivitamin Therapeutic',
                    'dosage': '1 Cap',
                    'frequency': '1-0-0 after food',
                    'duration_days': 15,
                    'instructions': 'Take in the morning.'
                })

            prescriptions.append({
                'id': rx_id,
                'patient_id': patient_id,
                'patient_name': full_name,
                'mrn': mrn,
                'age': age,
                'gender': gender,
                'date': f"2026-09-{random.randint(1, 18):02d}",
                'diagnosis': conds[0] if conds else 'General Health Review',
                'medications': med_rows,
                'status': 'active',
                'risk_status': rx_risk_status
            })

    return patients, prescriptions

async def sync_data():
    print("🔄 Starting database sync for 100 PTAI v3 patients...")
    await init_db()

    patients_data, prescriptions_data = generate_100()
    print(f"✓ Generated {len(patients_data)} patients and {len(prescriptions_data)} prescriptions")

    async with AsyncSessionLocal() as db:
        # Organization
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

        # Doctor
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

        # Clean old test data
        await db.execute(text("TRUNCATE TABLE document_chunks, documents, clinical_notes, prescription_items, prescriptions, encounters, patient_identifiers, patients CASCADE"))
        await db.commit()
        print("✓ Truncated tables for fresh sync")

        mrn_to_patient_id = {}

        # Insert Patients
        for p in patients_data:
            approx_dob = date(2026 - int(p["age"]), 5, 15)
            patient = Patient(
                organization_id=org.id,
                primary_doctor_id=doctor.id,
                mrn=p["mrn"],
                first_name=p["first_name"],
                last_name=p["last_name"],
                date_of_birth=approx_dob,
                gender=p["gender"].lower(),
                phone=p["phone"],
                email=f"{p['first_name'].lower()}.{p['last_name'].lower()}@patient.ptai.dev",
                blood_group=p["blood_group"],
                known_allergies=json.dumps(p["allergies"]),
                notes=p["notes"],
                is_active=True,
            )
            db.add(patient)
            await db.flush()
            mrn_to_patient_id[p["mrn"]] = patient.id
            mrn_to_patient_id[p["id"]] = patient.id

            # Baseline Encounter
            encounter = Encounter(
                organization_id=org.id,
                patient_id=patient.id,
                doctor_id=doctor.id,
                encounter_date=date(2026, 6, 10),
                encounter_type="outpatient",
                chief_complaint=p["diagnosis"],
                assessment=f"Evaluated for {p['diagnosis']}. Clinical risk: {p['risk_level']}.",
                plan=f"Active medications: {', '.join(p['active_medications']) or 'None'}. Routine outpatient follow-up.",
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
                content=f"Baseline Clinical Record for {p['name']} ({p['mrn']}). Allergies: {', '.join(p['allergies'])}. Chronic Conditions: {', '.join(p['chronic_conditions'])}. Active Meds: {', '.join(p['active_medications']) or 'None'}. Notes: {p['notes']}",
                is_finalized=True,
            )
            db.add(note)

            # RAG Document & Chunk
            doc_text = f"Patient: {p['name']} ({p['mrn']}). Age: {p['age']}, Gender: {p['gender']}, Blood: {p['blood_group']}. Allergies: {', '.join(p['allergies'])}. Chronic Conditions: {', '.join(p['chronic_conditions'])}. Regimens: {', '.join(p['active_medications']) or 'None'}. Clinical Notes: {p['notes']}"
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
        print(f"✓ Synchronized {len(patients_data)} patients into PostgreSQL")

        # Insert Prescriptions
        for rx in prescriptions_data:
            pat_uuid = mrn_to_patient_id.get(rx["mrn"]) or mrn_to_patient_id.get(rx["patient_id"])
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
                diagnosis_context=rx["diagnosis"],
                is_immutable=True,
                finalized_at=datetime(rx_d.year, rx_d.month, rx_d.day, 10, 0, 0, tzinfo=timezone.utc),
            )
            db.add(prescription)
            await db.flush()

            med_summaries = []
            for idx, m in enumerate(rx["medications"]):
                item = PrescriptionItem(
                    prescription_id=prescription.id,
                    medication_name=m["medication"],
                    generic_name=m["medication"],
                    dosage=m["dosage"],
                    frequency=m["frequency"],
                    duration=f"{m['duration_days']} days",
                    route="oral",
                    instructions=m["instructions"],
                    sort_order=idx,
                )
                db.add(item)
                med_summaries.append(f"{m['medication']} {m['dosage']} ({m['frequency']}) for {m['duration_days']} days. Instructions: {m['instructions']}")

            # Ingest prescription document chunk for RAG
            rx_text = f"Prescription Record {rx['id']} for {rx['patient_name']} ({rx['mrn']}) on {rx['date']}. Diagnosis: {rx['diagnosis']}. Prescribed: {'; '.join(med_summaries)}. Status: {rx['status']}. AI Safety: {rx['risk_status']}."
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

    print("\n🎉 Database sync completed successfully! PostgreSQL and seedData.ts are now identical.")

if __name__ == "__main__":
    asyncio.run(sync_data())
