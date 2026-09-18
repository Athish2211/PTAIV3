// PTAI v3 — 100 Patient Dataset (Low, Moderate, High Risk)
export interface PatientSeed {
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
}

export interface PrescriptionSeed {
  id: string
  patient_id: string
  patient_name: string
  mrn: string
  age: number
  gender: string
  date: string
  diagnosis: string
  medications: {
    medication: string
    dosage: string
    frequency: string
    duration_days: number
    instructions: string
  }[]
  status: 'active' | 'completed' | 'flagged' | 'draft'
  risk_status: 'normal' | 'anomaly_flagged' | 'high_risk'
}

export const SEED_PATIENTS_100: PatientSeed[] = [
  {
    "id": "p-1001",
    "mrn": "MRN-2026-1001",
    "name": "Vivaan Tripathi",
    "deidentified_id": "PT-1001",
    "age": 26,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9362950628",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1002",
    "mrn": "MRN-2026-1002",
    "name": "Shruti Dutta",
    "deidentified_id": "PT-1002",
    "age": 25,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9702632297",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1003",
    "mrn": "MRN-2026-1003",
    "name": "Shaurya Tiwari",
    "deidentified_id": "PT-1003",
    "age": 27,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9465341213",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1004",
    "mrn": "MRN-2026-1004",
    "name": "Geeta Kaur",
    "deidentified_id": "PT-1004",
    "age": 20,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9966647391",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1005",
    "mrn": "MRN-2026-1005",
    "name": "Aditya Mishra",
    "deidentified_id": "PT-1005",
    "age": 28,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9930075810",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1006",
    "mrn": "MRN-2026-1006",
    "name": "Ramesh Gupta",
    "deidentified_id": "PT-1006",
    "age": 25,
    "gender": "Male",
    "blood_group": "AB-",
    "phone": "+91 9481469012",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Gastritis"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Gastritis"
  },
  {
    "id": "p-1007",
    "mrn": "MRN-2026-1007",
    "name": "Sneha Choudhary",
    "deidentified_id": "PT-1007",
    "age": 29,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9835098955",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1008",
    "mrn": "MRN-2026-1008",
    "name": "Jyoti Dubey",
    "deidentified_id": "PT-1008",
    "age": 39,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9328306011",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1009",
    "mrn": "MRN-2026-1009",
    "name": "Prakash Goyal",
    "deidentified_id": "PT-1009",
    "age": 31,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9726563708",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Seasonal Flu"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Seasonal Flu"
  },
  {
    "id": "p-1010",
    "mrn": "MRN-2026-1010",
    "name": "Myra Pandey",
    "deidentified_id": "PT-1010",
    "age": 21,
    "gender": "Female",
    "blood_group": "O+",
    "phone": "+91 9740389325",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1011",
    "mrn": "MRN-2026-1011",
    "name": "Keshav Yadav",
    "deidentified_id": "PT-1011",
    "age": 28,
    "gender": "Male",
    "blood_group": "AB-",
    "phone": "+91 9219778234",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Seasonal Flu"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Seasonal Flu"
  },
  {
    "id": "p-1012",
    "mrn": "MRN-2026-1012",
    "name": "Reyansh Choudhary",
    "deidentified_id": "PT-1012",
    "age": 35,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9786066793",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Seasonal Flu"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Seasonal Flu"
  },
  {
    "id": "p-1013",
    "mrn": "MRN-2026-1013",
    "name": "Ayaan Patil",
    "deidentified_id": "PT-1013",
    "age": 20,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9357109965",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1014",
    "mrn": "MRN-2026-1014",
    "name": "Krishna Mishra",
    "deidentified_id": "PT-1014",
    "age": 24,
    "gender": "Male",
    "blood_group": "O-",
    "phone": "+91 9690347116",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Myalgia"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Myalgia"
  },
  {
    "id": "p-1015",
    "mrn": "MRN-2026-1015",
    "name": "Vandana Yadav",
    "deidentified_id": "PT-1015",
    "age": 35,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9570406376",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Wellness"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Wellness"
  },
  {
    "id": "p-1016",
    "mrn": "MRN-2026-1016",
    "name": "Shobha Mittal",
    "deidentified_id": "PT-1016",
    "age": 21,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9107721109",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1017",
    "mrn": "MRN-2026-1017",
    "name": "Arjun Dutta",
    "deidentified_id": "PT-1017",
    "age": 40,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9399012686",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Seasonal Flu"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Seasonal Flu"
  },
  {
    "id": "p-1018",
    "mrn": "MRN-2026-1018",
    "name": "Vandana Gaekwad",
    "deidentified_id": "PT-1018",
    "age": 32,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9554814084",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1019",
    "mrn": "MRN-2026-1019",
    "name": "Reyansh Singhal",
    "deidentified_id": "PT-1019",
    "age": 36,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9304235259",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Seasonal Flu"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Seasonal Flu"
  },
  {
    "id": "p-1020",
    "mrn": "MRN-2026-1020",
    "name": "Arjun Bose",
    "deidentified_id": "PT-1020",
    "age": 39,
    "gender": "Male",
    "blood_group": "A-",
    "phone": "+91 9154318806",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Wellness"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Wellness"
  },
  {
    "id": "p-1021",
    "mrn": "MRN-2026-1021",
    "name": "Pranav Chavan",
    "deidentified_id": "PT-1021",
    "age": 31,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9276777762",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Antacid Syrup"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1022",
    "mrn": "MRN-2026-1022",
    "name": "Rahul Iyengar",
    "deidentified_id": "PT-1022",
    "age": 25,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9418587604",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1023",
    "mrn": "MRN-2026-1023",
    "name": "Kiran Gupta",
    "deidentified_id": "PT-1023",
    "age": 21,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9645276696",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1024",
    "mrn": "MRN-2026-1024",
    "name": "Jyoti Singhal",
    "deidentified_id": "PT-1024",
    "age": 21,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9765055833",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1025",
    "mrn": "MRN-2026-1025",
    "name": "Vandana Yadav",
    "deidentified_id": "PT-1025",
    "age": 29,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9590941149",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1026",
    "mrn": "MRN-2026-1026",
    "name": "Neha Iyer",
    "deidentified_id": "PT-1026",
    "age": 26,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9173864104",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Gastritis"
    ],
    "active_medications": [
      "Paracetamol 500mg"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Gastritis"
  },
  {
    "id": "p-1027",
    "mrn": "MRN-2026-1027",
    "name": "Vandana Menon",
    "deidentified_id": "PT-1027",
    "age": 22,
    "gender": "Female",
    "blood_group": "B+",
    "phone": "+91 9383968123",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Paracetamol 500mg"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1028",
    "mrn": "MRN-2026-1028",
    "name": "Sarita Goyal",
    "deidentified_id": "PT-1028",
    "age": 20,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9369639388",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1029",
    "mrn": "MRN-2026-1029",
    "name": "Ashok Goyal",
    "deidentified_id": "PT-1029",
    "age": 33,
    "gender": "Male",
    "blood_group": "B+",
    "phone": "+91 9895890631",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1030",
    "mrn": "MRN-2026-1030",
    "name": "Rakesh Iyengar",
    "deidentified_id": "PT-1030",
    "age": 30,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9996139578",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Myalgia"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Myalgia"
  },
  {
    "id": "p-1031",
    "mrn": "MRN-2026-1031",
    "name": "Aadhya Deshpande",
    "deidentified_id": "PT-1031",
    "age": 26,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9832363533",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Wellness"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Wellness"
  },
  {
    "id": "p-1032",
    "mrn": "MRN-2026-1032",
    "name": "Atharv Shinde",
    "deidentified_id": "PT-1032",
    "age": 42,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9292587044",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1033",
    "mrn": "MRN-2026-1033",
    "name": "Sanjay Mittal",
    "deidentified_id": "PT-1033",
    "age": 33,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9976803188",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Gastritis"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Gastritis"
  },
  {
    "id": "p-1034",
    "mrn": "MRN-2026-1034",
    "name": "Sneha Rao",
    "deidentified_id": "PT-1034",
    "age": 39,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9477040284",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1035",
    "mrn": "MRN-2026-1035",
    "name": "Neha Patel",
    "deidentified_id": "PT-1035",
    "age": 32,
    "gender": "Female",
    "blood_group": "A-",
    "phone": "+91 9740563507",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1036",
    "mrn": "MRN-2026-1036",
    "name": "Swati Sharma",
    "deidentified_id": "PT-1036",
    "age": 32,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9491079829",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1037",
    "mrn": "MRN-2026-1037",
    "name": "Vikram Chavan",
    "deidentified_id": "PT-1037",
    "age": 23,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9695295870",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Vitamin D3 60k"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1038",
    "mrn": "MRN-2026-1038",
    "name": "Rohan Shah",
    "deidentified_id": "PT-1038",
    "age": 44,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9561588882",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Myalgia"
    ],
    "active_medications": [
      "Antacid Syrup"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Myalgia"
  },
  {
    "id": "p-1039",
    "mrn": "MRN-2026-1039",
    "name": "Dolly Gupta",
    "deidentified_id": "PT-1039",
    "age": 35,
    "gender": "Female",
    "blood_group": "A-",
    "phone": "+91 9404713332",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1040",
    "mrn": "MRN-2026-1040",
    "name": "Ira Iyengar",
    "deidentified_id": "PT-1040",
    "age": 26,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9149621604",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Myalgia"
    ],
    "active_medications": [
      "Antacid Syrup"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Myalgia"
  },
  {
    "id": "p-1041",
    "mrn": "MRN-2026-1041",
    "name": "Aaryan Iyengar",
    "deidentified_id": "PT-1041",
    "age": 43,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9906341966",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1042",
    "mrn": "MRN-2026-1042",
    "name": "Shobha Singhal",
    "deidentified_id": "PT-1042",
    "age": 23,
    "gender": "Female",
    "blood_group": "A-",
    "phone": "+91 9590122159",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Mild Vitamin D Deficiency"
    ],
    "active_medications": [
      "Antacid Syrup"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Mild Vitamin D Deficiency"
  },
  {
    "id": "p-1043",
    "mrn": "MRN-2026-1043",
    "name": "Ekta Singhal",
    "deidentified_id": "PT-1043",
    "age": 43,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9922286180",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Allergic Rhinitis"
    ],
    "active_medications": [
      "Antacid Syrup"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "Allergic Rhinitis"
  },
  {
    "id": "p-1044",
    "mrn": "MRN-2026-1044",
    "name": "Anita Joshi",
    "deidentified_id": "PT-1044",
    "age": 23,
    "gender": "Female",
    "blood_group": "A-",
    "phone": "+91 9248578017",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1045",
    "mrn": "MRN-2026-1045",
    "name": "Anita Sen",
    "deidentified_id": "PT-1045",
    "age": 20,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9546434187",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "General Outpatient"
    ],
    "active_medications": [
      "Multivitamin"
    ],
    "risk_level": "Low",
    "notes": "Routine outpatient consultation. Vitals within baseline limits. Low clinical complexity.",
    "diagnosis": "General Outpatient"
  },
  {
    "id": "p-1046",
    "mrn": "MRN-2026-1046",
    "name": "Rohan Upadhyay",
    "deidentified_id": "PT-1046",
    "age": 55,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9997356828",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "GERD",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Amlodipine",
      "Glimepiride",
      "Metformin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1047",
    "mrn": "MRN-2026-1047",
    "name": "Harish Sen",
    "deidentified_id": "PT-1047",
    "age": 60,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9523076025",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "GERD"
    ],
    "active_medications": [
      "Metoprolol",
      "Amlodipine",
      "Ramipril"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Essential Hypertension. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1048",
    "mrn": "MRN-2026-1048",
    "name": "Anita Upadhyay",
    "deidentified_id": "PT-1048",
    "age": 55,
    "gender": "Female",
    "blood_group": "O+",
    "phone": "+91 9398775766",
    "allergies": [
      "Pollen"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "GERD",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Atorvastatin",
      "Pantoprazole",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Essential Hypertension. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1049",
    "mrn": "MRN-2026-1049",
    "name": "Advik Verma",
    "deidentified_id": "PT-1049",
    "age": 46,
    "gender": "Male",
    "blood_group": "B+",
    "phone": "+91 9356135680",
    "allergies": [
      "Sulfa drugs (Mild rash)"
    ],
    "chronic_conditions": [
      "Osteoarthritis",
      "Essential Hypertension",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Metoprolol",
      "Vildagliptin",
      "Levothyroxine"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Osteoarthritis. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Osteoarthritis"
  },
  {
    "id": "p-1050",
    "mrn": "MRN-2026-1050",
    "name": "Reyansh Singh",
    "deidentified_id": "PT-1050",
    "age": 60,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9434961542",
    "allergies": [
      "Dust mites"
    ],
    "chronic_conditions": [
      "GERD",
      "Type 2 Diabetes Mellitus",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Cetirizine",
      "Montelukast"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1051",
    "mrn": "MRN-2026-1051",
    "name": "Swati Mishra",
    "deidentified_id": "PT-1051",
    "age": 58,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9174041730",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "GERD",
      "Hypothyroidism"
    ],
    "active_medications": [
      "Pantoprazole",
      "Levothyroxine",
      "Dapagliflozin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Essential Hypertension. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1052",
    "mrn": "MRN-2026-1052",
    "name": "Usha Yadav",
    "deidentified_id": "PT-1052",
    "age": 59,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9761330848",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "GERD",
      "Osteoarthritis",
      "Hyperlipidemia"
    ],
    "active_medications": [
      "Levothyroxine",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1053",
    "mrn": "MRN-2026-1053",
    "name": "Dinesh Kumar",
    "deidentified_id": "PT-1053",
    "age": 42,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9461203124",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Type 2 Diabetes Mellitus",
      "GERD"
    ],
    "active_medications": [
      "Metformin",
      "Ramipril",
      "Vildagliptin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1054",
    "mrn": "MRN-2026-1054",
    "name": "Advik Nair",
    "deidentified_id": "PT-1054",
    "age": 55,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9873174285",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Type 2 Diabetes Mellitus",
      "GERD"
    ],
    "active_medications": [
      "Montelukast",
      "Amlodipine",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1055",
    "mrn": "MRN-2026-1055",
    "name": "Rohan Mishra",
    "deidentified_id": "PT-1055",
    "age": 59,
    "gender": "Male",
    "blood_group": "AB-",
    "phone": "+91 9608159580",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "GERD",
      "Hypothyroidism",
      "Hyperlipidemia"
    ],
    "active_medications": [
      "Ramipril",
      "Paracetamol",
      "Levothyroxine"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1056",
    "mrn": "MRN-2026-1056",
    "name": "Vikram Pillai",
    "deidentified_id": "PT-1056",
    "age": 48,
    "gender": "Male",
    "blood_group": "B+",
    "phone": "+91 9305665554",
    "allergies": [
      "Dust mites"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Hypothyroidism",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Atorvastatin",
      "Metformin",
      "Metoprolol"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1057",
    "mrn": "MRN-2026-1057",
    "name": "Aadhya Reddy",
    "deidentified_id": "PT-1057",
    "age": 46,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9848846217",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "Osteoarthritis",
      "Hyperlipidemia"
    ],
    "active_medications": [
      "Metoprolol",
      "Amlodipine",
      "Ramipril"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Essential Hypertension. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1058",
    "mrn": "MRN-2026-1058",
    "name": "Ananya Roy",
    "deidentified_id": "PT-1058",
    "age": 46,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9262915636",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "Type 2 Diabetes Mellitus",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Montelukast",
      "Sitagliptin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Essential Hypertension. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1059",
    "mrn": "MRN-2026-1059",
    "name": "Kiran Gaekwad",
    "deidentified_id": "PT-1059",
    "age": 61,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9710561240",
    "allergies": [
      "Dust mites"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Ramipril",
      "Pantoprazole"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1060",
    "mrn": "MRN-2026-1060",
    "name": "Shobha Rao",
    "deidentified_id": "PT-1060",
    "age": 55,
    "gender": "Female",
    "blood_group": "B+",
    "phone": "+91 9102873038",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Osteoarthritis",
      "Hypothyroidism",
      "GERD"
    ],
    "active_medications": [
      "Ramipril",
      "Cetirizine"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Osteoarthritis. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Osteoarthritis"
  },
  {
    "id": "p-1061",
    "mrn": "MRN-2026-1061",
    "name": "Dhruv Choudhary",
    "deidentified_id": "PT-1061",
    "age": 45,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9556489494",
    "allergies": [
      "Dust mites"
    ],
    "chronic_conditions": [
      "Osteoarthritis",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Amlodipine",
      "Metoprolol"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Osteoarthritis. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Osteoarthritis"
  },
  {
    "id": "p-1062",
    "mrn": "MRN-2026-1062",
    "name": "Archana Desai",
    "deidentified_id": "PT-1062",
    "age": 58,
    "gender": "Female",
    "blood_group": "O+",
    "phone": "+91 9392322121",
    "allergies": [
      "Sulfa drugs (Mild rash)"
    ],
    "chronic_conditions": [
      "GERD",
      "Essential Hypertension",
      "Hypothyroidism"
    ],
    "active_medications": [
      "Amlodipine",
      "Telmisartan",
      "Atorvastatin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1063",
    "mrn": "MRN-2026-1063",
    "name": "Madhav Upadhyay",
    "deidentified_id": "PT-1063",
    "age": 58,
    "gender": "Male",
    "blood_group": "B+",
    "phone": "+91 9605196410",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Type 2 Diabetes Mellitus",
      "GERD"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Metformin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1064",
    "mrn": "MRN-2026-1064",
    "name": "Shaurya Kulkarni",
    "deidentified_id": "PT-1064",
    "age": 57,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9844826434",
    "allergies": [
      "Sulfa drugs (Mild rash)"
    ],
    "chronic_conditions": [
      "Osteoarthritis",
      "GERD",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Metformin",
      "Telmisartan",
      "Montelukast"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Osteoarthritis. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Osteoarthritis"
  },
  {
    "id": "p-1065",
    "mrn": "MRN-2026-1065",
    "name": "Prakash Chatterjee",
    "deidentified_id": "PT-1065",
    "age": 48,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9158201193",
    "allergies": [
      "Dust mites"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "GERD",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Sitagliptin",
      "Metoprolol",
      "Ramipril"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1066",
    "mrn": "MRN-2026-1066",
    "name": "Sarita Kaur",
    "deidentified_id": "PT-1066",
    "age": 47,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9862123506",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Essential Hypertension",
      "GERD"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1067",
    "mrn": "MRN-2026-1067",
    "name": "Rudra Dutta",
    "deidentified_id": "PT-1067",
    "age": 57,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9546129354",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "GERD",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Levothyroxine",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Type 2 Diabetes Mellitus. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1068",
    "mrn": "MRN-2026-1068",
    "name": "Naveen Mehta",
    "deidentified_id": "PT-1068",
    "age": 65,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9403696046",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Osteoarthritis",
      "GERD"
    ],
    "active_medications": [
      "Metformin",
      "Paracetamol",
      "Sitagliptin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1069",
    "mrn": "MRN-2026-1069",
    "name": "Rakesh Singhal",
    "deidentified_id": "PT-1069",
    "age": 55,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9350785761",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "GERD"
    ],
    "active_medications": [
      "Pantoprazole",
      "Montelukast",
      "Paracetamol"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1070",
    "mrn": "MRN-2026-1070",
    "name": "Krishna Dutta",
    "deidentified_id": "PT-1070",
    "age": 56,
    "gender": "Male",
    "blood_group": "AB-",
    "phone": "+91 9207765664",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "GERD"
    ],
    "active_medications": [
      "Glimepiride",
      "Levothyroxine"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1071",
    "mrn": "MRN-2026-1071",
    "name": "Neha Kulkarni",
    "deidentified_id": "PT-1071",
    "age": 44,
    "gender": "Female",
    "blood_group": "O+",
    "phone": "+91 9797756796",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Osteoarthritis",
      "Hypothyroidism",
      "GERD"
    ],
    "active_medications": [
      "Vildagliptin",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Osteoarthritis. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Osteoarthritis"
  },
  {
    "id": "p-1072",
    "mrn": "MRN-2026-1072",
    "name": "Gopal Nair",
    "deidentified_id": "PT-1072",
    "age": 62,
    "gender": "Male",
    "blood_group": "O+",
    "phone": "+91 9205702499",
    "allergies": [
      "Pollen"
    ],
    "chronic_conditions": [
      "GERD",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Metformin",
      "Montelukast"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1073",
    "mrn": "MRN-2026-1073",
    "name": "Swati Iyengar",
    "deidentified_id": "PT-1073",
    "age": 55,
    "gender": "Female",
    "blood_group": "B-",
    "phone": "+91 9670335494",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Vildagliptin",
      "Pantoprazole",
      "Atorvastatin"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Type 2 Diabetes Mellitus. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1074",
    "mrn": "MRN-2026-1074",
    "name": "Neha Chatterjee",
    "deidentified_id": "PT-1074",
    "age": 42,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9816014770",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Hypothyroidism",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Vildagliptin",
      "Ramipril",
      "Pantoprazole"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1075",
    "mrn": "MRN-2026-1075",
    "name": "Advik Pawar",
    "deidentified_id": "PT-1075",
    "age": 49,
    "gender": "Male",
    "blood_group": "O-",
    "phone": "+91 9214518079",
    "allergies": [
      "Sulfa drugs (Mild rash)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Hyperlipidemia",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Levothyroxine",
      "Pantoprazole"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1076",
    "mrn": "MRN-2026-1076",
    "name": "Santosh Pathak",
    "deidentified_id": "PT-1076",
    "age": 65,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9751124015",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Type 2 Diabetes Mellitus",
      "Osteoarthritis"
    ],
    "active_medications": [
      "Vildagliptin",
      "Ramipril"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1077",
    "mrn": "MRN-2026-1077",
    "name": "Vinod Patel",
    "deidentified_id": "PT-1077",
    "age": 56,
    "gender": "Male",
    "blood_group": "AB+",
    "phone": "+91 9946764061",
    "allergies": [
      "Pollen"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Hyperlipidemia"
    ],
    "active_medications": [
      "Metformin",
      "Cetirizine",
      "Glimepiride"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1078",
    "mrn": "MRN-2026-1078",
    "name": "Asha Patil",
    "deidentified_id": "PT-1078",
    "age": 47,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9991713190",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "GERD",
      "Hyperlipidemia",
      "Hypothyroidism"
    ],
    "active_medications": [
      "Metoprolol",
      "Montelukast"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for GERD. Regular 6-month lab follow-up indicated.",
    "diagnosis": "GERD"
  },
  {
    "id": "p-1079",
    "mrn": "MRN-2026-1079",
    "name": "Mahesh Patil",
    "deidentified_id": "PT-1079",
    "age": 54,
    "gender": "Male",
    "blood_group": "A-",
    "phone": "+91 9948988297",
    "allergies": [
      "NKDA (No Known Drug Allergies)"
    ],
    "chronic_conditions": [
      "Hyperlipidemia",
      "Hypothyroidism"
    ],
    "active_medications": [
      "Pantoprazole",
      "Cetirizine",
      "Paracetamol"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hyperlipidemia. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hyperlipidemia"
  },
  {
    "id": "p-1080",
    "mrn": "MRN-2026-1080",
    "name": "Shruti Banerjee",
    "deidentified_id": "PT-1080",
    "age": 59,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9765233376",
    "allergies": [
      "Ibuprofen (Mild GI distress)"
    ],
    "chronic_conditions": [
      "Hypothyroidism",
      "Type 2 Diabetes Mellitus",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Pantoprazole",
      "Glimepiride",
      "Telmisartan"
    ],
    "risk_level": "Moderate",
    "notes": "Moderate risk chronic disease profile for Hypothyroidism. Regular 6-month lab follow-up indicated.",
    "diagnosis": "Hypothyroidism"
  },
  {
    "id": "p-1081",
    "mrn": "MRN-2026-1081",
    "name": "Rohan Mukherjee",
    "deidentified_id": "PT-1081",
    "age": 65,
    "gender": "Male",
    "blood_group": "A-",
    "phone": "+91 9204359116",
    "allergies": [
      "Morphine (Severe respiratory depression)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "Chronic Kidney Disease (Stage 3)",
      "COPD",
      "Essential Hypertension",
      "Atrial Fibrillation",
      "Heart Failure (NYHA II)"
    ],
    "active_medications": [
      "Paracetamol",
      "Glimepiride",
      "Pantoprazole",
      "Telmisartan"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Type 2 Diabetes Mellitus and Chronic Kidney Disease (Stage 3). Documented allergy flag: Morphine (Severe respiratory depression).",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1082",
    "mrn": "MRN-2026-1082",
    "name": "Sita Bansal",
    "deidentified_id": "PT-1082",
    "age": 65,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9577488537",
    "allergies": [
      "Aspirin (Bronchospasm)"
    ],
    "chronic_conditions": [
      "Coronary Artery Disease",
      "COPD",
      "Essential Hypertension",
      "Atrial Fibrillation",
      "Heart Failure (NYHA II)"
    ],
    "active_medications": [
      "Atorvastatin",
      "Telmisartan",
      "Dapagliflozin",
      "Levothyroxine",
      "Pantoprazole"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Coronary Artery Disease and COPD. Documented allergy flag: Aspirin (Bronchospasm).",
    "diagnosis": "Coronary Artery Disease"
  },
  {
    "id": "p-1083",
    "mrn": "MRN-2026-1083",
    "name": "Anita Singhal",
    "deidentified_id": "PT-1083",
    "age": 76,
    "gender": "Female",
    "blood_group": "B+",
    "phone": "+91 9945011302",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "Coronary Artery Disease",
      "Atrial Fibrillation",
      "Type 2 Diabetes Mellitus",
      "COPD"
    ],
    "active_medications": [
      "Montelukast",
      "Metoprolol",
      "Paracetamol",
      "Vildagliptin",
      "Amlodipine"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Coronary Artery Disease and Atrial Fibrillation. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "Coronary Artery Disease"
  },
  {
    "id": "p-1084",
    "mrn": "MRN-2026-1084",
    "name": "Atharv Pillai",
    "deidentified_id": "PT-1084",
    "age": 58,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9241522640",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Type 2 Diabetes Mellitus",
      "Atrial Fibrillation",
      "Essential Hypertension",
      "Coronary Artery Disease"
    ],
    "active_medications": [
      "Amlodipine",
      "Metoprolol",
      "Cetirizine",
      "Glimepiride",
      "Sitagliptin"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Type 2 Diabetes Mellitus. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1085",
    "mrn": "MRN-2026-1085",
    "name": "Farida Patil",
    "deidentified_id": "PT-1085",
    "age": 74,
    "gender": "Female",
    "blood_group": "A-",
    "phone": "+91 9585337126",
    "allergies": [
      "Aspirin (Bronchospasm)"
    ],
    "chronic_conditions": [
      "Atrial Fibrillation",
      "Coronary Artery Disease",
      "Heart Failure (NYHA II)",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Amlodipine",
      "Dapagliflozin",
      "Glimepiride",
      "Montelukast"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Atrial Fibrillation and Coronary Artery Disease. Documented allergy flag: Aspirin (Bronchospasm).",
    "diagnosis": "Atrial Fibrillation"
  },
  {
    "id": "p-1086",
    "mrn": "MRN-2026-1086",
    "name": "Manoj Rao",
    "deidentified_id": "PT-1086",
    "age": 77,
    "gender": "Male",
    "blood_group": "A-",
    "phone": "+91 9445864933",
    "allergies": [
      "Aspirin (Bronchospasm)"
    ],
    "chronic_conditions": [
      "Coronary Artery Disease",
      "Type 2 Diabetes Mellitus",
      "Essential Hypertension",
      "Atrial Fibrillation"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Sitagliptin",
      "Vildagliptin",
      "Glimepiride",
      "Telmisartan"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Coronary Artery Disease and Type 2 Diabetes Mellitus. Documented allergy flag: Aspirin (Bronchospasm).",
    "diagnosis": "Coronary Artery Disease"
  },
  {
    "id": "p-1087",
    "mrn": "MRN-2026-1087",
    "name": "Pranav Gaekwad",
    "deidentified_id": "PT-1087",
    "age": 71,
    "gender": "Male",
    "blood_group": "O-",
    "phone": "+91 9345343109",
    "allergies": [
      "Penicillin (Anaphylaxis risk)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Chronic Kidney Disease (Stage 3)",
      "COPD",
      "Atrial Fibrillation",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Glimepiride",
      "Metformin",
      "Pantoprazole",
      "Ramipril",
      "Levothyroxine"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Chronic Kidney Disease (Stage 3). Documented allergy flag: Penicillin (Anaphylaxis risk).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1088",
    "mrn": "MRN-2026-1088",
    "name": "Pari Nair",
    "deidentified_id": "PT-1088",
    "age": 81,
    "gender": "Female",
    "blood_group": "O+",
    "phone": "+91 9203685265",
    "allergies": [
      "Codeine"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "Type 2 Diabetes Mellitus",
      "Atrial Fibrillation",
      "Coronary Artery Disease",
      "Heart Failure (NYHA II)",
      "COPD"
    ],
    "active_medications": [
      "Glimepiride",
      "Metformin",
      "Pantoprazole",
      "Paracetamol"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Essential Hypertension and Type 2 Diabetes Mellitus. Documented allergy flag: Codeine.",
    "diagnosis": "Essential Hypertension"
  },
  {
    "id": "p-1089",
    "mrn": "MRN-2026-1089",
    "name": "Suresh Menon",
    "deidentified_id": "PT-1089",
    "age": 79,
    "gender": "Male",
    "blood_group": "B-",
    "phone": "+91 9266140258",
    "allergies": [
      "Cephalosporins (Cross-reactive)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "Coronary Artery Disease",
      "Essential Hypertension",
      "Atrial Fibrillation",
      "COPD"
    ],
    "active_medications": [
      "Montelukast",
      "Glimepiride",
      "Sitagliptin",
      "Vildagliptin"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Type 2 Diabetes Mellitus and Coronary Artery Disease. Documented allergy flag: Cephalosporins (Cross-reactive).",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1090",
    "mrn": "MRN-2026-1090",
    "name": "Sneha Tiwari",
    "deidentified_id": "PT-1090",
    "age": 69,
    "gender": "Female",
    "blood_group": "AB+",
    "phone": "+91 9464883950",
    "allergies": [
      "Penicillin (Anaphylaxis risk)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "Heart Failure (NYHA II)",
      "Atrial Fibrillation",
      "Chronic Kidney Disease (Stage 3)"
    ],
    "active_medications": [
      "Cetirizine",
      "Pantoprazole",
      "Amlodipine",
      "Telmisartan"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Type 2 Diabetes Mellitus and Heart Failure (NYHA II). Documented allergy flag: Penicillin (Anaphylaxis risk).",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1091",
    "mrn": "MRN-2026-1091",
    "name": "Anita Gupta",
    "deidentified_id": "PT-1091",
    "age": 81,
    "gender": "Female",
    "blood_group": "AB-",
    "phone": "+91 9434618074",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Atrial Fibrillation",
      "COPD",
      "Coronary Artery Disease",
      "Chronic Kidney Disease (Stage 3)"
    ],
    "active_medications": [
      "Montelukast",
      "Vildagliptin",
      "Amlodipine",
      "Pantoprazole"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Atrial Fibrillation. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1092",
    "mrn": "MRN-2026-1092",
    "name": "Swati Mukherjee",
    "deidentified_id": "PT-1092",
    "age": 66,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9544726404",
    "allergies": [
      "Aspirin (Bronchospasm)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Atrial Fibrillation",
      "Coronary Artery Disease",
      "Essential Hypertension"
    ],
    "active_medications": [
      "Ramipril",
      "Pantoprazole",
      "Levothyroxine",
      "Vildagliptin"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Atrial Fibrillation. Documented allergy flag: Aspirin (Bronchospasm).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1093",
    "mrn": "MRN-2026-1093",
    "name": "Meera Kaur",
    "deidentified_id": "PT-1093",
    "age": 64,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9108253947",
    "allergies": [
      "Penicillin (Anaphylaxis risk)"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes Mellitus",
      "Heart Failure (NYHA II)",
      "Essential Hypertension",
      "Atrial Fibrillation",
      "COPD"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Cetirizine",
      "Glimepiride",
      "Metoprolol"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Type 2 Diabetes Mellitus and Heart Failure (NYHA II). Documented allergy flag: Penicillin (Anaphylaxis risk).",
    "diagnosis": "Type 2 Diabetes Mellitus"
  },
  {
    "id": "p-1094",
    "mrn": "MRN-2026-1094",
    "name": "Advaith Dutta",
    "deidentified_id": "PT-1094",
    "age": 70,
    "gender": "Male",
    "blood_group": "AB-",
    "phone": "+91 9177390472",
    "allergies": [
      "Morphine (Severe respiratory depression)"
    ],
    "chronic_conditions": [
      "Coronary Artery Disease",
      "Chronic Kidney Disease (Stage 3)",
      "Heart Failure (NYHA II)",
      "COPD",
      "Atrial Fibrillation",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Vildagliptin",
      "Glimepiride",
      "Cetirizine",
      "Pantoprazole",
      "Levothyroxine"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Coronary Artery Disease and Chronic Kidney Disease (Stage 3). Documented allergy flag: Morphine (Severe respiratory depression).",
    "diagnosis": "Coronary Artery Disease"
  },
  {
    "id": "p-1095",
    "mrn": "MRN-2026-1095",
    "name": "Sunita Gupta",
    "deidentified_id": "PT-1095",
    "age": 80,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9993381017",
    "allergies": [
      "Morphine (Severe respiratory depression)"
    ],
    "chronic_conditions": [
      "Coronary Artery Disease",
      "Chronic Kidney Disease (Stage 3)",
      "Heart Failure (NYHA II)",
      "Type 2 Diabetes Mellitus",
      "COPD"
    ],
    "active_medications": [
      "Sitagliptin",
      "Telmisartan",
      "Glimepiride",
      "Ramipril",
      "Metformin"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Coronary Artery Disease and Chronic Kidney Disease (Stage 3). Documented allergy flag: Morphine (Severe respiratory depression).",
    "diagnosis": "Coronary Artery Disease"
  },
  {
    "id": "p-1096",
    "mrn": "MRN-2026-1096",
    "name": "Arjun Dutta",
    "deidentified_id": "PT-1096",
    "age": 74,
    "gender": "Male",
    "blood_group": "A-",
    "phone": "+91 9669732591",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Essential Hypertension",
      "COPD",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Metoprolol",
      "Ramipril",
      "Atorvastatin",
      "Paracetamol"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Essential Hypertension. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1097",
    "mrn": "MRN-2026-1097",
    "name": "Farida Choudhary",
    "deidentified_id": "PT-1097",
    "age": 82,
    "gender": "Female",
    "blood_group": "O-",
    "phone": "+91 9598165815",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Atrial Fibrillation",
      "Chronic Kidney Disease (Stage 3)",
      "Essential Hypertension",
      "COPD",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Telmisartan",
      "Dapagliflozin",
      "Levothyroxine",
      "Pantoprazole",
      "Ramipril"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Atrial Fibrillation. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1098",
    "mrn": "MRN-2026-1098",
    "name": "Rohan Chatterjee",
    "deidentified_id": "PT-1098",
    "age": 59,
    "gender": "Male",
    "blood_group": "O-",
    "phone": "+91 9140380477",
    "allergies": [
      "Morphine (Severe respiratory depression)"
    ],
    "chronic_conditions": [
      "Heart Failure (NYHA II)",
      "Essential Hypertension",
      "Coronary Artery Disease",
      "Atrial Fibrillation",
      "COPD"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Vildagliptin",
      "Sitagliptin",
      "Cetirizine",
      "Amlodipine"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Heart Failure (NYHA II) and Essential Hypertension. Documented allergy flag: Morphine (Severe respiratory depression).",
    "diagnosis": "Heart Failure (NYHA II)"
  },
  {
    "id": "p-1099",
    "mrn": "MRN-2026-1099",
    "name": "Naveen Iyengar",
    "deidentified_id": "PT-1099",
    "age": 61,
    "gender": "Male",
    "blood_group": "A+",
    "phone": "+91 9583745511",
    "allergies": [
      "Amoxicillin (Severe angioedema)"
    ],
    "chronic_conditions": [
      "COPD",
      "Coronary Artery Disease",
      "Atrial Fibrillation",
      "Type 2 Diabetes Mellitus",
      "Heart Failure (NYHA II)"
    ],
    "active_medications": [
      "Dapagliflozin",
      "Sitagliptin",
      "Levothyroxine",
      "Vildagliptin",
      "Metoprolol"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid COPD and Coronary Artery Disease. Documented allergy flag: Amoxicillin (Severe angioedema).",
    "diagnosis": "COPD"
  },
  {
    "id": "p-1100",
    "mrn": "MRN-2026-1100",
    "name": "Farida Kulkarni",
    "deidentified_id": "PT-1100",
    "age": 78,
    "gender": "Female",
    "blood_group": "A+",
    "phone": "+91 9947425963",
    "allergies": [
      "Cephalosporins (Cross-reactive)"
    ],
    "chronic_conditions": [
      "Essential Hypertension",
      "Coronary Artery Disease",
      "Heart Failure (NYHA II)",
      "COPD",
      "Atrial Fibrillation",
      "Type 2 Diabetes Mellitus"
    ],
    "active_medications": [
      "Cetirizine",
      "Levothyroxine",
      "Pantoprazole",
      "Vildagliptin",
      "Metoprolol"
    ],
    "risk_level": "High",
    "notes": "High-risk complex care profile with multi-morbid Essential Hypertension and Coronary Artery Disease. Documented allergy flag: Cephalosporins (Cross-reactive).",
    "diagnosis": "Essential Hypertension"
  }
];

export const SEED_PRESCRIPTIONS_100: PrescriptionSeed[] = [
  {
    "id": "rx-10010",
    "patient_id": "p-1001",
    "patient_name": "Vivaan Tripathi",
    "mrn": "MRN-2026-1001",
    "age": 26,
    "gender": "Male",
    "date": "2026-09-02",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10011",
    "patient_id": "p-1001",
    "patient_name": "Vivaan Tripathi",
    "mrn": "MRN-2026-1001",
    "age": 26,
    "gender": "Male",
    "date": "2026-09-01",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10020",
    "patient_id": "p-1002",
    "patient_name": "Shruti Dutta",
    "mrn": "MRN-2026-1002",
    "age": 25,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10021",
    "patient_id": "p-1002",
    "patient_name": "Shruti Dutta",
    "mrn": "MRN-2026-1002",
    "age": 25,
    "gender": "Female",
    "date": "2026-09-01",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10030",
    "patient_id": "p-1003",
    "patient_name": "Shaurya Tiwari",
    "mrn": "MRN-2026-1003",
    "age": 27,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10040",
    "patient_id": "p-1004",
    "patient_name": "Geeta Kaur",
    "mrn": "MRN-2026-1004",
    "age": 20,
    "gender": "Female",
    "date": "2026-09-12",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10041",
    "patient_id": "p-1004",
    "patient_name": "Geeta Kaur",
    "mrn": "MRN-2026-1004",
    "age": 20,
    "gender": "Female",
    "date": "2026-09-07",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10050",
    "patient_id": "p-1005",
    "patient_name": "Aditya Mishra",
    "mrn": "MRN-2026-1005",
    "age": 28,
    "gender": "Male",
    "date": "2026-09-09",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10051",
    "patient_id": "p-1005",
    "patient_name": "Aditya Mishra",
    "mrn": "MRN-2026-1005",
    "age": 28,
    "gender": "Male",
    "date": "2026-09-15",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10060",
    "patient_id": "p-1006",
    "patient_name": "Ramesh Gupta",
    "mrn": "MRN-2026-1006",
    "age": 25,
    "gender": "Male",
    "date": "2026-09-06",
    "diagnosis": "Mild Gastritis",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10070",
    "patient_id": "p-1007",
    "patient_name": "Sneha Choudhary",
    "mrn": "MRN-2026-1007",
    "age": 29,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10071",
    "patient_id": "p-1007",
    "patient_name": "Sneha Choudhary",
    "mrn": "MRN-2026-1007",
    "age": 29,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10080",
    "patient_id": "p-1008",
    "patient_name": "Jyoti Dubey",
    "mrn": "MRN-2026-1008",
    "age": 39,
    "gender": "Female",
    "date": "2026-09-05",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10081",
    "patient_id": "p-1008",
    "patient_name": "Jyoti Dubey",
    "mrn": "MRN-2026-1008",
    "age": 39,
    "gender": "Female",
    "date": "2026-09-08",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10090",
    "patient_id": "p-1009",
    "patient_name": "Prakash Goyal",
    "mrn": "MRN-2026-1009",
    "age": 31,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10100",
    "patient_id": "p-1010",
    "patient_name": "Myra Pandey",
    "mrn": "MRN-2026-1010",
    "age": 21,
    "gender": "Female",
    "date": "2026-09-18",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10110",
    "patient_id": "p-1011",
    "patient_name": "Keshav Yadav",
    "mrn": "MRN-2026-1011",
    "age": 28,
    "gender": "Male",
    "date": "2026-09-17",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10111",
    "patient_id": "p-1011",
    "patient_name": "Keshav Yadav",
    "mrn": "MRN-2026-1011",
    "age": 28,
    "gender": "Male",
    "date": "2026-09-06",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10120",
    "patient_id": "p-1012",
    "patient_name": "Reyansh Choudhary",
    "mrn": "MRN-2026-1012",
    "age": 35,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10130",
    "patient_id": "p-1013",
    "patient_name": "Ayaan Patil",
    "mrn": "MRN-2026-1013",
    "age": 20,
    "gender": "Male",
    "date": "2026-09-03",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10131",
    "patient_id": "p-1013",
    "patient_name": "Ayaan Patil",
    "mrn": "MRN-2026-1013",
    "age": 20,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10140",
    "patient_id": "p-1014",
    "patient_name": "Krishna Mishra",
    "mrn": "MRN-2026-1014",
    "age": 24,
    "gender": "Male",
    "date": "2026-09-10",
    "diagnosis": "Myalgia",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10150",
    "patient_id": "p-1015",
    "patient_name": "Vandana Yadav",
    "mrn": "MRN-2026-1015",
    "age": 35,
    "gender": "Female",
    "date": "2026-09-11",
    "diagnosis": "General Wellness",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10160",
    "patient_id": "p-1016",
    "patient_name": "Shobha Mittal",
    "mrn": "MRN-2026-1016",
    "age": 21,
    "gender": "Female",
    "date": "2026-09-02",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10170",
    "patient_id": "p-1017",
    "patient_name": "Arjun Dutta",
    "mrn": "MRN-2026-1017",
    "age": 40,
    "gender": "Male",
    "date": "2026-09-14",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10171",
    "patient_id": "p-1017",
    "patient_name": "Arjun Dutta",
    "mrn": "MRN-2026-1017",
    "age": 40,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10180",
    "patient_id": "p-1018",
    "patient_name": "Vandana Gaekwad",
    "mrn": "MRN-2026-1018",
    "age": 32,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10190",
    "patient_id": "p-1019",
    "patient_name": "Reyansh Singhal",
    "mrn": "MRN-2026-1019",
    "age": 36,
    "gender": "Male",
    "date": "2026-09-15",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10191",
    "patient_id": "p-1019",
    "patient_name": "Reyansh Singhal",
    "mrn": "MRN-2026-1019",
    "age": 36,
    "gender": "Male",
    "date": "2026-09-08",
    "diagnosis": "Seasonal Flu",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10200",
    "patient_id": "p-1020",
    "patient_name": "Arjun Bose",
    "mrn": "MRN-2026-1020",
    "age": 39,
    "gender": "Male",
    "date": "2026-09-14",
    "diagnosis": "General Wellness",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10210",
    "patient_id": "p-1021",
    "patient_name": "Pranav Chavan",
    "mrn": "MRN-2026-1021",
    "age": 31,
    "gender": "Male",
    "date": "2026-09-14",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10211",
    "patient_id": "p-1021",
    "patient_name": "Pranav Chavan",
    "mrn": "MRN-2026-1021",
    "age": 31,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10220",
    "patient_id": "p-1022",
    "patient_name": "Rahul Iyengar",
    "mrn": "MRN-2026-1022",
    "age": 25,
    "gender": "Male",
    "date": "2026-09-16",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10230",
    "patient_id": "p-1023",
    "patient_name": "Kiran Gupta",
    "mrn": "MRN-2026-1023",
    "age": 21,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10240",
    "patient_id": "p-1024",
    "patient_name": "Jyoti Singhal",
    "mrn": "MRN-2026-1024",
    "age": 21,
    "gender": "Female",
    "date": "2026-09-08",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10241",
    "patient_id": "p-1024",
    "patient_name": "Jyoti Singhal",
    "mrn": "MRN-2026-1024",
    "age": 21,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10250",
    "patient_id": "p-1025",
    "patient_name": "Vandana Yadav",
    "mrn": "MRN-2026-1025",
    "age": 29,
    "gender": "Female",
    "date": "2026-09-18",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10260",
    "patient_id": "p-1026",
    "patient_name": "Neha Iyer",
    "mrn": "MRN-2026-1026",
    "age": 26,
    "gender": "Female",
    "date": "2026-09-18",
    "diagnosis": "Mild Gastritis",
    "medications": [
      {
        "medication": "Paracetamol 500mg",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10270",
    "patient_id": "p-1027",
    "patient_name": "Vandana Menon",
    "mrn": "MRN-2026-1027",
    "age": 22,
    "gender": "Female",
    "date": "2026-09-11",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Paracetamol 500mg",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10280",
    "patient_id": "p-1028",
    "patient_name": "Sarita Goyal",
    "mrn": "MRN-2026-1028",
    "age": 20,
    "gender": "Female",
    "date": "2026-09-11",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10290",
    "patient_id": "p-1029",
    "patient_name": "Ashok Goyal",
    "mrn": "MRN-2026-1029",
    "age": 33,
    "gender": "Male",
    "date": "2026-09-03",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10300",
    "patient_id": "p-1030",
    "patient_name": "Rakesh Iyengar",
    "mrn": "MRN-2026-1030",
    "age": 30,
    "gender": "Male",
    "date": "2026-09-10",
    "diagnosis": "Myalgia",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10310",
    "patient_id": "p-1031",
    "patient_name": "Aadhya Deshpande",
    "mrn": "MRN-2026-1031",
    "age": 26,
    "gender": "Female",
    "date": "2026-09-06",
    "diagnosis": "General Wellness",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10320",
    "patient_id": "p-1032",
    "patient_name": "Atharv Shinde",
    "mrn": "MRN-2026-1032",
    "age": 42,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10330",
    "patient_id": "p-1033",
    "patient_name": "Sanjay Mittal",
    "mrn": "MRN-2026-1033",
    "age": 33,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Mild Gastritis",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10340",
    "patient_id": "p-1034",
    "patient_name": "Sneha Rao",
    "mrn": "MRN-2026-1034",
    "age": 39,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10350",
    "patient_id": "p-1035",
    "patient_name": "Neha Patel",
    "mrn": "MRN-2026-1035",
    "age": 32,
    "gender": "Female",
    "date": "2026-09-07",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10351",
    "patient_id": "p-1035",
    "patient_name": "Neha Patel",
    "mrn": "MRN-2026-1035",
    "age": 32,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10360",
    "patient_id": "p-1036",
    "patient_name": "Swati Sharma",
    "mrn": "MRN-2026-1036",
    "age": 32,
    "gender": "Female",
    "date": "2026-09-17",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10361",
    "patient_id": "p-1036",
    "patient_name": "Swati Sharma",
    "mrn": "MRN-2026-1036",
    "age": 32,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10370",
    "patient_id": "p-1037",
    "patient_name": "Vikram Chavan",
    "mrn": "MRN-2026-1037",
    "age": 23,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10371",
    "patient_id": "p-1037",
    "patient_name": "Vikram Chavan",
    "mrn": "MRN-2026-1037",
    "age": 23,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Vitamin D3 60k",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10380",
    "patient_id": "p-1038",
    "patient_name": "Rohan Shah",
    "mrn": "MRN-2026-1038",
    "age": 44,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Myalgia",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10381",
    "patient_id": "p-1038",
    "patient_name": "Rohan Shah",
    "mrn": "MRN-2026-1038",
    "age": 44,
    "gender": "Male",
    "date": "2026-09-17",
    "diagnosis": "Myalgia",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10390",
    "patient_id": "p-1039",
    "patient_name": "Dolly Gupta",
    "mrn": "MRN-2026-1039",
    "age": 35,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10400",
    "patient_id": "p-1040",
    "patient_name": "Ira Iyengar",
    "mrn": "MRN-2026-1040",
    "age": 26,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "Myalgia",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10410",
    "patient_id": "p-1041",
    "patient_name": "Aaryan Iyengar",
    "mrn": "MRN-2026-1041",
    "age": 43,
    "gender": "Male",
    "date": "2026-09-17",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10420",
    "patient_id": "p-1042",
    "patient_name": "Shobha Singhal",
    "mrn": "MRN-2026-1042",
    "age": 23,
    "gender": "Female",
    "date": "2026-09-06",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10421",
    "patient_id": "p-1042",
    "patient_name": "Shobha Singhal",
    "mrn": "MRN-2026-1042",
    "age": 23,
    "gender": "Female",
    "date": "2026-09-16",
    "diagnosis": "Mild Vitamin D Deficiency",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10430",
    "patient_id": "p-1043",
    "patient_name": "Ekta Singhal",
    "mrn": "MRN-2026-1043",
    "age": 43,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "Allergic Rhinitis",
    "medications": [
      {
        "medication": "Antacid Syrup",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10440",
    "patient_id": "p-1044",
    "patient_name": "Anita Joshi",
    "mrn": "MRN-2026-1044",
    "age": 23,
    "gender": "Female",
    "date": "2026-09-03",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin Therapeutic",
        "dosage": "1 Cap",
        "frequency": "1-0-0 after food",
        "duration_days": 15,
        "instructions": "Take in the morning."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10450",
    "patient_id": "p-1045",
    "patient_name": "Anita Sen",
    "mrn": "MRN-2026-1045",
    "age": 20,
    "gender": "Female",
    "date": "2026-09-16",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10451",
    "patient_id": "p-1045",
    "patient_name": "Anita Sen",
    "mrn": "MRN-2026-1045",
    "age": 20,
    "gender": "Female",
    "date": "2026-09-01",
    "diagnosis": "General Outpatient",
    "medications": [
      {
        "medication": "Multivitamin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 7,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10460",
    "patient_id": "p-1046",
    "patient_name": "Rohan Upadhyay",
    "mrn": "MRN-2026-1046",
    "age": 55,
    "gender": "Male",
    "date": "2026-09-06",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10461",
    "patient_id": "p-1046",
    "patient_name": "Rohan Upadhyay",
    "mrn": "MRN-2026-1046",
    "age": 55,
    "gender": "Male",
    "date": "2026-09-15",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10470",
    "patient_id": "p-1047",
    "patient_name": "Harish Sen",
    "mrn": "MRN-2026-1047",
    "age": 60,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10471",
    "patient_id": "p-1047",
    "patient_name": "Harish Sen",
    "mrn": "MRN-2026-1047",
    "age": 60,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10480",
    "patient_id": "p-1048",
    "patient_name": "Anita Upadhyay",
    "mrn": "MRN-2026-1048",
    "age": 55,
    "gender": "Female",
    "date": "2026-09-01",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10490",
    "patient_id": "p-1049",
    "patient_name": "Advik Verma",
    "mrn": "MRN-2026-1049",
    "age": 46,
    "gender": "Male",
    "date": "2026-09-06",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10500",
    "patient_id": "p-1050",
    "patient_name": "Reyansh Singh",
    "mrn": "MRN-2026-1050",
    "age": 60,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10501",
    "patient_id": "p-1050",
    "patient_name": "Reyansh Singh",
    "mrn": "MRN-2026-1050",
    "age": 60,
    "gender": "Male",
    "date": "2026-09-02",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10510",
    "patient_id": "p-1051",
    "patient_name": "Swati Mishra",
    "mrn": "MRN-2026-1051",
    "age": 58,
    "gender": "Female",
    "date": "2026-09-14",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10520",
    "patient_id": "p-1052",
    "patient_name": "Usha Yadav",
    "mrn": "MRN-2026-1052",
    "age": 59,
    "gender": "Female",
    "date": "2026-09-15",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10521",
    "patient_id": "p-1052",
    "patient_name": "Usha Yadav",
    "mrn": "MRN-2026-1052",
    "age": 59,
    "gender": "Female",
    "date": "2026-09-08",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10530",
    "patient_id": "p-1053",
    "patient_name": "Dinesh Kumar",
    "mrn": "MRN-2026-1053",
    "age": 42,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10531",
    "patient_id": "p-1053",
    "patient_name": "Dinesh Kumar",
    "mrn": "MRN-2026-1053",
    "age": 42,
    "gender": "Male",
    "date": "2026-09-01",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10540",
    "patient_id": "p-1054",
    "patient_name": "Advik Nair",
    "mrn": "MRN-2026-1054",
    "age": 55,
    "gender": "Male",
    "date": "2026-09-08",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10541",
    "patient_id": "p-1054",
    "patient_name": "Advik Nair",
    "mrn": "MRN-2026-1054",
    "age": 55,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10550",
    "patient_id": "p-1055",
    "patient_name": "Rohan Mishra",
    "mrn": "MRN-2026-1055",
    "age": 59,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10560",
    "patient_id": "p-1056",
    "patient_name": "Vikram Pillai",
    "mrn": "MRN-2026-1056",
    "age": 48,
    "gender": "Male",
    "date": "2026-09-01",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10561",
    "patient_id": "p-1056",
    "patient_name": "Vikram Pillai",
    "mrn": "MRN-2026-1056",
    "age": 48,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10570",
    "patient_id": "p-1057",
    "patient_name": "Aadhya Reddy",
    "mrn": "MRN-2026-1057",
    "age": 46,
    "gender": "Female",
    "date": "2026-09-04",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10571",
    "patient_id": "p-1057",
    "patient_name": "Aadhya Reddy",
    "mrn": "MRN-2026-1057",
    "age": 46,
    "gender": "Female",
    "date": "2026-09-03",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10580",
    "patient_id": "p-1058",
    "patient_name": "Ananya Roy",
    "mrn": "MRN-2026-1058",
    "age": 46,
    "gender": "Female",
    "date": "2026-09-15",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10581",
    "patient_id": "p-1058",
    "patient_name": "Ananya Roy",
    "mrn": "MRN-2026-1058",
    "age": 46,
    "gender": "Female",
    "date": "2026-09-15",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10590",
    "patient_id": "p-1059",
    "patient_name": "Kiran Gaekwad",
    "mrn": "MRN-2026-1059",
    "age": 61,
    "gender": "Female",
    "date": "2026-09-06",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10600",
    "patient_id": "p-1060",
    "patient_name": "Shobha Rao",
    "mrn": "MRN-2026-1060",
    "age": 55,
    "gender": "Female",
    "date": "2026-09-15",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10601",
    "patient_id": "p-1060",
    "patient_name": "Shobha Rao",
    "mrn": "MRN-2026-1060",
    "age": 55,
    "gender": "Female",
    "date": "2026-09-03",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10610",
    "patient_id": "p-1061",
    "patient_name": "Dhruv Choudhary",
    "mrn": "MRN-2026-1061",
    "age": 45,
    "gender": "Male",
    "date": "2026-09-10",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10611",
    "patient_id": "p-1061",
    "patient_name": "Dhruv Choudhary",
    "mrn": "MRN-2026-1061",
    "age": 45,
    "gender": "Male",
    "date": "2026-09-15",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10620",
    "patient_id": "p-1062",
    "patient_name": "Archana Desai",
    "mrn": "MRN-2026-1062",
    "age": 58,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10630",
    "patient_id": "p-1063",
    "patient_name": "Madhav Upadhyay",
    "mrn": "MRN-2026-1063",
    "age": 58,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10631",
    "patient_id": "p-1063",
    "patient_name": "Madhav Upadhyay",
    "mrn": "MRN-2026-1063",
    "age": 58,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10640",
    "patient_id": "p-1064",
    "patient_name": "Shaurya Kulkarni",
    "mrn": "MRN-2026-1064",
    "age": 57,
    "gender": "Male",
    "date": "2026-09-17",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10641",
    "patient_id": "p-1064",
    "patient_name": "Shaurya Kulkarni",
    "mrn": "MRN-2026-1064",
    "age": 57,
    "gender": "Male",
    "date": "2026-09-01",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10650",
    "patient_id": "p-1065",
    "patient_name": "Prakash Chatterjee",
    "mrn": "MRN-2026-1065",
    "age": 48,
    "gender": "Male",
    "date": "2026-09-16",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10651",
    "patient_id": "p-1065",
    "patient_name": "Prakash Chatterjee",
    "mrn": "MRN-2026-1065",
    "age": 48,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10660",
    "patient_id": "p-1066",
    "patient_name": "Sarita Kaur",
    "mrn": "MRN-2026-1066",
    "age": 47,
    "gender": "Female",
    "date": "2026-09-16",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10670",
    "patient_id": "p-1067",
    "patient_name": "Rudra Dutta",
    "mrn": "MRN-2026-1067",
    "age": 57,
    "gender": "Male",
    "date": "2026-09-14",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10671",
    "patient_id": "p-1067",
    "patient_name": "Rudra Dutta",
    "mrn": "MRN-2026-1067",
    "age": 57,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10680",
    "patient_id": "p-1068",
    "patient_name": "Naveen Mehta",
    "mrn": "MRN-2026-1068",
    "age": 65,
    "gender": "Male",
    "date": "2026-09-15",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10681",
    "patient_id": "p-1068",
    "patient_name": "Naveen Mehta",
    "mrn": "MRN-2026-1068",
    "age": 65,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10690",
    "patient_id": "p-1069",
    "patient_name": "Rakesh Singhal",
    "mrn": "MRN-2026-1069",
    "age": 55,
    "gender": "Male",
    "date": "2026-09-16",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10700",
    "patient_id": "p-1070",
    "patient_name": "Krishna Dutta",
    "mrn": "MRN-2026-1070",
    "age": 56,
    "gender": "Male",
    "date": "2026-09-03",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10710",
    "patient_id": "p-1071",
    "patient_name": "Neha Kulkarni",
    "mrn": "MRN-2026-1071",
    "age": 44,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "Osteoarthritis",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10720",
    "patient_id": "p-1072",
    "patient_name": "Gopal Nair",
    "mrn": "MRN-2026-1072",
    "age": 62,
    "gender": "Male",
    "date": "2026-09-10",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10730",
    "patient_id": "p-1073",
    "patient_name": "Swati Iyengar",
    "mrn": "MRN-2026-1073",
    "age": 55,
    "gender": "Female",
    "date": "2026-09-05",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10731",
    "patient_id": "p-1073",
    "patient_name": "Swati Iyengar",
    "mrn": "MRN-2026-1073",
    "age": 55,
    "gender": "Female",
    "date": "2026-09-08",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10740",
    "patient_id": "p-1074",
    "patient_name": "Neha Chatterjee",
    "mrn": "MRN-2026-1074",
    "age": 42,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10741",
    "patient_id": "p-1074",
    "patient_name": "Neha Chatterjee",
    "mrn": "MRN-2026-1074",
    "age": 42,
    "gender": "Female",
    "date": "2026-09-15",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10750",
    "patient_id": "p-1075",
    "patient_name": "Advik Pawar",
    "mrn": "MRN-2026-1075",
    "age": 49,
    "gender": "Male",
    "date": "2026-09-09",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10751",
    "patient_id": "p-1075",
    "patient_name": "Advik Pawar",
    "mrn": "MRN-2026-1075",
    "age": 49,
    "gender": "Male",
    "date": "2026-09-01",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10760",
    "patient_id": "p-1076",
    "patient_name": "Santosh Pathak",
    "mrn": "MRN-2026-1076",
    "age": 65,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10770",
    "patient_id": "p-1077",
    "patient_name": "Vinod Patel",
    "mrn": "MRN-2026-1077",
    "age": 56,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10780",
    "patient_id": "p-1078",
    "patient_name": "Asha Patil",
    "mrn": "MRN-2026-1078",
    "age": 47,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "GERD",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10790",
    "patient_id": "p-1079",
    "patient_name": "Mahesh Patil",
    "mrn": "MRN-2026-1079",
    "age": 54,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10791",
    "patient_id": "p-1079",
    "patient_name": "Mahesh Patil",
    "mrn": "MRN-2026-1079",
    "age": 54,
    "gender": "Male",
    "date": "2026-09-12",
    "diagnosis": "Hyperlipidemia",
    "medications": [
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10800",
    "patient_id": "p-1080",
    "patient_name": "Shruti Banerjee",
    "mrn": "MRN-2026-1080",
    "age": 59,
    "gender": "Female",
    "date": "2026-09-02",
    "diagnosis": "Hypothyroidism",
    "medications": [
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10810",
    "patient_id": "p-1081",
    "patient_name": "Rohan Mukherjee",
    "mrn": "MRN-2026-1081",
    "age": 65,
    "gender": "Male",
    "date": "2026-09-14",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10811",
    "patient_id": "p-1081",
    "patient_name": "Rohan Mukherjee",
    "mrn": "MRN-2026-1081",
    "age": 65,
    "gender": "Male",
    "date": "2026-09-09",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10820",
    "patient_id": "p-1082",
    "patient_name": "Sita Bansal",
    "mrn": "MRN-2026-1082",
    "age": 65,
    "gender": "Female",
    "date": "2026-09-01",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10830",
    "patient_id": "p-1083",
    "patient_name": "Anita Singhal",
    "mrn": "MRN-2026-1083",
    "age": 76,
    "gender": "Female",
    "date": "2026-09-05",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10831",
    "patient_id": "p-1083",
    "patient_name": "Anita Singhal",
    "mrn": "MRN-2026-1083",
    "age": 76,
    "gender": "Female",
    "date": "2026-09-05",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10840",
    "patient_id": "p-1084",
    "patient_name": "Atharv Pillai",
    "mrn": "MRN-2026-1084",
    "age": 58,
    "gender": "Male",
    "date": "2026-09-03",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10850",
    "patient_id": "p-1085",
    "patient_name": "Farida Patil",
    "mrn": "MRN-2026-1085",
    "age": 74,
    "gender": "Female",
    "date": "2026-09-16",
    "diagnosis": "Atrial Fibrillation",
    "medications": [
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10860",
    "patient_id": "p-1086",
    "patient_name": "Manoj Rao",
    "mrn": "MRN-2026-1086",
    "age": 77,
    "gender": "Male",
    "date": "2026-09-18",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10870",
    "patient_id": "p-1087",
    "patient_name": "Pranav Gaekwad",
    "mrn": "MRN-2026-1087",
    "age": 71,
    "gender": "Male",
    "date": "2026-09-16",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10880",
    "patient_id": "p-1088",
    "patient_name": "Pari Nair",
    "mrn": "MRN-2026-1088",
    "age": 81,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10890",
    "patient_id": "p-1089",
    "patient_name": "Suresh Menon",
    "mrn": "MRN-2026-1089",
    "age": 79,
    "gender": "Male",
    "date": "2026-09-09",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10900",
    "patient_id": "p-1090",
    "patient_name": "Sneha Tiwari",
    "mrn": "MRN-2026-1090",
    "age": 69,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10910",
    "patient_id": "p-1091",
    "patient_name": "Anita Gupta",
    "mrn": "MRN-2026-1091",
    "age": 81,
    "gender": "Female",
    "date": "2026-09-09",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Montelukast",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10920",
    "patient_id": "p-1092",
    "patient_name": "Swati Mukherjee",
    "mrn": "MRN-2026-1092",
    "age": 66,
    "gender": "Female",
    "date": "2026-09-17",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10921",
    "patient_id": "p-1092",
    "patient_name": "Swati Mukherjee",
    "mrn": "MRN-2026-1092",
    "age": 66,
    "gender": "Female",
    "date": "2026-09-10",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10930",
    "patient_id": "p-1093",
    "patient_name": "Meera Kaur",
    "mrn": "MRN-2026-1093",
    "age": 64,
    "gender": "Female",
    "date": "2026-09-13",
    "diagnosis": "Type 2 Diabetes Mellitus",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10940",
    "patient_id": "p-1094",
    "patient_name": "Advaith Dutta",
    "mrn": "MRN-2026-1094",
    "age": 70,
    "gender": "Male",
    "date": "2026-09-04",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10941",
    "patient_id": "p-1094",
    "patient_name": "Advaith Dutta",
    "mrn": "MRN-2026-1094",
    "age": 70,
    "gender": "Male",
    "date": "2026-09-13",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10950",
    "patient_id": "p-1095",
    "patient_name": "Sunita Gupta",
    "mrn": "MRN-2026-1095",
    "age": 80,
    "gender": "Female",
    "date": "2026-09-11",
    "diagnosis": "Coronary Artery Disease",
    "medications": [
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Glimepiride",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10960",
    "patient_id": "p-1096",
    "patient_name": "Arjun Dutta",
    "mrn": "MRN-2026-1096",
    "age": 74,
    "gender": "Male",
    "date": "2026-09-03",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Atorvastatin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Paracetamol",
        "dosage": "500mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10970",
    "patient_id": "p-1097",
    "patient_name": "Farida Choudhary",
    "mrn": "MRN-2026-1097",
    "age": 82,
    "gender": "Female",
    "date": "2026-09-02",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10971",
    "patient_id": "p-1097",
    "patient_name": "Farida Choudhary",
    "mrn": "MRN-2026-1097",
    "age": 82,
    "gender": "Female",
    "date": "2026-09-12",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Telmisartan",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Ramipril",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10980",
    "patient_id": "p-1098",
    "patient_name": "Rohan Chatterjee",
    "mrn": "MRN-2026-1098",
    "age": 59,
    "gender": "Male",
    "date": "2026-09-07",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10981",
    "patient_id": "p-1098",
    "patient_name": "Rohan Chatterjee",
    "mrn": "MRN-2026-1098",
    "age": 59,
    "gender": "Male",
    "date": "2026-09-11",
    "diagnosis": "Heart Failure (NYHA II)",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Amlodipine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-10990",
    "patient_id": "p-1099",
    "patient_name": "Naveen Iyengar",
    "mrn": "MRN-2026-1099",
    "age": 61,
    "gender": "Male",
    "date": "2026-09-12",
    "diagnosis": "COPD",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-10991",
    "patient_id": "p-1099",
    "patient_name": "Naveen Iyengar",
    "mrn": "MRN-2026-1099",
    "age": 61,
    "gender": "Male",
    "date": "2026-09-10",
    "diagnosis": "COPD",
    "medications": [
      {
        "medication": "Dapagliflozin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Sitagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "anomaly_flagged"
  },
  {
    "id": "rx-11000",
    "patient_id": "p-1100",
    "patient_name": "Farida Kulkarni",
    "mrn": "MRN-2026-1100",
    "age": 78,
    "gender": "Female",
    "date": "2026-09-03",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  },
  {
    "id": "rx-11001",
    "patient_id": "p-1100",
    "patient_name": "Farida Kulkarni",
    "mrn": "MRN-2026-1100",
    "age": 78,
    "gender": "Female",
    "date": "2026-09-05",
    "diagnosis": "Essential Hypertension",
    "medications": [
      {
        "medication": "Cetirizine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Levothyroxine",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Pantoprazole",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Vildagliptin",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      },
      {
        "medication": "Metoprolol",
        "dosage": "5mg",
        "frequency": "1-0-1 after food",
        "duration_days": 30,
        "instructions": "Take with water after meals."
      }
    ],
    "status": "active",
    "risk_status": "normal"
  }
];
