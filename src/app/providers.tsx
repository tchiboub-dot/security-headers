'use client'

import { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}
