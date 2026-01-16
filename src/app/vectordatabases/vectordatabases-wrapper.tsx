'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Callout from "@/components/Callout"

interface VectorDatabasesWrapperProps {
  children: React.ReactNode
}

export default function VectorDatabasesWrapper({ children }: VectorDatabasesWrapperProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <main className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      <div className="container mx-auto py-8 px-4">
        <Callout type="announcement" title="This experience is under construction" className="mb-6">
          We&apos;re actively improving accuracy and coverage. Some metrics are estimates based on available documentation and may not reflect exact benchmarks.
        </Callout>
        <h1 className={`font-serif text-4xl md:text-5xl font-bold text-center mb-2 ${
          isDark ? '!text-amber-400' : '!text-burnt-400'
        }`}>
          Vector Database Comparison
        </h1>
        <p className={`text-center mb-8 max-w-2xl mx-auto ${
          isDark ? 'text-slate-300' : 'text-parchment-600'
        }`}>
          Compare leading vector databases across company metrics, features, performance, security, algorithms, and
          capabilities
        </p>

        {children}
      </div>
    </main>
  )
}
