import type { Metadata } from 'next'
import Sidebar from '@/components/ui/Sidebar'
import Navbar from '@/components/ui/Navbar'
import { RoleProvider } from '@/context/RoleContext'

export const metadata: Metadata = {
  title: 'PTAI v3 - Medical Prescription & Analytics Management System',
  description: 'AI-Native EHR, Multi-Agent Analytics, and Longitudinal Prescription Intelligence',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleProvider>
  )
}
