'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { DataQualityBanner } from '@/components/data-quality-indicator'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

interface DataQualitySummary {
  totalTools: number;
  totalMetrics: number;
  estimatedMetrics: number;
  verifiedMetrics: number;
  verifiedPercentage: number;
  lastUpdate: Date | null;
  canRemoveBetaBanner: boolean;
}

interface DevToolsWrapperProps {
  children: React.ReactNode;
  dataQuality?: DataQualitySummary | null;
}

export default function DevToolsWrapper({ children, dataQuality }: DevToolsWrapperProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Show beta banner only if data quality doesn't meet threshold
  const showBetaBanner = !dataQuality?.canRemoveBetaBanner

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
          {showBetaBanner && (
            <DataQualityBanner
              className="mb-6"
              verifiedPercentage={dataQuality?.verifiedPercentage}
              totalDatabases={dataQuality?.totalTools}
              itemType="tools"
            />
          )}
          <header className="mb-8 text-center">
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

          {/* AI Tools Quick Start Banner */}
          <Link
            href="/best-ai-tools"
            className="block mb-10 max-w-3xl mx-auto group"
          >
            <div className={`rounded-xl p-4 border transition-all hover:shadow-lg ${
              isDark
                ? 'bg-amber-900/30 border-amber-600/40 hover:border-amber-500/60'
                : 'bg-amber-50 border-amber-300/60 hover:border-amber-400'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-amber-500/30' : 'bg-amber-500/20'
                }`}>
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                    Just want the essentials? Start here.
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-600'}`}>
                    My top 4 AI tools for small business—no comparison paralysis needed
                  </p>
                </div>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
            </div>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
