'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { SEED_PATIENTS_100, SEED_PRESCRIPTIONS_100 } from '@/data/seedData'

export type UserRole = 'doctor' | 'admin'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  specialization?: string
  license_number?: string
  department?: string
  organization?: string
  created_at?: string
  password?: string
}

export const DEMO_DOCTOR: UserProfile = {
  id: 'doc-demo',
  name: 'Dr. Dinesh Kumar',
  email: 'dr.dinesh@ptai-health.org',
  role: 'doctor',
  specialization: 'Attending Physician / General Medicine',
  license_number: 'MCI-2026-98421',
  password: 'clinical-secure-demo',
  organization: 'PTAI Metro Academic Medical Center',
}

export const DEMO_ADMIN: UserProfile = {
  id: 'admin-demo',
  name: 'Dr. Sarah Connor',
  email: 'admin@ptai-health.org',
  role: 'admin',
  department: 'Chief Medical Officer & Analytics Governance',
  password: 'admin-secure-demo',
  organization: 'PTAI Health System Analytics Division',
}

export interface PatientRecord {
  id: string
  doctor_id?: string
  doctor_name?: string
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
  doctor_id?: string
  doctor_name?: string
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

  // Prescription-level signals & Risk flags
  const patientRxs = prescriptions.filter(
    (rx) => rx.patient_id === patient.id || rx.mrn === patient.mrn
  )

  patientRxs.forEach((rx) => {
    if (rx.medications && rx.medications.length >= 4) score += 1
    if ((rx as any).risk_status === 'anomaly_flagged' || (rx as any).status === 'flagged') score += 3
    if ((rx as any).risk_status === 'high_risk') score += 4
  })

  if (score >= 6) return 'High'
  if (score >= 3) return 'Moderate'
  return 'Low'
}

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  toggleRole: () => void
  currentUser: UserProfile | null
  setCurrentUser: (user: UserProfile | null) => void
  users: UserProfile[]
  registerUser: (userData: {
    name: string
    email: string
    role: UserRole
    password?: string
    specialization?: string
    license_number?: string
    department?: string
    organization?: string
  }) => UserProfile
  loginUser: (user: UserProfile) => void
  logoutUser: () => void
  switchUser: (userId: string) => void
  allDoctors: {
    id: string
    name: string
    email: string
    specialization?: string
    license_number?: string
    patientCount: number
  }[]
  activePatient: PatientContextType | null
  setActivePatient: (patient: PatientContextType | null) => void
  handoffToPrescription: (patient: PatientContextType) => void
  isDeIdentified: boolean
  patients: PatientRecord[]
  allPatients: PatientRecord[]
  addPatient: (patient: PatientRecord) => void
  deletePatient: (id: string) => void
  getPatient: (id: string) => PatientRecord | undefined
  prescriptions: PrescriptionRecord[]
  allPrescriptions: PrescriptionRecord[]
  addPrescription: (prescription: PrescriptionRecord) => void
  deletePrescription: (id: string) => void
  clearAllData: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

const USERS_STORAGE_KEY = 'ptai_users_list_v2'
const CURRENT_USER_KEY = 'ptai_active_user_v2'
const PATIENTS_STORAGE_KEY = 'ptai_patients_v2'
const PRESCRIPTIONS_STORAGE_KEY = 'ptai_prescriptions_v2'

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('doctor')
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null)
  const [users, setUsers] = useState<UserProfile[]>([DEMO_DOCTOR, DEMO_ADMIN])
  const [activePatient, setActivePatient] = useState<PatientContextType | null>(null)
  const [allPatients, setAllPatients] = useState<PatientRecord[]>([])
  const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionRecord[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initial client-side load
  useEffect(() => {
    // 1. Load users
    let storedUsers: UserProfile[] = [DEMO_DOCTOR, DEMO_ADMIN]
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee demo accounts exist
          const hasDemoDoc = parsed.some((u) => u.id === DEMO_DOCTOR.id || u.email === DEMO_DOCTOR.email)
          const hasDemoAdmin = parsed.some((u) => u.id === DEMO_ADMIN.id || u.email === DEMO_ADMIN.email)
          storedUsers = [...parsed]
          if (!hasDemoDoc) storedUsers.unshift(DEMO_DOCTOR)
          if (!hasDemoAdmin) storedUsers.push(DEMO_ADMIN)
        }
      } catch (e) {
        console.error('Error parsing stored users', e)
      }
    }
    setUsers(storedUsers)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers))

    // 2. Load active user
    let activeUser: UserProfile | null = DEMO_DOCTOR
    const savedActiveUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedActiveUser) {
      try {
        const parsed = JSON.parse(savedActiveUser)
        if (parsed && parsed.id) {
          activeUser = parsed
        }
      } catch (e) {
        console.error('Error parsing active user', e)
      }
    }
    setCurrentUserState(activeUser)
    if (activeUser) {
      setRoleState(activeUser.role)
      localStorage.setItem('ptai_active_role', activeUser.role)
    }

    // 3. Format default demo patients (mapped to demo doctor)
    const formattedSeedPatients: PatientRecord[] = SEED_PATIENTS_100.map((p) => ({
      id: p.id,
      doctor_id: DEMO_DOCTOR.id,
      doctor_name: DEMO_DOCTOR.name,
      name: p.name,
      deidentified_id: p.deidentified_id,
      mrn: p.mrn,
      age: p.age,
      age_bracket: p.age < 30 ? '18-29' : p.age < 50 ? '30-49' : p.age < 70 ? '50-69' : '70+',
      gender: p.gender,
      phone: p.phone,
      blood_group: p.blood_group,
      allergies: p.allergies,
      chronic_conditions: p.chronic_conditions,
      active_medications: p.active_medications,
      last_visit: '2026-09-15',
      risk_level: p.risk_level,
      notes: p.notes,
    }))

    // 4. Format default demo prescriptions (mapped to demo doctor)
    const formattedSeedPrescriptions: PrescriptionRecord[] = SEED_PRESCRIPTIONS_100.map((rx) => ({
      id: rx.id,
      doctor_id: DEMO_DOCTOR.id,
      doctor_name: DEMO_DOCTOR.name,
      patient_id: rx.patient_id,
      patient_name: rx.patient_name,
      mrn: rx.mrn,
      age: rx.age,
      gender: rx.gender,
      date: rx.date,
      diagnosis: rx.diagnosis,
      medications: rx.medications,
      status: (rx.status === 'flagged' ? 'flagged' : rx.status === 'completed' ? 'dispensed' : 'active') as 'active' | 'dispensed' | 'flagged',
      risk_status: (rx.risk_status === 'anomaly_flagged' ? 'anomaly_flagged' : 'normal') as 'normal' | 'anomaly_flagged',
    }))

    // 5. Load Prescriptions
    let loadedRxs = formattedSeedPrescriptions
    const savedPrescriptions = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY) || localStorage.getItem('ptai_prescriptions')
    if (savedPrescriptions) {
      try {
        const parsed = JSON.parse(savedPrescriptions)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all prescriptions have doctor_id (default to demo doctor if legacy)
          loadedRxs = parsed.map((rx) => ({
            ...rx,
            doctor_id: rx.doctor_id || DEMO_DOCTOR.id,
            doctor_name: rx.doctor_name || DEMO_DOCTOR.name,
          }))
        }
      } catch (e) {
        console.error('Failed to parse cached prescriptions', e)
      }
    }
    setAllPrescriptions(loadedRxs)
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(loadedRxs))

    // 6. Load Patients
    let loadedPatients = formattedSeedPatients
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY) || localStorage.getItem('ptai_patients')
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients)
        if (Array.isArray(parsed) && parsed.length >= 10) {
          loadedPatients = parsed.map((p: PatientRecord) => ({
            ...p,
            doctor_id: p.doctor_id || DEMO_DOCTOR.id,
            doctor_name: p.doctor_name || DEMO_DOCTOR.name,
            risk_level: p.risk_level || computeRiskLevel(p, loadedRxs),
          }))
        }
      } catch (e) {
        console.error('Failed to parse cached patients', e)
      }
    }
    setAllPatients(loadedPatients)
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(loadedPatients))

    setIsInitialized(true)
  }, [])

  // Filtered patients for the active context:
  // - If logged in as a DOCTOR: ONLY returns patients assigned to THIS doctor account!
  // - Demo Doctor sees all 100 seed patients.
  // - A newly registered doctor only sees their own patients.
  // - If logged in as an ADMIN: returns ALL patients across all doctors.
  const patients = useMemo(() => {
    if (role === 'doctor') {
      const activeDocId = currentUser?.id || DEMO_DOCTOR.id
      return allPatients.filter((p) => (p.doctor_id || DEMO_DOCTOR.id) === activeDocId)
    }
    return allPatients
  }, [role, currentUser, allPatients])

  // Filtered prescriptions for the active context:
  // - Doctor: only their prescriptions
  // - Admin: all prescriptions across all doctors
  const prescriptions = useMemo(() => {
    if (role === 'doctor') {
      const activeDocId = currentUser?.id || DEMO_DOCTOR.id
      return allPrescriptions.filter((rx) => (rx.doctor_id || DEMO_DOCTOR.id) === activeDocId)
    }
    return allPrescriptions
  }, [role, currentUser, allPrescriptions])

  // All registered doctors with their patient counts
  const allDoctors = useMemo(() => {
    const doctors = users.filter((u) => u.role === 'doctor')
    return doctors.map((doc) => ({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      specialization: doc.specialization,
      license_number: doc.license_number,
      patientCount: allPatients.filter((p) => (p.doctor_id || DEMO_DOCTOR.id) === doc.id).length,
    }))
  }, [users, allPatients])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem('ptai_active_role', newRole)
    if (currentUser && currentUser.role !== newRole) {
      // Find matching user for role or default to demo
      const matched = users.find((u) => u.role === newRole) || (newRole === 'doctor' ? DEMO_DOCTOR : DEMO_ADMIN)
      setCurrentUserState(matched)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched))
    }
  }

  const toggleRole = () => {
    const nextRole = role === 'doctor' ? 'admin' : 'doctor'
    setRole(nextRole)
  }

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user)
    if (user) {
      setRoleState(user.role)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
      localStorage.setItem('ptai_active_role', user.role)
      localStorage.setItem('ptai_access_token', `token-${user.id}`)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
      localStorage.removeItem('ptai_access_token')
    }
  }

  const registerUser = (userData: {
    name: string
    email: string
    role: UserRole
    password?: string
    specialization?: string
    license_number?: string
    department?: string
    organization?: string
  }): UserProfile => {
    const cleanEmail = userData.email.toLowerCase().trim()
    const isDoctor = userData.role === 'doctor'
    const id = isDoctor ? `doc-${Date.now().toString(36)}` : `admin-${Date.now().toString(36)}`

    const newUser: UserProfile = {
      id,
      name: userData.name.trim(),
      email: cleanEmail,
      role: userData.role,
      specialization: userData.specialization?.trim() || (isDoctor ? 'General Medicine & Family Practice' : undefined),
      license_number: userData.license_number?.trim() || (isDoctor ? `MCI-2026-${Math.floor(10000 + Math.random() * 90000)}` : undefined),
      department: userData.department?.trim() || (!isDoctor ? 'Clinical Administration & Informatics' : undefined),
      organization: userData.organization?.trim() || 'PTAI Healthcare Network',
      password: userData.password,
      created_at: new Date().toISOString(),
    }

    setUsers((prev) => {
      const filtered = prev.filter((u) => u.email.toLowerCase() !== cleanEmail)
      const updated = [...filtered, newUser]
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    // Automatically set as active logged in user
    setCurrentUser(newUser)
    return newUser
  }

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user)
  }

  const logoutUser = () => {
    setCurrentUserState(null)
    localStorage.removeItem(CURRENT_USER_KEY)
    localStorage.removeItem('ptai_access_token')
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId)
    if (found) {
      loginUser(found)
    }
  }

  const handoffToPrescription = (patient: PatientContextType) => {
    setActivePatient(patient)
  }

  const addPatient = (newPatient: PatientRecord) => {
    const activeDocId = currentUser?.role === 'doctor' ? currentUser.id : DEMO_DOCTOR.id
    const activeDocName = currentUser?.role === 'doctor' ? currentUser.name : DEMO_DOCTOR.name

    const patientWithDoc: PatientRecord = {
      ...newPatient,
      doctor_id: newPatient.doctor_id || activeDocId,
      doctor_name: newPatient.doctor_name || activeDocName,
      risk_level: computeRiskLevel(newPatient, allPrescriptions),
    }

    setAllPatients((prev) => {
      const updated = [patientWithDoc, ...prev.filter((p) => p.id !== newPatient.id)]
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const deletePatient = (id: string) => {
    setAllPatients((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const getPatient = (id: string) => {
    return allPatients.find((p) => p.id === id || p.mrn === id || p.deidentified_id === id)
  }

  const addPrescription = (newRx: PrescriptionRecord) => {
    const activeDocId = currentUser?.role === 'doctor' ? currentUser.id : DEMO_DOCTOR.id
    const activeDocName = currentUser?.role === 'doctor' ? currentUser.name : DEMO_DOCTOR.name

    const rxWithDoc: PrescriptionRecord = {
      ...newRx,
      doctor_id: newRx.doctor_id || activeDocId,
      doctor_name: newRx.doctor_name || activeDocName,
    }

    setAllPrescriptions((prev) => {
      const updatedRxs = [rxWithDoc, ...prev.filter((r) => r.id !== newRx.id)]
      localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(updatedRxs))

      // Re-stratify the linked patient's risk level with this new prescription
      if (newRx.patient_id || newRx.mrn) {
        setAllPatients((prevPatients) => {
          const updatedPatients = prevPatients.map((p) => {
            const isLinked = (newRx.patient_id && p.id === newRx.patient_id) || p.mrn === newRx.mrn
            if (!isLinked) return p
            return { ...p, risk_level: computeRiskLevel(p, updatedRxs) }
          })
          localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients))
          return updatedPatients
        })
      }

      return updatedRxs
    })
  }

  const deletePrescription = (id: string) => {
    setAllPrescriptions((prev) => {
      const updated = prev.filter((r) => r.id !== id)
      localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearAllData = () => {
    localStorage.removeItem(PATIENTS_STORAGE_KEY)
    localStorage.removeItem(PRESCRIPTIONS_STORAGE_KEY)
    setAllPatients([])
    setAllPrescriptions([])
    setActivePatient(null)
  }

  const isDeIdentified = role === 'admin'

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        currentUser,
        setCurrentUser,
        users,
        registerUser,
        loginUser,
        logoutUser,
        switchUser,
        allDoctors,
        activePatient,
        setActivePatient,
        handoffToPrescription,
        isDeIdentified,
        patients,
        allPatients,
        addPatient,
        deletePatient,
        getPatient,
        prescriptions,
        allPrescriptions,
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
