'use client'

import type { Database } from '@/types/database'
import { Sparkles, Rocket, Lock, Code2, Zap, DollarSign } from 'lucide-react'
import { track } from '@vercel/analytics'

interface QuickComparisonsProps {
  databases: Database[]
  onSelect: (dbIds: string[]) => void
}

interface ComparisonSet {
  id: string
  title: string
  description: string
  icon: React.ElementType
  filter: (db: Database) => boolean
  sort?: (a: Database, b: Database) => number
  limit?: number
}

const comparisonSets: ComparisonSet[] = [
  {
    id: 'rag-ready',
    title: 'Best for RAG',
    description: 'LLM integration, LangChain support',
    icon: Sparkles,
    filter: (db) => {
      const llmScore = db.aiCapabilities?.scores?.llmIntegration ?? 0
      const hasLangchain = db.aiCapabilities?.supportedModels?.langchain === true
      return llmScore >= 7 || hasLangchain
    },
    sort: (a, b) => {
      const aScore = (a.aiCapabilities?.scores?.llmIntegration ?? 0) + (a.aiCapabilities?.scores?.ragSupport ?? 0)
      const bScore = (b.aiCapabilities?.scores?.llmIntegration ?? 0) + (b.aiCapabilities?.scores?.ragSupport ?? 0)
      return bScore - aScore
    },
    limit: 6,
  },
  {
    id: 'open-source',
    title: 'Open Source',
    description: 'Self-host, full control',
    icon: Code2,
    filter: (db) => db.community_ecosystem?.open_source === true,
    limit: 6,
  },
  {
    id: 'easy-start',
    title: 'Easiest to Start',
    description: 'Serverless, cloud-native',
    icon: Rocket,
    filter: (db) => db.features?.serverless === true || db.features?.cloudNative === true,
    limit: 6,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Ready',
    description: 'Security, compliance',
    icon: Lock,
    filter: (db) => {
      const hasEncryption = db.security?.encryption === true
      const hasAccessControl = db.security?.access_control === true
      const hasAuditLogging = db.security?.audit_logging === true
      return hasEncryption && hasAccessControl && hasAuditLogging
    },
    sort: (a, b) => {
      const aScore = (a.security?.encryption ? 1 : 0) + (a.security?.access_control ? 1 : 0) + (a.security?.audit_logging ? 1 : 0)
      const bScore = (b.security?.encryption ? 1 : 0) + (b.security?.access_control ? 1 : 0) + (b.security?.audit_logging ? 1 : 0)
      return bScore - aScore
    },
    limit: 6,
  },
  {
    id: 'performance',
    title: 'High Performance',
    description: 'Low latency, high throughput',
    icon: Zap,
    filter: (db) => (db.performance?.scalabilityScore ?? 0) >= 70,
    sort: (a, b) => {
      const aLatency = a.performance?.queryLatencyMs ?? 999
      const bLatency = b.performance?.queryLatencyMs ?? 999
      if (aLatency !== bLatency) return aLatency - bLatency
      const aScale = a.performance?.scalabilityScore ?? 0
      const bScale = b.performance?.scalabilityScore ?? 0
      return bScale - aScale
    },
    limit: 6,
  },
  {
    id: 'budget',
    title: 'Budget Friendly',
    description: 'Free tiers & open source',
    icon: DollarSign,
    filter: (db) => db.pricing?.free_tier === true || db.community_ecosystem?.open_source === true,
    limit: 6,
  },
]

export function QuickComparisons({ databases, onSelect }: QuickComparisonsProps) {
  const handleSelect = (set: ComparisonSet) => {
    let filtered = databases.filter(set.filter)
    if (set.sort) {
      filtered = filtered.sort(set.sort)
    }
    if (set.limit) {
      filtered = filtered.slice(0, set.limit)
    }
    const ids = filtered.map(db => db.id)

    track('quick_comparison_select', { comparison: set.id, count: ids.length })
    onSelect(ids)
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-parchment-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Quick Comparisons
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {comparisonSets.map(set => {
          const count = databases.filter(set.filter).length
          return (
            <button
              key={set.id}
              onClick={() => handleSelect(set)}
              className="group relative p-4 bg-white dark:bg-slate-800 rounded-lg border border-parchment-200 dark:border-slate-700 hover:border-burnt-400 dark:hover:border-amber-500 hover:shadow-md transition-all text-left"
            >
              <set.icon className="h-5 w-5 mb-2 text-burnt-400 dark:text-amber-400" />
              <div className="font-medium text-charcoal-50 dark:text-parchment-100 text-sm">{set.title}</div>
              <div className="text-xs text-parchment-600 dark:text-slate-400 mt-0.5">{set.description}</div>
              <div className="text-xs text-parchment-500 dark:text-slate-500 mt-2">{count} databases</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
