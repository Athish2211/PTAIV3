'use client'

/**
 * DatasetUpload — NEW FEATURE
 * Allows doctors/analysts to upload external datasets (CSV/Excel/JSON)
 * and use them for prescription trend analysis.
 * 
 * Features:
 * - Drag-and-drop file upload
 * - Real-time profiling status polling
 * - Schema mapping review table with confidence indicators
 * - Field mapping editor (override auto-detected mapping)
 * - Analytics trigger
 */

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Database, FileSpreadsheet, CheckCircle2, XCircle,
  AlertCircle, Clock, Loader2, ChevronDown, ChevronUp,
  Trash2, Play, ArrowRight, Info, AlertTriangle,
  TrendingUp, Activity, Grid3X3
} from 'lucide-react'
import { datasetsApi } from '@/services/api'

interface ColumnProfile {
  name: string
  dtype: string
  null_pct: number
  unique_count: number
  cardinality: string
  sample_values: any[]
  canonical_field?: string
  mapping_confidence?: string
}

interface Dataset {
  id: string
  name: string
  description?: string
  filename: string
  file_type: string
  file_size_bytes: number
  row_count?: number
  column_count?: number
  status: 'uploaded' | 'profiling' | 'ready' | 'failed'
  analytics_enabled: boolean
  schema_detected?: Record<string, string>
  schema_mapped?: Record<string, { source_column: string; confidence: string }>
  mapping_confidence?: string
  column_profiles?: ColumnProfile[]
  data_quality_score?: number
  mapping_reviewed: boolean
}

interface DatasetUploadProps {
  datasets: Dataset[]
  onUploadSuccess: () => void
}

const CANONICAL_FIELDS = [
  { key: 'patient_id', label: 'Patient ID', required: true },
  { key: 'encounter_id', label: 'Encounter ID', required: false },
  { key: 'date', label: 'Date', required: true },
  { key: 'diagnosis', label: 'Diagnosis', required: false },
  { key: 'medication', label: 'Medication', required: true },
  { key: 'dosage', label: 'Dosage', required: false },
  { key: 'frequency', label: 'Frequency', required: false },
  { key: 'age', label: 'Age', required: false },
  { key: 'gender', label: 'Gender', required: false },
  { key: 'region', label: 'Region', required: false },
  { key: 'risk_score', label: 'Risk Score', required: false },
  { key: 'prescriber', label: 'Prescriber', required: false },
  { key: 'quantity', label: 'Quantity', required: false },
]

const ANALYSIS_TYPES = [
  { key: 'trend', label: 'Trend Analysis', icon: <TrendingUp size={14} />, color: 'var(--brand-400)' },
  { key: 'anomaly', label: 'Anomaly Detection', icon: <Activity size={14} />, color: 'var(--amber-400)' },
  { key: 'pattern', label: 'Pattern Mining', icon: <Grid3X3 size={14} />, color: 'var(--teal-400)' },
]

export default function DatasetUpload({ datasets, onUploadSuccess }: DatasetUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingMapping, setEditingMapping] = useState<Record<string, string>>({})
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>(['trend', 'anomaly', 'pattern'])
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      if (!formData.name) {
        setFormData(f => ({ ...f, name: file.name.replace(/\.[^.]+$/, '') }))
      }
    }
  }, [formData.name])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxSize: 100 * 1024 * 1024,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0]
      if (err?.code === 'file-too-large') setError('File too large. Maximum 100MB.')
      else setError('Invalid file type. Allowed: CSV, XLSX, XLS, JSON.')
    },
  })

  const handleUpload = async () => {
    if (!selectedFile || !formData.name.trim()) return
    setUploading(true)
    setError('')

    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('name', formData.name)
    if (formData.description) fd.append('description', formData.description)

    try {
      await datasetsApi.upload(fd)
      setSelectedFile(null)
      setFormData({ name: '', description: '' })
      onUploadSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleApproveMapping = async (dataset: Dataset) => {
    const mapping: Record<string, any> = {}
    // Combine auto-detected + manual overrides
    if (dataset.schema_mapped) {
      Object.entries(dataset.schema_mapped).forEach(([canonical, info]) => {
        mapping[canonical] = editingMapping[canonical] || info.source_column
      })
    }
    try {
      await datasetsApi.updateMapping(dataset.id, { manual_mapping: mapping })
      onUploadSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRunAnalysis = async (datasetId: string) => {
    if (selectedAnalyses.length === 0) return
    setRunningAnalysis(datasetId)
    try {
      const res = await datasetsApi.analyze(datasetId, selectedAnalyses)
      alert(`Analytics started! Run ID: ${res.data.analytics_run_id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setRunningAnalysis(null)
    }
  }

  const getConfidenceColor = (confidence?: string) => {
    if (confidence === 'high') return 'var(--emerald-400)'
    if (confidence === 'medium') return 'var(--amber-400)'
    return 'var(--text-muted)'
  }

  const getQualityColor = (score?: number) => {
    if (!score) return 'var(--text-muted)'
    if (score >= 80) return 'var(--emerald-400)'
    if (score >= 50) return 'var(--amber-400)'
    return 'var(--rose-400)'
  }

  return (
    <div className="space-y-6">
      {/* ── Upload Section ─────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Database size={18} style={{ color: 'var(--teal-400)' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: 15 }}>Upload External Dataset</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              CSV, Excel, or JSON — up to 100MB — for analytics alongside EHR data
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ marginBottom: 16 }}
        >
          <input {...getInputProps()} id="dataset-upload-input" />
          <motion.div animate={{ scale: isDragActive ? 1.02 : 1 }} transition={{ duration: 0.15 }}>
            {selectedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <FileSpreadsheet size={24} style={{ color: 'var(--teal-400)' }} />
                <div>
                  <p style={{ fontWeight: 500 }}>{selectedFile.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                  className="btn btn-ghost btn-icon"
                  aria-label="Remove file"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ) : (
              <div>
                <FileSpreadsheet size={32} style={{ color: 'var(--teal-400)', margin: '0 auto 12px', opacity: 0.7 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  {isDragActive ? 'Drop the dataset here' : 'Drag & drop or click to upload'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  CSV, XLSX, XLS, JSON — up to 100MB
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 16 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Dataset Name *
                  </label>
                  <input
                    className="input"
                    placeholder="e.g., Q3 2024 Cardiology Prescriptions"
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    id="dataset-name"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Description
                  </label>
                  <input
                    className="input"
                    placeholder="Source, purpose, date range..."
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    id="dataset-description"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {selectedFile && (
          <button
            id="dataset-upload-submit"
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading || !formData.name.trim()}
            style={{ width: '100%' }}
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" />Uploading & Profiling...</>
            ) : (
              <><Upload size={16} />Upload Dataset</>
            )}
          </button>
        )}

        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(20,184,166,0.05)', borderRadius: 8,
          fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--teal-400)' }}>🧠 Data Intelligence Agent:</strong>{' '}
          After upload, the AI will automatically profile the dataset, detect column types,
          and map them to the canonical analytics schema. You can review and edit the mapping
          before enabling analytics.
        </div>
      </div>

      {/* ── Datasets List ──────────────────────────────────────────── */}
      {datasets.map((dataset) => {
        const isExpanded = expandedId === dataset.id
        const statusConfig = {
          uploaded: { label: 'Queued', color: 'badge-muted', icon: <Clock size={10} /> },
          profiling: { label: 'Profiling...', color: 'badge-warning', icon: <Loader2 size={10} className="animate-spin" /> },
          ready: { label: 'Ready', color: 'badge-success', icon: <CheckCircle2 size={10} /> },
          failed: { label: 'Failed', color: 'badge-danger', icon: <XCircle size={10} /> },
        }[dataset.status]

        return (
          <motion.div key={dataset.id} layout className="card">
            {/* Dataset header */}
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(20,184,166,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileSpreadsheet size={18} style={{ color: 'var(--teal-400)' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {dataset.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <span className={`badge ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  {dataset.row_count && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {dataset.row_count.toLocaleString()} rows · {dataset.column_count} cols
                    </span>
                  )}
                  {dataset.data_quality_score !== undefined && (
                    <span style={{ fontSize: 11, color: getQualityColor(dataset.data_quality_score) }}>
                      Quality: {dataset.data_quality_score}%
                    </span>
                  )}
                  {dataset.analytics_enabled && (
                    <span style={{ fontSize: 11, color: 'var(--emerald-400)' }}>✓ Analytics Enabled</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {dataset.status === 'ready' && !dataset.mapping_reviewed && (
                  <button
                    id={`dataset-review-${dataset.id}`}
                    className="btn btn-sm btn-primary"
                    onClick={() => setExpandedId(dataset.id)}
                    style={{ fontSize: 12 }}
                  >
                    Review Mapping
                  </button>
                )}
                {dataset.analytics_enabled && (
                  <button
                    id={`dataset-analyze-${dataset.id}`}
                    className="btn btn-sm"
                    style={{ background: 'rgba(20,184,166,0.12)', color: 'var(--teal-400)', border: '1px solid rgba(20,184,166,0.2)' }}
                    onClick={() => handleRunAnalysis(dataset.id)}
                    disabled={runningAnalysis === dataset.id}
                  >
                    {runningAnalysis === dataset.id ? (
                      <><Loader2 size={12} className="animate-spin" />Running...</>
                    ) : (
                      <><Play size={12} />Run Analysis</>
                    )}
                  </button>
                )}
                {dataset.status === 'ready' && (
                  <button
                    id={`dataset-expand-${dataset.id}`}
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setExpandedId(isExpanded ? null : dataset.id)}
                    aria-label="Toggle schema"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
                <button
                  id={`dataset-delete-${dataset.id}`}
                  className="btn btn-ghost btn-icon btn-sm"
                  style={{ color: 'var(--rose-400)' }}
                  onClick={async () => {
                    if (!confirm('Delete this dataset?')) return
                    await datasetsApi.delete(dataset.id)
                    onUploadSuccess()
                  }}
                  aria-label="Delete dataset"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Schema mapping panel */}
            <AnimatePresence>
              {isExpanded && dataset.schema_mapped && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    padding: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: 14 }}>Schema Mapping</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Review and confirm how your columns map to the analytics schema.
                      </p>
                    </div>
                    <span className={`badge ${dataset.mapping_confidence === 'high' ? 'badge-success' : dataset.mapping_confidence === 'medium' ? 'badge-warning' : 'badge-muted'}`}>
                      {dataset.mapping_confidence || 'low'} confidence
                    </span>
                  </div>

                  {/* Mapping table */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 80px',
                      gap: 8, marginBottom: 8,
                      fontSize: 11, fontWeight: 600,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      <span>Canonical Field</span>
                      <span>Your Column</span>
                      <span>Confidence</span>
                    </div>
                    {CANONICAL_FIELDS.map(({ key, label, required }) => {
                      const mapped = dataset.schema_mapped?.[key]
                      const columns = Object.keys(dataset.schema_detected || {})
                      return (
                        <div key={key} style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr 80px',
                          gap: 8, padding: '8px 0',
                          borderBottom: '1px solid var(--border-subtle)',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                            {required && (
                              <span style={{ fontSize: 10, color: 'var(--rose-400)', fontWeight: 700 }}>REQ</span>
                            )}
                          </div>
                          <select
                            id={`mapping-${dataset.id}-${key}`}
                            className="input"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            value={editingMapping[key] || mapped?.source_column || ''}
                            onChange={e => setEditingMapping(prev => ({ ...prev, [key]: e.target.value }))}
                          >
                            <option value="">— Not mapped —</option>
                            {columns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            color: getConfidenceColor(mapped?.confidence)
                          }}>
                            {mapped ? mapped.confidence : '—'}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Analysis type selection */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Run these analyses after enabling:</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {ANALYSIS_TYPES.map(({ key, label, icon, color }) => (
                        <button
                          key={key}
                          id={`analysis-type-${key}`}
                          className="btn btn-sm"
                          style={{
                            background: selectedAnalyses.includes(key) ? `rgba(${color}, 0.15)` : 'var(--bg-elevated)',
                            color: selectedAnalyses.includes(key) ? color : 'var(--text-muted)',
                            border: `1px solid ${selectedAnalyses.includes(key) ? color : 'var(--border-default)'}`,
                          }}
                          onClick={() => setSelectedAnalyses(prev =>
                            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
                          )}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      id={`dataset-approve-${dataset.id}`}
                      className="btn btn-primary"
                      onClick={() => handleApproveMapping(dataset)}
                    >
                      <CheckCircle2 size={14} />
                      Confirm Mapping & Enable Analytics
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setExpandedId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {datasets.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          color: 'var(--text-muted)', fontSize: 13,
          border: '1px dashed var(--border-subtle)', borderRadius: 12
        }}>
          <Database size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
          <p>No external datasets uploaded yet.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Upload CSV or Excel files to run analytics on external data alongside your EHR.
          </p>
        </div>
      )}
    </div>
  )
}
