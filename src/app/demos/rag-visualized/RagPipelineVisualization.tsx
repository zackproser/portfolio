'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Database,
  LifeBuoy,
  MousePointerClick,
  Network,
  Search,
  Sparkles
} from 'lucide-react'

import type { RagDataset } from './data'

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
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null)
  const [flowIndex, setFlowIndex] = useState<number>(-1)
  const [isPlaying, setIsPlaying] = useState(false)

  const vectorNode = mainNodes.find((node) => node.id === 'vector-store')!

  const docNodes = useMemo(() => {
    const docs = dataset.documents.slice(0, 4)
    const count = docs.length
    const radius = 100

    return docs.map((doc, index) => {
      const normalizedIndex = count > 1 ? index / (count - 1) : 0.5
      const angle = (normalizedIndex - 0.5) * Math.PI * 0.9
      const x = vectorNode.x + radius * Math.cos(angle)
      const y = vectorNode.y + radius * Math.sin(angle)

      return {
        id: doc.id,
        title: doc.title,
        snippet: doc.content.slice(0, 220).trim(),
        x,
        y
      }
    })
  }, [dataset, vectorNode.x, vectorNode.y])

  const edges: PipelineEdge[] = useMemo(() => {
    const baseEdges: PipelineEdge[] = [
      {
        id: 'edge-question-embedding',
        source: 'question',
        target: 'embedding',
        stepIndex: 1,
        curved: true
      },
      {
        id: 'edge-embedding-vector',
        source: 'embedding',
        target: 'vector-store',
        stepIndex: 2,
        curved: true
      },
      {
        id: 'edge-vector-reranker',
        source: 'vector-store',
        target: 'reranker',
        stepIndex: 3,
        curved: true
      },
      {
        id: 'edge-reranker-answer',
        source: 'reranker',
        target: 'answer',
        stepIndex: 4,
        curved: true
      }
    ]

    const docEdges: PipelineEdge[] = docNodes.map((doc, index) => ({
      id: `edge-vector-doc-${index}`,
      source: 'vector-store',
      target: doc.id,
      stepIndex: 2
    }))

    return [...baseEdges, ...docEdges]
  }, [docNodes])

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
        }, index * 650)
      )
    })

    timers.push(
      window.setTimeout(() => {
        setIsPlaying(false)
      }, flowSequence.length * 650 + 200)
    )

    return () => {
      timers.forEach((id) => clearTimeout(id))
    }
  }, [isPlaying])

  const handleRunPipeline = () => {
    if (isPlaying) return
    setFlowIndex(-1)
    setIsPlaying(true)
  }

  const docInspector = pinnedDoc ?? (docNodes.length ? docNodes[0] : null)

  return (
    <section className="rounded-3xl border border-blue-200 bg-white/90 p-8 shadow-sm dark:border-blue-900/40 dark:bg-zinc-900/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            Interactive pipeline explorer
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Follow a question as it becomes a grounded answer
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-blue-800/80 dark:text-blue-100/70">
            Play the flow to light up each stage, hover any document to enlarge it, and see exactly what context the model pulls into your final answer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunPipeline}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isPlaying}
          >
            <Sparkles className="h-4 w-4" />
            {isPlaying ? 'Running...' : 'Animate pipeline'}
          </button>
          <div className="hidden text-xs text-blue-700/80 dark:text-blue-200/80 sm:flex sm:flex-col">
            <span className="font-semibold uppercase tracking-wide">Quick legend</span>
            <span>? Bold nodes = active stage</span>
            <span>? Glowing edges = data in motion</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr),280px]">
        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            className="h-full w-full"
          >
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
              const path = edge.curved ? makeCurvedPath(source, target) : makeStraightPath(source, target)

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
              const stepIndex = 'stepIndex' in node ? node.stepIndex : 2
              const visited = flowIndex >= stepIndex
              const active = flowIndex === stepIndex
              const isDoc = !('stepIndex' in node)
              const radius = isDoc ? (hoveredDocId === node.id ? 24 : 18) : 32

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
                    className={`transition-all duration-300 ${
                      active
                        ? 'fill-blue-600 stroke-blue-300'
                        : visited
                            ? 'fill-blue-100 stroke-blue-400 dark:fill-blue-900/60 dark:stroke-blue-300'
                            : 'fill-white stroke-blue-200 dark:fill-zinc-900 dark:stroke-blue-900/60'
                    }`}
                    strokeWidth={isDoc ? 2 : 3}
                    filter={active ? 'url(#glow)' : undefined}
                  />
                  <text
                    className={`pointer-events-none select-none text-center text-xs font-semibold ${
                      active ? 'fill-white' : visited ? 'fill-blue-700 dark:fill-blue-100' : 'fill-blue-500/80 dark:fill-blue-200/70'
                    }`}
                    dy={isDoc ? 4 : -2}
                  >
                    {'emoji' in node ? node.emoji : '??'}
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
                <text textAnchor="middle" dy={36} className="text-[11px] fill-blue-700/80 dark:fill-blue-200/70">
                  {doc.title.length > 22 ? `${doc.title.slice(0, 22)}?` : doc.title}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-5 text-sm text-blue-900 shadow-inner dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="font-semibold uppercase tracking-wide text-xs">Active corpus node</span>
          </div>
          {docInspector ? (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">{docInspector.title}</h3>
              <p className="text-xs leading-relaxed text-blue-800/80 dark:text-blue-100/70">
                {docInspector.snippet.length > 0 ? `${docInspector.snippet}?` : 'This chunk contributes relevant context to the answer.'}
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

      <div className="mt-4 flex items-center gap-3 text-xs text-blue-700/70 dark:text-blue-200/70">
        <MousePointerClick className="h-3.5 w-3.5" />
        <span>Tip: rerun the animation after switching datasets or retriever settings below to compare how the flow changes.</span>
      </div>
    </section>
  )
}
