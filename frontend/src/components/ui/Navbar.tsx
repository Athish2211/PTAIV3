'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/context/RoleContext'
import {
  Stethoscope, ShieldCheck, Cpu, Bell, ArrowLeftRight,
  LogOut, ChevronDown, User, Sparkles, UserPlus
} from 'lucide-react'

export default function Navbar() {
  const { role, toggleRole, currentUser, logoutUser, users, switchUser } = useRole()
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)

  const activeName = currentUser?.name || (role === 'doctor' ? 'Dr. Dinesh Kumar' : 'Dr. Sarah Connor')
  const isDemoUser = currentUser?.id === 'doc-demo' || currentUser?.id === 'admin-demo'

  return (
    <header className="no-print border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 backdrop-blur-md px-4 py-3 sm:h-16 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-40">
      {/* Left: Active Organization / Doctor Info */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[var(--text-muted)] hidden md:inline">Account:</span>
        <span className="font-semibold text-white flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${role === 'doctor' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
          <span>{activeName}</span>
          {isDemoUser && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
              Demo
            </span>
          )}
        </span>
      </div>

      {/* Right: Role Status, Switcher & System Telemetry */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
        {/* Local SLM Telemetry */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu size={13} />
          <span className="font-medium text-[11px] whitespace-nowrap">Local SLM Active (Ollama)</span>
        </div>

        {/* Active Access Badge */}
        {role === 'doctor' ? (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
            <Stethoscope size={12} className="text-emerald-400 sm:w-3.5 sm:h-3.5" />
            <span>Doctor <span className="hidden sm:inline">(Clinical Roster)</span></span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
            <ShieldCheck size={12} className="text-cyan-400 sm:w-3.5 sm:h-3.5" />
            <span>Admin <span className="hidden sm:inline">/ CMO</span></span>
          </div>
        )}

        {/* Instant Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          className="btn btn-secondary text-[10px] sm:text-xs py-1 sm:py-1.5 px-2.5 sm:px-3 flex items-center gap-1 sm:gap-1.5 hover:border-[var(--brand-400)] transition-all whitespace-nowrap"
          title="Toggle between Doctor and Admin personas"
        >
          <ArrowLeftRight size={12} className="text-[var(--brand-400)] sm:w-3 sm:h-3" />
          <span>Switch <span className="hidden sm:inline">to {role === 'doctor' ? 'Admin' : 'Doctor'}</span></span>
        </button>

        {/* Account Menu / Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-[10px] font-bold">
              {activeName.slice(0, 1)}
            </div>
            <ChevronDown size={12} className="text-[var(--text-muted)]" />
          </button>

          {showAccountDropdown && (
            <div className="absolute right-0 mt-2 w-64 glass-panel p-2 shadow-2xl border-white/[0.1] z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <div className="font-bold text-white truncate">{activeName}</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {currentUser?.email || (role === 'doctor' ? 'dr.dinesh@ptai-health.org' : 'admin@ptai-health.org')}
                </div>
                <div className="text-[10px] text-emerald-400 capitalize mt-0.5 font-mono">
                  Role: {role}
                </div>
              </div>

              {/* Quick switch between registered accounts */}
              <div className="px-2 py-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                Switch User Account
              </div>
              <div className="max-h-32 overflow-y-auto space-y-0.5">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id)
                      setShowAccountDropdown(false)
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                      currentUser?.id === u.id
                        ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/[0.05] text-[var(--text-muted)]">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between gap-1">
                <Link
                  href="/login"
                  onClick={() => setShowAccountDropdown(false)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] flex items-center gap-1.5 flex-1"
                >
                  <UserPlus size={12} />
                  <span>New Login / Signup</span>
                </Link>
                <button
                  onClick={() => {
                    setShowAccountDropdown(false)
                    logoutUser()
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button 
          onClick={() => alert("System Telemetry: 0 High-Risk Alerts. Live multi-agent verification active.")}
          className="btn btn-ghost btn-icon relative text-[var(--text-muted)] hover:text-white flex-shrink-0"
          aria-label="Alerts"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-500)]" />
        </button>
      </div>
    </header>
  )
}
