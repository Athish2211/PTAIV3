'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'doctor' | 'admin'

export interface PatientRecord {
  id: string
  name: string
  deidentified_id: string
  mrn: string
  age: number
  age_bracket: string
  gender: string
  phone?: string
  email?: string
  city?: string
  blood_group?: string
  allergies: string[]
  chronic_conditions: string[]
  active_medications?: string[]
  last_visit: string
  risk_level: 'Low' | 'Moderate' | 'High'
  notes?: string
}

export interface PrescriptionRecord {
  id: string
  patient_id?: string
  patient_name: string
  mrn: string
  age: number | string
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
  status: 'active' | 'dispensed' | 'flagged'
  risk_status: 'normal' | 'anomaly_flagged'
}

interface PatientContextType {
  id: string
  name: string
  mrn: string
  age: number
  gender: string
  diagnosis?: string
  notes?: string
  allergies?: string[]
}

const DEFAULT_PATIENTS: PatientRecord[] = []

const DEFAULT_PRESCRIPTIONS: PrescriptionRecord[] = []

/**
 * V2-inspired clinical risk scoring engine.
 * Score 0-2 = Low, 3-5 = Moderate, 6+ = High
 */
export function computeRiskLevel(
  patient: Omit<PatientRecord, 'risk_level'> & { risk_level?: string },
  prescriptions: PrescriptionRecord[]
): 'Low' | 'Moderate' | 'High' {
  let score = 0

  // Age-based risk
  const age = typeof patient.age === 'number' ? patient.age : parseInt(String(patient.age)) || 0
  if (age >= 65) score += 2
  else if (age >= 50) score += 1

  // Chronic condition burden
  const condCount = (patient.chronic_conditions || []).filter(
    (c) => c && c.toLowerCase() !== 'newly registered patient profile' &&
           c.toLowerCase() !== 'outpatient clinical profile' &&
           c.toLowerCase() !== 'known vector clinical profile'
  ).length
  if (condCount >= 5) score += 3
  else if (condCount >= 3) score += 2
  else if (condCount >= 1) score += 1

  // Allergy burden
  const allergyCount = (patient.allergies || []).filter(
    (a) => a && a.toUpperCase() !== 'NKDA' && a.toLowerCase() !== 'no known drug allergies' && a.trim() !== ''
  ).length
  if (allergyCount >= 3) score += 1

  // Active medications polypharmacy
  const activeMeds = (patient as any).active_medications?.length || 0
  if (activeMeds >= 5) score += 2

  // Prescription-level signals & Dynamic Allergy Conflict Detection
  const patientRxs = prescriptions.filter(
    (rx) => rx.patient_id === patient.id || rx.mrn === patient.mrn
  )

  const allergyClasses: Record<string, string[]> = {
    'penicillin': ['cillin', 'augmentin'],
    'cephalosporin': ['cef', 'ceph'],
    'sulfa': ['sulfa', 'bactrim', 'septra'],
    'nsaid': ['ibuprofen', 'naproxen', 'diclofenac', 'ketorolac', 'meloxicam', 'aspirin'],
    'opioid': ['morphine', 'codeine', 'hydrocodone', 'oxycodone', 'fentanyl', 'tramadol']
  };

  patientRxs.forEach((rx) => {
    if (rx.medications && rx.medications.length >= 4) score += 1
    if ((rx as any).risk_status === 'anomaly_flagged' || (rx as any).status === 'flagged') score += 3

    // Dynamic Cross-Reactivity Check
    if (rx.medications && patient.allergies && patient.allergies.length > 0) {
      rx.medications.forEach(med => {
        const drug = med.medication.toLowerCase();
        patient.allergies.forEach(allergy => {
          const alg = allergy.toLowerCase();
          if (alg === 'nkda' || alg.includes('no known')) return;
          
          // Direct match
          if (drug.includes(alg)) {
            score += 3; // +3 automatically pushes to at least Moderate
          } else {
            // Class-based cross-reactivity match
            for (const [algClass, members] of Object.entries(allergyClasses)) {
              if (alg.includes(algClass) && members.some(m => drug.includes(m))) {
                score += 3; // Push to Moderate risk
                break;
              }
            }
          }
        });
      });
    }
  })

  if (score >= 6) return 'High'
  if (score >= 3) return 'Moderate'
  return 'Low'
}

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  toggleRole: () => void
  activePatient: PatientContextType | null
  setActivePatient: (patient: PatientContextType | null) => void
  handoffToPrescription: (patient: PatientContextType) => void
  isDeIdentified: boolean
  patients: PatientRecord[]
  addPatient: (patient: PatientRecord) => void
  deletePatient: (id: string) => void
  getPatient: (id: string) => PatientRecord | undefined
  prescriptions: PrescriptionRecord[]
  addPrescription: (prescription: PrescriptionRecord) => void
  deletePrescription: (id: string) => void
  clearAllData: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

const CLEAN_SLATE_KEY = 'ptai_v3_clean_slate_zero_mock_v1'

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('doctor')
  const [activePatient, setActivePatient] = useState<PatientContextType | null>(null)
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([])

  useEffect(() => {
    // Role selection
    const savedRole = localStorage.getItem('ptai_active_role') as UserRole
    if (savedRole === 'doctor' || savedRole === 'admin') {
      setRoleState(savedRole)
    }

    // Clean slate migration: automatically wipe out stale mock data from previous sessions
    const hasCleared = localStorage.getItem(CLEAN_SLATE_KEY)
    if (!hasCleared) {
      localStorage.removeItem('ptai_patients')
      localStorage.removeItem('ptai_prescriptions')
      localStorage.setItem(CLEAN_SLATE_KEY, 'true')
      setPatients([])
      setPrescriptions([])
      return
    }


    const savedPrescriptions = localStorage.getItem('ptai_prescriptions')
    let loadedRxs: PrescriptionRecord[] = []
    if (savedPrescriptions) {
      try {
        const parsed = JSON.parse(savedPrescriptions)
        if (Array.isArray(parsed)) {
          loadedRxs = parsed
          setPrescriptions(parsed)
        }
      } catch (e) {
        console.error('Failed to parse cached prescriptions', e)
      }
    }

    const savedPatients = localStorage.getItem('ptai_patients')
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients)
        if (Array.isArray(parsed)) {
          // Recompute risk for every loaded patient using their prescriptions
          const reScored = parsed.map((p: PatientRecord) => ({
            ...p,
            risk_level: computeRiskLevel(p, loadedRxs),
          }))
          setPatients(reScored)
          localStorage.setItem('ptai_patients', JSON.stringify(reScored))
        }
      } catch (e) {
        console.error('Failed to parse cached patients', e)
      }
    }
  }, [])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem('ptai_active_role', newRole)
  }

  const toggleRole = () => {
    const next = role === 'doctor' ? 'admin' : 'doctor'
    setRole(next)
  }

  const handoffToPrescription = (patient: PatientContextType) => {
    setActivePatient(patient)
  }

  const addPatient = (newPatient: PatientRecord) => {
    setPatients((prev) => {
      const withRisk: PatientRecord = {
        ...newPatient,
        risk_level: computeRiskLevel(newPatient, prescriptions),
      }
      const updated = [withRisk, ...prev.filter((p) => p.id !== newPatient.id)]
      localStorage.setItem('ptai_patients', JSON.stringify(updated))
      return updated
    })
  }

  const deletePatient = (id: string) => {
    setPatients((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem('ptai_patients', JSON.stringify(updated))
      return updated
    })
  }

  const getPatient = (id: string) => {
    return patients.find((p) => p.id === id || p.mrn === id || p.deidentified_id === id)
  }

  const addPrescription = (newRx: PrescriptionRecord) => {
    setPrescriptions((prev) => {
      const updatedRxs = [newRx, ...prev.filter((r) => r.id !== newRx.id)]
      localStorage.setItem('ptai_prescriptions', JSON.stringify(updatedRxs))

      // Re-stratify the linked patient's risk level with this new prescription
      if (newRx.patient_id || newRx.mrn) {
        setPatients((prevPatients) => {
          const updatedPatients = prevPatients.map((p) => {
            const isLinked = (newRx.patient_id && p.id === newRx.patient_id) || p.mrn === newRx.mrn
            if (!isLinked) return p
            return { ...p, risk_level: computeRiskLevel(p, updatedRxs) }
          })
          localStorage.setItem('ptai_patients', JSON.stringify(updatedPatients))
          return updatedPatients
        })
      }

      return updatedRxs
    })
  }

  const deletePrescription = (id: string) => {
    setPrescriptions((prev) => {
      const updated = prev.filter((r) => r.id !== id)
      localStorage.setItem('ptai_prescriptions', JSON.stringify(updated))
      return updated
    })
  }

  const clearAllData = () => {
    localStorage.removeItem('ptai_patients')
    localStorage.removeItem('ptai_prescriptions')
    localStorage.setItem(CLEAN_SLATE_KEY, 'true')
    setPatients([])
    setPrescriptions([])
    setActivePatient(null)
  }

  const isDeIdentified = role === 'admin'

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        activePatient,
        setActivePatient,
        handoffToPrescription,
        isDeIdentified,
        patients,
        addPatient,
        deletePatient,
        getPatient,
        prescriptions,
        addPrescription,
        deletePrescription,
        clearAllData,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}

