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
  verifiedPercentage?: number
  totalDatabases?: number
  onLearnMore?: () => void
}

export function DataQualityBanner({
  className = '',
  verifiedPercentage,
  totalDatabases,
  onLearnMore
}: DataQualityBannerProps) {
  const [expanded, setExpanded] = useState(false)

  // Determine banner style based on verification percentage
  const isHighlyVerified = verifiedPercentage !== undefined && verifiedPercentage >= 80
  const isMediumVerified = verifiedPercentage !== undefined && verifiedPercentage >= 50

  const bannerStyle = isHighlyVerified
    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
    : isMediumVerified
    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
    : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'

  const textStyle = isHighlyVerified
    ? 'text-green-700 dark:text-green-400'
    : isMediumVerified
    ? 'text-blue-700 dark:text-blue-400'
    : 'text-amber-700 dark:text-amber-400'

  const headingStyle = isHighlyVerified
    ? 'text-green-800 dark:text-green-300'
    : isMediumVerified
    ? 'text-blue-800 dark:text-blue-300'
    : 'text-amber-800 dark:text-amber-300'

  const iconStyle = isHighlyVerified
    ? 'text-green-600 dark:text-green-400'
    : isMediumVerified
    ? 'text-blue-600 dark:text-blue-400'
    : 'text-amber-600 dark:text-amber-400'

  return (
    <div className={`rounded-lg border p-4 ${className} ${bannerStyle}`}>
      <div className="flex items-start gap-3">
        <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyle}`} />
        <div className="flex-grow">
          <h4 className={`font-semibold mb-1 ${headingStyle}`}>
            About This Data
            {verifiedPercentage !== undefined && (
              <span className="ml-2 text-sm font-normal">
                ({verifiedPercentage}% verified)
              </span>
            )}
          </h4>
          <p className={`text-sm ${textStyle}`}>
            {verifiedPercentage !== undefined && verifiedPercentage >= 80 ? (
              <>
                Data for {totalDatabases || 'these'} databases has been verified from official sources.
              </>
            ) : (
              <>
                Performance metrics and scores are estimates based on available documentation.
              </>
            )}
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
            <div className={`mt-3 text-sm ${textStyle} space-y-2`}>
              {verifiedPercentage !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-grow h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isHighlyVerified
                            ? 'bg-green-500'
                            : isMediumVerified
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${verifiedPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{verifiedPercentage}%</span>
                  </div>
                  <p className="text-xs opacity-75">
                    {totalDatabases} databases tracked with field-level verification status
                  </p>
                </div>
              )}
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
