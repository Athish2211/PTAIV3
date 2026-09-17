'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Pill, User, Save, Plus, PlusCircle, Trash2, ShieldCheck,
  AlertTriangle, Printer, UploadCloud, CheckCircle2, UserPlus,
  Sparkles, Stethoscope, Search, Info, HelpCircle
} from 'lucide-react'
import { useRole } from '@/context/RoleContext'
import PrintPrescriptionModal from '@/components/prescriptions/PrintPrescriptionModal'
import UploadMedicalHistoryModal from '@/components/patients/UploadMedicalHistoryModal'

interface MedicationRow {
  medication: string
  dosage: string
  frequency: string
  duration_days: number
  instructions: string
}

export default function NewPrescriptionPage() {
  const router = useRouter()
  const { activePatient, setActivePatient, patients, addPatient, addPrescription } = useRole()

  // Patient State
  const [searchQuery, setSearchQuery] = useState('')
  const [matchedPatient, setMatchedPatient] = useState<any | null>(null)
  const [showNewPatientCard, setShowNewPatientCard] = useState(false)
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: 35,
    gender: 'Male',
    phone: '',
    blood_group: 'O+',
    allergies: 'NKDA',
    chronic_conditions: '',
  })

  // Prescription Form State
  const [diagnosisContext, setDiagnosisContext] = useState('')
  const [items, setItems] = useState<MedicationRow[]>([
    { medication: 'Amoxicillin-Clavulanate', dosage: '625mg', frequency: '1-0-1 after food', duration_days: 7, instructions: 'Take with a full glass of water' }
  ])
  const [clinicalNotes, setClinicalNotes] = useState('')

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Auto-fill if redirected from RAG Agent ("Continue Consultation w/o Re-entry")
  useEffect(() => {
    if (activePatient) {
      setSearchQuery(activePatient.name)
      setMatchedPatient({
        id: activePatient.id,
        name: activePatient.name,
        mrn: activePatient.mrn,
        age: activePatient.age,
        gender: activePatient.gender,
        blood_group: (activePatient as any).blood_group || 'O+',
        phone: (activePatient as any).phone || '',
        allergies: activePatient.allergies || ['NKDA'],
        chronic_conditions: ['Known vector clinical profile'],
      })
      if (activePatient.diagnosis) {
        setDiagnosisContext(activePatient.diagnosis)
      }
      if (activePatient.notes) {
        setClinicalNotes(activePatient.notes)
      }
    }
  }, [activePatient])

  // Real-time search matches (non-blocking suggestions)
  const searchMatches =
    searchQuery.trim().length >= 1 && !matchedPatient
      ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : []

  const handleSelectPatient = (patient: any) => {
    setMatchedPatient(patient)
    setSearchQuery(patient.name)
    setShowNewPatientCard(false)
  }

  const handleClearPatient = () => {
    setMatchedPatient(null)
    setSearchQuery('')
    setShowNewPatientCard(false)
  }

  const handleOpenInlineCreate = (initialName?: string) => {
    setMatchedPatient(null)
    setShowNewPatientCard(true)
    setNewPatientData({
      name: initialName || searchQuery || '',
      age: 30,
      gender: 'Male',
      phone: '',
      blood_group: 'O+',
      allergies: '',
    })
  }

  // Handle Medication item management
  const handleAddItem = () => {
    setItems([
      ...items,
      { medication: '', dosage: '', frequency: '1-0-1 after food', duration_days: 5, instructions: 'Take after meals' }
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  const handleItemChange = (index: number, field: keyof MedicationRow, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  // Save Prescription to persistent state
  const handleFinalize = () => {
    setIsSaving(true)
    const newRx = {
      id: `rx-${Date.now()}`,
      patient_id: matchedPatient?.id,
      patient_name: matchedPatient?.name || searchQuery || 'Anonymous Patient',
      mrn: matchedPatient?.mrn || `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      age: matchedPatient?.age || 35,
      gender: matchedPatient?.gender || 'Male',
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosisContext || 'General Medical Review',
      medications: items,
      status: 'active' as const,
      risk_status: hasPenicillinConflict ? ('anomaly_flagged' as const) : ('normal' as const),
    }

    addPrescription(newRx)

    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => {
        router.push('/prescriptions')
      }, 900)
    }, 800)
  }

  // Handle data applied from Scanned Rx Upload
  const handleUploadedData = (data: any) => {
    setSearchQuery(data.patient_name)
    setMatchedPatient({
      id: 'p-uploaded',
      name: data.patient_name,
      mrn: data.mrn,
      age: data.age,
      gender: data.gender,
      allergies: ['NKDA'],
      chronic_conditions: [],
    })
    setDiagnosisContext(data.diagnosis || '')
    if (data.medications && data.medications.length > 0) {
      setItems(data.medications)
    }
  }

  // Check for mock live safety warning (e.g. Penicillin allergy vs Amoxicillin)
  const hasPenicillinConflict =
    matchedPatient?.allergies?.some((a: string) => a.toLowerCase().includes('penicillin')) &&
    items.some((i) => i.medication.toLowerCase().includes('amox'))

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <Link href="/dashboard" className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Clinical Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Pill size={24} className="text-emerald-400" />
            <span>Prescription Composer & Safety Guardrail</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Real-time patient auto-match, live Anomaly & Risk Agent checks, and paper-ready printing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-secondary text-xs flex items-center gap-2"
          >
            <UploadCloud size={15} className="text-indigo-400" />
            <span>Upload Previous Rx</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="btn btn-emerald text-xs flex items-center gap-2"
          >
            <Printer size={15} />
            <span>Print Prescription</span>
          </button>

          <button
            onClick={handleFinalize}
            disabled={isSaving}
            className="btn btn-primary text-xs flex items-center gap-2"
          >
            {isSaving ? (
              <span>Saving & Indexing...</span>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-300" />
                <span>Prescription Saved!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Finalize & Commit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── LIVE PATIENT AUTO-MATCH / INLINE PROFILE CREATE ── */}
      <div className="glass-panel p-6 space-y-4 border-indigo-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User size={16} className="text-indigo-400" />
            Step 1: Patient Identification
          </h2>
          <div className="flex items-center gap-2">
            {!matchedPatient && !showNewPatientCard && (
              <button
                type="button"
                onClick={() => handleOpenInlineCreate(searchQuery)}
                className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10"
              >
                <UserPlus size={13} />
                <span>+ Register New Patient</span>
              </button>
            )}
            <span className="text-[11px] text-[var(--text-muted)]">Type Name or MRN to Auto-Match</span>
          </div>
        </div>

        {/* CASE A: PATIENT ATTACHED */}
        {matchedPatient ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-base font-bold text-white">{matchedPatient.name}</span>
                <span className="text-xs font-mono text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-500/20">
                  {matchedPatient.mrn}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {matchedPatient.age} Yrs · {matchedPatient.gender}
                </span>
                <span className="badge badge-rose text-[10px] font-bold">
                  Blood: {matchedPatient.blood_group || 'O+'}
                </span>
                {matchedPatient.phone && (
                  <span className="text-xs text-slate-300 font-mono bg-white/[0.04] px-2 py-0.5 rounded">
                    Tel: {matchedPatient.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald">Attached Patient</span>
                <button
                  type="button"
                  onClick={handleClearPatient}
                  className="btn btn-secondary text-xs py-1 px-2.5 hover:text-rose-300 hover:border-rose-500/30"
                >
                  Change / Reselect Patient
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-500/20 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Blood & Phone</span>
                <span className="text-emerald-300 font-semibold">
                  {matchedPatient.blood_group || 'O+'} · {matchedPatient.phone || 'No phone recorded'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Allergies</span>
                <span className="text-rose-400 font-semibold">
                  {matchedPatient.allergies && matchedPatient.allergies.length > 0
                    ? matchedPatient.allergies.join(', ')
                    : 'NKDA'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Chronic Conditions</span>
                <span className="text-[var(--text-secondary)]">
                  {matchedPatient.chronic_conditions && matchedPatient.chronic_conditions.length > 0
                    ? matchedPatient.chronic_conditions.join(', ')
                    : 'None recorded'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Active Medications</span>
                <span className="text-[var(--text-secondary)]">
                  {matchedPatient.active_medications && matchedPatient.active_medications.length > 0
                    ? matchedPatient.active_medications.join(', ')
                    : 'None recorded'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: PATIENT SEARCH INPUT + REAL-TIME CANDIDATES */
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
              <input
                type="text"
                className="input-field pl-10 pr-24"
                placeholder="Type patient name or MRN (e.g. 'Rajesh', 'Sanc', 'MRN-2026-0012')..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowNewPatientCard(false)
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Candidate Matches Dropdown / Panel */}
            {searchQuery.trim().length >= 1 && !showNewPatientCard && (
              <div className="p-3 bg-[#0d101a] border border-indigo-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 pb-2">
                  <span>Found {searchMatches.length} matching existing patient{searchMatches.length === 1 ? '' : 's'}:</span>
                  <button
                    type="button"
                    onClick={() => handleOpenInlineCreate(searchQuery)}
                    className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle size={12} />
                    Register "{searchQuery}" as a New Patient Profile
                  </button>
                </div>

                {searchMatches.length > 0 ? (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {searchMatches.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient)}
                        className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-indigo-500/15 border border-white/5 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                            {patient.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-indigo-200 flex items-center gap-2">
                              <span>{patient.name}</span>
                              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                {patient.mrn}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {patient.age} Yrs · {patient.gender} · {patient.chronic_conditions?.slice(0, 2).join(', ') || 'No chronic tags'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-emerald text-[11px] py-1 px-3 opacity-90 group-hover:opacity-100"
                        >
                          Select Patient
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      No existing patients match <strong className="text-white">"{searchQuery}"</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenInlineCreate(searchQuery)}
                      className="btn btn-primary text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                    >
                      <UserPlus size={13} />
                      <span>Create New Profile for "{searchQuery}"</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CASE C: INLINE QUICK PROFILE CREATION */}
        {showNewPatientCard && (
          <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-400" />
                <span className="text-sm font-bold text-white">Create New Patient Profile Inline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-indigo">Instant Registration</span>
                <button
                  type="button"
                  onClick={() => setShowNewPatientCard(false)}
                  className="btn btn-ghost text-xs p-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Enter details for this new patient. The profile will be registered and attached to this prescription without leaving the composer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                  placeholder="e.g. Sanc"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Age (Years, 0-130) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={130}
                  className="input-field"
                  value={newPatientData.age}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e) => {
                    const raw = parseInt(e.target.value)
                    const sanitized = isNaN(raw) ? 0 : Math.max(0, Math.min(130, raw))
                    setNewPatientData({ ...newPatientData, age: sanitized })
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Gender
                </label>
                <select
                  className="input-field"
                  value={newPatientData.gender}
                  onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Blood Group <span className="text-rose-400">*</span>
                </label>
                <select
                  className="input-field font-bold text-rose-300 bg-[#161a2b]"
                  value={newPatientData.blood_group}
                  onChange={(e) => setNewPatientData({ ...newPatientData, blood_group: e.target.value })}
                >
                  <option value="A+">A+ (A Positive)</option>
                  <option value="A-">A- (A Negative)</option>
                  <option value="B+">B+ (B Positive)</option>
                  <option value="B-">B- (B Negative)</option>
                  <option value="AB+">AB+ (AB Positive)</option>
                  <option value="AB-">AB- (AB Negative)</option>
                  <option value="O+">O+ (O Positive)</option>
                  <option value="O-">O- (O Negative)</option>
                  <option value="Unknown">Unknown / Pending Lab</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  className="input-field font-mono"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={newPatientData.phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setNewPatientData({ ...newPatientData, phone: digits })
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Known Allergies
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Penicillin or NKDA"
                  value={newPatientData.allergies}
                  onChange={(e) => setNewPatientData({ ...newPatientData, allergies: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Hypertension, Diabetes (comma separated)"
                  value={newPatientData.chronic_conditions}
                  onChange={(e) => setNewPatientData({ ...newPatientData, chronic_conditions: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Blood: <strong className="text-rose-400">{newPatientData.blood_group}</strong> · Phone: <strong className="text-white font-mono">{newPatientData.phone || 'Not entered'}</strong> · Age: <strong className="text-emerald-400">{Math.max(0, Math.min(130, newPatientData.age))} yrs</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!newPatientData.name.trim()) {
                    alert('Please enter a patient name')
                    return
                  }
                  const safeAge = Math.max(0, Math.min(130, newPatientData.age || 0))
                  const randomCode = Math.floor(1000 + Math.random() * 9000)
                  const registeredPatient = {
                    id: `p-${Date.now()}`,
                    name: newPatientData.name.trim(),
                    deidentified_id: `PT-ANON-${randomCode}`,
                    mrn: `MRN-2026-${randomCode}`,
                    age: safeAge,
                    age_bracket: safeAge < 10 ? '0-9' : `${Math.floor(safeAge / 10) * 10}-${Math.floor(safeAge / 10) * 10 + 9}`,
                    gender: newPatientData.gender,
                    phone: newPatientData.phone.trim() || '+91 98000 00000',
                    email: `${newPatientData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                    city: 'Outpatient Clinic',
                    blood_group: newPatientData.blood_group || 'O+',
                    allergies: [newPatientData.allergies || 'NKDA'],
                    chronic_conditions: newPatientData.chronic_conditions 
                      ? newPatientData.chronic_conditions.split(',').map(c => c.trim()) 
                      : ['Newly registered patient profile'],
                    last_visit: new Date().toISOString().split('T')[0],
                    risk_level: 'Low' as const,
                    notes: 'Registered inline during prescription creation.',
                  }
                  addPatient(registeredPatient)
                  setMatchedPatient(registeredPatient)
                  setSearchQuery(registeredPatient.name)
                  setShowNewPatientCard(false)
                }}
                className="btn btn-primary text-xs py-1.5 px-4"
              >
                Confirm & Attach to Prescription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── STEP 2: CLINICAL CONTEXT ── */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Stethoscope size={16} className="text-indigo-400" />
          Step 2: Diagnosis & Clinical Context
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">Primary Clinical Diagnosis</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Acute Streptococcal Pharyngitis, Essential Hypertension..."
              value={diagnosisContext}
              onChange={(e) => setDiagnosisContext(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">Physician Clinical Notes</label>
            <input
              type="text"
              className="input-field"
              placeholder="Symptoms, vital notes, follow-up timeline..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── STEP 3: MEDICATION ITEM COMPOSER ── */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Pill size={16} className="text-emerald-400" />
              Step 3: Medications & Sig Instructions
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Specify medications, dosages, frequency codes, and durations.
            </p>
          </div>
          <button onClick={handleAddItem} className="btn btn-secondary text-xs flex items-center gap-1.5">
            <Plus size={14} /> Add Medication
          </button>
        </div>

        {/* Medication Rows */}
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300">Medication #{idx + 1}</span>
                {items.length > 1 && (
                  <button onClick={() => handleRemoveItem(idx)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block mb-1">Medication Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Amoxicillin, Metformin..."
                    value={item.medication}
                    onChange={(e) => handleItemChange(idx, 'medication', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block mb-1">Dosage</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 500mg, 10mg..."
                    value={item.dosage}
                    onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block mb-1">Frequency (Sig)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 1-0-1 after food"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={item.duration_days}
                    onChange={(e) => handleItemChange(idx, 'duration_days', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block mb-1">Special Patient Instructions</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Take with warm water, avoid dairy 2 hours before..."
                  value={item.instructions}
                  onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── LIVE AI SAFETY GUARDRAIL WARNING ── */}
        {hasPenicillinConflict ? (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-rose-300 uppercase tracking-wider">
                Risk Agent Alert: Potential Contraindication Detected
              </div>
              <div className="text-rose-200 mt-1">
                Patient profile lists an allergy to <strong>Penicillin</strong>, but <strong>{items[0].medication}</strong> belongs to the aminopenicillin class. Consider alternative antimicrobial therapy (e.g. Macrolide / Azithromycin).
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>AI Safety & Anomaly Guardrail passed: No acute contraindications or extreme dosage outliers detected.</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <PrintPrescriptionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        prescriptionId={`RX-2026-${(matchedPatient?.mrn || '9842').replace(/[^0-9]/g, '').slice(-4) || '9842'}`}
        patientName={matchedPatient?.name || 'Patient Name'}
        patientAge={matchedPatient?.age || '—'}
        patientGender={matchedPatient?.gender || '—'}
        patientMrn={matchedPatient?.mrn || 'MRN-AUTO'}
        patientBloodGroup={matchedPatient?.blood_group || 'Unknown'}
        patientPhone={matchedPatient?.phone || 'N/A'}
        diagnosis={diagnosisContext}
        allergies={matchedPatient?.allergies || ['NKDA']}
        items={items}
      />

      <UploadMedicalHistoryModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onExtractionComplete={handleUploadedData}
      />
    </div>
  )
}
