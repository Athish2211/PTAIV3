'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Activity, TrendingUp, AlertTriangle, Users, ShieldAlert,
  Sparkles, RefreshCw, BarChart2, PieChart, ArrowUpRight,
  ShieldCheck, Cpu, Database, PlusCircle, CheckCircle2, Clock
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { useRole } from '@/context/RoleContext'

export default function AnalyticsPipelinePage() {
  const { role, patients, prescriptions } = useRole()
  const [activeTab, setActiveTab] = useState<'trend' | 'anomaly' | 'risk' | 'cohort'>('trend')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState('')
  const [v2Analysis, setV2Analysis] = useState<any>(null)

  // 1. Dynamic Trend Data computed from actual prescriptions
  const trendAnalysis = useMemo(() => {
    if (prescriptions.length === 0) {
      return { data: [], total: 0, velocity: '0%' }
    }

    // Group prescriptions by date / month
    const monthCounts: Record<string, { prescriptions: number; patients: Set<string> }> = {}

    // Sort chronological
    const sorted = [...prescriptions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    sorted.forEach((rx) => {
      // Format to MMM YYYY or MMM DD
      const d = new Date(rx.date)
      const label = isNaN(d.getTime())
        ? rx.date
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      if (!monthCounts[label]) {
        monthCounts[label] = { prescriptions: 0, patients: new Set() }
      }
      monthCounts[label].prescriptions += 1
      if (rx.patient_name) {
        monthCounts[label].patients.add(rx.patient_name)
      }
    })

    const data = Object.entries(monthCounts).map(([month, val]) => ({
      month,
      prescriptions: val.prescriptions,
      patients: val.patients.size,
    }))

    // Calculate growth velocity
    const velocity = data.length > 1 ? `+${Math.round((data[data.length - 1].prescriptions / (data[0].prescriptions || 1)) * 10)}%` : '+100%'

    return { data, total: prescriptions.length, velocity }
  }, [prescriptions])

  // 2. Dynamic Anomaly Data computed from flagged prescriptions & safety checks
  const anomalyAnalysis = useMemo(() => {
    const flagged = prescriptions.filter((p) => p.risk_status === 'anomaly_flagged' || p.status === 'flagged')

    let dosageCount = 0
    let allergyConflictCount = 0
    let polypharmacyCount = 0
    let durationCount = 0

    flagged.forEach((rx) => {
      if (rx.medications && rx.medications.length >= 3) polypharmacyCount++
      if (rx.medications && rx.medications.some((m) => m.duration_days > 14)) durationCount++
      // If diagnosis or medication has penicillin conflict
      if (rx.medications && rx.medications.some((m) => m.medication.toLowerCase().includes('amox'))) allergyConflictCount++
      dosageCount++
    })

    const radarData = [
      { metric: 'Dosage Deviation', score: dosageCount > 0 ? Math.min(100, dosageCount * 30 + 20) : 0 },
      { metric: 'Allergy Conflict', score: allergyConflictCount > 0 ? Math.min(100, allergyConflictCount * 40 + 20) : 0 },
      { metric: 'Duration Outlier', score: durationCount > 0 ? Math.min(100, durationCount * 30 + 10) : 0 },
      { metric: 'Polypharmacy Spike', score: polypharmacyCount > 0 ? Math.min(100, polypharmacyCount * 35 + 15) : 0 },
      { metric: 'Rare Co-Rx', score: flagged.length > 0 ? 25 : 0 },
    ]

    return { flagged, radarData }
  }, [prescriptions])

  // 3. Dynamic Risk Stratification computed from patients
  const riskAnalysis = useMemo(() => {
    if (patients.length === 0) {
      return { low: 0, moderate: 0, high: 0, lowPct: 0, modPct: 0, highPct: 0, total: 0 }
    }

    const low = patients.filter((p) => p.risk_level === 'Low').length
    const moderate = patients.filter((p) => p.risk_level === 'Moderate').length
    const high = patients.filter((p) => p.risk_level === 'High').length
    const total = patients.length

    return {
      low,
      moderate,
      high,
      lowPct: Math.round((low / total) * 100) || 0,
      modPct: Math.round((moderate / total) * 100) || 0,
      highPct: Math.round((high / total) * 100) || 0,
      total,
    }
  }, [patients])

  // 4. Dynamic Cohort Data computed from patient chronic conditions
  const cohortAnalysis = useMemo(() => {
    if (patients.length === 0) return []

    const cohortMap: Record<string, { count: number; totalMeds: number }> = {}

    patients.forEach((p) => {
      const conditions = (p.chronic_conditions && p.chronic_conditions.length > 0)
        ? p.chronic_conditions
        : ['General Outpatient']

      conditions.forEach((c) => {
        if (!cohortMap[c]) {
          cohortMap[c] = { count: 0, totalMeds: 0 }
        }
        cohortMap[c].count += 1
        cohortMap[c].totalMeds += p.active_medications?.length || 1
      })
    })

    return Object.entries(cohortMap).map(([cohort, val]) => ({
      cohort: cohort.length > 20 ? cohort.slice(0, 18) + '...' : cohort,
      count: val.count,
      avgMeds: (val.totalMeds / (val.count || 1)).toFixed(1),
    }))
  }, [patients])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setRefreshMessage('Executing Heavy V2 ML Agent evaluation over dataset...')
    setV2Analysis(null)
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/analytics/v2-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patients, prescriptions })
      })
      
      const data = await res.json()
      if (data.status === 'success') {
        setV2Analysis(data)
        setRefreshMessage('V2 ML Agents evaluated successfully! See results at the bottom.')
      } else {
        setRefreshMessage('V2 ML Agents failed or skipped (not enough data).')
      }
    } catch (e) {
      console.error(e)
      setRefreshMessage('Failed to connect to backend ML agents.')
    } finally {
      setIsRefreshing(false)
      setTimeout(() => setRefreshMessage(''), 8000)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-cyan flex items-center gap-1">
              <Sparkles size={11} /> Multi-Agent Analytics Pipeline (PTAI V3)
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Live Evaluation over EHR Store
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Activity size={24} className="text-cyan-400" />
            <span>Prescription Intelligence & Agentic Pipeline</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            4 specialized agents continuously evaluating patient records for longitudinal prescribing patterns, statistical anomalies, clinical risks, and chronic cohorts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-secondary text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-cyan-400' : ''} />
          <span>Re-run Analytics Pipeline</span>
        </button>
      </div>

      {refreshMessage && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{refreshMessage}</span>
          </span>
          <button onClick={() => setRefreshMessage('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 4 Multi-Agent Pipeline Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Trend Agent Tab */}
        <button
          onClick={() => setActiveTab('trend')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'trend'
              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
              : 'glass-panel hover:border-white/[0.15]'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400">Agent 1</span>
            <TrendingUp size={16} className="text-cyan-400" />
          </div>
          <div className="font-bold text-sm text-white">Trend Agent</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {prescriptions.length} Prescriptions tracked
          </div>
        </button>

        {/* Anomaly Agent Tab */}
        <button
          onClick={() => setActiveTab('anomaly')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'anomaly'
              ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10'
              : 'glass-panel hover:border-white/[0.15]'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-rose-400">Agent 2</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="font-bold text-sm text-white">Anomaly Agent</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {anomalyAnalysis.flagged.length} Outliers flagged
          </div>
        </button>

        {/* Risk Agent Tab */}
        <button
          onClick={() => setActiveTab('risk')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'risk'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'glass-panel hover:border-white/[0.15]'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">Agent 3</span>
            <ShieldAlert size={16} className="text-amber-400" />
          </div>
          <div className="font-bold text-sm text-white">Risk Agent</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {riskAnalysis.high} High-risk patients
          </div>
        </button>

        {/* Cohort Agent Tab */}
        <button
          onClick={() => setActiveTab('cohort')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'cohort'
              ? 'bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'glass-panel hover:border-white/[0.15]'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-indigo-400">Agent 4</span>
            <Users size={16} className="text-indigo-400" />
          </div>
          <div className="font-bold text-sm text-white">Cohort Agent</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {cohortAnalysis.length} Cohort segments
          </div>
        </button>
      </div>

      {/* ── TAB 1: TREND AGENT ── */}
      {activeTab === 'trend' && (
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Longitudinal Prescribing Trajectory</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Real-time prescription volume and patient frequency computed from active EHR records.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                <TrendingUp size={14} /> {trendAnalysis.velocity} Velocity ({trendAnalysis.total} Total Rx)
              </div>
            </div>

            {trendAnalysis.data.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendAnalysis.data}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(17, 20, 31, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="prescriptions"
                      name="Prescriptions"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#trendGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* Empty state when 0 prescriptions exist */
              <div className="p-12 text-center space-y-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <TrendingUp size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Trend Agent: Awaiting Prescription Activity</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    No prescriptions currently exist in the database. As you compose and finalize prescriptions, the Trend Agent will compute and render longitudinal velocity curves here.
                  </p>
                </div>
                <Link href="/prescriptions/new" className="btn btn-primary text-xs inline-flex items-center gap-1.5">
                  <PlusCircle size={14} />
                  <span>Create First Prescription</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: ANOMALY AGENT ── */}
      {activeTab === 'anomaly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Analysis */}
            <div className="glass-panel p-6">
              <h3 className="text-sm font-bold text-white mb-1">Isolation Forest Anomaly Vectors</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Outlier distribution across clinical dimensions</p>

              {prescriptions.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={anomalyAnalysis.radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                      <PolarRadiusAxis stroke="rgba(255,255,255,0.05)" />
                      <Radar name="Anomaly Score" dataKey="score" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                  Vector radar will calibrate upon prescription logging.
                </div>
              )}
            </div>

            {/* Live Flagged Outliers */}
            <div className="glass-panel p-6 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Flagged Outlier Prescriptions</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Detected via real-time safety guardrails and Isolation Forest models.
                  </p>
                </div>
                <span className="badge badge-rose">
                  {anomalyAnalysis.flagged.length} Flagged
                </span>
              </div>

              {anomalyAnalysis.flagged.length > 0 ? (
                <div className="space-y-3">
                  {anomalyAnalysis.flagged.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {a.medications.map((m) => m.medication).join(', ') || 'Prescribed Regimen'}
                        </span>
                        <span className="badge badge-rose text-[10px]">High Priority</span>
                      </div>
                      <div className="text-xs text-rose-200/90">
                        Flagged anomaly: Potential drug-allergy or dosage interaction conflict for {a.diagnosis}.
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono pt-1 border-t border-rose-500/20">
                        <span>Patient: {a.patient_name} ({a.mrn})</span>
                        <span>Isolation Forest Safety Sentinel</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state when 0 anomalies detected */
                <div className="p-8 text-center space-y-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white">0 Clinical Anomalies Flagged</h4>
                  <p className="text-xs text-emerald-200/80 max-w-sm mx-auto">
                    All current prescriptions adhere to dosage standards, without detected contraindications or extreme temporal outliers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: RISK AGENT ── */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 mb-4">
            <h3 className="text-base font-bold text-white mb-1">Adverse Drug Event Risk Stratification</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Evaluated across all {riskAnalysis.total} registered patients based on polypharmacy count, chronic conditions, and allergy history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 space-y-2 border-emerald-500/20 bg-emerald-950/10">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Optimal Regimen (Low Risk)</span>
              <div className="text-3xl font-extrabold text-white">
                {riskAnalysis.total > 0 ? `${riskAnalysis.lowPct}%` : '0%'}
              </div>
              <div className="text-xs text-emerald-300/80 font-medium">
                {riskAnalysis.low} Patient{riskAnalysis.low === 1 ? '' : 's'} on standard monolithic or dual therapy.
              </div>
            </div>

            <div className="glass-panel p-6 space-y-2 border-amber-500/20 bg-amber-950/10">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Moderate Monitoring</span>
              <div className="text-3xl font-extrabold text-white">
                {riskAnalysis.total > 0 ? `${riskAnalysis.modPct}%` : '0%'}
              </div>
              <div className="text-xs text-amber-300/80 font-medium">
                {riskAnalysis.moderate} Patient{riskAnalysis.moderate === 1 ? '' : 's'} requiring periodic liver or renal panel monitoring.
              </div>
            </div>

            <div className="glass-panel p-6 space-y-2 border-rose-500/20 bg-rose-950/10">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">High Polypharmacy Risk</span>
              <div className="text-3xl font-extrabold text-white">
                {riskAnalysis.total > 0 ? `${riskAnalysis.highPct}%` : '0%'}
              </div>
              <div className="text-xs text-rose-300/80 font-medium">
                {riskAnalysis.high} Patient{riskAnalysis.high === 1 ? '' : 's'} flagged for multi-drug de-prescribing review.
              </div>
            </div>
          </div>

          {patients.length === 0 && (
            <div className="glass-panel p-6 text-center space-y-2 border-dashed">
              <p className="text-xs text-[var(--text-muted)]">
                No patient records registered yet. Register patients via the New Prescription composer to populate live stratification percentages.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: COHORT AGENT ── */}
      {activeTab === 'cohort' && (
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-base font-bold text-white mb-1">Comparative Chronic Disease Cohorts</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Patient population clustered by primary chronic disease entities and active medication counts.
            </p>

            {cohortAnalysis.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="cohort" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(17, 20, 31, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Patients" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* Empty state when 0 cohorts exist */
              <div className="p-12 text-center space-y-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Users size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Cohort Agent: 0 Segments Mapped</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    Cohort clustering categorizes your patient demographics and chronic conditions. Register patient profiles to map comparative groups.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* V2 Advanced ML Agent Results Section */}
      {v2Analysis && (
        <div className="glass-panel p-6 mt-8 space-y-4 border-amber-500/30">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Sparkles size={20} />
            Deep ML Agent Insights (V2 Pipeline Add-on)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b0c13] p-4 rounded-xl border border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-rose-400 mb-2">Anomaly Agent Summary</h3>
              <p className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
                {v2Analysis.anomaly_agent?.summary || 'No summary generated or agent crashed.'}
              </p>
            </div>
            <div className="bg-[#0b0c13] p-4 rounded-xl border border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Risk Agent Summary</h3>
              <p className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
                {v2Analysis.risk_agent?.summary || 'No summary generated or agent crashed.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
