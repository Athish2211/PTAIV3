'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, User, Mail, Lock, Building, ArrowRight, Loader2, FileText, CheckCircle2 } from 'lucide-react'
import { authApi } from '@/services/api'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'doctor', // 'doctor' or 'admin'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authApi.signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      // Store tokens and proceed
      localStorage.setItem('ptai_access_token', res.data?.access_token)
      localStorage.setItem('ptai_active_role', formData.role)
      setSuccess(true)
      
      // Give a tiny delay for success animation
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-white flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-sm w-full flex flex-col items-center justify-center text-center space-y-4">
          <CheckCircle2 size={48} className="text-emerald-400" />
          <h2 className="text-xl font-bold">Account Created</h2>
          <p className="text-sm text-[var(--text-secondary)]">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg shadow-cyan-500/20 mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Join the Clinical Intelligence Network
          </p>
        </div>

        <form onSubmit={handleSignup} className="glass-panel p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 px-3 pl-10 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                  placeholder="John"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 px-3 pl-10 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                  placeholder="Doe"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 px-3 pl-10 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                placeholder="doctor@hospital.com"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 px-3 pl-10 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                placeholder="Min 8 characters"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
              Account Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 px-3 pl-10 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none appearance-none"
              >
                <option value="doctor">Clinical Doctor</option>
                <option value="admin">Hospital Administrator</option>
              </select>
              <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
          
          <div className="text-center pt-2">
            <p className="text-xs text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center flex flex-col items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-mono">
          <div className="flex items-center gap-2">
            <FileText size={12} />
            <span>Secure Access</span>
          </div>
        </div>
      </div>
    </div>
  )
}
