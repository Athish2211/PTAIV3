'use client'

/**
 * Patient Documents Page
 * Tabs: Previous Prescriptions | Clinical Documents
 */

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Pill, ArrowLeft, Loader2, Sparkles, Database } from 'lucide-react'
import { Download, ExternalLink, Calendar, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { patientsApi, prescriptionUploadsApi } from '@/services/api'
import { useRole } from '@/context/RoleContext'

type Tab = 'documents'

export default function PatientDocumentsPage() {
  const params = useParams()
  const patientId = params.id as string
  const { getPatient } = useRole()

  const [activeTab, setActiveTab] = useState<Tab>('documents')
  const [patient, setPatient] = useState<any>(null)
  const [uploads, setUploads] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [patientRes, uploadsRes, docsRes] = await Promise.all([
        patientsApi.get(patientId),
        prescriptionUploadsApi.list(patientId),
        patientsApi.getDocuments(patientId),
      ])
      if (patientRes.data) setPatient(patientRes.data)
      setUploads(uploadsRes.data || [])
      setDocuments(docsRes.data || [])
    } catch (err) {
      // Fallback
    }

    if (!patient) {
      const local = getPatient(patientId)
      if (local) {
        setPatient({
          first_name: local.name.split(' ')[0] || local.name,
          last_name: local.name.split(' ').slice(1).join(' ') || '',
          name: local.name,
          mrn: local.mrn,
        })
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [patientId])

  const TABS: Array<{ key: Tab; label: string; icon: React.ReactNode; count?: number }> = [
    {
      key: 'documents',
      label: 'Clinical Documents',
      icon: <FileText size={14} />,
      count: documents.length,
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <Link href={`/patients/${patientId}`} className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Patient Profile
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText size={22} className="text-indigo-400" />
            <span>{loading ? 'Patient Documents' : `${patient?.first_name || 'Patient'} ${patient?.last_name || ''} — Documents`}</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Upload, inspect, and vectorize previous prescriptions and clinical documents into the pgvector memory.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-indigo-400" />
          <span>Loading documents catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tab sidebar */}
          <div className="space-y-4">
            <div className="glass-panel p-2 space-y-1">
              {TABS.map(({ key, label, icon, count }) => (
                <button
                  key={key}
                  id={`tab-${key}`}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {icon}
                  <span className="flex-1 text-left">{label}</span>
                  {count !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.1] text-white">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* AI Integration Card */}
            <div className="glass-panel p-4 space-y-2 border-indigo-500/20 bg-indigo-950/10 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-[11px] uppercase">
                <Sparkles size={13} />
                <span>AI Memory Integration</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                All uploaded prescriptions and PDF records are automatically parsed via OCR and embedded into the patient's longitudinal vector index for local SLM retrieval.
              </p>
            </div>
          </div>

          {/* Tab content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'documents' && (
                <div className="glass-panel p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white">Clinical Documents & Records</h3>
                  {documents.length === 0 ? (
                    <div className="text-center py-12 text-xs text-[var(--text-muted)] space-y-2">
                      <FileText size={32} className="mx-auto opacity-40 text-indigo-400" />
                      <p>No external clinical documents registered yet for this profile.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.06]">
                      {documents.map((doc: any) => (
                        <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-indigo-400" />
                            <div>
                              <p className="font-semibold text-white">{doc.original_filename}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">
                                {doc.document_type} · {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="badge badge-emerald text-[10px]">
                            {doc.status || 'Indexed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
