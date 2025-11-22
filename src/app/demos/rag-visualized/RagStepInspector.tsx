'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  X
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
  // 2: search (Vector Search) -> Inspector: Search View (Top K candidates)
  // 3: retrieve (Retrieve Top Chunks) -> Inspector: Search View (Selected chunks)
  // 4: compose (Compose Prompt) -> Inspector: Prompt View
  // 5: generate (Generate Answer) -> Inspector: Answer View

  // We derive the "Active View" based on the current step index
  const getViewType = (stepIndex: number) => {
    switch(stepIndex) {
      case 0: return 'question'
      case 1: return 'embedding'
      case 2: // Intentional fallthrough - both show retrieval results
      case 3: return 'retrieval'
      case 4: return 'prompt'
      case 5: return 'answer'
      default: return 'question'
    }
  }

  const activeView = getViewType(currentStepIndex)

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
               <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Live Input Query
               </h3>
               <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">Live</span>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
               <Settings2 className="h-3.5 w-3.5" />
               Pipeline Settings
            </h3>
            
            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500">Retrieval Mode</label>
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
                <span className="font-medium text-zinc-500">Top K Chunks</span>
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
                className="flex w-full items-center justify-between text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
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
                    <div className="pt-3 space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500">Chunk Size</span>
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Step Inspection */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-zinc-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                            {activeView === 'retrieval' && <span className="text-xs font-medium text-purple-600">Context Selection</span>}
                            {activeView === 'prompt' && <span className="text-xs font-medium text-amber-600">Context Injection</span>}
                            {activeView === 'answer' && <span className="text-xs font-medium text-green-600">Final Output</span>}
                         </div>
                         <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            {activeView === 'question' && 'Review User Query'}
                            {activeView === 'embedding' && 'Inspect Query Embeddings'}
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
                                            <span className="text-xs text-blue-700/60 uppercase font-bold">Character Count</span>
                                            <p className="font-mono text-blue-900 dark:text-blue-100">{query.length} chars</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-blue-700/60 uppercase font-bold">Est. Tokens</span>
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
                                    <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Vector Snippet (First 50 dimensions)</label>
                                    <div className="font-mono text-xs leading-relaxed break-all text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                        [{simulationData.queryEmbedding.slice(0, 50).map(n => n.toFixed(4)).join(', ')}...]
                                    </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-12 text-zinc-400">
                                    <RefreshCcw className="h-8 w-8 animate-spin mb-2" />
                                    <p>Generating embedding...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2 & 3. Retrieval View */}
                        {activeView === 'retrieval' && (
                            <div className="space-y-6">
                                {simulationData.results.length > 0 ? (
                                    <div className="grid gap-4">
                                        {simulationData.results.map((result, i) => (
                                            <div key={result.chunk.id} className="group relative p-4 rounded-xl border border-zinc-200 hover:border-purple-300 bg-white hover:shadow-md transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-purple-700">
                                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                                    <div className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-mono font-bold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30">
                                                        {(result.similarity * 100).toFixed(1)}% Match
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 pr-20">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-900/30 dark:text-purple-300">
                                                        {i + 1}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                                            {result.chunk.docTitle}
                                                            <span className="text-[10px] font-normal text-zinc-400 border border-zinc-200 rounded px-1 dark:border-zinc-700">Chunk {result.chunk.id}</span>
                                                        </h5>
                                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{result.chunk.text}</p>
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
                                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30 text-sm text-amber-900 dark:text-amber-100">
                                    <p>This is the actual text sent to the LLM. Note how the retrieved chunks (from the previous step) are inserted as context.</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Constructed Prompt</h4>
                                    <div className="text-xs font-mono bg-zinc-900 text-zinc-300 p-4 rounded-xl overflow-x-auto border border-zinc-800 space-y-4">
                                        {simulationData.answer?.promptParts ? (
                                            <>
                                                <div className="pl-3 border-l-2 border-blue-500">
                                                    <div className="text-blue-500 text-[10px] font-bold mb-1">SYSTEM PROMPT</div>
                                                    {simulationData.answer.promptParts.systemPrompt}
                                                </div>
                                                <div className="pl-3 border-l-2 border-amber-500 text-amber-200/80">
                                                    <div className="text-amber-500 text-[10px] font-bold mb-1">INJECTED CONTEXT</div>
                                                    {simulationData.answer.promptParts.contextSections.map((s,i) => (
                                                        <div key={i} className="mb-2 last:mb-0">
                                                            Source {i+1}: {s.text.substring(0, 100)}...
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pl-3 border-l-2 border-emerald-500 text-emerald-200">
                                                    <div className="text-emerald-500 text-[10px] font-bold mb-1">USER QUERY</div>
                                                    {query}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-zinc-500 italic">Waiting for simulation...</div>
                                        )}
                                    </div>
                                </div>
                             </div>
                        )}

                        {/* 5. Answer View */}
                        {activeView === 'answer' && (
                            <div className="space-y-6">
                                {simulationData.answer ? (
                                    <>
                                        <div className="relative p-6 rounded-xl bg-green-50/50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30 shadow-sm">
                                            <div className="absolute -top-3 left-4 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-green-200 dark:bg-green-900 dark:text-green-400 dark:border-green-800">
                                                Final Output
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

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                            {metrics.map((metric) => (
                                                <div key={metric.label} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg p-3 flex flex-col items-center text-center">
                                                    <metric.icon className={`h-4 w-4 mb-2 ${metric.color}`} />
                                                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{metric.label}</span>
                                                    <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">{metric.value}</span>
                                                </div>
                                            ))}
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
