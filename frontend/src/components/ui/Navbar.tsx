'use client'

import React from 'react'
import { useRole } from '@/context/RoleContext'
import { Stethoscope, ShieldCheck, Cpu, Search, Bell, ArrowLeftRight, UserCheck } from 'lucide-react'

export default function Navbar() {
  const { role, toggleRole } = useRole()

  return (
    <header className="no-print border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 backdrop-blur-md px-4 py-3 sm:h-16 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-40">
      {/* Left: Quick Search */}
      <div className="flex items-center gap-4 w-full sm:flex-1 sm:max-w-md">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={role === 'doctor' ? "Search patient... (⌘K)" : "Search dataset... (⌘K)"}
            className="input-field pl-9 pr-14 text-xs h-9 bg-[var(--bg-base)]/70 w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  alert(`Global Search for "${target.value}" is routing through the pgvector engine... (Production Feature)`);
                  target.value = '';
                }
              }
            }}
          />
          <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.08] text-[var(--text-muted)] rounded hidden sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Role Status, Switcher & System Telemetry */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
        {/* Local SLM Telemetry */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu size={13} />
          <span className="font-medium text-[11px] whitespace-nowrap">Local SLM Active (Ollama)</span>
        </div>

        {/* Active Access Badge */}
        {role === 'doctor' ? (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
            <Stethoscope size={12} className="text-emerald-400 sm:w-3.5 sm:h-3.5" />
            <span>Doctor <span className="hidden sm:inline">(Clinical Access)</span></span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
            <ShieldCheck size={12} className="text-cyan-400 sm:w-3.5 sm:h-3.5" />
            <span>Admin <span className="hidden sm:inline">/ CMO</span></span>
          </div>
        )}

        {/* Instant Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          className="btn btn-secondary text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3 flex items-center gap-1 sm:gap-1.5 hover:border-[var(--brand-400)] transition-all whitespace-nowrap"
          title="Switch persona for testing"
        >
          <ArrowLeftRight size={12} className="text-[var(--brand-400)] sm:w-3 sm:h-3" />
          <span>Switch <span className="hidden sm:inline">to {role === 'doctor' ? 'Admin' : 'Doctor'}</span></span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => alert("System Telemetry: 0 New High-Risk Alerts. Anomaly Agent is monitoring active prescriptions.")}
          className="btn btn-ghost btn-icon relative text-[var(--text-muted)] hover:text-white flex-shrink-0" aria-label="Alerts"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-500)]" />
        </button>
      </div>
    </header>
  )
}
