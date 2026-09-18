'use client'

import React from 'react'
import Link from 'next/link'
import { Stethoscope, ShieldCheck, ArrowRight, Bot, Pill, Activity, Database, Cpu } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Stethoscope size={20} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
              PTAI <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">v3</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">AI-Native Electronic Health Record</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Cpu size={13} />
            <span>Local SLM Active (Ollama)</span>
          </div>
          <Link href="/dashboard" className="btn btn-primary text-xs py-2 px-4 shadow-lg shadow-indigo-500/25">
            <span>Enter EHR Portal</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto z-10 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Bot size={14} />
          <span>Multi-Agent Longitudinal Prescription Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Next-Generation <br />
          <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI-Native EHR & Prescriptions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Zero-trust clinical care with local SLMs, automated patient auto-match, live Anomaly & Risk Agent checks, hospital-grade paper printing, and secure data handling.
        </p>

        {/* Dual Track Entry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto pt-6">
          {/* Track 1: Doctor */}
          <Link
            href="/dashboard"
            className="glass-panel p-6 border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-500/10 hover:shadow-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Stethoscope size={20} />
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Clinical Portal</div>
            <h3 className="text-base font-bold text-white mb-1.5">Doctor Workstation</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-normal mb-4">
              Access Patient Lookup (AI RAG), Generate Prescriptions with live auto-match, and print physical Rx sheets.
            </p>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Enter as Physician</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Track 2: Admin / CMO */}
          <Link
            href="/analytics"
            className="glass-panel p-6 border-cyan-500/30 hover:border-cyan-500 hover:shadow-cyan-500/10 hover:shadow-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1">Analytics Console</div>
            <h3 className="text-base font-bold text-white mb-1.5">Data Admin / CMO</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-normal mb-4">
              Explore aggregated population health trends, review Anomaly & Risk agent alerts, and manage encryption settings.
            </p>
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <span>Enter as Admin / CMO</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6 z-10">
        <div>© 2026 PTAI v3. Privacy-First Electronic Health Record & Analytics Management.</div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>AES-256 Encrypted</span>
          <span>·</span>
          <span>pgvector Indexing</span>
          <span>·</span>
          <span>Local SLM Zero Retention</span>
        </div>
      </footer>
    </main>
  )
}
