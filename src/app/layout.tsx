import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Password & Phishing Lab',
  description: 'Test password strength, detect phishing patterns, and learn security best practices.',
  keywords: 'password, phishing, security, education, cyber security',
  authors: [{ name: 'Security Lab' }],
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
