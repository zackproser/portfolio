'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'
import { Wand2, Cloud, Server, HardDrive, Brain, Search, ShoppingCart, Rocket, Building2, Users, ArrowRight, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VectorDbWizardProps {
  databases: Database[]
  onRecommendations: (dbIds: string[]) => void
}

type DeploymentPref = 'managed' | 'self-hosted' | 'any'
type UseCase = 'rag' | 'search' | 'recommendations' | 'any'
type Scale = 'hobby' | 'startup' | 'enterprise'

interface WizardState {
  step: number
  deployment: DeploymentPref | null
  useCase: UseCase | null
  scale: Scale | null
}

const deploymentOptions = [
  { value: 'managed' as const, label: 'Fully Managed Cloud', icon: Cloud, desc: 'No infrastructure to manage' },
  { value: 'self-hosted' as const, label: 'Self-Hosted', icon: Server, desc: 'Run on your own servers' },
  { value: 'any' as const, label: 'Flexible / Both', icon: HardDrive, desc: 'I want options' },
]

const useCaseOptions = [
  { value: 'rag' as const, label: 'RAG / LLM Apps', icon: Brain, desc: 'AI chatbots, Q&A systems' },
  { value: 'search' as const, label: 'Semantic Search', icon: Search, desc: 'Document or product search' },
  { value: 'recommendations' as const, label: 'Recommendations', icon: ShoppingCart, desc: 'Similar items, personalization' },
  { value: 'any' as const, label: 'General Purpose', icon: HardDrive, desc: 'Multiple use cases' },
]

const scaleOptions = [
  { value: 'hobby' as const, label: 'Hobby / Prototype', icon: Rocket, desc: 'Learning, small projects' },
  { value: 'startup' as const, label: 'Startup / Growth', icon: Users, desc: 'Production apps, scaling' },
  { value: 'enterprise' as const, label: 'Enterprise', icon: Building2, desc: 'Large scale, compliance needs' },
]

export function VectorDbWizard({ databases, onRecommendations }: VectorDbWizardProps) {
  const [state, setState] = useState<WizardState>({
    step: 0,
    deployment: null,
    useCase: null,
    scale: null,
  })
  const [showResults, setShowResults] = useState(false)

  const filterDatabases = (): Database[] => {
    let filtered = [...databases]

    // Filter by deployment preference
    if (state.deployment === 'managed') {
      filtered = filtered.filter(db =>
        db.features?.cloudNative === true || db.features?.serverless === true || db.deployment?.cloud === true
      )
    } else if (state.deployment === 'self-hosted') {
      filtered = filtered.filter(db =>
        db.community_ecosystem?.open_source === true || db.deployment?.local === true
      )
    }

    // Filter by scale
    if (state.scale === 'hobby') {
      filtered = filtered.filter(db =>
        db.features?.serverless === true || db.pricing?.free_tier === true
      )
    } else if (state.scale === 'enterprise') {
      filtered = filtered.filter(db =>
        db.security?.encryption === true &&
        db.security?.access_control === true
      )
    }

    // Sort by relevance to use case
    if (state.useCase === 'rag') {
      filtered.sort((a, b) => {
        const aScore = (a.aiCapabilities?.scores?.llmIntegration ?? 0) + (a.aiCapabilities?.scores?.ragSupport ?? 0)
        const bScore = (b.aiCapabilities?.scores?.llmIntegration ?? 0) + (b.aiCapabilities?.scores?.ragSupport ?? 0)
        return bScore - aScore
      })
    } else if (state.useCase === 'search') {
      filtered.sort((a, b) => {
        const aScore = (a.searchCapabilities?.hybridSearch ? 2 : 0) + (a.features?.hybridSearch ? 1 : 0)
        const bScore = (b.searchCapabilities?.hybridSearch ? 2 : 0) + (b.features?.hybridSearch ? 1 : 0)
        return bScore - aScore
      })
    } else if (state.useCase === 'recommendations') {
      filtered.sort((a, b) => {
        const aScore = a.performance?.scalabilityScore ?? 0
        const bScore = b.performance?.scalabilityScore ?? 0
        return bScore - aScore
      })
    }

    return filtered.slice(0, 5)
  }

  const handleSelect = (field: 'deployment' | 'useCase' | 'scale', value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      step: prev.step + 1,
    }))
  }

  const handleShowResults = () => {
    const recommendations = filterDatabases()
    onRecommendations(recommendations.map(db => db.id))
    setShowResults(true)
  }

  const handleReset = () => {
    setState({ step: 0, deployment: null, useCase: null, scale: null })
    setShowResults(false)
  }

  const recommendations = filterDatabases()

  if (showResults) {
    return (
      <div className="bg-parchment-100 dark:bg-slate-800/60 rounded-xl p-6 mb-8 border border-parchment-300 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-burnt-400/10 dark:bg-amber-500/10 rounded-lg">
              <Check className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal-50 dark:text-parchment-100">
              Top {recommendations.length} Recommendations
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-parchment-600 dark:text-slate-400 hover:text-burnt-400 dark:hover:text-amber-400">
            <RotateCcw className="h-4 w-4 mr-1" /> Start Over
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recommendations.map(db => (
            <span
              key={db.id}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-charcoal-50 dark:text-parchment-100 border border-parchment-200 dark:border-slate-600"
            >
              {db.name}
            </span>
          ))}
        </div>

        <p className="text-sm text-parchment-600 dark:text-slate-400">
          Based on: {state.deployment === 'managed' ? 'Managed cloud' : state.deployment === 'self-hosted' ? 'Self-hosted' : 'Flexible deployment'}
          {' • '}
          {state.useCase === 'rag' ? 'RAG/LLM' : state.useCase === 'search' ? 'Semantic search' : state.useCase === 'recommendations' ? 'Recommendations' : 'General purpose'}
          {' • '}
          {state.scale === 'hobby' ? 'Hobby/prototype' : state.scale === 'startup' ? 'Startup' : 'Enterprise'} scale
        </p>
        <p className="text-sm text-parchment-500 dark:text-slate-500 mt-2">
          These databases are now selected in the comparison below. Explore the tabs to dive deeper.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-parchment-100 dark:bg-slate-800/60 rounded-xl p-6 mb-8 border border-parchment-300 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-burnt-400/10 dark:bg-amber-500/10 rounded-lg">
          <Wand2 className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-charcoal-50 dark:text-parchment-100">Find Your Database</h3>
          <p className="text-sm text-parchment-600 dark:text-slate-400">Answer 3 questions to get personalized recommendations</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < state.step ? "bg-burnt-400 dark:bg-amber-500" : i === state.step ? "bg-burnt-400/40 dark:bg-amber-500/40" : "bg-parchment-300 dark:bg-slate-600"
            )}
          />
        ))}
      </div>

      {/* Step 1: Deployment */}
      {state.step === 0 && (
        <div>
          <p className="font-medium text-charcoal-50 dark:text-parchment-100 mb-3">What&apos;s your deployment preference?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {deploymentOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect('deployment', opt.value)}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-parchment-200 dark:border-slate-700 hover:border-burnt-400 dark:hover:border-amber-500 text-left transition-all hover:shadow-md"
              >
                <opt.icon className="h-5 w-5 text-burnt-400 dark:text-amber-400 mb-2" />
                <div className="font-medium text-charcoal-50 dark:text-parchment-100">{opt.label}</div>
                <div className="text-sm text-parchment-600 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Use Case */}
      {state.step === 1 && (
        <div>
          <p className="font-medium text-charcoal-50 dark:text-parchment-100 mb-3">What&apos;s your primary use case?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {useCaseOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect('useCase', opt.value)}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-parchment-200 dark:border-slate-700 hover:border-burnt-400 dark:hover:border-amber-500 text-left transition-all hover:shadow-md"
              >
                <opt.icon className="h-5 w-5 text-burnt-400 dark:text-amber-400 mb-2" />
                <div className="font-medium text-charcoal-50 dark:text-parchment-100">{opt.label}</div>
                <div className="text-sm text-parchment-600 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Scale */}
      {state.step === 2 && (
        <div>
          <p className="font-medium text-charcoal-50 dark:text-parchment-100 mb-3">What&apos;s your expected scale?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scaleOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  handleSelect('scale', opt.value)
                }}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-parchment-200 dark:border-slate-700 hover:border-burnt-400 dark:hover:border-amber-500 text-left transition-all hover:shadow-md"
              >
                <opt.icon className="h-5 w-5 text-burnt-400 dark:text-amber-400 mb-2" />
                <div className="font-medium text-charcoal-50 dark:text-parchment-100">{opt.label}</div>
                <div className="text-sm text-parchment-600 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show results button */}
      {state.step === 3 && (
        <div className="text-center">
          <Button
            onClick={handleShowResults}
            className="bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white px-6"
          >
            Show My Recommendations <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
