'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Workflow,
  Gauge,
  NotebookPen,
  LayoutDashboard,
  LifeBuoy,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Zap,
  Play,
  MousePointerClick,
  ArrowRight,
  Database,
  Brain,
  FileSearch
} from 'lucide-react'

import { SAMPLE_DATASETS } from './data'
import RagPipelineVisualization from './RagPipelineVisualization'
import RagStepInspector from './RagStepInspector'
import { 
  generateEmbedding, 
  simulateRetrieval, 
  generateGroundedAnswer,
  buildChunkIndex,
  type RetrieverMode,
  type RagRetrievalResult,
  type GeneratedAnswer
} from './utils'

export default function RagDemoClient() {
  const dataset = useMemo(() => SAMPLE_DATASETS[0], [])
  
  // Shared State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [query, setQuery] = useState(dataset.sampleQueries[0] ?? '')
  const [mode, setMode] = useState<RetrieverMode>('hybrid')
  const [topK, setTopK] = useState<number>(3)
  const [chunkSize, setChunkSize] = useState<number>(50)
  
  // Simulation State (Derived)
  const [queryEmbedding, setQueryEmbedding] = useState<number[] | null>(null)
  const [results, setResults] = useState<RagRetrievalResult[]>([])
  const [answer, setAnswer] = useState<GeneratedAnswer | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  // Re-run simulation when inputs change
  useEffect(() => {
    const runSimulation = async () => {
      setIsSimulating(true)
      
      // 1. Embed
      const embedding = generateEmbedding(query)
      setQueryEmbedding(embedding)

      // 2. Retrieve
      const chunks = buildChunkIndex(dataset, chunkSize)
      const retrieved = simulateRetrieval({
        query,
        chunks,
        topK,
        mode
      })
      setResults(retrieved)

      // 3. Generate
      const grounded = generateGroundedAnswer({
        query,
        selectedChunks: retrieved,
        dataset
      })
      setAnswer(grounded)
      
      setIsSimulating(false)
    }

    const debounce = setTimeout(runSimulation, 500)
    return () => clearTimeout(debounce)
  }, [query, mode, topK, chunkSize, dataset])

  const [showIntroDetails, setShowIntroDetails] = useState(false)

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Learn RAG interactively
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          A visual journey through the Retrieval-Augmented Generation pipeline, revealing how AI models ground their answers in your data.
        </p>
      </div>

      {/* Polished Intro Card with Instructions - Light/Dark mode aware */}
      <div className="max-w-4xl mx-auto">
        {/* Light mode: soft blue/indigo gradient, Dark mode: deep purple/slate */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/60 dark:border-transparent bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-violet-600 dark:via-purple-600 dark:to-indigo-700 p-[1px] shadow-lg shadow-blue-500/10 dark:shadow-purple-500/20">
          <div className="relative rounded-[15px] bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-purple-950/90 dark:to-slate-900 p-5 sm:p-6">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 dark:from-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 dark:from-blue-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            
            <div className="relative flex flex-col lg:flex-row gap-6 items-start">
              {/* Left: What is RAG */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    What is RAG?
                  </h3>
                </div>
                
                <p className="text-sm text-zinc-700 dark:text-purple-100/90 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-white">Retrieval-Augmented Generation</strong> fetches relevant docs from your knowledge base and injects them into the LLM prompt—giving AI verified facts instead of stale training data.
                </p>

                {/* Expand for why it matters */}
                <button
                  onClick={() => setShowIntroDetails(!showIntroDetails)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-purple-300 hover:text-blue-800 dark:hover:text-white transition-colors group"
                >
                  <span className="border-b border-blue-400/50 dark:border-purple-400/50 group-hover:border-blue-600 dark:group-hover:border-white/50">{showIntroDetails ? 'Hide details' : 'Why it matters'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showIntroDetails ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showIntroDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid sm:grid-cols-2 gap-3 pt-2">
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-100/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300">Without RAG</p>
                            <p className="text-xs text-red-600/80 dark:text-red-200/70 mt-0.5">LLMs hallucinate plausible-sounding answers from stale training data.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-100/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">With RAG</p>
                            <p className="text-xs text-emerald-600/80 dark:text-emerald-200/70 mt-0.5">Answers grounded in your documents with verifiable citations.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-transparent via-blue-300/40 dark:via-purple-400/30 to-transparent self-center" />
              <div className="lg:hidden w-full h-px bg-gradient-to-r from-transparent via-blue-300/40 dark:via-purple-400/30 to-transparent" />

              {/* Right: How to Use */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-blue-500 dark:to-cyan-600 shadow-lg shadow-indigo-500/30 dark:shadow-blue-500/30">
                    <MousePointerClick className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    How to Use This Demo
                  </h3>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-purple-100/90">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-purple-500/30 text-xs font-bold text-blue-700 dark:text-purple-200">1</div>
                    <span>Click <strong className="text-zinc-900 dark:text-white">Play</strong> or step through manually with <strong className="text-zinc-900 dark:text-white">Next</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-purple-100/90">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-purple-500/30 text-xs font-bold text-blue-700 dark:text-purple-200">2</div>
                    <span>Watch data flow through each RAG stage in the diagram</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-purple-100/90">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-purple-500/30 text-xs font-bold text-blue-700 dark:text-purple-200">3</div>
                    <span>Explore the <strong className="text-zinc-900 dark:text-white">Inspector</strong> below to see step details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Visualization - Controlled Component */}
      <RagPipelineVisualization 
        dataset={dataset}
        currentStepIndex={currentStepIndex}
        onStepChange={setCurrentStepIndex}
        simulationData={{
          query,
          queryEmbedding,
          retrievalResults: results,
          groundedAnswer: answer
        }}
      />

      {/* Deep Dive Inspector - Controlled by Active Step */}
      <div id="inspector" className="w-full">
        <RagStepInspector 
          currentStepIndex={currentStepIndex}
          simulationData={{
            query,
            queryEmbedding,
            results,
            answer,
            metrics: answer ? {
              latencyMs: answer.estimatedLatencyMs,
              costUsd: answer.estimatedCostUsd,
              promptTokens: answer.promptTokens,
              completionTokens: answer.responseTokens
            } : undefined
          }}
          config={{
            query,
            setQuery,
            mode,
            setMode,
            topK,
            setTopK,
            chunkSize,
            setChunkSize,
            dataset
          }}
        />
      </div>

      <section className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/10" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16">
          <div className="space-y-8">
            {/* Content */}
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 backdrop-blur-sm dark:bg-blue-900/40 dark:text-blue-200">
                Build production RAG
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
                Build the Production Pipeline This Demo is Inspired By
              </h2>
              
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg max-w-2xl mx-auto">
                Follow the exact system I refined while leading RAG architecture at Pinecone. The premium tutorial includes the notebook that preprocesses your data, the Next.js app that ships to Vercel, and direct email support when you hit edge cases.
              </p>

              {/* Feature Grid - More refined */}
              <div className="grid gap-3 sm:grid-cols-3 text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <NotebookPen className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Step-by-step Jupyter notebook for chunking, embeddings, and Pinecone indexing.</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Production-ready Next.js + Vercel AI SDK interface with streaming, citations, and guardrails.</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <LifeBuoy className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Direct email support from me while you adapt the pipeline to your stack.</span>
                </div>
              </div>

              {/* CTA Buttons - More refined */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                <Link
                  href="/checkout?product=rag-pipeline-tutorial&type=blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get the $149 Tutorial →
                </Link>
                <Link
                  href="/products/rag-pipeline-tutorial"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-blue-300/60 bg-white/80 text-blue-700 backdrop-blur-sm hover:bg-blue-50/80 hover:border-blue-400 transition-all dark:border-blue-700/60 dark:bg-zinc-900/80 dark:text-blue-200 dark:hover:bg-zinc-800/80 dark:hover:border-blue-600"
                >
                  Preview the Curriculum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
