"""
Synthetic data seed script.
Generates realistic but synthetic patient and prescription data for development.
NEVER use real patient data in development.
"""
import asyncio
import random
import uuid
from datetime import date, timedelta, datetime, timezone
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models import *

fake = Faker("en_IN")
random.seed(42)

DIAGNOSES = [
    ("I10", "Essential Hypertension"),
    ("E11", "Type 2 Diabetes Mellitus"),
    ("J06.9", "Upper Respiratory Tract Infection"),
    ("F41.1", "Generalized Anxiety Disorder"),
    ("M54.5", "Low Back Pain"),
    ("K21.0", "GERD"),
    ("J45.9", "Asthma"),
    ("E78.5", "Hyperlipidemia"),
    ("N39.0", "Urinary Tract Infection"),
    ("G43.9", "Migraine"),
]

MEDICATIONS = [
    ("Metformin", "Metformin Hydrochloride", "500mg", "twice daily", "3 months"),
    ("Atorvastatin", "Atorvastatin Calcium", "20mg", "once at night", "3 months"),
    ("Amlodipine", "Amlodipine Besylate", "5mg", "once daily", "1 month"),
    ("Ramipril", "Ramipril", "5mg", "once daily", "1 month"),
    ("Metoprolol", "Metoprolol Succinate", "50mg", "once daily", "1 month"),
    ("Pantoprazole", "Pantoprazole Sodium", "40mg", "before breakfast", "14 days"),
    ("Cetirizine", "Cetirizine Hydrochloride", "10mg", "once at night", "7 days"),
    ("Amoxicillin", "Amoxicillin Trihydrate", "500mg", "three times daily", "5 days"),
    ("Ibuprofen", "Ibuprofen", "400mg", "three times daily", "5 days"),
    ("Paracetamol", "Paracetamol", "500mg", "as needed, max 4x/day", "7 days"),
]

BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]


async def seed_organization_and_admin(db: AsyncSession) -> tuple[Organization, User]:
    org = Organization(
        name="Apollo Hospitals Demo",
        slug="apollo-demo",
        email="admin@apollo-demo.ptai.dev",
        phone="+91-9999999999",
        city="Hyderabad",
        state="Telangana",
        country="India",
        plan_tier="enterprise",
    )
    db.add(org)
    await db.flush()

    admin = User(
        organization_id=org.id,
        email="admin@apollo-demo.ptai.dev",
        hashed_password=hash_password("Demo@1234!"),
        first_name="Dr. Priya",
        last_name="Sharma",
        role="org_admin",
        is_active=True,
        is_email_verified=True,
    )
    doctor = User(
        organization_id=org.id,
        email="doctor@apollo-demo.ptai.dev",
        hashed_password=hash_password("Demo@1234!"),
        first_name="Dr. Ravi",
        last_name="Kumar",
        role="doctor",
        specialization="Internal Medicine",
        is_active=True,
        is_email_verified=True,
    )
    db.add(admin)
    db.add(doctor)
    await db.flush()

    print(f"✓ Organization: {org.name} ({org.id})")
    print(f"✓ Admin user: {admin.email} / Demo@1234!")
    print(f"✓ Doctor user: {doctor.email} / Demo@1234!")
    return org, doctor


async def seed_patients(db: AsyncSession, org: Organization, count: int = 50) -> list[Patient]:
    patients = []
    for i in range(count):
        dob = date(1960 + random.randint(0, 55), random.randint(1, 12), random.randint(1, 28))
        patient = Patient(
            organization_id=org.id,
            mrn=f"MRN-{1000 + i:04d}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            date_of_birth=dob,
            gender=random.choice(["male", "female"]),
            phone=fake.phone_number()[:20],
            email=fake.email(),
            city=fake.city(),
            state=fake.state(),
            country="India",
            blood_group=random.choice(BLOOD_GROUPS),
            is_active=True,
        )
        db.add(patient)
        patients.append(patient)
    await db.flush()
    print(f"✓ Created {count} synthetic patients")
    return patients


async def seed_prescriptions(db: AsyncSession, org: Organization, doctor: User, patients: list[Patient], count_per_patient: int = 6):
    total = 0
    for patient in patients:
        for j in range(random.randint(2, count_per_patient)):
            rx_date = date.today() - timedelta(days=random.randint(0, 365))
            diag_code, diag_name = random.choice(DIAGNOSES)

            prescription = Prescription(
                organization_id=org.id,
                patient_id=patient.id,
                prescribed_by=doctor.id,
                rx_number=f"RX-{uuid.uuid4().hex[:8].upper()}",
                prescription_date=rx_date,
                status="finalized",
                diagnosis_context=f"Patient presented with {diag_name.lower()}.",
                is_immutable=True,
                finalized_at=datetime(rx_date.year, rx_date.month, rx_date.day, 10, 0, 0, tzinfo=timezone.utc),
            )
            db.add(prescription)
            await db.flush()

            # Add 1-3 medications
            for k, (med_name, generic, dosage, frequency, duration) in enumerate(
                random.sample(MEDICATIONS, random.randint(1, 3))
            ):
                item = PrescriptionItem(
                    prescription_id=prescription.id,
                    medication_name=med_name,
                    generic_name=generic,
                    dosage=dosage,
                    frequency=frequency,
                    duration=duration,
                    route="oral",
                    instructions="Take as directed.",
                    sort_order=k,
                )
                db.add(item)

            total += 1

    await db.commit()
    print(f"✓ Created {total} synthetic prescriptions with items")


async def main():
    print("\n🌱 Seeding synthetic data for PTAI v3 development...")
    print("   (Using entirely synthetic data — NO real patient information)")
    print()

    async with AsyncSessionLocal() as db:
        org, doctor = await seed_organization_and_admin(db)
        patients = await seed_patients(db, org, count=50)
        await seed_prescriptions(db, org, doctor, patients)
        await db.commit()

    print()
    print("✅ Seed complete! Login credentials:")
    print("   Admin : admin@apollo-demo.ptai.dev / Demo@1234!")
    print("   Doctor: doctor@apollo-demo.ptai.dev / Demo@1234!")
    print()
    print("⚠️  All data is synthetic. Do not use in production.")


if __name__ == "__main__":
    asyncio.run(main())
