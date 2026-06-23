'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  NotebookPen,
  LayoutDashboard,
  LifeBuoy,
  ChevronDown,
  AlertTriangle,
  Zap,
  MousePointerClick,
  Brain
} from 'lucide-react'

import { track } from '@vercel/analytics'
import Newsletter from '@/components/Newsletter'
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
      {/* Promo ribbon — surfaces the premium tutorial from the first scroll. */}
      <Link
        href="/products/rag-pipeline-tutorial"
        onClick={() => track('rag_demo_ribbon_click', { surface: 'top_ribbon' })}
        className="group block rounded-md border border-burnt-400/70 dark:border-amber-400/60 bg-burnt-50/60 dark:bg-amber-400/[0.06] hover:bg-burnt-50 dark:hover:bg-amber-400/[0.1] transition-colors"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-4 py-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10.5px] font-semibold tracking-[0.14em] uppercase text-burnt-500 dark:text-amber-300">
            <span aria-hidden>✱</span>
            Companion tutorial
          </span>
          <span className="text-sm text-zinc-700 dark:text-zinc-200 sm:flex-1">
            This demo&rsquo;s pipeline ships in the <span className="font-semibold">$149 RAG tutorial</span> &mdash; notebook, Next.js app, hybrid retrieval, reranker, and an eval harness.
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-burnt-500 dark:text-amber-300 group-hover:underline whitespace-nowrap">
            Get it &rarr;
          </span>
        </div>
      </Link>

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

      {/* Editorial CTA card — same visual language as the homepage hero capture. */}
      <section className="relative px-4 sm:px-6 py-12 md:py-16">
        <div className="rag-cta-card relative mx-auto max-w-4xl rounded-[10px] border-[1.5px] border-burnt-400 dark:border-amber-400 bg-parchment-50 dark:bg-slate-800 p-6 sm:p-8 md:p-10">
          {/* Eyebrow / mono label */}
          <div className="flex items-center gap-3 font-mono text-[10.5px] font-semibold tracking-[0.14em] uppercase text-burnt-500 dark:text-amber-300">
            <span className="h-px w-7 bg-burnt-400 dark:bg-amber-400" aria-hidden />
            <span>§ Companion · Premium tutorial · $149</span>
          </div>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 max-w-3xl">
            Ship the pipeline behind this demo &mdash;{' '}
            <em className="text-burnt-400 dark:text-amber-400 font-extrabold italic">with evals.</em>
          </h2>

          <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[60ch]">
            The same system I refined while leading the first production RAG reference architecture at Pinecone &mdash;
            updated for 2026. Hybrid retrieval, a Cohere reranker, and an eval harness with faithfulness and recoverability scores
            you can put in front of your team without flinching.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 max-w-3xl">
            <div className="flex items-start gap-3 rounded-md border border-parchment-300/70 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 p-4">
              <NotebookPen className="h-4 w-4 flex-shrink-0 text-burnt-400 dark:text-amber-300 mt-0.5" />
              <div className="text-[13.5px] leading-relaxed text-parchment-600 dark:text-slate-300">
                <b className="text-charcoal-50 dark:text-parchment-100 font-semibold">Notebook</b> &mdash; chunking, embeddings, indexing. Annotated, runnable, defensibly small.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-parchment-300/70 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 p-4">
              <LayoutDashboard className="h-4 w-4 flex-shrink-0 text-burnt-400 dark:text-amber-300 mt-0.5" />
              <div className="text-[13.5px] leading-relaxed text-parchment-600 dark:text-slate-300">
                <b className="text-charcoal-50 dark:text-parchment-100 font-semibold">Next.js app</b> &mdash; streaming, citations, hybrid retrieval, reranker, real failure paths.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-parchment-300/70 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 p-4">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-burnt-400 dark:text-amber-300 mt-0.5" />
              <div className="text-[13.5px] leading-relaxed text-parchment-600 dark:text-slate-300">
                <b className="text-charcoal-50 dark:text-parchment-100 font-semibold">Eval harness</b> &mdash; Ragas + LLM-as-judge, wired into CI. Regressions fail loud.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-parchment-300/70 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 p-4">
              <LifeBuoy className="h-4 w-4 flex-shrink-0 text-burnt-400 dark:text-amber-300 mt-0.5" />
              <div className="text-[13.5px] leading-relaxed text-parchment-600 dark:text-slate-300">
                <b className="text-charcoal-50 dark:text-parchment-100 font-semibold">Direct email support</b> &mdash; ask me your questions while you adapt it to your stack.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link
              href="/checkout?product=rag-pipeline-tutorial&type=blog"
              onClick={() =>
                track('rag_demo_cta_click', {
                  surface: 'demo_footer',
                  destination: 'checkout',
                })
              }
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
            >
              Buy the tutorial &mdash; $149
            </Link>
            <Link
              href="/products/rag-pipeline-tutorial"
              onClick={() =>
                track('rag_demo_cta_click', {
                  surface: 'demo_footer',
                  destination: 'product_page',
                })
              }
              className="text-sm text-parchment-600 dark:text-slate-300 underline decoration-parchment-400 dark:decoration-slate-500 underline-offset-4 hover:decoration-burnt-400 dark:hover:decoration-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
            >
              Preview the curriculum &rarr;
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-parchment-300/60 dark:border-slate-700 font-mono text-[10px] tracking-[0.1em] uppercase text-parchment-500 dark:text-slate-500">
            Updated for 2026 · Notebook · Next.js · Hybrid retrieval · Reranker · Evals · Email support
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Newsletter
          title="Build Production RAG Systems"
          body="Get weekly deep-dives on embeddings, vector search, and retrieval pipelines."
          successMessage="You're in! RAG engineering content coming your way."
          onSubscribe={() => track('rag_demo_newsletter_subscribe')}
          position="rag-demo-footer"
          tags={['interest:ai-engineering', 'source:demo']}
        />
      </div>
    </div>
  )
}
