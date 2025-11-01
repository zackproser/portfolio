'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Database,
  LifeBuoy,
  MousePointerClick,
  Network,
  PlayCircle,
  RefreshCcw,
  Search,
  Sparkles
} from 'lucide-react'

import type { RagDataset } from './data'
import {
  generateGroundedAnswer,
  simulateRetrieval,
  type GeneratedAnswer,
  type RagChunk,
  type RagRetrievalResult,
  type RetrieverMode
} from './utils'

const stepConfig = [
  {
    id: 'question',
    title: 'Question captured',
    description: 'The raw user text is normalized and preprocessed before leaving the UI.',
    icon: MousePointerClick
  },
  {
    id: 'embedding',
    title: 'Embedding generated',
    description: 'The same embedding model turns the query into a dense vector of numbers.',
    icon: Network
  },
  {
    id: 'vector-search',
    title: 'Vector search',
    description: 'We search the vector database for nearby chunks using cosine similarity.',
    icon: Database
  },
  {
    id: 'rerank',
    title: 'Hybrid rerank',
    description: 'Keyword overlap and metadata filters boost the most trustworthy chunks.',
    icon: Search
  },
  {
    id: 'compose',
    title: 'Answer composed',
    description: 'The model receives a grounded prompt and streams back a response with citations.',
    icon: Bot
  }
] as const

type RagPipelineSandboxProps = {
  dataset: RagDataset
  chunks: RagChunk[]
}

const modeLabels: Record<RetrieverMode, string> = {
  semantic: 'Semantic',
  keyword: 'Keyword',
  hybrid: 'Hybrid'
}

export default function RagPipelineSandbox({ dataset, chunks }: RagPipelineSandboxProps) {
  const [query, setQuery] = useState(dataset.sampleQueries[0] ?? '')
  const [mode, setMode] = useState<RetrieverMode>('hybrid')
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<RagRetrievalResult[]>([])
  const [answer, setAnswer] = useState<GeneratedAnswer | null>(null)
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null)
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  useEffect(() => {
    if (dataset.sampleQueries[0]) {
      setQuery(dataset.sampleQueries[0])
    }
  }, [dataset])

  const handleRun = () => {
    if (!query.trim()) {
      return
    }

    timeouts.current.forEach((id) => clearTimeout(id))
    timeouts.current = []

    setIsRunning(true)
    setActiveStepIndex(0)
    setAnswer(null)

    const retrieved = simulateRetrieval({
      query,
      chunks,
      topK: 3,
      mode
    })
    setResults(retrieved)

    const grounded = generateGroundedAnswer({
      query,
      selectedChunks: retrieved,
      dataset
    })

    stepConfig.forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        setActiveStepIndex(index)
      }, index * 550)
      timeouts.current.push(timeout)
    })

    const finishTimeout = window.setTimeout(() => {
      setAnswer(grounded)
      setIsRunning(false)
    }, stepConfig.length * 550 + 400)

    timeouts.current.push(finishTimeout)
  }

  const currentStep = useMemo(() => stepConfig[Math.max(activeStepIndex, 0)], [activeStepIndex])

  return (
    <section className="rounded-2xl border border-blue-200 bg-white/90 p-8 shadow-sm dark:border-blue-900/40 dark:bg-zinc-900/80">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              Pipeline playground
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-900 dark:text-blue-200">
              Watch the RAG circuit fire in real-time
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-800/80 dark:text-blue-100/70">
              Use the same sample corpus from above, then watch your question flow through embeddings, vector search, reranking, and answer composition. Hover the returned chunks to inspect what actually grounded the response.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-3 text-xs text-blue-900/80 dark:text-blue-100/70">
              <label className="font-semibold uppercase tracking-widest">Retriever blend</label>
              <div className="flex flex-wrap gap-2">
                {(['semantic', 'keyword', 'hybrid'] as RetrieverMode[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setMode(option)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      mode === option
                        ? 'border-blue-500 bg-blue-100 text-blue-700 dark:border-blue-300 dark:bg-blue-900/40 dark:text-blue-200'
                        : 'border-blue-200 bg-white/70 text-blue-700/70 hover:border-blue-400 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-200/60'
                    }`}
                  >
                    {modeLabels[option]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-blue-200/70 bg-blue-50/70 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-200">
                Ask the system anything
              </label>
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={2}
                className="mt-2 w-full rounded-lg border border-blue-200 bg-white/90 p-3 text-sm text-blue-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100"
                placeholder="How do we rotate credentials for our Pinecone clusters?"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {dataset.sampleQueries.map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-blue-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-100"
                  >
                    {sample}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isRunning ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                  {isRunning ? 'Running...' : 'Run the pipeline'}
                </button>
                {answer && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                    <Sparkles className="h-3 w-3" /> Grounded answer ready
                  </span>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white/90 p-6 dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="absolute inset-y-1/2 left-6 right-6 h-px -translate-y-1/2 bg-blue-200/60 dark:bg-blue-800/60" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {stepConfig.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === activeStepIndex
                  const isComplete = index < activeStepIndex
                  return (
                    <button
                      key={step.id}
                      onMouseEnter={() => setActiveStepIndex(index)}
                      className={`group flex flex-col items-center gap-3 text-center transition ${
                        isActive
                          ? 'text-blue-700 dark:text-blue-100'
                          : isComplete
                              ? 'text-blue-500/80 dark:text-blue-200/70'
                              : 'text-blue-400/70 dark:text-blue-200/50'
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold transition-all dark:bg-blue-950/40 ${
                          isActive
                            ? 'border-blue-500 shadow-lg shadow-blue-200'
                            : isComplete
                                ? 'border-blue-400'
                                : 'border-blue-200'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-blue-400/80'}`} />
                      </span>
                      <span className="max-w-[9rem] text-sm font-semibold leading-tight">
                        {step.title}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 rounded-xl border border-blue-200/70 bg-blue-50/80 p-4 text-left text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100">
                <p className="font-medium">{currentStep.title}</p>
                <p className="mt-1 text-sm text-blue-900/80 dark:text-blue-100/80">{currentStep.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-blue-200/70 bg-white/90 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-200">Retrieved context</h3>
                <span className="text-xs text-blue-400/80 dark:text-blue-300/70">Top 3 chunks</span>
              </div>
              <div className="mt-4 space-y-3">
                {results.length === 0 && (
                  <p className="text-sm text-blue-800/70 dark:text-blue-200/60">
                    Run the pipeline to view which documents the retriever trusts for this answer.
                  </p>
                )}
                {results.map((result, index) => (
                  <motion.div
                    key={result.chunk.id}
                    onHoverStart={() => setHoveredDoc(result.chunk.id)}
                    onHoverEnd={() => setHoveredDoc(null)}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition ${
                      hoveredDoc === result.chunk.id
                        ? 'border-blue-500 bg-blue-50/80 dark:border-blue-400 dark:bg-blue-900/40'
                        : 'border-blue-200 bg-white dark:border-blue-900/40 dark:bg-blue-950/20'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-xs text-blue-500/80 dark:text-blue-200/70">
                      <span className="font-semibold">Source {index + 1}</span>
                      <span>{(result.hybridScore * 100).toFixed(0)}% confidence</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {result.chunk.docTitle}
                    </p>
                    <p className="mt-1 text-sm text-blue-800/80 dark:text-blue-100/70 line-clamp-3">
                      {result.chunk.text}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-blue-500/80 dark:text-blue-200/70">
                      {result.reasons.map((reason) => (
                        <span key={reason} className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/50">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 p-5 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200">
                <Bot className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-wide text-xs">Grounded answer</span>
              </div>
              {answer ? (
                <>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                    {answer.answer}
                  </p>
                  <div className="mt-4 grid gap-2 text-xs text-emerald-700/80 dark:text-emerald-100/70">
                    <span>Prompt tokens: {answer.promptTokens}</span>
                    <span>Response tokens: {answer.responseTokens}</span>
                    <span>Estimated latency: {Math.round(answer.estimatedLatencyMs)} ms ? Estimated cost: ${answer.estimatedCostUsd.toFixed(4)}</span>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-100/70">
                  Run the pipeline to see the composed response, token usage, and estimated cost profile.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200/70 bg-white/80 p-4 text-xs text-blue-900/70 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200/70">
          <p className="flex items-center gap-2">
            <LifeBuoy className="h-3.5 w-3.5" /> Tip: rerun the sandbox with different retriever modes to see how relying purely on semantic similarity compares with hybrid retrieval when metadata filters are important.
          </p>
        </div>
      </div>
    </section>
  )
}
