'use client'

import { useEffect, useMemo, useState } from 'react'
import { Database, LifeBuoy, MousePointerClick, Search, Sparkles } from 'lucide-react'

import type { RagDataset } from './data'
import {
  buildChunkIndex,
  generateGroundedAnswer,
  simulateRetrieval,
  type GeneratedAnswer,
  type RagRetrievalResult,
  type RetrieverMode
} from './utils'

type PipelineNode = {
  id: string
  label: string
  sublabel: string
  x: number
  y: number
  emoji: string
  stepIndex: number
}

type PipelineEdge = {
  id: string
  source: string
  target: string
  stepIndex: number
  curved?: boolean
}

type DocNode = {
  id: string
  title: string
  snippet: string
  x: number
  y: number
  rank: number
}

const VIEWBOX_WIDTH = 980
const VIEWBOX_HEIGHT = 360

const mainNodes: PipelineNode[] = [
  {
    id: 'question',
    label: 'User question',
    sublabel: '?How do we rotate credentials safely??',
    x: 90,
    y: 190,
    emoji: '??',
    stepIndex: 0
  },
  {
    id: 'embedding',
    label: 'Embedding model',
    sublabel: 'Text ? vector fingerprint',
    x: 270,
    y: 160,
    emoji: '??',
    stepIndex: 1
  },
  {
    id: 'vector-store',
    label: 'Vector database',
    sublabel: 'Semantic nearest neighbours',
    x: 470,
    y: 190,
    emoji: '???',
    stepIndex: 2
  },
  {
    id: 'reranker',
    label: 'Hybrid reranker',
    sublabel: 'Cosine + filters + metadata',
    x: 690,
    y: 160,
    emoji: '??',
    stepIndex: 3
  },
  {
    id: 'answer',
    label: 'Grounded answer',
    sublabel: 'Citations + streaming tokens',
    x: 890,
    y: 190,
    emoji: '??',
    stepIndex: 4
  }
]

const flowSequence = [
  { nodeId: 'question', edges: [] as string[] },
  { nodeId: 'embedding', edges: ['edge-question-embedding'] },
  {
    nodeId: 'vector-store',
    edges: ['edge-embedding-vector', 'edge-vector-doc-0', 'edge-vector-doc-1', 'edge-vector-doc-2', 'edge-vector-doc-3']
  },
  { nodeId: 'reranker', edges: ['edge-vector-reranker'] },
  { nodeId: 'answer', edges: ['edge-reranker-answer'] }
]

const STEP_DELAY = 950

const RETRIEVER_OPTIONS: { mode: RetrieverMode; label: string; hint: string }[] = [
  {
    mode: 'hybrid',
    label: 'Hybrid',
    hint: 'Cosine + keyword boost'
  },
  {
    mode: 'semantic',
    label: 'Semantic',
    hint: 'Embeddings only'
  },
  {
    mode: 'keyword',
    label: 'Keyword',
    hint: 'Lexical filters'
  }
]

const makeCurvedPath = (source: { x: number; y: number }, target: { x: number; y: number }) => {
  const midX = (source.x + target.x) / 2
  const controlY = source.y - 70
  return `M ${source.x} ${source.y} C ${midX} ${controlY} ${midX} ${controlY} ${target.x} ${target.y}`
}

const makeStraightPath = (source: { x: number; y: number }, target: { x: number; y: number }) =>
  `M ${source.x} ${source.y} L ${target.x} ${target.y}`

type RagPipelineVisualizationProps = {
  dataset: RagDataset
}

export default function RagPipelineVisualization({ dataset }: RagPipelineVisualizationProps) {
  const [query, setQuery] = useState<string>(dataset.sampleQueries[0] ?? '')
  const [chunkSize, setChunkSize] = useState(90)
  const [topK, setTopK] = useState(3)
  const [retrieverMode, setRetrieverMode] = useState<RetrieverMode>('hybrid')
  const [results, setResults] = useState<RagRetrievalResult[]>([])
  const [answer, setAnswer] = useState<GeneratedAnswer | null>(null)
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null)
  const [flowIndex, setFlowIndex] = useState<number>(-1)
  const [isPlaying, setIsPlaying] = useState(false)

  const vectorNode = mainNodes.find((node) => node.id === 'vector-store')!

  useEffect(() => {
    setQuery(dataset.sampleQueries[0] ?? '')
    setResults([])
    setAnswer(null)
    setFlowIndex(-1)
    setIsPlaying(false)
  }, [dataset])

  const chunkIndex = useMemo(() => buildChunkIndex(dataset, chunkSize), [dataset, chunkSize])

  const docNodes = useMemo(() => {
    const source = results.length > 0
      ? results.map((result, index) => ({
          id: result.chunk.id,
          title: result.chunk.docTitle,
          snippet: result.chunk.text.slice(0, 220).trim(),
          rank: index
        }))
      : dataset.documents.slice(0, Math.min(4, dataset.documents.length)).map((doc, index) => ({
          id: doc.id,
          title: doc.title,
          snippet: doc.content.slice(0, 220).trim(),
          rank: index
        }))

    const count = source.length
    const radius = 150

    return source.map((doc, index) => {
      const normalizedIndex = count > 1 ? index / (count - 1) : 0.5
      const angle = (normalizedIndex - 0.5) * Math.PI * 0.85
      const x = vectorNode.x + radius * Math.cos(angle)
      const y = vectorNode.y + radius * Math.sin(angle)

      return {
        ...doc,
        x,
        y
      }
    })
  }, [dataset, results, vectorNode.x, vectorNode.y])

  const activeDocIds = useMemo(() => new Set(results.map((result) => result.chunk.id)), [results])

  const edges: PipelineEdge[] = useMemo(() => {
    const baseEdges: PipelineEdge[] = [
      {
        id: 'edge-question-embedding',
        source: 'question',
        target: 'embedding',
        stepIndex: 1
      },
      {
        id: 'edge-embedding-vector',
        source: 'embedding',
        target: 'vector-store',
        stepIndex: 2
      },
      {
        id: 'edge-vector-reranker',
        source: 'vector-store',
        target: 'reranker',
        stepIndex: 3
      },
      {
        id: 'edge-reranker-answer',
        source: 'reranker',
        target: 'answer',
        stepIndex: 4
      }
    ]

    const docEdges: PipelineEdge[] = results.length > 0
      ? docNodes.map((doc, index) => ({
          id: `edge-vector-doc-${index}`,
          source: 'vector-store',
          target: doc.id,
          stepIndex: 2
        }))
      : []

    return [...baseEdges, ...docEdges]
  }, [docNodes, results.length])

  const pinnedDoc = hoveredDocId ? docNodes.find((doc) => doc.id === hoveredDocId) : null

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const timers: number[] = []
    flowSequence.forEach((_step, index) => {
      timers.push(
        window.setTimeout(() => {
          setFlowIndex(index)
        }, index * STEP_DELAY)
      )
    })

    timers.push(
      window.setTimeout(() => {
        setIsPlaying(false)
      }, flowSequence.length * STEP_DELAY + 350)
    )

    return () => {
      timers.forEach((id) => clearTimeout(id))
    }
  }, [isPlaying])

  const handleRunPipeline = () => {
    if (isPlaying || !query.trim()) return

    const retrieved = simulateRetrieval({
      query,
      chunks: chunkIndex,
      topK,
      mode: retrieverMode
    })

    setResults(retrieved)
    setAnswer(
      retrieved.length
        ? generateGroundedAnswer({
            query,
            selectedChunks: retrieved,
            dataset
          })
        : null
    )
    setHoveredDocId(retrieved[0]?.chunk.id ?? null)
    setFlowIndex(-1)
    setIsPlaying(true)
  }

  const docInspector = pinnedDoc ?? (docNodes.length ? docNodes[0] : null)

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-2 sm:px-4 lg:px-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            Interactive pipeline explorer
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Follow a question as it becomes a grounded answer
          </h2>
          <p className="mt-2 text-sm text-blue-800/80 dark:text-blue-100/70">
            Pick a prompt, tune the retrieval knobs, then step through each phase of the pipeline. Hover the documents in the graph to inspect the evidence powering the answer.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-blue-600/80 dark:text-blue-200/70">
          <button
            type="button"
            onClick={handleRunPipeline}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isPlaying}
          >
            <Sparkles className="h-4 w-4" />
            {isPlaying ? 'Playing pipeline...' : 'Play pipeline'}
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-3 py-1 text-[11px] uppercase tracking-wide dark:border-blue-900/50">
            Manual advance only
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-3 py-1 text-[11px] uppercase tracking-wide dark:border-blue-900/50">
            Hover to inspect evidence
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),320px]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 border border-blue-200/70 bg-white/80 p-4 text-xs font-semibold uppercase tracking-wide text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
              Question to explore
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={2}
                className="mt-1 h-[70px] w-full resize-none rounded-md border border-blue-200 bg-white/95 px-3 py-2 text-sm text-blue-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100"
                placeholder="How do we rotate credentials for our Pinecone clusters?"
              />
              <div className="flex flex-wrap gap-2 text-[11px] font-medium normal-case tracking-normal">
                {dataset.sampleQueries.map((sample) => (
                  <button
                    type="button"
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="rounded-full border border-blue-200/70 bg-white px-3 py-1 text-blue-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-100"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </label>

            <div className="flex flex-col gap-2 border border-blue-200/70 bg-white/80 p-4 text-xs uppercase tracking-wide text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
              <span className="font-semibold">Chunk size</span>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{chunkSize} words</p>
              <input
                type="range"
                min={60}
                max={160}
                step={10}
                value={chunkSize}
                onChange={(event) => setChunkSize(Number(event.target.value))}
                className="mt-2 w-full accent-blue-500"
              />
              <span className="text-[11px] normal-case tracking-normal text-blue-700/70 dark:text-blue-200/70">Smaller chunks sharpen relevance; larger ones cut prompts.</span>
            </div>

            <div className="flex flex-col gap-2 border border-blue-200/70 bg-white/80 p-4 text-xs uppercase tracking-wide text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
              <span className="font-semibold">Context window</span>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">Top {topK} chunks</p>
              <input
                type="range"
                min={2}
                max={5}
                step={1}
                value={topK}
                onChange={(event) => setTopK(Number(event.target.value))}
                className="mt-2 w-full accent-blue-500"
              />
              <span className="text-[11px] normal-case tracking-normal text-blue-700/70 dark:text-blue-200/70">Balance coverage with prompt size and latency.</span>
            </div>

            <div className="flex flex-col gap-3 border border-blue-200/70 bg-white/80 p-4 text-xs uppercase tracking-wide text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
              <span className="font-semibold">Retriever blend</span>
              <div className="flex flex-wrap gap-2 text-[11px] normal-case tracking-normal">
                {RETRIEVER_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.mode}
                    onClick={() => setRetrieverMode(option.mode)}
                    className={`rounded-full border px-3 py-1.5 font-semibold transition ${
                      retrieverMode === option.mode
                        ? 'border-blue-500 bg-blue-100 text-blue-700 dark:border-blue-300 dark:bg-blue-900/40 dark:text-blue-200'
                        : 'border-blue-200 bg-white text-blue-600/70 hover:border-blue-400 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-200/60'
                    }`}
                  >
                    {option.label}
                    <span className="ml-1 text-[10px] font-normal uppercase tracking-widest text-blue-500/80 dark:text-blue-300/70">
                      {option.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px]">
            <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full">
              <defs>
                <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {edges.map((edge) => {
                const source = mainNodes.find((node) => node.id === edge.source) || docNodes.find((doc) => doc.id === edge.source)
                const target = mainNodes.find((node) => node.id === edge.target) || docNodes.find((doc) => doc.id === edge.target)
                if (!source || !target) {
                  return null
                }

                const stepReached = flowIndex >= edge.stepIndex
                const isCurrent = flowIndex === edge.stepIndex
                const path = makeStraightPath(source, target)

                return (
                  <path
                    key={edge.id}
                    d={path}
                    className={`transition-all duration-500 ${
                      stepReached
                        ? 'stroke-[url(#pipeline-gradient)] opacity-100'
                        : 'stroke-blue-200 dark:stroke-blue-900/60 opacity-60'
                    } ${isCurrent ? 'stroke-[4]' : 'stroke-[2.2]'}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={stepReached ? (isCurrent ? '8 4' : '0') : '6 6'}
                  />
                )
              })}

            {[...mainNodes, ...docNodes].map((node) => {
              const isDoc = !('stepIndex' in node)
              const docNode = isDoc ? (node as DocNode) : null
              const stepIndex = isDoc ? 2 : (node as PipelineNode).stepIndex
              const visited = flowIndex >= stepIndex
              const active = flowIndex === stepIndex
              const isSelectedDoc = isDoc && docNode && activeDocIds.has(docNode.id)
              const radius = isDoc ? (hoveredDocId === node.id ? 32 : isSelectedDoc ? 26 : 20) : 34

              const circleClass = (() => {
                if (!isDoc) {
                  if (active) return 'fill-blue-600 stroke-blue-300'
                  if (visited) return 'fill-blue-100 stroke-blue-400 dark:fill-blue-900/60 dark:stroke-blue-300'
                  return 'fill-white stroke-blue-200 dark:fill-zinc-900 dark:stroke-blue-900/60'
                }
                if (hoveredDocId === node.id) return 'fill-blue-500 stroke-blue-200'
                if (isSelectedDoc) return 'fill-blue-100 stroke-blue-400 dark:fill-blue-900/60 dark:stroke-blue-300'
                return 'fill-white stroke-blue-200 dark:fill-zinc-900 dark:stroke-blue-900/60'
              })()

              const textClass = (() => {
                if (!isDoc) {
                  if (active) return 'fill-white'
                  if (visited) return 'fill-blue-700 dark:fill-blue-100'
                  return 'fill-blue-500/80 dark:fill-blue-200/70'
                }
                if (hoveredDocId === node.id) return 'fill-white'
                if (isSelectedDoc) return 'fill-blue-700 dark:fill-blue-100'
                return 'fill-blue-500/80 dark:fill-blue-200/70'
              })()

              const label = isDoc ? `#${(docNode?.rank ?? 0) + 1}` : (node as PipelineNode).emoji

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    if (isDoc) setHoveredDocId(node.id)
                  }}
                  onMouseLeave={() => {
                    if (isDoc) setHoveredDocId(null)
                  }}
                >
                  <circle
                    r={radius}
                    className={`transition-all duration-300 ${circleClass}`}
                    strokeWidth={isDoc ? 2 : 3}
                    filter={active ? 'url(#glow)' : undefined}
                  />
                  <text className={`pointer-events-none select-none text-center text-xs font-semibold ${textClass}`} dy={isDoc ? 4 : -2}>
                    {label}
                  </text>
                </g>
              )
            })}

            {mainNodes.map((node) => {
              const active = flowIndex === node.stepIndex
              const visited = flowIndex >= node.stepIndex

              return (
                <g key={`${node.id}-labels`} transform={`translate(${node.x}, ${node.y})`} className="pointer-events-none select-none">
                  <text
                    textAnchor="middle"
                    dy={52}
                    className={`text-sm font-semibold ${visited ? 'fill-blue-900 dark:fill-blue-100' : 'fill-blue-700/70 dark:fill-blue-200/70'}`}
                  >
                    {node.label}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={70}
                    className={`text-[11px] ${active ? 'fill-blue-700 dark:fill-blue-200' : 'fill-blue-600/60 dark:fill-blue-200/60'}`}
                  >
                    {node.sublabel}
                  </text>
                </g>
              )
            })}

            {docNodes.map((doc) => (
              <g key={`${doc.id}-label`} transform={`translate(${doc.x}, ${doc.y})`} className="pointer-events-none select-none">
                <text textAnchor="middle" dy={38} className="text-[11px] fill-blue-700/80 dark:fill-blue-200/70">
                  {doc.title.length > 30 ? `${doc.title.slice(0, 30)}...` : doc.title}
                </text>
              </g>
            ))}
          </svg>
        </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100/70 bg-white/70 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="font-semibold uppercase tracking-wide text-xs">Active corpus node</span>
          </div>
          {docInspector ? (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">{docInspector.title}</h3>
              <p className="text-xs leading-relaxed text-blue-800/80 dark:text-blue-100/70">
                {docInspector.snippet.length > 0 ? `${docInspector.snippet}...` : 'This chunk contributes relevant context to the answer.'}
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                <Search className="h-3.5 w-3.5" /> Semantic similarity score boosted for this chunk
              </div>
              <p className="text-[11px] text-blue-700/70 dark:text-blue-200/70">
                Hover over other documents in the graph to inspect their contents and contribution to the answer.
              </p>
            </div>
          ) : (
            <p className="text-xs text-blue-700/70 dark:text-blue-200/70">
              Play the pipeline to highlight retrieved documents and see how they ground the answer.
            </p>
          )}
          <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
            <LifeBuoy className="h-4 w-4" /> Move your cursor along the pipeline to freeze on any stage.
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[260px] space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-100">Retrieved context</h3>
          {results.length === 0 ? (
            <p className="text-sm text-blue-700/70 dark:text-blue-200/70">Run the pipeline to highlight which chunks the retriever trusts for this question.</p>
          ) : (
            results.map((result, index) => (
              <div
                key={result.chunk.id}
                className="rounded-xl border border-blue-100 bg-white/80 p-4 text-sm text-blue-900 transition hover:border-blue-300 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100"
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-blue-500/80 dark:text-blue-300/70">
                  <span>Source {index + 1}</span>
                  <span>{(result.hybridScore * 100).toFixed(0)}% match</span>
                </div>
                <p className="mt-2 font-semibold">{result.chunk.docTitle}</p>
                <p className="mt-1 text-sm text-blue-800/80 dark:text-blue-100/70 line-clamp-3">{result.chunk.text}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex-1 min-w-[260px] space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-100">Grounded answer snapshot</h3>
          {answer ? (
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-100">
              <p className="whitespace-pre-wrap leading-relaxed">{answer.answer}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-emerald-700/80 dark:text-emerald-200/70">
                <span>Prompt tokens: {answer.promptTokens}</span>
                <span>Response tokens: {answer.responseTokens}</span>
                <span>Latency ~ {Math.round(answer.estimatedLatencyMs)} ms</span>
                <span>Cost ~ ${answer.estimatedCostUsd.toFixed(4)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-blue-700/70 dark:text-blue-200/70">After you play the pipeline, you will see the grounded response, token usage, and estimated runtime cost here.</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 text-xs text-blue-700/70 dark:text-blue-200/70">
        <MousePointerClick className="h-3.5 w-3.5" />
        <span>Tip: rerun the animation after switching datasets or retriever settings to compare how the flow changes.</span>
      </div>
    </div>
  )
}
