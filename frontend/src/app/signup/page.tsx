'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function SignupRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get('role') || searchParams.get('portal') || 'doctor'
    router.replace(`/login?portal=${roleParam}&mode=signup`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center text-white gap-3">
      <Loader2 className="animate-spin text-emerald-400" size={32} />
      <span className="text-xs text-[var(--text-secondary)]">Redirecting to Registration Gateway...</span>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-emerald-400" size={32} />
      </div>
    }>
      <SignupRedirect />
    </Suspense>
  )
}
