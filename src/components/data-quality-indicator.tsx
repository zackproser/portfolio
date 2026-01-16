'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react'

interface DataQualityIndicatorProps {
  isEstimate: boolean
  confidence?: number
  source?: string
  notes?: string
  compact?: boolean
}

export function DataQualityIndicator({
  isEstimate,
  confidence,
  source,
  notes,
  compact = false
}: DataQualityIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (compact) {
    return (
      <span
        className="relative inline-flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {isEstimate ? (
          <AlertCircle className="w-3 h-3 text-amber-500" />
        ) : (
          <CheckCircle className="w-3 h-3 text-green-500" />
        )}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
            {isEstimate ? 'Estimated value' : 'Verified data'}
            {source && <span className="block text-slate-400">{source}</span>}
          </div>
        )}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isEstimate
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }`}>
      {isEstimate ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      )}
      <span>{isEstimate ? 'Estimate' : 'Verified'}</span>
      {confidence && (
        <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
      )}
    </div>
  )
}

interface DataQualityBannerProps {
  className?: string
  onLearnMore?: () => void
}

export function DataQualityBanner({ className = '', onLearnMore }: DataQualityBannerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`rounded-lg border p-4 ${className} bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
            About This Data
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Performance metrics and scores are estimates based on available documentation.
            {!expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="ml-1 underline hover:no-underline"
              >
                Learn more
              </button>
            )}
          </p>
          {expanded && (
            <div className="mt-3 text-sm text-amber-700 dark:text-amber-400 space-y-2">
              <p>
                <strong>Verified data</strong> (marked with <CheckCircle className="w-3 h-3 inline text-green-500" />):
                Information confirmed from official documentation, websites, or APIs.
              </p>
              <p>
                <strong>Estimated data</strong> (marked with <AlertCircle className="w-3 h-3 inline text-amber-500" />):
                Values calculated or inferred from available information. These may not reflect
                real-world performance under your specific conditions.
              </p>
              <p className="font-medium">
                For production decisions, we recommend running your own benchmarks and verifying
                information with official sources.
              </p>
              <button
                onClick={() => setExpanded(false)}
                className="underline hover:no-underline"
              >
                Show less
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface FieldWithEstimateProps {
  value: string | number
  isEstimate?: boolean
  label?: string
}

export function FieldWithEstimate({ value, isEstimate = false, label }: FieldWithEstimateProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {label && <span className="text-slate-500 dark:text-slate-400">{label}:</span>}
      <span>{value}</span>
      {isEstimate && (
        <DataQualityIndicator isEstimate compact />
      )}
    </span>
  )
}

// Hook to get estimate status for a field
export function useFieldEstimate(fieldName: string): boolean {
  const ESTIMATE_FIELDS = new Set([
    'queryLatencyMs',
    'indexingSpeedVectorsPerSec',
    'memoryUsageMb',
    'scalabilityScore',
    'accuracyScore',
    'employees',
  ])
  return ESTIMATE_FIELDS.has(fieldName)
}
