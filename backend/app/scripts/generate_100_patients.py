import json
import random
import os

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

patients = []
prescriptions = []

random.seed(42)

for i in range(1, 101):
    gender = 'Male' if random.random() > 0.48 else 'Female'
    first_name = random.choice(first_names_m) if gender == 'Male' else random.choice(first_names_f)
    last_name = random.choice(last_names)
    full_name = f"{first_name} {last_name}"
    mrn = f"MRN-2026-{1000 + i}"
    patient_id = f"p-{1000 + i}"
    blood_group = random.choice(blood_groups)
    phone = f"+91 9{random.randint(100000000, 999999999)}"

    # 45 Low, 35 Moderate, 20 High
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

    # 1-2 prescriptions per patient
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

# Output TypeScript file
ts_content = f"""// PTAI v3 — 100 Patient Dataset (Low, Moderate, High Risk)
export interface PatientSeed {{
  id: string
  mrn: string
  name: string
  deidentified_id: string
  age: number
  gender: string
  blood_group: string
  phone: string
  allergies: string[]
  chronic_conditions: string[]
  active_medications: string[]
  risk_level: 'Low' | 'Moderate' | 'High'
  notes: string
  diagnosis: string
}}

export interface PrescriptionSeed {{
  id: string
  patient_id: string
  patient_name: string
  mrn: string
  age: number
  gender: string
  date: string
  diagnosis: string
  medications: {{
    medication: string
    dosage: string
    frequency: string
    duration_days: number
    instructions: string
  }}[]
  status: 'active' | 'completed' | 'flagged' | 'draft'
  risk_status: 'normal' | 'anomaly_flagged' | 'high_risk'
}}

export const SEED_PATIENTS_100: PatientSeed[] = {json.dumps(patients, indent=2)};

export const SEED_PRESCRIPTIONS_100: PrescriptionSeed[] = {json.dumps(prescriptions, indent=2)};
"""

with open("c:/Users/athis/PTAIV3/frontend/src/data/seedData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated seedData.ts with {len(patients)} patients:")
print(f" - Low Risk: {sum(1 for p in patients if p['risk_level'] == 'Low')}")
print(f" - Moderate Risk: {sum(1 for p in patients if p['risk_level'] == 'Moderate')}")
print(f" - High Risk: {sum(1 for p in patients if p['risk_level'] == 'High')}")
print(f"Total Prescriptions: {len(prescriptions)}")
