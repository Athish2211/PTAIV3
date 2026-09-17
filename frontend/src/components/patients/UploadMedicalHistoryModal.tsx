'use client'

import React, { useState } from 'react'
import { UploadCloud, FileText, CheckCircle2, Loader2, X, AlertCircle, Database, Sparkles } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onExtractionComplete?: (extractedData: any) => void
}

export default function UploadMedicalHistoryModal({
  isOpen,
  onClose,
  onExtractionComplete,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any | null>(null)
  const [autoMatchStatus, setAutoMatchStatus] = useState<'matched' | 'new_profile' | null>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setExtractedData(null)
      setAutoMatchStatus(null)
    }
  }

  const handleProcess = () => {
    if (!file) return
    setIsProcessing(true)

    // Simulate OCR and Vector Ingestion
    setTimeout(() => {
      setIsProcessing(false)
      const mockResult = {
        patient_name: 'Ananya Sharma',
        mrn: 'MRN-2026-0841',
        age: 34,
        gender: 'Female',
        diagnosis: 'Acute Bronchitis & Wheezing',
        medications: [
          { medication: 'Amoxicillin-Clavulanate', dosage: '625mg', frequency: '1-0-1 after food', duration_days: 7 },
          { medication: 'Salbutamol Inhaler', dosage: '100mcg', frequency: '2 puffs PRN', duration_days: 14 }
        ],
        vector_embedded: true,
      }
      setExtractedData(mockResult)
      setAutoMatchStatus('matched')
    }, 1800)
  }

  const handleApplyToPrescription = () => {
    if (extractedData && onExtractionComplete) {
      onExtractionComplete(extractedData)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl glass-panel p-6 border-indigo-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UploadCloud size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Prescription / Medical Record</h2>
              <p className="text-xs text-[var(--text-secondary)]">OCR extraction & Vector Database ingestion</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon text-[var(--text-muted)] hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Dropzone */}
        {!extractedData ? (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-default)] hover:border-indigo-500/50 rounded-2xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <UploadCloud size={32} className="text-indigo-400 mb-2" />
              <span className="text-xs font-semibold text-white">Choose file or drag scanned prescription here</span>
              <span className="text-[11px] text-[var(--text-muted)] mt-1">Supports PDF, PNG, JPG (Max 25MB)</span>
              <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  <span className="font-medium text-white truncate max-w-xs">{file.name}</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Running OCR & Embedding into Vector DB...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Process with AI OCR</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Extraction & Auto-Match Results */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-300">
                  {autoMatchStatus === 'matched' ? 'Patient Profile Auto-Matched!' : 'New Profile Created!'}
                </div>
                <div className="text-[11px] text-emerald-200/80 mt-0.5">
                  Record parsed successfully and vectorized into <code className="font-mono text-white">pgvector</code> knowledge store.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Patient Name</span>
                  <span className="font-bold text-white">{extractedData.patient_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">MRN</span>
                  <span className="font-mono text-indigo-400 font-bold">{extractedData.mrn}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Demographics</span>
                  <span className="text-[var(--text-secondary)]">{extractedData.age} Yrs · {extractedData.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">Diagnosis</span>
                  <span className="text-[var(--text-secondary)]">{extractedData.diagnosis}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block mb-1">
                  Extracted Medications ({extractedData.medications.length})
                </span>
                <ul className="space-y-1 text-[11px] text-white">
                  {extractedData.medications.map((m: any, i: number) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>• {m.medication} ({m.dosage})</span>
                      <span className="text-[var(--text-muted)]">{m.frequency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setExtractedData(null)} className="btn btn-secondary flex-1">
                Upload Another
              </button>
              <button onClick={handleApplyToPrescription} className="btn btn-primary flex-1">
                Apply to Prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
