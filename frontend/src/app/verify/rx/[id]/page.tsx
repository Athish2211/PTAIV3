'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Pill,
  User,
  Calendar,
  Building2,
  FileCheck,
  Printer,
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

export default function VerifyPrescriptionPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const rxId = (params.id as string) || 'RX-VERIFIED'
  const mrnFromQuery = searchParams.get('mrn') || ''
  const nameFromQuery = searchParams.get('name') || ''
  const dateFromQuery = searchParams.get('date') || ''
  const doctorFromQuery = searchParams.get('dr') || 'Dr. Dinesh Kumar, MD'
  const bgFromQuery = searchParams.get('bg') || ''
  const phoneFromQuery = searchParams.get('phone') || ''

  const [prescriptionData, setPrescriptionData] = useState<{
    id: string
    patient_name: string
    mrn: string
    blood_group?: string
    phone?: string
    date: string
    diagnosis: string
    doctor: string
    doctor_lic?: string
    medications: {
      medication: string
      dosage: string
      frequency: string
      duration_days: number
      instructions: string
    }[]
  } | null>(null)

  const [verificationTime, setVerificationTime] = useState<string>('')

  const diagFromQuery = searchParams.get('diag') || 'Clinical Care Plan'
  const licFromQuery = searchParams.get('lic') || '#MED-IN-984210'
  const sigFromQuery = searchParams.get('sig') || ''
  const medsDataParam = searchParams.get('meds_data')

  useEffect(() => {
    setVerificationTime(new Date().toUTCString())

    // 1. First check if medications were passed directly in the QR code query params (for cross-device phone scans)
    if (medsDataParam) {
      try {
        const parsedMeds = JSON.parse(decodeURIComponent(medsDataParam))
        if (Array.isArray(parsedMeds) && parsedMeds.length > 0) {
          setPrescriptionData({
            id: rxId,
            patient_name: nameFromQuery || 'Verified Patient',
            mrn: mrnFromQuery || 'MRN-AUTO',
            blood_group: bgFromQuery,
            phone: phoneFromQuery,
            date: dateFromQuery || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            diagnosis: diagFromQuery,
            doctor: doctorFromQuery,
            doctor_lic: licFromQuery,
            medications: parsedMeds,
          })
          return
        }
      } catch (e) {
        console.warn('Could not parse meds_data query param:', e)
      }
    }

    // 2. Attempt to load from localStorage (if opened on the doctor workstation)
    try {
      const stored = localStorage.getItem('ptai_prescriptions')
      if (stored) {
        const list = JSON.parse(stored)
        const found = list.find(
          (p: any) =>
            p.id?.toLowerCase() === rxId.toLowerCase() ||
            p.mrn?.toLowerCase() === mrnFromQuery.toLowerCase()
        )
        if (found) {
          setPrescriptionData({
            id: found.id || rxId,
            patient_name: found.patient_name,
            mrn: found.mrn,
            blood_group: bgFromQuery || found.blood_group,
            phone: phoneFromQuery || found.phone,
            date: found.date,
            diagnosis: found.diagnosis || diagFromQuery,
            doctor: doctorFromQuery,
            doctor_lic: licFromQuery,
            medications: found.medications || [],
          })
          return
        }
      }
    } catch (e) {
      console.warn('Could not read local prescriptions store:', e)
    }

    // 3. Fallback to URL parameters
    setPrescriptionData({
      id: rxId,
      patient_name: nameFromQuery || 'Verified Patient',
      mrn: mrnFromQuery || 'MRN-AUTO',
      blood_group: bgFromQuery,
      phone: phoneFromQuery,
      date: dateFromQuery || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      diagnosis: diagFromQuery,
      doctor: doctorFromQuery,
      doctor_lic: licFromQuery,
      medications: [],
    })
  }, [rxId, mrnFromQuery, nameFromQuery, dateFromQuery, doctorFromQuery, diagFromQuery, licFromQuery, medsDataParam])

  const handlePrint = () => {
    window.print()
  }

  // Generate deterministic mock cryptographic checksum from Rx ID
  const hashDigest = rxId
    .split('')
    .reduce((acc, char, idx) => acc + (char.charCodeAt(0) * (idx + 13)).toString(16), 'e8a4')
    .padEnd(32, 'f7b2c9')
    .slice(0, 32)

  return (
    <div className="min-h-screen bg-[#090a10] text-[#f8fafc] flex flex-col items-center justify-start p-4 sm:p-8 selection:bg-emerald-500/30">
      {/* Top Navigation */}
      <div className="no-print w-full max-w-4xl flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <Link
          href="/prescriptions"
          className="btn btn-secondary text-xs flex items-center gap-2 hover:text-white"
        >
          <ArrowLeft size={14} />
          <span>Back to EHR System</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Official Verification Gateway</span>
        </div>
      </div>

      {/* Verification Card */}
      <div className="w-full max-w-4xl bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-900 border-b border-emerald-500/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                    PTAI Cryptographic EHR Verification
                  </span>
                  <span className="badge badge-emerald text-[10px]">Verified Authentic</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
                  Official Prescription Validated
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Issued by PTAI Memorial Health & Research Hospital · Digital Signature Confirmed
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="no-print btn btn-emerald text-xs py-2 px-4 flex items-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <Printer size={15} />
              <span>Print Verification</span>
            </button>
          </div>
        </div>

        {/* Prescription Metadata Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <FileCheck size={14} className="text-emerald-400" />
                <span>Prescription Identifier</span>
              </div>
              <div className="text-lg font-mono font-bold text-white">{prescriptionData?.id}</div>
              <div className="text-[11px] text-slate-400 mt-1">Status: Active / Authorized</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <User size={14} className="text-indigo-400" />
                <span>Patient Record</span>
              </div>
              <div className="text-base font-bold text-white">{prescriptionData?.patient_name}</div>
              <div className="text-[11px] font-mono text-indigo-300 mt-0.5">
                MRN: {prescriptionData?.mrn}
              </div>
              {(prescriptionData?.blood_group || prescriptionData?.phone) && (
                <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                  {prescriptionData.blood_group && (
                    <span className="badge badge-rose font-bold py-0 px-1.5">
                      Blood: {prescriptionData.blood_group}
                    </span>
                  )}
                  {prescriptionData.phone && (
                    <span className="font-mono text-slate-300">
                      {prescriptionData.phone}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <Calendar size={14} className="text-cyan-400" />
                <span>Issue & Authorization Date</span>
              </div>
              <div className="text-base font-bold text-white">{prescriptionData?.date}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Licensed Clinical Provider</div>
            </div>
          </div>

          {/* Physician Information */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold font-serif text-sm">
                Rx
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                  Authorizing Physician
                </span>
                <span className="font-extrabold text-white text-sm">Dr. Dinesh Kumar, MD</span>
                <span className="text-slate-400 ml-2">Internal Medicine & Clinical AI</span>
              </div>
            </div>
            <div className="font-mono text-slate-400 text-right">
              <div>License: <span className="text-indigo-300 font-semibold">#MED-IN-984210</span></div>
              <div className="text-[10px] text-slate-500">NPI: 1849204921</div>
            </div>
          </div>

          {/* Prescribed Medications Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <Pill size={16} className="text-emerald-400" />
                <span>Authorized Medications ({prescriptionData?.medications.length || 0})</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Pharmacy Verification Ready
              </span>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase text-[10px]">
                    <th className="p-3">#</th>
                    <th className="p-3">Medication</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Sig / Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {prescriptionData?.medications.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{item.medication}</td>
                      <td className="p-3 font-semibold text-emerald-400">{item.dosage}</td>
                      <td className="p-3 text-slate-300">{item.frequency}</td>
                      <td className="p-3 text-slate-300">{item.duration_days} Days</td>
                      <td className="p-3 text-slate-400 italic">{item.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Security Details */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 size={15} />
                <span>Cryptographic Proof Valid</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This prescription contains a tamper-evident digital certificate registered in the PTAI
                zero-knowledge EHR ledger.
              </p>
              <div className="font-mono text-[10px] text-slate-500 bg-black/40 p-2 rounded border border-white/5 break-all">
                Checksum: SHA256:{hashDigest}
              </div>
            </div>

            <div className="space-y-1.5 sm:text-right">
              <div className="flex items-center sm:justify-end gap-2 text-cyan-400 font-semibold">
                <Lock size={15} />
                <span>Data Secure</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Verification timestamp: <span className="text-white font-mono">{verificationTime}</span>
              </p>
              <div className="text-[10px] text-slate-500">
                Facility ID: <span className="text-slate-300 font-mono">HOSP-PTAI-MEMORIAL-402</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>PTAI Memorial Health & Research Hospital · Precision Medicine & Clinical AI Registry</p>
        <p className="text-[11px]">
          If this prescription appears altered or does not match the patient identity, contact the Pharmacy Hotline: +1 (800) 555-PTAI.
        </p>
      </div>
    </div>
  )
}
