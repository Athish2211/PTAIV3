'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users, User, Search, PlusCircle, Bot, Pill, ShieldCheck,
  ArrowRight, Lock, EyeOff, UserPlus, X, Phone, Droplet
} from 'lucide-react'
import { useRole, PatientRecord } from '@/context/RoleContext'

export default function PatientsDirectoryPage() {
  const { role, handoffToPrescription, patients, addPatient } = useRole()
  const [search, setSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Male',
    blood_group: 'O+',
    phone: '',
    allergies: 'NKDA',
    chronic_conditions: '',
  })

  const filtered = patients.filter((p) => {
    if (role === 'doctor') {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.mrn.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone && p.phone.includes(search)) ||
        (p.blood_group && p.blood_group.toLowerCase().includes(search.toLowerCase())) ||
        p.chronic_conditions.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      )
    } else {
      return (
        p.deidentified_id.toLowerCase().includes(search.toLowerCase()) ||
        p.age_bracket.includes(search) ||
        p.chronic_conditions.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      )
    }
  })

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Please enter a patient full name')
      return
    }

    const safeAge = Math.max(0, Math.min(130, formData.age || 0))
    const randomCode = Math.floor(1000 + Math.random() * 9000)

    const newRecord: PatientRecord = {
      id: `p-${Date.now()}`,
      name: formData.name.trim(),
      deidentified_id: `PT-ANON-${randomCode}`,
      mrn: `MRN-2026-${randomCode}`,
      age: safeAge,
      age_bracket: safeAge < 10 ? '0-9' : `${Math.floor(safeAge / 10) * 10}-${Math.floor(safeAge / 10) * 10 + 9}`,
      gender: formData.gender,
      blood_group: formData.blood_group || 'O+',
      phone: formData.phone.trim() || '+91 98000 00000',
      email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      city: 'Outpatient Clinic',
      allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : ['NKDA'],
      chronic_conditions: formData.chronic_conditions
        ? formData.chronic_conditions.split(',').map((s) => s.trim())
        : ['Outpatient Clinical Profile'],
      last_visit: new Date().toISOString().split('T')[0],
      risk_level: 'Low',
      notes: 'Profile registered in EHR patient registry.',
    }

    addPatient(newRecord)
    setIsAddModalOpen(false)
    setFormData({
      name: '',
      age: 35,
      gender: 'Male',
      blood_group: 'O+',
      phone: '',
      allergies: 'NKDA',
      chronic_conditions: '',
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {role === 'doctor' ? (
              <span className="badge badge-emerald">Clinical Assigned Patients</span>
            ) : (
              <span className="badge badge-cyan flex items-center gap-1">
                <Lock size={10} /> De-Identified Cohort View
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users size={24} className="text-indigo-400" />
            <span>{role === 'doctor' ? 'Patients Directory' : 'De-Identified Patient Registry'}</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {role === 'doctor'
              ? 'Browse clinical profiles, blood groups, contact info, and launch RAG lookups or prescription builders.'
              : 'Secure longitudinal patient cohort data with redacted personal identifiable information.'}
          </p>
        </div>

        {role === 'doctor' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-secondary text-xs flex items-center gap-1.5 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10"
            >
              <UserPlus size={14} />
              <span>Register Patient</span>
            </button>
            <Link href="/prescriptions/new" className="btn btn-primary text-xs flex items-center gap-2">
              <PlusCircle size={15} />
              <span>New Prescription</span>
            </Link>
          </div>
        )}
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            className="input-field pl-9 text-xs"
            placeholder={
              role === 'doctor'
                ? "Search patient name, MRN, phone, blood group..."
                : "Search de-identified ID (e.g. PT-ANON-0842) or condition..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          {filtered.length} Record{filtered.length === 1 ? '' : 's'} displayed
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        {filtered.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-white/[0.02] text-[var(--text-muted)] uppercase text-[10px] font-bold">
                <th className="p-4">{role === 'doctor' ? 'Patient Name' : 'De-Identified Entity ID'}</th>
                <th className="p-4">Demographics & Blood Group</th>
                <th className="p-4">{role === 'doctor' ? 'MRN' : 'Cohort Mask'}</th>
                <th className="p-4">Chronic Profile / Diagnosis</th>
                <th className="p-4">Risk Stratification</th>
                <th className="p-4">Last Consultation</th>
                {role === 'doctor' && <th className="p-4 text-right">Clinical Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    {role === 'doctor' ? (
                      <div>
                        <Link href={`/patients/${p.id}`} className="font-bold text-white text-sm hover:text-indigo-300 transition-colors">
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-rose-400 font-semibold">
                          Allergies: {p.allergies.join(', ')}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <EyeOff size={14} className="text-cyan-400" />
                        <span className="font-mono font-bold text-cyan-300 text-sm">{p.deidentified_id}</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-[var(--text-secondary)]">
                    {role === 'doctor' ? (
                      <div className="space-y-0.5">
                        <div className="text-white font-medium">
                          {p.age} Yrs · {p.gender}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                            {p.blood_group || 'O+'}
                          </span>
                          {p.phone && (
                            <span className="font-mono text-slate-300 text-[10px]">
                              {p.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-mono text-xs">{p.age_bracket} Yrs · {p.gender}</span>
                        <div className="text-[10px] text-rose-300 font-mono">Blood: {p.blood_group || 'O+'}</div>
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-indigo-300">
                    {role === 'doctor' ? p.mrn : 'HASHED-SHA256'}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.chronic_conditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    {p.risk_level === 'High' ? (
                      <span className="badge badge-rose">High Risk</span>
                    ) : p.risk_level === 'Moderate' ? (
                      <span className="badge badge-amber">Moderate Risk</span>
                    ) : (
                      <span className="badge badge-emerald">Low Risk</span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-[var(--text-muted)] text-[11px]">
                    {p.last_visit}
                  </td>

                  {role === 'doctor' && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/patients/${p.id}`}
                          className="btn btn-secondary text-xs py-1 px-2 flex items-center gap-1 hover:text-white"
                          title="View Patient Medical Profile"
                        >
                          <User size={12} />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/prescriptions/new"
                          onClick={() =>
                            handoffToPrescription({
                              id: p.id,
                              name: p.name,
                              mrn: p.mrn,
                              age: p.age,
                              gender: p.gender,
                              allergies: p.allergies,
                            })
                          }
                          className="btn btn-secondary text-xs py-1 px-2 flex items-center gap-1 hover:text-emerald-400 hover:border-emerald-500/30"
                        >
                          <Pill size={12} />
                          <span>Prescribe</span>
                        </Link>

                        <Link
                          href={`/ai?patientId=${p.id}`}
                          className="btn btn-secondary text-xs py-1 px-2 flex items-center gap-1 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/40 hover:text-white"
                          title="Query longitudinal records with Clinical AI RAG"
                        >
                          <Bot size={12} className="text-indigo-400" />
                          <span>AI Lookup</span>
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Empty State when 0 patients */
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Patients Registered</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                The patient registry is currently empty. Register a patient with their blood group and contact number to begin clinical tracking.
              </p>
            </div>
            {role === 'doctor' && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Register Patient</span>
                </button>
                <Link href="/prescriptions/new" className="btn btn-secondary text-xs flex items-center gap-1.5">
                  <PlusCircle size={14} />
                  <span>Write Prescription</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── REGISTER PATIENT MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 max-w-lg w-full space-y-5 border-indigo-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-400" />
                <h3 className="text-base font-bold text-white">Register New Patient Profile</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost text-xs p-1 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                    Age (0-130) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={130}
                    required
                    className="input-field"
                    value={formData.age}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) => {
                      const raw = parseInt(e.target.value)
                      const sanitized = isNaN(raw) ? 0 : Math.max(0, Math.min(130, raw))
                      setFormData({ ...formData, age: sanitized })
                    }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                    Gender
                  </label>
                  <select
                    className="input-field"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
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
                    required
                    className="input-field font-mono"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData({ ...formData, phone: digits })
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                    Known Drug Allergies
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Penicillin, Sulfa drugs, or NKDA"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                </div>



                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block mb-1">
                    Chronic Conditions (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                    value={formData.chronic_conditions}
                    onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Create Patient Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
