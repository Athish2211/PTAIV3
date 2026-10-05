'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Stethoscope, Loader2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'
import { authApi } from '@/services/api'
import { useRole } from '@/context/RoleContext'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'login' | 'mfa'>('login')
  const [email, setEmail] = useState('dr.dinesh@ptai-health.org')
  const [password, setPassword] = useState('clinical-secure-demo')
  const [mfaCode, setMfaCode] = useState('')
  const [tempToken, setTempToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authApi.login(email, password)
      if (res.data?.requires_mfa) {
        setTempToken(res.data.temp_token || '')
        setStep('mfa')
      } else {
        localStorage.setItem('ptai_access_token', res.data?.access_token || 'demo-token')
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials or server offline')
    } finally {
      setLoading(false)
    }
  }

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authApi.verifyMfa(mfaCode, tempToken)
      localStorage.setItem('ptai_access_token', res.data?.access_token || 'demo-token')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid MFA code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col md:flex-row text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Left branding panel */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-16 relative z-10 border-b md:border-b-0 md:border-r border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                PTAI <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">v3</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">Electronic Health Record & Analytics</div>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <span className="badge badge-indigo flex items-center gap-1.5 w-fit">
              <Cpu size={12} /> Local SLM Powered (phi-4-mini)
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Clinical Intelligence <br />
              <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Private & AI-Native.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Longitudinal vector memory, real-time patient auto-match, live multi-agent prescription safety checks, and zero-data-retention local inference.
            </p>
          </div>
        </div>

        <div className="pt-8 text-xs text-[var(--text-muted)] flex items-center gap-4 font-mono">
          <span>AES-256 Encrypted</span>
          <span>·</span>
          <span>pgvector Knowledge Store</span>
          <span>·</span>
          <span>Secure Access</span>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-md glass-panel p-8 space-y-6">
          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white">Sign In to EHR Portal</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Enter your clinical credentials to access the Doctor Workstation or Admin Console.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        required
                        className="input-field pl-10 text-xs"
                        placeholder="doctor@hospital.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-[var(--text-muted)] uppercase block">
                        Password
                      </label>
                      <a href="#" className="text-indigo-400 hover:text-indigo-300 text-[11px]">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3 text-[var(--text-muted)]" />
                      <input
                        type="password"
                        required
                        className="input-field pl-10 text-xs"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-[var(--text-muted)]">
                  <span>Demo Mode: Click "Sign In" to proceed directly to the Clinical Hub.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Enter the 6-digit authentication token from your device.
                  </p>
                </div>

                <form onSubmit={handleMfa} className="space-y-4">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="input-field text-center text-xl font-mono tracking-widest"
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  />

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || mfaCode.length !== 6}
                    className="btn btn-primary w-full text-xs py-2.5"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin mx-auto" /> : 'Verify Token'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="btn btn-ghost text-xs w-full text-[var(--text-muted)] hover:text-white"
                  >
                    Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
