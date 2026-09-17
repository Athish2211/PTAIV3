'use client'

/**
 * PrescriptionUpload — NEW FEATURE
 * Allows doctors to upload historical prescription documents for a patient.
 * Supports: PDF, PNG, JPG, DOCX
 * Features: drag-and-drop, progress tracking, OCR preview, review workflow
 */

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, Image, CheckCircle2, XCircle,
  AlertCircle, Clock, Eye, Trash2, Pill, Calendar,
  User, ChevronDown, ChevronUp, Loader2, Stethoscope
} from 'lucide-react'
import { prescriptionUploadsApi } from '@/services/api'

interface PrescriptionUploadRecord {
  id: string
  filename: string
  original_filename: string
  file_type: string
  status: 'uploaded' | 'processing' | 'indexed' | 'failed'
  ocr_text?: string
  extracted_data?: {
    medicines?: Array<{ name: string; dosage: string }>
    prescriber_name?: string
    prescription_date?: string
    clinic_name?: string
    confidence?: string
  }
  extraction_confidence?: string
  is_reviewed: boolean
  original_prescription_date?: string
  original_prescriber?: string
  description?: string
  uploaded_at: string
  indexed_at?: string
}

interface PrescriptionUploadProps {
  patientId: string
  patientName: string
  uploads: PrescriptionUploadRecord[]
  onUploadSuccess: () => void
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText size={20} className="text-rose-400" />,
  png: <Image size={20} className="text-blue-400" />,
  jpg: <Image size={20} className="text-blue-400" />,
  jpeg: <Image size={20} className="text-blue-400" />,
  docx: <FileText size={20} className="text-indigo-400" />,
  doc: <FileText size={20} className="text-indigo-400" />,
}

const STATUS_CONFIG = {
  uploaded: { label: 'Queued', color: 'badge-muted', icon: <Clock size={10} /> },
  processing: { label: 'Processing', color: 'badge-warning', icon: <Loader2 size={10} className="animate-spin" /> },
  indexed: { label: 'Indexed', color: 'badge-success', icon: <CheckCircle2 size={10} /> },
  failed: { label: 'Failed', color: 'badge-danger', icon: <XCircle size={10} /> },
}

export default function PrescriptionUpload({
  patientId,
  patientName,
  uploads,
  onUploadSuccess,
}: PrescriptionUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    originalPrescriber: '',
    originalDate: '',
  })
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxSize: 50 * 1024 * 1024,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0]
      if (err?.code === 'file-too-large') setError('File too large. Maximum 50MB.')
      else if (err?.code === 'file-invalid-type') setError('Invalid file type. Allowed: PDF, PNG, JPG, DOCX.')
      else setError('File rejected. Please try another file.')
    },
  })

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError('')
    setUploadProgress(0)

    const fd = new FormData()
    fd.append('file', selectedFile)
    if (formData.description) fd.append('description', formData.description)
    if (formData.originalPrescriber) fd.append('original_prescriber', formData.originalPrescriber)
    if (formData.originalDate) fd.append('original_prescription_date', formData.originalDate)

    try {
      await prescriptionUploadsApi.upload(patientId, fd)
      setSelectedFile(null)
      setFormData({ description: '', originalPrescriber: '', originalDate: '' })
      setUploadProgress(100)
      onUploadSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleReview = async (uploadId: string) => {
    try {
      await prescriptionUploadsApi.review(patientId, uploadId)
      onUploadSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (uploadId: string) => {
    if (!confirm('Delete this prescription upload? This cannot be undone.')) return
    try {
      await prescriptionUploadsApi.delete(patientId, uploadId)
      onUploadSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Upload Section ─────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Upload size={18} style={{ color: 'var(--brand-400)' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: 15 }}>Upload Previous Prescription</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              For {patientName} — PDF, PNG, JPG, DOCX up to 50MB
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ marginBottom: 16 }}
        >
          <input {...getInputProps()} id="prescription-upload-input" />
          <motion.div
            initial={false}
            animate={{ scale: isDragActive ? 1.02 : 1 }}
            transition={{ duration: 0.15 }}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                {FILE_ICONS[selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf']}
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{selectedFile.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                  className="btn btn-ghost btn-icon"
                  style={{ marginLeft: 8 }}
                  aria-label="Remove selected file"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ) : (
              <div>
                <Upload size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  PDF, PNG, JPG, DOCX — up to 50MB
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Metadata form */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
              style={{ marginBottom: 16 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    <User size={11} style={{ display: 'inline', marginRight: 4 }} />
                    Original Prescriber
                  </label>
                  <input
                    className="input"
                    placeholder="Dr. Name / Hospital"
                    value={formData.originalPrescriber}
                    onChange={e => setFormData(f => ({ ...f, originalPrescriber: e.target.value }))}
                    id="rx-upload-prescriber"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                    Original Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.originalDate}
                    onChange={e => setFormData(f => ({ ...f, originalDate: e.target.value }))}
                    id="rx-upload-date"
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Description (optional)
                </label>
                <input
                  className="input"
                  placeholder="e.g., Cardiology follow-up prescription from General Hospital"
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  id="rx-upload-description"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: 8, marginBottom: 12, fontSize: 13, color: 'var(--rose-400)'
          }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Upload button */}
        {selectedFile && (
          <button
            id="rx-upload-submit"
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
            style={{ width: '100%' }}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload & Index Prescription
              </>
            )}
          </button>
        )}

        {/* Info note */}
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(99,102,241,0.05)', borderRadius: 8, fontSize: 12,
          color: 'var(--text-muted)', lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--brand-400)' }}>🔬 AI Processing:</strong>{' '}
          The document will be OCR'd, text extracted, and indexed in the patient's AI memory.
          The AI will then be able to answer questions about this prescription history.
        </div>
      </div>

      {/* ── Uploads List ──────────────────────────────────────────── */}
      {uploads.length > 0 && (
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontWeight: 600, fontSize: 14 }}>
              Uploaded Prescriptions ({uploads.length})
            </h3>
          </div>
          <div>
            {uploads.map((upload) => {
              const status = STATUS_CONFIG[upload.status]
              const ext = upload.file_type?.toLowerCase() || 'pdf'
              const isExpanded = expandedId === upload.id

              return (
                <motion.div
                  key={upload.id}
                  layout
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '14px 20px',
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {FILE_ICONS[ext] || <FileText size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {upload.original_filename}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                        <span className={`badge ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        {upload.original_prescriber && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {upload.original_prescriber}
                          </span>
                        )}
                        {upload.original_prescription_date && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {new Date(upload.original_prescription_date).toLocaleDateString()}
                          </span>
                        )}
                        {upload.is_reviewed && (
                          <span style={{ fontSize: 11, color: 'var(--emerald-400)' }}>✓ Reviewed</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      {upload.status === 'indexed' && !upload.is_reviewed && (
                        <button
                          id={`rx-review-${upload.id}`}
                          className="btn btn-sm"
                          style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--emerald-400)', border: '1px solid rgba(16,185,129,0.2)' }}
                          onClick={() => handleReview(upload.id)}
                        >
                          <CheckCircle2 size={12} />
                          Review
                        </button>
                      )}
                      {upload.status === 'indexed' && (
                        <button
                          id={`rx-expand-${upload.id}`}
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => setExpandedId(isExpanded ? null : upload.id)}
                          aria-label="Toggle details"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                      <button
                        id={`rx-delete-${upload.id}`}
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(upload.id)}
                        style={{ color: 'var(--rose-400)' }}
                        aria-label="Delete upload"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && upload.extracted_data && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          marginTop: 12,
                          background: 'var(--bg-elevated)',
                          borderRadius: 10,
                          padding: 14,
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <Stethoscope size={13} style={{ color: 'var(--brand-400)' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-400)' }}>
                            AI Extracted Data
                          </span>
                          <span className={`badge ${upload.extraction_confidence === 'high' ? 'badge-success' : upload.extraction_confidence === 'medium' ? 'badge-warning' : 'badge-muted'}`}>
                            {upload.extraction_confidence || 'low'} confidence
                          </span>
                        </div>

                        {upload.extracted_data.medicines && upload.extracted_data.medicines.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Medicines Detected</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {upload.extracted_data.medicines.map((med, i) => (
                                <span key={i} style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 4,
                                  background: 'rgba(99,102,241,0.1)', borderRadius: 6,
                                  padding: '3px 10px', fontSize: 12
                                }}>
                                  <Pill size={10} />
                                  {med.name} {med.dosage}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {upload.extracted_data.prescriber_name && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            <strong>Prescriber:</strong> {upload.extracted_data.prescriber_name}
                          </p>
                        )}

                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>
                          ⚠ AI extraction is not clinically verified. Always confirm with the original document.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {uploads.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          color: 'var(--text-muted)', fontSize: 13,
          border: '1px dashed var(--border-subtle)', borderRadius: 12
        }}>
          <FileText size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
          <p>No previous prescriptions uploaded yet.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Upload PDFs or images of historical prescriptions to include them in AI queries.</p>
        </div>
      )}
    </div>
  )
}
