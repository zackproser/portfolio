'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Database,
  Cpu,
  Code,
  Layers,
  LifeBuoy,
  MousePointerClick,
  Network,
  Search,
  RefreshCcw,
  ChevronRight,
  Settings2,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'

import type { RagDataset } from './data'
import {
  type GeneratedAnswer,
  type RagRetrievalResult,
  type RetrieverMode
} from './utils'

// This component now functions as a "Deep Dive" inspector for the current active step
// driven by the top-level visualization state.

type RagStepInspectorProps = {
  currentStepIndex: number
  simulationData: {
    query: string
    queryEmbedding: number[] | null
    results: RagRetrievalResult[]
    answer: GeneratedAnswer | null
    metrics?: {
      latencyMs: number
      costUsd: number
      promptTokens: number
      completionTokens: number
    }
  }
  config: {
    query: string
    setQuery: (q: string) => void
    mode: RetrieverMode
    setMode: (m: RetrieverMode) => void
    topK: number
    setTopK: (k: number) => void
    chunkSize: number
    setChunkSize: (s: number) => void
    dataset: RagDataset
  }
}

const modeLabels: Record<RetrieverMode, string> = {
  semantic: 'Semantic',
  keyword: 'Keyword',
  hybrid: 'Hybrid'
}

export default function RagStepInspector({ 
  currentStepIndex, 
  simulationData,
  config
}: RagStepInspectorProps) {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [ragComparison, setRagComparison] = useState<'withRAG' | 'withoutRAG'>('withRAG')
  
  const {
    query,
    setQuery,
    mode,
    setMode,
    topK,
    setTopK,
    chunkSize,
    setChunkSize,
    dataset
  } = config

  // Map visualization steps to inspector view types
  // Visualization Steps:
  // 0: query (User Query) -> Inspector: Question View
  // 1: embed (Embed Query) -> Inspector: Embedding View
  // 2: search (Vector Search) -> Inspector: Search View (Math & Vectors)
  // 3: retrieve (Retrieve Top Chunks) -> Inspector: Retrieval View (Selected chunks text)
  // 4: compose (Compose Prompt) -> Inspector: Prompt View
  // 5: generate (Generate Answer) -> Inspector: Answer View

  // We derive the "Active View" based on the currentStepIndex
  const getViewType = (stepIndex: number) => {
    switch(stepIndex) {
      case 0: return 'question'
      case 1: return 'embedding'
      case 2: return 'search'
      case 3: return 'retrieval'
      case 4: return 'prompt'
      case 5: return 'answer'
      default: return 'question'
    }
  }

  const activeView = getViewType(currentStepIndex)

  // Generate mock hallucinated answer for comparison
  const generateMockHallucinatedAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes('sso') || lowerQuery.includes('provisioning')) {
      return `To troubleshoot SSO provisioning failures, you should first check your identity provider configuration. Typically, SAML assertions need to be properly formatted with the correct entity ID. Most common issues involve certificate mismatches or incorrect attribute mappings. You may also want to verify that your SP-initiated flow is configured correctly, though some providers prefer IdP-initiated flows. If problems persist, clearing browser cookies and retrying authentication often resolves transient issues.`
    } else if (lowerQuery.includes('support') || lowerQuery.includes('sla') || lowerQuery.includes('escalation')) {
      return `Premium support typically includes 24/7 coverage with response time SLAs that vary by severity level. For critical issues, you can expect initial response within 15-30 minutes during business hours. Escalation procedures usually involve creating a ticket with detailed reproduction steps and impact assessment. The support team will triage based on customer tier and issue severity, with enterprise customers receiving priority routing.`
    } else {
      return `Based on general best practices, the recommended approach involves several key steps. First, identify the root cause by examining system logs and error messages. Next, verify configuration settings match documented requirements. If the issue persists, consider checking for recent updates or changes that might have introduced the problem. Finally, consult the troubleshooting guide or reach out to support for assistance with persistent issues.`
    }
  }

  // Metrics for display - always visible in inspector to show "live" stats
  const metrics = [
    { label: 'Latency', value: simulationData.metrics ? `${Math.round(simulationData.metrics.latencyMs)}ms` : '-', icon: Cpu, color: 'text-orange-500' },
    { label: 'Cost', value: simulationData.metrics ? `$${simulationData.metrics.costUsd.toFixed(4)}` : '-', icon: LifeBuoy, color: 'text-green-500' },
    { label: 'Prompt', value: simulationData.metrics ? simulationData.metrics.promptTokens : '-', icon: Layers, color: 'text-blue-500' },
    { label: 'Completion', value: simulationData.metrics ? simulationData.metrics.completionTokens : '-', icon: Code, color: 'text-purple-500' },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      {/* Inspector Header */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
             <Search className="h-4 w-4" />
           </div>
           <div>
             <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
               Pipeline Inspector
             </h3>
             <p className="text-xs text-zinc-500">
               Live inspection of the active RAG step
             </p>
           </div>
        </div>
        
        {/* Global Metrics Bar (Compact) */}
        <div className="hidden md:flex items-center gap-4">
          {metrics.map((metric) => (
             <div key={metric.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
               <metric.icon className={`h-3 w-3 ${metric.color}`} />
               <div className="flex flex-col leading-none">
                 <span className="text-[10px] text-zinc-500 uppercase font-medium">{metric.label}</span>
                 <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">{metric.value}</span>
               </div>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* LEFT COLUMN: Configuration & Global State */}
        <div className="lg:col-span-4 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 p-6 space-y-8">
          
          {/* 1. Query Input (Always editable, drives simulation) */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Live Input Query
               </h3>
               <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">Live</span>
             </div>
             <div className="relative">
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-relaxed text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                  placeholder="Ask a question about the dataset..."
                />
             </div>
             <div className="flex flex-wrap gap-2">
                {dataset.sampleQueries.slice(0, 2).map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(sample)}
                    className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Sample {i + 1}
                  </button>
                ))}
             </div>
          </div>

          {/* 2. Configuration Controls */}
          <div className="space-y-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
               <Settings2 className="h-3.5 w-3.5" />
               Pipeline Settings
            </h3>
            
            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Retrieval Mode</label>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-200/50 p-1 dark:bg-zinc-800">
                {(['semantic', 'keyword', 'hybrid'] as RetrieverMode[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setMode(option)}
                    className={`rounded-md px-2 py-1.5 text-[10px] font-medium transition-all ${
                      mode === option
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-400'
                        : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                    }`}
                  >
                    {modeLabels[option]}
                  </button>
                ))}
              </div>
            </div>

            {/* Top K Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Top K Chunks</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{topK}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-full bg-zinc-200 h-1.5 accent-blue-600 dark:bg-zinc-700"
              />
            </div>

            {/* Advanced Toggle */}
            <div className="pt-2">
               <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                 <span>Advanced Options</span>
                 <ChevronRight className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Chunk Size</span>
                          <span className="text-zinc-700 dark:text-zinc-300">{chunkSize} words</span>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={200}
                          step={10}
                          value={chunkSize}
                          onChange={(e) => setChunkSize(parseInt(e.target.value))}
                          className="w-full cursor-pointer appearance-none rounded-full bg-zinc-200 h-1.5 accent-blue-600 dark:bg-zinc-700"
                        />
                      </div>
                      
                      {/* Chunking Strategy Explanation */}
                      <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 space-y-2">
                        <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5" />
                          Understanding Chunking
                        </h5>
                        <div className="text-xs text-blue-700/80 dark:text-blue-300/80 space-y-2 leading-relaxed">
                          <p>
                            <strong>What is chunking?</strong> Breaking documents into smaller, searchable pieces that preserve context while enabling precise retrieval.
                          </p>
                          <p>
                            <strong>Chunk size impact:</strong>
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li><strong>Too small</strong> ({chunkSize < 50 ? '← current' : ''}): Loses context, may miss important information</li>
                            <li><strong>Optimal</strong> (50-100 words): Balance between context preservation and precision</li>
                            <li><strong>Too large</strong> ({chunkSize > 100 ? '← current' : ''}): Dilutes signal, harder to find precise matches, wastes tokens</li>
                          </ul>
                          <p className="pt-1">
                            <strong>Strategies:</strong> Respect sentence boundaries, use overlap to prevent information loss, group related concepts together.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Step Inspection */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-zinc-900 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="h-full flex flex-col"
                >
                    {/* View Header */}
                    <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                Step {currentStepIndex + 1} Detail
                            </span>
                            {activeView === 'question' && <span className="text-xs font-medium text-blue-600">Input Processing</span>}
                            {activeView === 'embedding' && <span className="text-xs font-medium text-emerald-600">Vector Space</span>}
                            {activeView === 'search' && <span className="text-xs font-medium text-purple-600">Similarity Search</span>}
                            {activeView === 'retrieval' && <span className="text-xs font-medium text-amber-600">Context Selection</span>}
                            {activeView === 'prompt' && <span className="text-xs font-medium text-indigo-600">Context Injection</span>}
                            {activeView === 'answer' && <span className="text-xs font-medium text-green-600">Final Output</span>}
                         </div>
                         <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            {activeView === 'question' && 'Review User Query'}
                            {activeView === 'embedding' && 'Inspect Query Embeddings'}
                            {activeView === 'search' && 'Vector Similarity Search'}
                            {activeView === 'retrieval' && `Review ${topK} Retrieved Chunks`}
                            {activeView === 'prompt' && 'Analyze Composed Prompt'}
                            {activeView === 'answer' && 'Final Generated Answer'}
                         </h2>
                    </div>

                    {/* View Content */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        
                        {/* 0. Question View */}
                        {activeView === 'question' && (
                            <div className="space-y-6">
                                <div className="p-6 bg-blue-50/30 rounded-xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Raw Input Analysis</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-xs text-blue-700/60 dark:text-blue-300/60 uppercase font-bold">Character Count</span>
                                            <p className="font-mono text-blue-900 dark:text-blue-100">{query.length} chars</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-blue-700/60 dark:text-blue-300/60 uppercase font-bold">Est. Tokens</span>
                                            <p className="font-mono text-blue-900 dark:text-blue-100">~{Math.ceil(query.length / 4)} tokens</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700">
                                    <p className="font-serif text-lg text-zinc-700 dark:text-zinc-300 italic">&quot;{query}&quot;</p>
                                </div>
                            </div>
                        )}

                        {/* 1. Embedding View */}
                        {activeView === 'embedding' && (
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                                    <Network className="h-5 w-5 text-emerald-600 mt-1" />
                                    <div>
                                    <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Vector Transformation</h4>
                                    <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                                        Your text has been converted into a 1536-dimensional vector. This array of numbers represents the semantic meaning of your query in high-dimensional space.
                                    </p>
                                    </div>
                                </div>
                                
                                {simulationData.queryEmbedding ? (
                                    <>
                                    {/* Concept Visualization */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Concept Dimensions</label>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                            Each dimension represents a learned concept. Higher values indicate stronger presence of that concept in your query.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { label: 'Support & SLA', index: 0 },
                                                { label: 'SSO & Integration', index: 1 },
                                                { label: 'Security & Compliance', index: 2 },
                                                { label: 'Operations & Runbooks', index: 3 },
                                                { label: 'Release & Versioning', index: 4 },
                                                { label: 'Policy & Controls', index: 5 },
                                                { label: 'Customer Impact', index: 6 }
                                            ].map(({ label, index }) => {
                                                const value = simulationData.queryEmbedding?.[index] || 0
                                                const normalizedValue = Math.max(0, Math.min(1, (value + 0.15) / 1.5))
                                                return (
                                                    <div key={index} className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100">{label}</span>
                                                            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">{value.toFixed(3)}</span>
                                                        </div>
                                                        <div className="h-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all"
                                                                style={{ width: `${normalizedValue * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Full Vector (First 50 dimensions)</label>
                                    <div className="font-mono text-xs leading-relaxed break-all text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                        [{simulationData.queryEmbedding.slice(0, 50).map(n => n.toFixed(4)).join(', ')}...]
                                    </div>
                                    </div>

                                    {/* Deep Dive Link */}
                                    <div className="mt-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800">
                                        <div className="flex items-start gap-3">
                                            <Network className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h5 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                                                    Want to dive deeper into embeddings?
                                                </h5>
                                                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mb-3 leading-relaxed">
                                                    Explore our interactive embeddings demo to see how text transforms into vectors, understand tokenization, and visualize semantic relationships in real-time.
                                                </p>
                                                <Link
                                                    href="/demos/embeddings"
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 transition-colors"
                                                >
                                                    Explore Embeddings Demo
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center py-12 text-zinc-400">
                                    <RefreshCcw className="h-8 w-8 animate-spin mb-2" />
                                    <p>Generating embedding...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. Search View (Vector Math) */}
                        {activeView === 'search' && (
                            <div className="space-y-6">
                                {/* Math Explanation */}
                                <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30">
                                   <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                                     <Cpu className="h-4 w-4" />
                                     Cosine Similarity
                                   </h4>
                                   <div className="font-mono text-xs bg-white/50 dark:bg-black/20 p-3 rounded border border-purple-100/50 dark:border-purple-800/30 text-purple-800 dark:text-purple-200 mb-2">
                                     similarity = (A · B) / (||A|| × ||B||)
                                   </div>
                                   <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
                                      We calculate the angle between the <strong>Query Vector</strong> (A) and every <strong>Chunk Vector</strong> (B). 
                                      Smaller angles mean higher similarity scores (closer to 1.0).
                                   </p>
                                </div>

                                {simulationData.results.length > 0 ? (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Top {topK} Candidate Matches</h4>
                                        <div className="grid gap-2">
                                            {simulationData.results.map((result, i) => (
                                                <div key={result.chunk.id} className="flex items-center gap-4 p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/30 dark:border-zinc-800">
                                                    <div className="w-16 text-right font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                                                        {(result.similarity).toFixed(4)}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <div 
                                                          className="h-full bg-purple-500 rounded-full" 
                                                          style={{ width: `${Math.max(0, result.similarity * 100)}%` }}
                                                        />
                                                    </div>
                                                    <div className="w-32 text-xs text-zinc-500 text-right truncate">
                                                        Chunk {result.chunk.id}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-zinc-500">
                                        Running vector search...
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Retrieval View (Content) */}
                        {activeView === 'retrieval' && (
                            <div className="space-y-6">
                                {/* Metadata Explanation */}
                                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30">
                                    <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        Understanding Metadata
                                    </h4>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
                                        Metadata fields (tags, dates, document IDs) enable filtering and organization. In production, you can filter by tags, date ranges, or document sources before retrieval to narrow results to specific contexts.
                                    </p>
                                </div>

                                {simulationData.results.length > 0 ? (
                                    <div className="grid gap-4">
                                        {simulationData.results.map((result, i) => (
                                            <div key={result.chunk.id} className="group relative p-4 rounded-xl border border-amber-200/60 hover:border-amber-300 bg-amber-50/30 hover:shadow-md transition-all dark:bg-amber-900/10 dark:border-amber-800 dark:hover:border-amber-700">
                                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                                    <div className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-mono font-bold border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800">
                                                        Rank #{i + 1}
                                                    </div>
                                                </div>
                                                <div className="space-y-3 pr-20">
                                                    {/* Document Title */}
                                                    <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                                        <Database className="h-3.5 w-3.5 text-amber-600" />
                                                        {result.chunk.docTitle}
                                                    </h5>
                                                    
                                                    {/* Metadata Fields */}
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="p-2 rounded-md bg-white/60 dark:bg-zinc-900/40 border border-amber-100 dark:border-amber-800">
                                                            <span className="text-amber-700/70 dark:text-amber-400/70 font-medium">Document ID:</span>
                                                            <div className="font-mono text-zinc-700 dark:text-zinc-300 mt-0.5 truncate">{result.chunk.docId}</div>
                                                        </div>
                                                        <div className="p-2 rounded-md bg-white/60 dark:bg-zinc-900/40 border border-amber-100 dark:border-amber-800">
                                                            <span className="text-amber-700/70 dark:text-amber-400/70 font-medium">Last Updated:</span>
                                                            <div className="text-zinc-700 dark:text-zinc-300 mt-0.5">{result.chunk.lastUpdated}</div>
                                                        </div>
                                                        <div className="p-2 rounded-md bg-white/60 dark:bg-zinc-900/40 border border-amber-100 dark:border-amber-800">
                                                            <span className="text-amber-700/70 dark:text-amber-400/70 font-medium">Tags:</span>
                                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                                {result.chunk.tags.map((tag, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-medium dark:bg-amber-900/40 dark:text-amber-300">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="p-2 rounded-md bg-white/60 dark:bg-zinc-900/40 border border-amber-100 dark:border-amber-800">
                                                            <span className="text-amber-700/70 dark:text-amber-400/70 font-medium">Word Count:</span>
                                                            <div className="text-zinc-700 dark:text-zinc-300 mt-0.5">{result.chunk.wordCount} words</div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Chunk Text */}
                                                    <div className="pt-2">
                                                        <span className="text-xs font-medium text-amber-700/70 dark:text-amber-400/70 mb-1 block">Chunk Text:</span>
                                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed p-3 bg-white rounded-lg border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
                                                            &quot;{result.chunk.text}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-zinc-500">
                                        No results found. Try adjusting your query or keywords.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. Prompt View */}
                        {activeView === 'prompt' && (
                             <div className="space-y-4">
                                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30 text-sm text-indigo-900 dark:text-indigo-100">
                                    <p className="font-medium mb-1">Visual Prompt Construction</p>
                                    <p className="text-xs">The LLM only sees this exact prompt—no other information. Retrieved context is &quot;sandwiched&quot; between system instructions and your query.</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Constructed Prompt</h4>
                                    
                                    {/* Visual Sandwich Diagram */}
                                    {simulationData.answer?.promptParts ? (
                                        <div className="space-y-3">
                                            {/* System Prompt - Top */}
                                            <div className="relative">
                                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
                                                <div className="pl-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">System Prompt</div>
                                                    </div>
                                                    <p className="text-xs text-indigo-900 dark:text-indigo-100 leading-relaxed">
                                                        {simulationData.answer.promptParts.systemPrompt}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Arrow pointing down */}
                                            <div className="flex justify-center">
                                                <ArrowRight className="h-4 w-4 text-zinc-400 rotate-90" />
                                            </div>
                                            
                                            {/* Retrieved Context - Middle */}
                                            <div className="relative">
                                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-amber-500 rounded-full"></div>
                                                <div className="pl-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase">Retrieved Context</div>
                                                        <span className="text-xs text-amber-600 dark:text-amber-400">({simulationData.answer.promptParts.contextSections.length} chunks)</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {simulationData.answer.promptParts.contextSections.map((s, i) => (
                                                            <div key={i} className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed p-2 bg-white/50 dark:bg-zinc-900/50 rounded border border-amber-100 dark:border-amber-800">
                                                                <span className="font-semibold">Source {i+1} - {s.docTitle}:</span> {s.text.substring(0, 150)}{s.text.length > 150 ? '...' : ''}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Arrow pointing down */}
                                            <div className="flex justify-center">
                                                <ArrowRight className="h-4 w-4 text-zinc-400 rotate-90" />
                                            </div>
                                            
                                            {/* User Query - Bottom */}
                                            <div className="relative">
                                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
                                                <div className="pl-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">User Query</div>
                                                    </div>
                                                    <p className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed font-medium">
                                                        {query}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-zinc-500 italic p-4 text-center">Waiting for simulation...</div>
                                    )}
                                </div>
                             </div>
                        )}

                        {/* 5. Answer View */}
                        {activeView === 'answer' && (
                            <div className="space-y-6">
                                {simulationData.answer ? (
                                    <>
                                        {/* Comparison Toggle - Enhanced with callout */}
                                        <div className="rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-4">
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[10px] font-bold uppercase tracking-wide">
                                              <AlertTriangle className="h-3 w-3" />
                                              Key Insight
                                            </div>
                                          </div>
                                          <p className="text-sm text-amber-900/80 dark:text-amber-100/80 mb-3 leading-relaxed">
                                            <strong>See how RAG prevents hallucinations.</strong> Toggle between responses to compare a grounded answer with citations vs. a plausible-sounding but unverified response.
                                          </p>
                                          <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700">
                                              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Compare answers:</span>
                                              <div className="flex items-center gap-2">
                                                  <button
                                                      onClick={() => setRagComparison('withRAG')}
                                                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                          ragComparison === 'withRAG'
                                                              ? 'bg-green-500 text-white shadow-sm'
                                                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                      }`}
                                                  >
                                                      ✓ With RAG
                                                  </button>
                                                  <button
                                                      onClick={() => setRagComparison('withoutRAG')}
                                                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                                                          ragComparison === 'withoutRAG'
                                                              ? 'bg-orange-500 text-white shadow-sm'
                                                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                      }`}
                                                  >
                                                      <AlertTriangle className="h-3 w-3" />
                                                      Without RAG
                                                  </button>
                                              </div>
                                          </div>
                                        </div>

                                        {ragComparison === 'withRAG' ? (
                                            <div className="relative p-6 rounded-xl bg-green-50/50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30 shadow-sm">
                                                <div className="absolute -top-3 left-4 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-green-200 dark:bg-green-900 dark:text-green-400 dark:border-green-800">
                                                    Final Output (With RAG)
                                                </div>
                                                <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                                                    {simulationData.answer.answer}
                                                </p>
                                                
                                                {simulationData.answer.citations && simulationData.answer.citations.length > 0 && (
                                                    <div className="mt-6 pt-4 border-t border-green-200/50 dark:border-green-800/30 flex flex-wrap gap-2">
                                                        <span className="text-xs text-green-700/70 dark:text-green-400/70 font-medium py-0.5">Sources:</span>
                                                        {simulationData.answer.citations.map((c, i) => (
                                                            <span key={i} className="text-xs px-2 py-1 bg-white/80 rounded-md border border-green-200 text-green-800 dark:bg-black/20 dark:border-green-800 dark:text-green-300 shadow-sm">
                                                                [{i+1}] {c.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative p-6 rounded-xl bg-orange-50/50 border-2 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800 shadow-sm">
                                                <div className="absolute -top-3 left-4 bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-orange-200 dark:bg-orange-900 dark:text-orange-400 dark:border-orange-800 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Without RAG (Hallucinated)
                                                </div>
                                                <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                                                    {generateMockHallucinatedAnswer(query)}
                                                </p>
                                                <div className="mt-4 p-3 rounded-lg bg-orange-100/50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                                                    <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed">
                                                        <strong>Warning:</strong> This answer was generated without RAG. It may sound plausible but contains unverified information and lacks citations. Without access to your knowledge base, LLMs can confabulate details that seem correct but aren&apos;t grounded in your actual documentation.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                            {metrics.map((metric) => (
                                                <div key={metric.label} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg p-3 flex flex-col items-center text-center">
                                                    <metric.icon className={`h-4 w-4 mb-2 ${metric.color}`} />
                                                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{metric.label}</span>
                                                    <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">{metric.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Learn More: Build Your Own RAG Pipeline */}
                                        <div className="mt-6 p-4 rounded-xl border border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
                                            <div className="flex items-start gap-3">
                                                <Bot className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                                                        Ready to build your own RAG pipeline?
                                                    </h5>
                                                    <p className="text-xs text-green-700/80 dark:text-green-300/80 mb-3 leading-relaxed">
                                                        Follow a step-by-step tutorial covering document chunking, embeddings, vector indexing, and production deployment with Next.js and Vercel AI SDK.
                                                    </p>
                                                    <Link
                                                        href="/blog/rag-pipeline-tutorial"
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100 transition-colors"
                                                    >
                                                        Read: RAG Pipeline Tutorial
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-12 flex justify-center">
                                        <RefreshCcw className="h-8 w-8 animate-spin text-zinc-300" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
