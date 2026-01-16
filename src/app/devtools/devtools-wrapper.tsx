'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { DataQualityBanner } from '@/components/data-quality-indicator'

interface DevToolsWrapperProps {
  children: React.ReactNode
}

export default function DevToolsWrapper({ children }: DevToolsWrapperProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      <div className="relative">
        {/* Subtle gradient accent */}
        <div className={`absolute inset-0 h-72 ${
          isDark
            ? 'bg-gradient-to-r from-amber-600/10 to-amber-800/10'
            : 'bg-gradient-to-r from-burnt-400/10 to-burnt-600/10'
        }`} />
        <div className="container mx-auto px-4 pt-16 pb-8 relative">
          <DataQualityBanner className="mb-6" />
          <header className="mb-12 text-center">
            <h1 className={`font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
              isDark ? '!text-amber-400' : '!text-burnt-400'
            }`}>
              AI Dev Tool Comparison
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              Find and compare the best AI development tools for your next project
            </p>
          </header>

          {children}
        </div>
      </div>
    </div>
  )
}
