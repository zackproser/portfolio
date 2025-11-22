'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Workflow,
  Gauge,
  NotebookPen,
  LayoutDashboard,
  LifeBuoy
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Interactive RAG Visualization
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          A visual journey through the Retrieval-Augmented Generation pipeline, revealing how AI models ground their answers in your data.
        </p>
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
