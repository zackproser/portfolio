'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { DataQualityBanner } from "@/components/data-quality-indicator"

interface DataQualitySummary {
  totalDatabases: number;
  totalMetrics: number;
  estimatedMetrics: number;
  verifiedMetrics: number;
  verifiedPercentage: number;
  lastUpdate: Date | null;
  canRemoveBetaBanner: boolean;
}

interface VectorDatabasesWrapperProps {
  children: React.ReactNode;
  dataQuality?: DataQualitySummary | null;
}

export default function VectorDatabasesWrapper({ children, dataQuality }: VectorDatabasesWrapperProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Show beta banner only if data quality doesn't meet threshold
  const showBetaBanner = !dataQuality?.canRemoveBetaBanner

  return (
    <main className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      <div className="container mx-auto py-8 px-4">
        {showBetaBanner && (
          <DataQualityBanner
            className="mb-6"
            verifiedPercentage={dataQuality?.verifiedPercentage}
            totalDatabases={dataQuality?.totalDatabases}
          />
        )}
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
