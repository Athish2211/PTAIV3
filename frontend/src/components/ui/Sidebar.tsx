'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Pill, Activity, Bot, ShieldCheck,
  ChevronRight, Stethoscope, PlusCircle, Lock, Menu, X, FileText,
  Home, Bug, AlertTriangle, Search, TrendingUp, BarChart
} from 'lucide-react'
import { useRole } from '@/context/RoleContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { role } = useRole()
  const [collapsed, setCollapsed] = useState(false)

  const doctorNav = [
    { href: '/dashboard', label: 'Clinical Hub', icon: LayoutDashboard },
    { href: '/prescriptions/new', label: 'Generate Prescription', icon: PlusCircle, highlight: true },
    { href: '/ai', label: 'Patient Lookup (RAG)', icon: Bot },
    { href: '/prescriptions', label: 'Prescriptions', icon: Pill },
    { href: '/patients', label: 'Assigned Patients', icon: Users },
    { href: '/analytics', label: 'Data Analysis', icon: Activity },
  ]

  const adminNav = [
    { href: '/dashboard', label: 'Overview', icon: Home, highlight: true },
    { href: '/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/patients', label: 'Patients', icon: Users },
    { href: '/diseases', label: 'Diseases', icon: Bug },
    { href: '/medicines', label: 'Medicines', icon: Pill },
    { href: '/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/risk-analytics', label: 'Risk Analytics', icon: AlertTriangle },
    { href: '/anomalies', label: 'Anomalies', icon: Search },
    { href: '/patient-cohorts', label: 'Patient Cohorts', icon: Users },
    { href: '/trends', label: 'Trends & Forecasts', icon: TrendingUp },
    { href: '/reports', label: 'Reports', icon: BarChart },
  ]

  const navItems = role === 'doctor' ? doctorNav : adminNav

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      <motion.aside
        className={`no-print h-screen sticky top-0 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 backdrop-blur-xl z-50 transition-all ${
          collapsed ? 'hidden md:flex' : 'fixed md:relative'
        }`}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
            <Stethoscope size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="whitespace-nowrap"
              >
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  PTAI <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">v3</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-medium">Prescription & Analytics</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-icon text-[var(--text-muted)] hover:text-white"
          aria-label="Toggle navigation"
        >
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Role Switcher Pill in Sidebar */}
      {!collapsed && (
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Current Portal
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className={`w-2 h-2 rounded-full ${role === 'doctor' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            {role === 'doctor' ? 'Doctor Workstation' : 'Medical Administration'}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, highlight }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[var(--brand-500)] text-white shadow-lg shadow-indigo-500/20 font-semibold'
                  : highlight
                  ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20'
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-white' : highlight ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate flex-1"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <ChevronRight size={13} className="text-white/70 ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
            {role === 'doctor' ? 'DU' : 'AD'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate flex-1"
              >
                <div className="text-xs font-semibold text-white truncate">
                  {role === 'doctor' ? 'Dr. Dinesh Kumar' : 'Admin / CMO'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {role === 'doctor' ? 'Attending Physician' : 'Population Analytics'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
    </>
  )
}
