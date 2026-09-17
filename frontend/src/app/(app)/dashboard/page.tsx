'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, Pill, Activity, Bot, PlusCircle, Search,
  ArrowRight, ShieldCheck, FileUp, Printer, AlertTriangle,
  Clock, TrendingUp, Sparkles, Stethoscope, ChevronRight,
  RotateCcw, CheckCircle2, Calendar, FileText
} from 'lucide-react'
import { useRole, PrescriptionRecord } from '@/context/RoleContext'
import PrintPrescriptionModal from '@/components/prescriptions/PrintPrescriptionModal'

export default function DashboardPage() {
  const { role, patients, prescriptions, clearAllData } = useRole()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<PrescriptionRecord | null>(null)
  const [resetNotice, setResetNotice] = useState<string>('')

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  // Dynamic real metrics computed from active EHR state
  const totalPatients = patients.length
  const totalPrescriptions = prescriptions.length
  const activePrescriptions = prescriptions.filter((p) => p.status === 'active').length
  const pendingReviews = prescriptions.filter((p) => p.status === 'flagged').length
  const anomalyFlags = prescriptions.filter((p) => p.risk_status === 'anomaly_flagged').length

  const highRiskPatients = patients.filter((p) => p.risk_level === 'High').length
  const uniqueCohorts = new Set(
    patients.flatMap((p) => p.chronic_conditions || []).filter((c) => c && !c.includes('Newly registered'))
  ).size

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all patient and prescription records? This will return the EHR to a clean 0-data state.')) {
      clearAllData()
      setResetNotice('All current patient and prescription records have been cleared.')
      setTimeout(() => setResetNotice(''), 4000)
    }
  }

  // Find patient record for printed Rx if needed
  const getPatientForRx = (rx: PrescriptionRecord) => {
    return patients.find((p) => p.id === rx.patient_id || p.mrn === rx.mrn)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald">
              {role === 'doctor' ? 'Clinical Session Active' : 'De-Identified Analytics Mode'}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">{currentTime}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {role === 'doctor' ? 'Clinical Command Hub' : 'Population Health & Analytics Center'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {role === 'doctor'
              ? 'Select a clinical action to begin patient consultation, prescription creation, or data review.'
              : 'Aggregated macro trends, anomaly detection, and population-level clinical intelligence.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetData}
            title="Wipe current records and reset to clean 0-state"
            className="btn btn-secondary text-xs flex items-center gap-1.5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
          >
            <RotateCcw size={13} />
            <span>Clear All Data</span>
          </button>

          {role === 'doctor' ? (
            <Link href="/prescriptions/new" className="btn btn-primary shadow-lg text-xs">
              <PlusCircle size={15} />
              <span>New Prescription</span>
            </Link>
          ) : (
            <Link href="/analytics" className="btn btn-primary shadow-lg text-xs">
              <Activity size={15} />
              <span>View Data Analysis</span>
            </Link>
          )}
        </div>
      </div>

      {resetNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{resetNotice}</span>
          </span>
          <button onClick={() => setResetNotice('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── DOCTOR 3-OPTION PRIMARY WORKSTATION ── */}
      {role === 'doctor' ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Primary Clinical Pathways
            </h2>
            <span className="text-xs text-[var(--text-muted)]">3 Core Options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* OPTION 1: PATIENT LOOKUP (AI RAG) */}
            <Link
              href="/ai"
              className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                  <Bot size={24} />
                </div>
                <div className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-1">Option 1</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Patient Lookup
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Query the Vector Database using our clinical RAG Agent. Inspect longitudinal history, past prescriptions, and seamlessly continue to prescription without re-entry.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Launch RAG Assistant ({totalPatients} Registered)</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* OPTION 2: GENERATE PRESCRIPTION */}
            <Link
              href="/prescriptions/new"
              className="glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-2xl transition-all flex flex-col justify-between border-emerald-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Pill size={24} />
                </div>
                <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-1">Option 2 (Core)</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Generate Prescription
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Instant patient auto-match on name/MRN entry, inline registration with Blood Group and Phone Number, live AI safety checks, and medical-grade paper printing.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Open Rx Composer</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* OPTION 3: DATA ANALYSIS */}
            <Link
              href="/analytics"
              className="glass-panel p-6 relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <Activity size={24} />
                </div>
                <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-1">Option 3</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Data Analysis
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Live multi-agent intelligence: Real-time longitudinal trends, Isolation Forest anomaly alerts, polypharmacy risk stratification, and chronic disease cohorts.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>View Live Analytics Pipeline</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Dynamic Clinical Workstation Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{totalPatients}</div>
                <div className="text-xs text-[var(--text-muted)]">Registered Patients</div>
              </div>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Pill size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{totalPrescriptions}</div>
                <div className="text-xs text-[var(--text-muted)]">Total Prescriptions</div>
              </div>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{pendingReviews}</div>
                <div className="text-xs text-[var(--text-muted)]">Pending Reviews</div>
              </div>
            </div>

            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{anomalyFlags}</div>
                <div className="text-xs text-[var(--text-muted)]">Contraindication Flags</div>
              </div>
            </div>
          </div>

          {/* ── RECENT PRESCRIPTIONS & CLINICAL ACTIVITY ── */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400" />
                  <span>Recent Prescriptions & Clinical Activity</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Live feed of prescriptions created in this workstation.
                </p>
              </div>

              <Link
                href="/prescriptions"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All ({prescriptions.length})</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {prescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-[var(--text-muted)] uppercase text-[10px] border-b border-white/[0.06]">
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">MRN</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Diagnosis</th>
                      <th className="py-2.5 px-3">Medications</th>
                      <th className="py-2.5 px-3">Safety Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {prescriptions.slice(0, 5).map((rx) => (
                      <tr key={rx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 font-bold text-white">
                          {rx.patient_name}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-indigo-300">
                          {rx.mrn}
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)] font-mono">
                          {rx.date}
                        </td>
                        <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                          {rx.diagnosis}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {rx.medications.map((m) => m.medication).join(', ') || 'None'}
                        </td>
                        <td className="py-3 px-3">
                          {rx.risk_status === 'normal' ? (
                            <span className="badge badge-emerald text-[10px]">Normal</span>
                          ) : (
                            <span className="badge badge-rose text-[10px]">Anomaly Flag</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedRxForPrint(rx)}
                            className="btn btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 hover:text-emerald-300"
                          >
                            <Printer size={12} />
                            <span>Print</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Clean 0-data Empty State */
              <div className="p-8 text-center space-y-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Pill size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Clean Clinical Workstation (0 Prescriptions)</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    All previous mock data has been wiped clean. Your clinical registry is now clean and ready to record real consultations.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/prescriptions/new" className="btn btn-primary text-xs flex items-center gap-1.5">
                    <PlusCircle size={14} />
                    <span>Create First Prescription</span>
                  </Link>
                  <Link href="/patients" className="btn btn-secondary text-xs flex items-center gap-1.5">
                    <Users size={14} />
                    <span>View Patients Directory</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── DATA ADMINISTRATOR / CMO OVERVIEW ── */
        <div className="space-y-6">
          <div className="glass-panel p-6 border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-indigo-950/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="badge badge-cyan mb-2">HIPAA Safe Harbor Compliance Enabled</span>
                <h2 className="text-xl font-bold text-white">Aggregated Population Intelligence Center</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
                  You are viewing de-identified patient data (`PT-ANON-XXXX`). All analytics are generated via the 4 ML/DL agents (Trend, Anomaly, Risk, and Cohort) operating over the live clinical registry.
                </p>
              </div>
              <Link href="/analytics" className="btn btn-secondary text-xs flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" />
                <span>Open Analytics Pipeline</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-5">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Anomaly Agent</div>
              <div className="text-2xl font-black text-rose-400">{anomalyFlags} Outliers</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">Dosage or interaction irregularities flagged</div>
            </div>
            <div className="glass-panel p-5">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Risk Agent</div>
              <div className="text-2xl font-black text-amber-400">{highRiskPatients} Patients</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">High polypharmacy or clinical risk score</div>
            </div>
            <div className="glass-panel p-5">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Cohort Agent</div>
              <div className="text-2xl font-black text-cyan-400">{uniqueCohorts} Cohorts</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">Demographic and chronic segments mapped</div>
            </div>
            <div className="glass-panel p-5">
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Trend Agent</div>
              <div className="text-2xl font-black text-emerald-400">{totalPrescriptions} Total Rx</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">Total prescription volume recorded</div>
            </div>
          </div>
        </div>
      )}

      {/* Print Prescription Modal */}
      {selectedRxForPrint && (
        <PrintPrescriptionModal
          isOpen={!!selectedRxForPrint}
          onClose={() => setSelectedRxForPrint(null)}
          prescriptionId={selectedRxForPrint.id}
          date={selectedRxForPrint.date}
          patientName={selectedRxForPrint.patient_name}
          patientAge={selectedRxForPrint.age}
          patientGender={selectedRxForPrint.gender}
          patientMrn={selectedRxForPrint.mrn}
          patientBloodGroup={getPatientForRx(selectedRxForPrint)?.blood_group || 'O+'}
          patientPhone={getPatientForRx(selectedRxForPrint)?.phone || 'N/A'}
          diagnosis={selectedRxForPrint.diagnosis}
          allergies={getPatientForRx(selectedRxForPrint)?.allergies || ['NKDA']}
          items={selectedRxForPrint.medications}
        />
      )}
    </div>
  )
}
