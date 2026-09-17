'use client'

import React from 'react'
import { useRole } from '@/context/RoleContext'
import { Stethoscope, ShieldCheck, Cpu, Search, Bell, ArrowLeftRight, UserCheck } from 'lucide-react'

export default function Navbar() {
  const { role, toggleRole } = useRole()

  return (
    <header className="no-print h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Quick Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={role === 'doctor' ? "Search patient by Name, MRN or Condition... (⌘K)" : "Search de-identified cohort or dataset... (⌘K)"}
            className="input-field pl-9 pr-14 text-xs h-9 bg-[var(--bg-base)]/70"
          />
          <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.08] text-[var(--text-muted)] rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Role Status, Switcher & System Telemetry */}
      <div className="flex items-center gap-4">
        {/* Local SLM Telemetry */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu size={13} />
          <span className="font-medium text-[11px]">Local SLM Active (Ollama)</span>
        </div>

        {/* Active Access Badge */}
        {role === 'doctor' ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Stethoscope size={14} className="text-emerald-400" />
            <span>Doctor (Clinical Access)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Data Admin / CMO (De-Identified)</span>
          </div>
        )}

        {/* Instant Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-[var(--brand-400)] transition-all"
          title="Switch persona for testing"
        >
          <ArrowLeftRight size={13} className="text-[var(--brand-400)]" />
          <span>Switch to {role === 'doctor' ? 'Admin / CMO' : 'Doctor'}</span>
        </button>

        {/* Notifications */}
        <button className="btn btn-ghost btn-icon relative text-[var(--text-muted)] hover:text-white" aria-label="Alerts">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-500)]" />
        </button>
      </div>
    </header>
  )
}
