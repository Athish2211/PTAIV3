'use client'

import React, { useState } from 'react'
import {
  Lock, ShieldCheck, Database, Cpu, Eye, EyeOff,
  FileText, CheckCircle2, AlertTriangle, Key, Server, RefreshCw
} from 'lucide-react'

const HIPAA_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-09-17 15:32:10',
    actor: 'Dr. Dinesh Kumar',
    role: 'Doctor',
    action: 'Prescription Created & Vector Indexed',
    target: 'Patient: Rajesh Sharma (MRN-2026-0012)',
    ip: '10.0.4.12',
    status: 'Compliant',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-17 14:18:45',
    actor: 'Admin / CMO',
    role: 'Analyst',
    action: 'Exported De-Identified Cohort Slice',
    target: 'Cohort: Type 2 Diabetes (n=390)',
    ip: '10.0.2.85',
    status: 'Compliant',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-17 12:05:22',
    actor: 'Dr. Dinesh Kumar',
    role: 'Doctor',
    action: 'Agentic RAG Query Execution',
    target: 'Patient: Priya Patel (MRN-2026-0045)',
    ip: '10.0.4.12',
    status: 'Compliant',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-17 09:44:11',
    actor: 'System Automated Ingestion',
    role: 'Service',
    action: 'OCR Document Vector Ingestion',
    target: 'Scanned Rx Document #8941',
    ip: '127.0.0.1',
    status: 'Encrypted & Indexed',
  }
]

export default function PrivacyAndEncryptionPage() {
  const [safeHarborEnabled, setSafeHarborEnabled] = useState(true)
  const [fieldEncryptionEnabled, setFieldEncryptionEnabled] = useState(true)
  const [zeroRetentionSLM, setZeroRetentionSLM] = useState(true)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-cyan flex items-center gap-1">
              <ShieldCheck size={11} /> Data Administrator / CMO Security Console
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">HIPAA / GDPR Ready</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Lock size={24} className="text-cyan-400" />
            <span>Privacy, Encryption & Audit Governance</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage cryptographic field-level encryption, zero-data-retention local SLM policies, and HIPAA access audit trails.
          </p>
        </div>
      </div>

      {/* Security Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Field Encryption */}
        <div className="glass-panel p-6 space-y-4 border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Key size={20} />
            </div>
            <span className="badge badge-emerald">Active</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AES-256 Field-Level Encryption</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              All clinical notes, patient names, and prescription items are encrypted at rest with rotating organization keys.
            </p>
          </div>
          <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
            <span>Key ID: PTAI-KMS-V3</span>
            <span>Cipher: AES-GCM</span>
          </div>
        </div>

        {/* Local SLM Zero Retention */}
        <div className="glass-panel p-6 space-y-4 border-indigo-500/20 bg-indigo-950/10">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <span className="badge badge-indigo">Zero-Retention</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Local SLM (Ollama) Isolation</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Language model inference runs completely on-premises. Zero clinical PHI is ever transmitted to external APIs or third parties.
            </p>
          </div>
          <div className="pt-2 border-t border-indigo-500/20 text-[11px] font-mono text-indigo-300 flex items-center justify-between">
            <span>Endpoint: localhost:11434</span>
            <span>Host: Private Mesh</span>
          </div>
        </div>

        {/* Vector DB Privacy */}
        <div className="glass-panel p-6 space-y-4 border-cyan-500/20 bg-cyan-950/10">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database size={20} />
            </div>
            <span className="badge badge-cyan">pgvector</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Encrypted Vector Embeddings</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              High-dimensional vector embeddings are stored inside a dedicated PostgreSQL pgvector schema with row-level security (RLS).
            </p>
          </div>
          <div className="pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
            <span>Dimensions: 1536</span>
            <span>RLS Policy: Strict</span>
          </div>
        </div>
      </div>

      {/* Governance & De-Identification Policy Controls */}
      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={16} className="text-cyan-400" />
          De-Identification & Safe Harbor Controls
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">HIPAA Safe Harbor De-Identification Masking</div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                Automatically masks patient names to `PT-ANON-XXXX` and dates of birth to 10-year age brackets in CMO/Admin views.
              </div>
            </div>
            <button
              onClick={() => setSafeHarborEnabled(!safeHarborEnabled)}
              className={`btn text-xs py-1.5 px-3 ${safeHarborEnabled ? 'btn-emerald' : 'btn-secondary'}`}
            >
              {safeHarborEnabled ? 'Enforced' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">Field-Level Cryptographic Masking</div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                Protects sensitive psychiatric, substance use, and contagious disease diagnostic codes from analytics aggregation without authorization.
              </div>
            </div>
            <button
              onClick={() => setFieldEncryptionEnabled(!fieldEncryptionEnabled)}
              className={`btn text-xs py-1.5 px-3 ${fieldEncryptionEnabled ? 'btn-emerald' : 'btn-secondary'}`}
            >
              {fieldEncryptionEnabled ? 'Enforced' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* HIPAA Access Audit Trail */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              HIPAA Clinical Access Audit Trail
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Immutable ledger of all patient record accesses, prescription generation events, and export queries.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Live Streaming</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {HIPAA_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-secondary)]">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-white">{log.actor}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-indigo text-[10px]">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-300">{log.target}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-muted)]">{log.ip}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="badge badge-emerald text-[10px]">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
