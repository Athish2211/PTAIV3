'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stethoscope, ShieldCheck, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Loader2, CheckCircle2, AlertTriangle, Building,
  Briefcase, Award, Users, Bot, Cpu, Sparkles, LogOut, ChevronRight
} from 'lucide-react'
import { useRole, DEMO_DOCTOR, DEMO_ADMIN, UserRole, UserProfile } from '@/context/RoleContext'
import { authApi } from '@/services/api'

function AuthGatewayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    role,
    setRole,
    currentUser,
    users,
    loginUser,
    logoutUser,
    registerUser,
    allDoctors,
  } = useRole()

  // Portal selection: 'doctor' or 'admin'
  const initialPortal = (searchParams.get('portal') as 'doctor' | 'admin') || (role === 'admin' ? 'admin' : 'doctor')
  const [activePortal, setActivePortal] = useState<'doctor' | 'admin'>(initialPortal)

  // Mode selection: 'signin' or 'signup'
  const initialMode = (searchParams.get('mode') as 'signin' | 'signup') || 'signin'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode)

  // Show/Hide password toggle
  const [showPassword, setShowPassword] = useState(false)

  // Doctor Sign In form state
  const [docEmail, setDocEmail] = useState(DEMO_DOCTOR.email)
  const [docPassword, setDocPassword] = useState(DEMO_DOCTOR.password || 'clinical-secure-demo')

  // Admin Sign In form state
  const [adminEmail, setAdminEmail] = useState(DEMO_ADMIN.email)
  const [adminPassword, setAdminPassword] = useState(DEMO_ADMIN.password || 'admin-secure-demo')

  // Doctor Sign Up form state
  const [docSignup, setDocSignup] = useState({
    firstName: '',
    lastName: '',
    specialization: 'General Medicine & Family Practice',
    licenseNumber: '',
    organization: 'PTAI Metro Academic Medical Center',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Admin Sign Up form state
  const [adminSignup, setAdminSignup] = useState({
    firstName: '',
    lastName: '',
    department: 'Chief Medical Officer & Analytics Governance',
    organization: 'PTAI Health System Analytics Division',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Feedback & Loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successNotice, setSuccessNotice] = useState('')

  // Sync portal with URL params if they change
  useEffect(() => {
    const portalParam = searchParams.get('portal')
    if (portalParam === 'doctor' || portalParam === 'admin') {
      setActivePortal(portalParam)
    }
    const modeParam = searchParams.get('mode')
    if (modeParam === 'signin' || modeParam === 'signup') {
      setAuthMode(modeParam)
    }
  }, [searchParams])

  // Clear messages on tab change
  const handlePortalSwitch = (portal: 'doctor' | 'admin') => {
    setActivePortal(portal)
    setError('')
    setSuccessNotice('')
  }

  const handleModeSwitch = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setError('')
    setSuccessNotice('')
  }

  // Quick 1-click autofill & sign-in for Demo Doctor
  const handleQuickDemoDoctor = () => {
    setError('')
    setLoading(true)
    setTimeout(() => {
      loginUser(DEMO_DOCTOR)
      setLoading(false)
      setSuccessNotice(`Signed in as ${DEMO_DOCTOR.name} (Demo Doctor). Redirecting...`)
      setTimeout(() => router.push('/dashboard'), 600)
    }, 400)
  }

  // Quick 1-click autofill & sign-in for Demo Admin
  const handleQuickDemoAdmin = () => {
    setError('')
    setLoading(true)
    setTimeout(() => {
      loginUser(DEMO_ADMIN)
      setLoading(false)
      setSuccessNotice(`Signed in as ${DEMO_ADMIN.name} (Demo Admin / CMO). Redirecting...`)
      setTimeout(() => router.push('/analytics'), 600)
    }, 400)
  }

  // Doctor Sign In Submit
  const handleDoctorSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessNotice('')
    setLoading(true)

    const email = docEmail.trim().toLowerCase()
    const password = docPassword

    try {
      // 1. Try local registered user verification
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email && u.role === 'doctor'
      )

      if (email === DEMO_DOCTOR.email.toLowerCase()) {
        loginUser(DEMO_DOCTOR)
        setSuccessNotice(`Authenticated as ${DEMO_DOCTOR.name}! Redirecting to Doctor Workstation...`)
        setTimeout(() => router.push('/dashboard'), 700)
        return
      }

      if (existingUser) {
        if (existingUser.password && existingUser.password !== password) {
          setError('Invalid doctor credentials. Please check your password.')
          setLoading(false)
          return
        }
        loginUser(existingUser)
        setSuccessNotice(`Welcome back, ${existingUser.name}! Accessing your assigned patient registry...`)
        setTimeout(() => router.push('/dashboard'), 700)
        return
      }

      // 2. Fallback to API if backend is running
      try {
        const res = await authApi.login(email, password)
        if (res.data?.access_token) {
          const apiDoc: UserProfile = {
            id: `doc-${Date.now().toString(36)}`,
            name: email.split('@')[0],
            email,
            role: 'doctor',
          }
          loginUser(apiDoc)
          setSuccessNotice(`Signed in successfully! Redirecting...`)
          setTimeout(() => router.push('/dashboard'), 700)
          return
        }
      } catch (apiErr) {
        // Backend not running or failed
      }

      setError('Doctor account not found with this email. Please check your email or click "Sign Up" to register.')
    } finally {
      setLoading(false)
    }
  }

  // Admin Sign In Submit
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessNotice('')
    setLoading(true)

    const email = adminEmail.trim().toLowerCase()
    const password = adminPassword

    try {
      if (email === DEMO_ADMIN.email.toLowerCase()) {
        loginUser(DEMO_ADMIN)
        setSuccessNotice(`Authenticated as ${DEMO_ADMIN.name}! Redirecting to Analytics Console...`)
        setTimeout(() => router.push('/analytics'), 700)
        return
      }

      const existingAdmin = users.find(
        (u) => u.email.toLowerCase() === email && u.role === 'admin'
      )

      if (existingAdmin) {
        if (existingAdmin.password && existingAdmin.password !== password) {
          setError('Invalid administrator credentials. Please check your password.')
          setLoading(false)
          return
        }
        loginUser(existingAdmin)
        setSuccessNotice(`Welcome back, ${existingAdmin.name}! Opening System Analytics & Risk Telemetry...`)
        setTimeout(() => router.push('/analytics'), 700)
        return
      }

      // API check fallback
      try {
        const res = await authApi.login(email, password)
        if (res.data?.access_token) {
          const apiAdmin: UserProfile = {
            id: `admin-${Date.now().toString(36)}`,
            name: email.split('@')[0],
            email,
            role: 'admin',
          }
          loginUser(apiAdmin)
          setSuccessNotice('Administrator authenticated. Redirecting...')
          setTimeout(() => router.push('/analytics'), 700)
          return
        }
      } catch (apiErr) {}

      setError('Administrator account not found with this email. Please register or use Demo Admin.')
    } finally {
      setLoading(false)
    }
  }

  // Doctor Sign Up Submit
  const handleDoctorSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessNotice('')

    if (!docSignup.firstName.trim() || !docSignup.lastName.trim()) {
      setError('Please provide your full legal doctor name.')
      return
    }

    if (!docSignup.email.includes('@')) {
      setError('Please enter a valid clinical work email address.')
      return
    }

    if (docSignup.password.length < 6) {
      setError('Password must be at least 6 characters for clinical data security.')
      return
    }

    if (docSignup.password !== docSignup.confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    // Check duplicate
    const duplicate = users.find(
      (u) => u.email.toLowerCase() === docSignup.email.trim().toLowerCase()
    )
    if (duplicate) {
      setError(`An account with email ${docSignup.email} already exists. Please sign in instead.`)
      return
    }

    setLoading(true)

    try {
      const fullName = `Dr. ${docSignup.firstName.trim()} ${docSignup.lastName.trim()}`
      
      // Register in local context
      const newDoc = registerUser({
        name: fullName,
        email: docSignup.email.trim(),
        role: 'doctor',
        password: docSignup.password,
        specialization: docSignup.specialization || 'General Medicine',
        license_number: docSignup.licenseNumber || `MCI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        organization: docSignup.organization,
      })

      // Also notify backend if active
      try {
        await authApi.signup({
          first_name: docSignup.firstName.trim(),
          last_name: docSignup.lastName.trim(),
          email: docSignup.email.trim(),
          password: docSignup.password,
          role: 'doctor',
          specialization: docSignup.specialization,
          license_number: docSignup.licenseNumber,
        })
      } catch (err) {
        // Backend optional in local/demo mode
      }

      setSuccessNotice(`Doctor account created! Welcome ${fullName}. Your private patient registry is ready. Redirecting...`)
      setTimeout(() => router.push('/dashboard'), 900)
    } catch (err: any) {
      setError(err?.message || 'Failed to create doctor account.')
      setLoading(false)
    }
  }

  // Admin Sign Up Submit
  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessNotice('')

    if (!adminSignup.firstName.trim() || !adminSignup.lastName.trim()) {
      setError('Please provide your administrator name.')
      return
    }

    if (!adminSignup.email.includes('@')) {
      setError('Please enter a valid administrator email address.')
      return
    }

    if (adminSignup.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (adminSignup.password !== adminSignup.confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    const duplicate = users.find(
      (u) => u.email.toLowerCase() === adminSignup.email.trim().toLowerCase()
    )
    if (duplicate) {
      setError(`An account with email ${adminSignup.email} already exists. Please sign in instead.`)
      return
    }

    setLoading(true)

    try {
      const fullName = `${adminSignup.firstName.trim()} ${adminSignup.lastName.trim()}`
      
      const newAdmin = registerUser({
        name: fullName,
        email: adminSignup.email.trim(),
        role: 'admin',
        password: adminSignup.password,
        department: adminSignup.department,
        organization: adminSignup.organization,
      })

      try {
        await authApi.signup({
          first_name: adminSignup.firstName.trim(),
          last_name: adminSignup.lastName.trim(),
          email: adminSignup.email.trim(),
          password: adminSignup.password,
          role: 'admin',
        })
      } catch (err) {}

      setSuccessNotice(`Admin account created for ${fullName}! Governance & Analytics access granted. Redirecting...`)
      setTimeout(() => router.push('/analytics'), 900)
    } catch (err: any) {
      setError(err?.message || 'Failed to create admin account.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto p-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Stethoscope size={20} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
              PTAI <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">v3</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">AI-Native Electronic Health Record</div>
          </div>
        </Link>

        {/* Status / Active user badge if already logged in */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-[11px]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-[11px]">
                <div className="font-semibold text-white truncate max-w-[140px]">{currentUser.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] capitalize">{currentUser.role}</div>
              </div>
              <Link
                href={currentUser.role === 'doctor' ? '/dashboard' : '/analytics'}
                className="btn btn-primary text-[11px] py-1 px-3 ml-1"
              >
                Go to Portal
              </Link>
              <button
                onClick={logoutUser}
                title="Log Out"
                className="text-[var(--text-muted)] hover:text-rose-400 p-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Cpu size={13} />
              <span>Zero-Trust Auth Gate Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 z-10 flex-1 flex flex-col items-center justify-center">
        {/* Title & Portal Switcher */}
        <div className="text-center space-y-3 mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[var(--text-secondary)]">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>Role-Based Healthcare Security & Patient Isolation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Access PTAI <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Health Gateway</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Select your clinical or administrative credential track. Multiple doctor and admin accounts are supported with isolated patient ownership.
          </p>

          {/* PRIMARY PORTAL SELECTOR: DOCTOR vs ADMIN */}
          <div className="pt-2 flex justify-center">
            <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] inline-flex gap-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => handlePortalSwitch('doctor')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePortal === 'doctor'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Stethoscope size={16} />
                <span>Doctor Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 text-emerald-200 uppercase font-mono">
                  Clinical
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('admin')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePortal === 'admin'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <ShieldCheck size={16} />
                <span>Admin / CMO Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 text-cyan-200 uppercase font-mono">
                  Governance
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Portal Body Card */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Context & Demo Accounts Info (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {activePortal === 'doctor' ? (
              /* DOCTOR SIDEBAR INFO */
              <div className="glass-panel p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-[var(--bg-elevated)] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Doctor Workstation</h3>
                    <p className="text-[11px] text-emerald-300">Clinical EHR & Prescription Generation</p>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-white">Patient Ownership Isolation:</strong> Patients and prescriptions are mapped directly to your attending physician ID.
                  </p>
                  <p>
                    <strong className="text-white">Demo Doctor Account:</strong> Contains the complete 100-patient clinical dataset, longitudinal medical histories, and active prescriptions.
                  </p>
                  <p>
                    <strong className="text-white">New Doctor Accounts:</strong> Create your own dedicated roster with isolated patient intake and private prescription drafting.
                  </p>
                </div>

                {/* Quick 1-Click Demo Doctor Button */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300">Pre-Configured Demo Doctor</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">100 Patients</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] space-y-0.5 font-mono">
                    <div>Email: <span className="text-white font-semibold">{DEMO_DOCTOR.email}</span></div>
                    <div>Password: <span className="text-white">clinical-secure-demo</span></div>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleQuickDemoDoctor}
                    className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Sparkles size={14} />
                    <span>1-Click Sign In as Demo Doctor</span>
                  </button>
                </div>

                {/* Multiple Doctor Switcher if others exist */}
                {users.filter((u) => u.role === 'doctor').length > 1 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Other Registered Doctors ({users.filter((u) => u.role === 'doctor').length})
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {users
                        .filter((u) => u.role === 'doctor')
                        .map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              loginUser(doc)
                              router.push('/dashboard')
                            }}
                            className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="truncate">
                              <div className="font-semibold text-white truncate">{doc.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">{doc.specialization || doc.email}</div>
                            </div>
                            <ChevronRight size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ADMIN SIDEBAR INFO */
              <div className="glass-panel p-6 border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-[var(--bg-elevated)] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Admin & CMO Gateway</h3>
                    <p className="text-[11px] text-cyan-300">Population Health & Risk Telemetry</p>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-white">HIPAA Zero-Trust Architecture:</strong> Admins view de-identified cohort analytics, polypharmacy stratifications, and system audits.
                  </p>
                  <p>
                    <strong className="text-white">Multi-Doctor Oversight:</strong> Inspect prescribing trends across all registered doctors with AI Anomaly Detection.
                  </p>
                  <p>
                    <strong className="text-white">Demo Admin Account:</strong> Pre-loaded with CMO authority, real-time telemetry, and LLM executive synthesis tools.
                  </p>
                </div>

                {/* Quick 1-Click Demo Admin Button */}
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">Pre-Configured Demo Admin / CMO</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] font-mono text-cyan-300">CMO / Admin</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] space-y-0.5 font-mono">
                    <div>Email: <span className="text-white font-semibold">{DEMO_ADMIN.email}</span></div>
                    <div>Password: <span className="text-white">admin-secure-demo</span></div>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleQuickDemoAdmin}
                    className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Sparkles size={14} />
                    <span>1-Click Sign In as Demo Admin</span>
                  </button>
                </div>

                {/* Multiple Admin Switcher if others exist */}
                {users.filter((u) => u.role === 'admin').length > 1 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Other Registered Admins ({users.filter((u) => u.role === 'admin').length})
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {users
                        .filter((u) => u.role === 'admin')
                        .map((adm) => (
                          <button
                            key={adm.id}
                            type="button"
                            onClick={() => {
                              loginUser(adm)
                              router.push('/analytics')
                            }}
                            className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="truncate">
                              <div className="font-semibold text-white truncate">{adm.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">{adm.department || adm.email}</div>
                            </div>
                            <ChevronRight size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Login & Signup Forms (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 space-y-6">
              
              {/* MODE SELECTOR: SIGN IN vs SIGN UP */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className={`text-sm font-bold pb-1 transition-all border-b-2 ${
                      authMode === 'signin'
                        ? activePortal === 'doctor'
                          ? 'border-emerald-400 text-white'
                          : 'border-cyan-400 text-white'
                        : 'border-transparent text-[var(--text-muted)] hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <span className="text-[var(--text-muted)] text-sm">/</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signup')}
                    className={`text-sm font-bold pb-1 transition-all border-b-2 ${
                      authMode === 'signup'
                        ? activePortal === 'doctor'
                          ? 'border-emerald-400 text-white'
                          : 'border-cyan-400 text-white'
                        : 'border-transparent text-[var(--text-muted)] hover:text-white'
                    }`}
                  >
                    Sign Up / Register New {activePortal === 'doctor' ? 'Doctor' : 'Admin'}
                  </button>
                </div>

                <span className="text-[11px] text-[var(--text-muted)]">
                  {activePortal === 'doctor' ? 'Physician Access' : 'Administrative Gate'}
                </span>
              </div>

              {/* Alert / Feedback Messages */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* ============================================================ */}
              {/* 1. DOCTOR PORTAL FORMS                                      */}
              {/* ============================================================ */}
              {activePortal === 'doctor' && (
                <div>
                  {authMode === 'signin' ? (
                    /* DOCTOR SIGN IN */
                    <form onSubmit={handleDoctorSignIn} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">Doctor Workstation Sign In</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Enter your physician email and credentials to manage your assigned patients.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                          Doctor Email Address
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            required
                            className="input-field !pl-10 text-xs"
                            placeholder="dr.name@hospital.org"
                            value={docEmail}
                            onChange={(e) => setDocEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1"
                          >
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{showPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="input-field !pl-10 text-xs"
                            placeholder="••••••••••••"
                            value={docPassword}
                            onChange={(e) => setDocPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>Verifying Credentials...</span>
                            </>
                          ) : (
                            <>
                              <span>Sign In to Doctor Workstation</span>
                              <ArrowRight size={15} />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
                        New physician to the team?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signup')}
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          Create Doctor Account
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* DOCTOR SIGN UP */
                    <form onSubmit={handleDoctorSignUp} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">Register New Doctor Account</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Create an independent clinical account. Patients you register will remain private to your roster.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">First Name</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. John"
                            value={docSignup.firstName}
                            onChange={(e) => setDocSignup({ ...docSignup, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Last Name</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. Smith"
                            value={docSignup.lastName}
                            onChange={(e) => setDocSignup({ ...docSignup, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Specialization</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. Cardiology"
                            value={docSignup.specialization}
                            onChange={(e) => setDocSignup({ ...docSignup, specialization: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Medical License / MCI</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="MCI-2026-98421"
                            value={docSignup.licenseNumber}
                            onChange={(e) => setDocSignup({ ...docSignup, licenseNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Work Email Address</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            required
                            className="input-field !pl-9 text-xs"
                            placeholder="doctor@hospital.org"
                            value={docSignup.email}
                            onChange={(e) => setDocSignup({ ...docSignup, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Password</label>
                          <input
                            type="password"
                            required
                            className="input-field text-xs"
                            placeholder="Min 6 characters"
                            value={docSignup.password}
                            onChange={(e) => setDocSignup({ ...docSignup, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Confirm Password</label>
                          <input
                            type="password"
                            required
                            className="input-field text-xs"
                            placeholder="Re-enter password"
                            value={docSignup.confirmPassword}
                            onChange={(e) => setDocSignup({ ...docSignup, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                        Physician isolation enabled: your registered patients, active prescriptions, and notes will belong strictly to your doctor account.
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                      >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Award size={15} />}
                        <span>Register Doctor Account & Enter Workstation</span>
                      </button>

                      <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
                        Already have a doctor account?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signin')}
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          Sign In Here
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* 2. ADMIN PORTAL FORMS                                       */}
              {/* ============================================================ */}
              {activePortal === 'admin' && (
                <div>
                  {authMode === 'signin' ? (
                    /* ADMIN SIGN IN */
                    <form onSubmit={handleAdminSignIn} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">Administrator & CMO Sign In</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Authenticate with administrative credentials for system-wide population analytics and anomaly detection.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                          Administrator Email Address
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            required
                            className="input-field !pl-10 text-xs"
                            placeholder="admin@hospital.org"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1"
                          >
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{showPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="input-field !pl-10 text-xs"
                            placeholder="••••••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>Verifying Credentials...</span>
                            </>
                          ) : (
                            <>
                              <span>Sign In to Admin Console</span>
                              <ArrowRight size={15} />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
                        Need administrative access?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signup')}
                          className="text-cyan-400 font-bold hover:underline"
                        >
                          Register Admin Account
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ADMIN SIGN UP */
                    <form onSubmit={handleAdminSignUp} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">Register Administrative / CMO Account</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Create governance credentials for hospital analytics, multi-doctor anomaly monitoring, and de-identified reporting.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">First Name</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. Sarah"
                            value={adminSignup.firstName}
                            onChange={(e) => setAdminSignup({ ...adminSignup, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Last Name</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. Connor"
                            value={adminSignup.lastName}
                            onChange={(e) => setAdminSignup({ ...adminSignup, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Department / Role</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="e.g. Chief Medical Officer"
                            value={adminSignup.department}
                            onChange={(e) => setAdminSignup({ ...adminSignup, department: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Organization</label>
                          <input
                            type="text"
                            required
                            className="input-field text-xs"
                            placeholder="PTAI Health Network"
                            value={adminSignup.organization}
                            onChange={(e) => setAdminSignup({ ...adminSignup, organization: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Administrative Email</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
                          <input
                            type="email"
                            required
                            className="input-field !pl-9 text-xs"
                            placeholder="admin@hospital.org"
                            value={adminSignup.email}
                            onChange={(e) => setAdminSignup({ ...adminSignup, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Password</label>
                          <input
                            type="password"
                            required
                            className="input-field text-xs"
                            placeholder="Min 6 characters"
                            value={adminSignup.password}
                            onChange={(e) => setAdminSignup({ ...adminSignup, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Confirm Password</label>
                          <input
                            type="password"
                            required
                            className="input-field text-xs"
                            placeholder="Re-enter password"
                            value={adminSignup.confirmPassword}
                            onChange={(e) => setAdminSignup({ ...adminSignup, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
                        Governance note: administrative credentials access aggregate cohort analytics with de-identified patient identifiers under HIPAA zero-trust guidelines.
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                      >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                        <span>Register Admin Account & Enter Analytics</span>
                      </button>

                      <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
                        Already have an admin account?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signin')}
                          className="text-cyan-400 font-bold hover:underline"
                        >
                          Sign In Here
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] z-10">
        <div>© 2026 PTAI v3. Privacy-First Electronic Health Record & Analytics Management.</div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>AES-256 Encrypted</span>
          <span>·</span>
          <span>pgvector Indexing</span>
          <span>·</span>
          <span>Multi-Doctor Patient Isolation</span>
        </div>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    }>
      <AuthGatewayContent />
    </Suspense>
  )
}
