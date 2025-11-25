'use client'

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Database,
  Search,
  FileText,
  Bot,
  ArrowRight,
  Code,
  Lightbulb,
  AlertTriangle,
  X,
  Keyboard,
  HelpCircle
} from 'lucide-react'

import Link from 'next/link'

// Tooltip component for technical terms
function Tooltip({ 
  term, 
  explanation, 
  children 
}: { 
  term: string
  explanation: string 
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 border-b-2 border-dotted border-current cursor-help font-medium text-inherit hover:opacity-80 transition-opacity"
      >
        {children}
        <HelpCircle className="h-4 w-4 opacity-60" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 p-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm leading-relaxed shadow-2xl border border-zinc-700 dark:border-zinc-300"
          >
            <div className="font-bold text-base mb-2 text-white dark:text-zinc-900">{term}</div>
            <div className="opacity-95 leading-relaxed">{explanation}</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-zinc-900 dark:border-t-zinc-100" style={{ borderWidth: '8px' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
import type { RagDataset } from './data'
import RagArchitectureDiagram from './RagArchitectureDiagram'
import {
  buildChunkIndex,
  generateEmbedding,
  simulateRetrieval,
  generateGroundedAnswer,
  type RagRetrievalResult,
  type GeneratedAnswer
} from './utils'

type RagPipelineVisualizationProps = {
  dataset: RagDataset
  currentStepIndex: number
  onStepChange: (index: number) => void
  simulationData: {
    query: string
    queryEmbedding: number[] | null
    retrievalResults: RagRetrievalResult[]
    groundedAnswer: GeneratedAnswer | null
  }
}

const STEPS = [
  {
    id: 'query',
    title: 'User Query',
    description: 'User enters a question',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'embed',
    title: 'Embed Query',
    description: 'Convert text to vector',
    icon: Cpu,
    color: 'emerald'
  },
  {
    id: 'search',
    title: 'Vector Search',
    description: 'Find similar chunks',
    icon: Search,
    color: 'purple'
  },
  {
    id: 'retrieve',
    title: 'Retrieve Chunks',
    description: 'Select relevant context',
    icon: Database,
    color: 'amber'
  },
  {
    id: 'compose',
    title: 'Compose Prompt',
    description: 'Combine query & context',
    icon: Code,
    color: 'indigo'
  },
  {
    id: 'generate',
    title: 'Generate Answer',
    description: 'LLM answers with citations',
    icon: Bot,
    color: 'green'
  }
] as const

// Tooltip definitions for technical terms
const TERM_TOOLTIPS = {
  embedding: {
    term: 'Embedding',
    explanation: 'A numerical vector (array of numbers) that captures the semantic meaning of text. Similar concepts have similar embeddings, enabling semantic search.'
  },
  cosine_similarity: {
    term: 'Cosine Similarity',
    explanation: 'Measures the angle between two vectors. A score of 1.0 means identical direction (perfect match), 0 means perpendicular (unrelated), -1 means opposite.'
  },
  chunk: {
    term: 'Chunk',
    explanation: 'A smaller segment of a larger document. Documents are split into chunks (typically 100-500 words) to enable precise retrieval and fit within context limits.'
  },
  top_k: {
    term: 'Top-K',
    explanation: 'The number of most similar results to retrieve. Higher K provides more context but costs more tokens; lower K is faster but may miss relevant info.'
  }
}

// Consolidated educational content with tooltip support
const STEP_DETAILS: Record<string, {
  overview: React.ReactNode
  whyItMatters: React.ReactNode
  howItWorks: React.ReactNode
  considerations?: React.ReactNode
}> = {
  query: {
    overview: 'The plaintext question capturing user intent.',
    whyItMatters: 'Clear queries lead to better retrieval than vague keywords.',
    howItWorks: 'Text is normalized but remains human-readable before vectorization.'
  },
  embed: {
    overview: <>Converts text into a dense numerical vector (<Tooltip {...TERM_TOOLTIPS.embedding}>embedding</Tooltip>) representing semantic meaning.</>,
    whyItMatters: 'Enables searching by concept (e.g., "login issues") rather than just keywords.',
    howItWorks: 'A neural network maps text to a high-dimensional space where similar concepts cluster together.',
    considerations: 'The same model must be used for both indexing documents and embedding queries.'
  },
  search: {
    overview: <>Compares the query vector against document vectors using <Tooltip {...TERM_TOOLTIPS.cosine_similarity}>cosine similarity</Tooltip>.</>,
    whyItMatters: 'Finds relevant information even when phrasing differs from the source text.',
    howItWorks: 'Calculates the angle between vectors; smaller angles mean higher semantic similarity.',
    considerations: 'Production systems use approximate nearest neighbor (ANN) algorithms for speed at scale.'
  },
  retrieve: {
    overview: <>Selects the <Tooltip {...TERM_TOOLTIPS.top_k}>top-K</Tooltip> most similar <Tooltip {...TERM_TOOLTIPS.chunk}>chunks</Tooltip> to serve as context.</>,
    whyItMatters: 'Provides the factual grounding that prevents LLM hallucinations.',
    howItWorks: <>
      <Tooltip {...TERM_TOOLTIPS.chunk}>Chunks</Tooltip> are ranked by similarity score; metadata filters can further refine results.
    </>,
    considerations: 'Balancing context quantity (K) with prompt window limits is key.'
  },
  compose: {
    overview: <>Sandwiches retrieved <Tooltip {...TERM_TOOLTIPS.chunk}>chunks</Tooltip> into a system prompt template.</>,
    whyItMatters: 'Ensures the LLM answers based ONLY on the provided verified data.',
    howItWorks: 'Retrieved text is inserted between instructions and the user query in a strict format.',
    considerations: 'Clear citation instructions in the prompt help the LLM reference sources accurately.'
  },
  generate: {
    overview: 'LLM synthesizes an answer citing the provided sources.',
    whyItMatters: 'Combines AI reasoning with your private data for trustworthy responses.',
    howItWorks: 'The model generates tokens based on the grounded prompt, adding citations like [1].',
    considerations: 'Monitoring latency and citation accuracy is crucial for production reliability.'
  }
}

const AUTO_ADVANCE_DELAYS = {
  query: 0,
  embed: 10000,
  search: 11000,
  retrieve: 12000,
  compose: 11000,
  generate: 12000
}

// Educational section component
function EducationalSection({ 
  stepId, 
  color 
}: { 
  stepId: string
  color: string 
}) {
  const content = STEP_DETAILS[stepId]
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!content) return null

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      textMuted: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-900 dark:text-emerald-100',
      textMuted: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-900 dark:text-purple-100',
      textMuted: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-900 dark:text-amber-100',
      textMuted: 'text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-900 dark:text-indigo-100',
      textMuted: 'text-indigo-700 dark:text-indigo-300',
      icon: 'text-indigo-600 dark:text-indigo-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      textMuted: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    }
  }

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <div className={`w-full space-y-3 ${colors.text} text-sm leading-relaxed`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className={`h-4 w-4 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text} text-sm`}>Overview</span>
          </div>
          <div className={`${colors.textMuted} text-sm leading-relaxed`}>{content.overview}</div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ArrowRight className={`h-4 w-4 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text} text-sm`}>Why it matters</span>
          </div>
          <div className={`${colors.textMuted} text-sm leading-relaxed`}>{content.whyItMatters}</div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 text-xs font-medium ${colors.text} hover:opacity-80 transition-opacity py-1`}
        >
          {isExpanded ? 'Hide details' : 'Show technical details'}
          <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className={`h-4 w-4 ${colors.icon}`} />
                    <span className={`font-semibold ${colors.text} text-sm`}>How it works</span>
                  </div>
                  <div className={`${colors.textMuted} text-sm leading-relaxed`}>
                    {content.howItWorks}
                  </div>
                </div>

                {content.considerations && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`h-4 w-4 ${colors.icon}`} />
                      <span className={`font-semibold ${colors.text} text-sm`}>Production note</span>
                    </div>
                    <div className={`${colors.textMuted} text-sm leading-relaxed`}>{content.considerations}</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function RagPipelineVisualization({ 
  dataset,
  currentStepIndex,
  onStepChange,
  simulationData
}: {
  dataset: RagDataset
  currentStepIndex: number
  onStepChange: (index: number) => void
  simulationData: any
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showKeyboardHints, setShowKeyboardHints] = useState<boolean>(false)
  const timeoutsRef = useRef<number[]>([])

  // Use passed simulation data or fallbacks
  const { 
    query: sampleQuery,
    queryEmbedding,
    retrievalResults,
    groundedAnswer
  } = simulationData

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => clearAllTimeouts()
  }, [clearAllTimeouts])

  const handleNext = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      onStepChange(currentStepIndex + 1)
    }
  }, [currentStepIndex, onStepChange])

  // Auto-advance logic
  useEffect(() => {
    // Clear any existing timeouts when effect re-runs
    clearAllTimeouts()

    if (!isPlaying || currentStepIndex >= STEPS.length - 1) {
      if (currentStepIndex >= STEPS.length - 1) {
        setIsPlaying(false)
      }
      return
    }

    const stepId = STEPS[currentStepIndex].id
    const delay = AUTO_ADVANCE_DELAYS[stepId as keyof typeof AUTO_ADVANCE_DELAYS] || 3000

    const timeout = window.setTimeout(() => {
      handleNext()
    }, delay)

    timeoutsRef.current.push(timeout)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isPlaying, currentStepIndex, handleNext, clearAllTimeouts])

  const handlePrevious = useCallback(() => {
    setIsPlaying(false) // Stop auto-play when manually navigating
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1)
    }
  }, [currentStepIndex, onStepChange])

  const handlePlayAll = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    if (currentStepIndex === STEPS.length - 1) {
      // Reset to beginning if at end
      onStepChange(0)
    }
    setIsPlaying(true)
  }, [currentStepIndex, onStepChange, isPlaying])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    clearAllTimeouts()
    onStepChange(0)
  }, [onStepChange, clearAllTimeouts])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const canGoNextLocal = currentStepIndex < STEPS.length - 1
      const canGoPreviousLocal = currentStepIndex > 0

      if (e.key === 'ArrowRight' && canGoNextLocal) {
        setIsPlaying(false)
        handleNext()
      } else if (e.key === 'ArrowLeft' && canGoPreviousLocal) {
        handlePrevious()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handlePlayAll()
      } else if (e.key === 'Escape') {
        setShowKeyboardHints(false)
      } else if (e.key === '?') {
        setShowKeyboardHints((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStepIndex, handleNext, handlePrevious, handlePlayAll])

  const currentStep = STEPS[currentStepIndex]
  const canGoNext = currentStepIndex < STEPS.length - 1
  const canGoPrevious = currentStepIndex > 0

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm relative ring-1 ring-black/5">
      {/* Keyboard Hints */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-6 z-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 max-w-xs ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardHints(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>← →</span>
                <span>Navigate steps</span>
              </div>
              <div className="flex justify-between">
                <span>Space/Enter</span>
                <span>Play/Pause</span>
              </div>
              <div className="flex justify-between">
                <span>?</span>
                <span>Toggle hints</span>
              </div>
              <div className="flex justify-between">
                <span>Esc</span>
                <span>Close overlays</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Top Navigation Bar - Clean & minimal */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-white/80 backdrop-blur-sm px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/80 rounded-t-xl">
        {/* Left: Navigation + Step buttons */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="flex items-center rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
              <span>{currentStepIndex + 1} / {STEPS.length}</span>
            </div>
            <button
              onClick={() => {
                setIsPlaying(false)
                handleNext()
              }}
              disabled={!canGoNext}
              className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0 mx-2" />
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setIsPlaying(false)
                    onStepChange(index)
                  }}
                  title={`${index + 1}. ${step.title}: ${step.description}`}
                  className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800'
                      : isComplete
                          ? 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                          : 'text-zinc-400 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  {/* Step name - hidden on mobile, shown on larger screens */}
                  <span className={`hidden xl:inline-block whitespace-nowrap ${isActive ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                    {step.title.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Right: Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowKeyboardHints(!showKeyboardHints)}
            className="hidden sm:inline-flex items-center justify-center rounded border border-zinc-300 bg-white w-7 h-7 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handlePlayAll}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded border border-blue-500 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:border-blue-700 dark:bg-zinc-900 dark:text-blue-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Unified Single-Flow Layout */}
      <div className="relative w-full">
        <div className="mx-auto px-4 py-2">
          
          {/* Architecture Diagram - Large and prominent, clear spacing */}
          <div className="mb-4">
            <RagArchitectureDiagram 
              currentStepIndex={currentStepIndex}
              stepTitle={STEPS[currentStepIndex].title}
              query={sampleQuery}
              queryEmbedding={queryEmbedding}
              retrievalResults={retrievalResults}
              generatedAnswer={groundedAnswer?.answer}
            />
          </div>

          {/* Step Title and Subheader - Consolidated below diagram */}
          <div className="mt-2 mb-4">
            <motion.div
              key={`step-header-${currentStepIndex}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className={`text-lg font-semibold ${getStepColorClass(currentStepIndex)} mb-1`}>
                {STEPS[currentStepIndex].title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {STEPS[currentStepIndex].description}
              </p>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getStepColorClass(currentStepIndex).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
            
          {/* Educational Content - Inline */}
          <div className="mt-4 max-w-4xl mx-auto">
            <EducationalSection 
              stepId={STEPS[currentStepIndex].id} 
              color={getStepColorName(currentStepIndex)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function for step colors
function getStepColorClass(stepIndex: number, muted = false): string {
  const colors = [
    muted ? 'text-blue-700 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400',
    muted ? 'text-emerald-700 dark:text-emerald-300' : 'text-emerald-600 dark:text-emerald-400',
    muted ? 'text-purple-700 dark:text-purple-300' : 'text-purple-600 dark:text-purple-400',
    muted ? 'text-amber-700 dark:text-amber-300' : 'text-amber-600 dark:text-amber-400',
    muted ? 'text-indigo-700 dark:text-indigo-300' : 'text-indigo-600 dark:text-indigo-400',
    muted ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-400'
  ]
  return colors[stepIndex] || colors[0]
}

// Helper function for step color names
function getStepColorName(stepIndex: number): string {
  const colors = ['blue', 'emerald', 'purple', 'amber', 'indigo', 'green']
  return colors[stepIndex] || colors[0]
}