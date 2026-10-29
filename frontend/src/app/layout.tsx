import type { Metadata } from 'next'
import './globals.css'
import { RoleProvider } from '@/context/RoleContext'

export const metadata: Metadata = {
  title: 'PTAI v3 — AI-Native EHR',
  description: 'The AI-native EHR that remembers, analyzes and surfaces clinical patterns — without replacing the doctor.',
  keywords: ['EHR', 'AI', 'clinical analytics', 'prescription intelligence'],
  authors: [{ name: 'PTAI' }],
  robots: 'noindex', // Clinical software — not public
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  )
}
