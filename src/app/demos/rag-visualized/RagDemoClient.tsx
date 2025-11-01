'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Clock,
  Compass,
  Gauge,
  Layers,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  NotebookPen,
  LayoutDashboard,
  LifeBuoy,
  ArrowRight
} from 'lucide-react'

import { SAMPLE_DATASETS, type RagDataset } from './data'
import {
  buildChunkIndex,
  generateGroundedAnswer,
  simulateRetrieval,
  type RetrieverMode,
  type RagRetrievalResult
} from './utils'
import RagPipelineSandbox from './RagPipelineSandbox'
import RagPipelineVisualization from './RagPipelineVisualization'

const modeLabels: Record<RetrieverMode, { title: string; subtitle: string }> = {
  semantic: {
    title: 'Semantic',
    subtitle: 'Embeddings only'
  },
  keyword: {
    title: 'Keyword',
    subtitle: 'Filtering & BM25 vibes'
  },
  hybrid: {
    title: 'Hybrid',
    subtitle: 'Best of both worlds'
  }
}

const modeIcons: Record<RetrieverMode, JSX.Element> = {
  semantic: <Sparkles className="h-4 w-4" />,
  keyword: <Layers className="h-4 w-4" />,
  hybrid: <Radar className="h-4 w-4" />
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return value.toString()
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100
}

const heroHighlights = [
  {
    title: 'Stay factual',
    description: 'Verified retrieval keeps responses tethered to audited sources.',
    icon: ShieldCheck
  },
  {
    title: 'Control cost',
    description: 'Semantic search over your corpus is leaner than repeated fine-tuning cycles.',
    icon: Gauge
  },
  {
    title: 'Ship fast',
    description: 'Engineers can assemble a RAG stack in weeks using existing models and tooling.',
    icon: Workflow
  }
] as const

function highlightChunk(text: string, query: string) {
  const tokens = new Set(
    query
      .toLowerCase()
      .match(/[a-z0-9]{4,}/g)
  )

  if (!tokens || tokens.size === 0) {
    return text
  }

  return text.split(/(\s+)/).map((segment, index) => {
    const cleaned = segment.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (tokens.has(cleaned)) {
      return (
        <mark key={`${segment}-${index}`} className="rounded-sm bg-amber-200 px-1 py-0.5 text-zinc-800">
          {segment}
        </mark>
      )
    }
    return <span key={`${segment}-${index}`}>{segment}</span>
  })
}

function DatasetSummary({ dataset }: { dataset: RagDataset }) {
  const stats = useMemo(() => {
    const wordCount = dataset.documents.reduce((total, doc) => {
      return total + doc.content.split(/\s+/).filter(Boolean).length
    }, 0)

    const tags = dataset.documents.flatMap((doc) => doc.tags)
    const tagCounts = tags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})

    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)

    return {
      wordCount,
      documentCount: dataset.documents.length,
      popularTags
    }
  }, [dataset])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Layers className="h-4 w-4" />
          <span className="font-medium">Documents</span>
        </div>
        <p className="mt-2 text-2xl font-semibold text-blue-800 dark:text-blue-200">
          {stats.documentCount}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-300/80">Unique sources ready for retrieval</p>
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-800 dark:bg-emerald-900/20">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Gauge className="h-4 w-4" />
          <span className="font-medium">Word count</span>
        </div>
        <p className="mt-2 text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          {formatNumber(stats.wordCount)}
        </p>
        <p className="text-xs text-emerald-600 dark:text-emerald-300/80">Fuel for rich semantic context</p>
      </div>
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm dark:border-purple-800 dark:bg-purple-900/20">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Top tags</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {stats.popularTags.map(([tag, count]) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-purple-700 dark:bg-purple-800/60 dark:text-purple-200"
            >
              #{tag}
              <span className="text-[10px] text-purple-500 dark:text-purple-300/80">{count}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-purple-600 dark:text-purple-300/80">Instant filters for governance</p>
      </div>
    </div>
  )
}

function RetrievalResultCard({
  result,
  query,
  index,
  mode
}: {
  result: RagRetrievalResult
  query: string
  index: number
  mode: RetrieverMode
}) {
  const scoreLabel = mode === 'keyword' ? 'Keyword' : mode === 'semantic' ? 'Semantic' : 'Hybrid'
  const scoreValue = mode === 'keyword' ? result.keywordScore : mode === 'semantic' ? result.semanticScore : result.hybridScore

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {index + 1}
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{result.chunk.docTitle}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Updated {result.chunk.lastUpdated}</p>
          </div>
        </div>
        <div className="rounded-md bg-zinc-100 px-3 py-1 text-right text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {scoreLabel} score: {roundToTwo(scoreValue)}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {highlightChunk(result.chunk.text, query)}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <ShieldCheck className="h-3 w-3" /> {result.chunk.tags.join(', ')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <Clock className="h-3 w-3" /> ~{result.chunk.wordCount} words
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <Gauge className="h-3 w-3" /> {result.estimatedTokens} tokens
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {result.reasons.map((reason) => (
          <span
            key={reason}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
          >
            <Compass className="h-3 w-3" /> {reason}
          </span>
        ))}
      </div>
    </div>
  )
}

function PromptViewer({
  prompt,
  answer,
  metadata
}: {
  prompt: string
  answer: string
  metadata: {
    promptTokens: number
    responseTokens: number
    estimatedLatencyMs: number
    estimatedCostUsd: number
    citations: { label: string; title: string; snippet: string }[]
  }
}) {
  const totalTokens = metadata.promptTokens + metadata.responseTokens

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-900 p-5 font-mono text-xs text-zinc-200 shadow-inner dark:border-zinc-700">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Grounded prompt</span>
          <span>{metadata.promptTokens} tokens</span>
        </div>
        <pre className="max-h-[340px] overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed">
          {prompt}
        </pre>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/30">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span>Model answer draft</span>
            <span>{metadata.responseTokens} tokens</span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
            {answer}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              <Gauge className="h-3 w-3" /> Total tokens: {totalTokens}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Clock className="h-3 w-3" /> ~{Math.round(metadata.estimatedLatencyMs)}ms latency
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
              <Sparkles className="h-3 w-3" /> ${metadata.estimatedCostUsd.toFixed(4)}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Citations</p>
            <div className="space-y-2">
              {metadata.citations.map((citation) => (
                <div
                  key={citation.label}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300"
                >
                  <p className="font-semibold text-zinc-700 dark:text-zinc-200">
                    {citation.label}: {citation.title}
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {citation.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RagDemoClient() {
  const [datasetId, setDatasetId] = useState<string>(SAMPLE_DATASETS[0].id)
  const [query, setQuery] = useState<string>(SAMPLE_DATASETS[0].sampleQueries[0])
  const [chunkSize, setChunkSize] = useState<number>(90)
  const [retrieverMode, setRetrieverMode] = useState<RetrieverMode>('hybrid')
  const [topK, setTopK] = useState<number>(3)

  const dataset = useMemo(() => SAMPLE_DATASETS.find((item) => item.id === datasetId) ?? SAMPLE_DATASETS[0], [datasetId])

  useEffect(() => {
    setQuery(dataset.sampleQueries[0])
  }, [dataset])

  const chunkIndex = useMemo(() => buildChunkIndex(dataset, chunkSize), [dataset, chunkSize])

  const retrievalResults = useMemo(() => {
    if (!query.trim()) {
      return [] as RagRetrievalResult[]
    }

    return simulateRetrieval({
      query,
      chunks: chunkIndex,
      topK,
      mode: retrieverMode
    })
  }, [query, chunkIndex, topK, retrieverMode])

  const groundedAnswer = useMemo(() => {
    if (retrievalResults.length === 0) {
      return null
    }

    return generateGroundedAnswer({
      query,
      selectedChunks: retrievalResults,
      dataset
    })
  }, [retrievalResults, dataset, query])

  return (
    <div className="space-y-16">
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-8 shadow-sm dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              Why RAG matters right now
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              See a grounded RAG stack click into place
            </h1>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
              🧭 Keep answers tied to vetted knowledge. 💸 Control spend without spinning up bespoke fine-tuning cycles. 🚀 Ship a trustworthy copilot with the engineering muscle you already have.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroHighlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-xl border border-blue-200 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/60 dark:bg-zinc-900/70"
              >
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                <h3 className="mt-3 text-base font-semibold text-blue-900 dark:text-blue-100">{title}</h3>
                <p className="mt-2 text-sm text-blue-800/80 dark:text-blue-100/70">{description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Crafted by Zachary Proser, senior AI/ML infrastructure engineer and Developer Experience Engineer at WorkOS. Looking for hands-on help?{' '}
            <Link href="/services" className="text-blue-600 underline decoration-blue-400 decoration-dotted underline-offset-4 dark:text-blue-300">
              Explore services
            </Link>
            .
          </p>
        </div>
      </section>

      <RagPipelineVisualization dataset={dataset} />

      <RagPipelineSandbox dataset={dataset} chunks={chunkIndex} />

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Dataset workbench</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Choose the corpus that powers the sandbox above, inspect its docs, and experiment with how chunking depth and metadata shape downstream retrieval.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <AlertTriangle className="h-4 w-4" /> No uploads in this demo; sample corpora only.
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SAMPLE_DATASETS.map((item) => (
            <button
              key={item.id}
              onClick={() => setDatasetId(item.id)}
              className={`flex h-full flex-col gap-3 rounded-xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 ${
                datasetId === item.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-zinc-200 bg-white/80 hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Corpus</p>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
              <div className="mt-auto flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {item.sampleQueries.map((sample) => (
                  <span key={sample} className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{sample}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <DatasetSummary dataset={dataset} />

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/70">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3">Last updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {dataset.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{doc.title}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">{doc.tags.join(', ')}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">{doc.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Retrieval microscope</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Tune chunk size, context window, and retriever blend to see how the scoring math shuffles. Each card explains why a chunk survived the filters.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Radar className="h-4 w-4" />
            <span>Scores simulate cosine similarity and BM25-style overlap</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
            <label className="flex flex-col gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Question to answer
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-300 bg-white/90 p-3 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Ask something your runbooks can actually answer?"
              />
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {dataset.sampleQueries.map((sample) => (
                <button
                  key={sample}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  onClick={() => setQuery(sample)}
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Chunk size</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{chunkSize} words</p>
                <input
                  type="range"
                  min={60}
                  max={160}
                  step={10}
                  value={chunkSize}
                  onChange={(event) => setChunkSize(Number(event.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Tight chunks improve precision; larger ones reduce LLM calls.</p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Context window</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Top {topK} chunks</p>
                <input
                  type="range"
                  min={2}
                  max={5}
                  step={1}
                  value={topK}
                  onChange={(event) => setTopK(Number(event.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Balance coverage with prompt size.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(modeLabels) as RetrieverMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRetrieverMode(mode)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    retrieverMode === mode
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  {modeIcons[mode]} {modeLabels[mode].title}
                  <span className="hidden text-[10px] font-normal text-zinc-400 md:inline">{modeLabels[mode].subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {retrievalResults.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
                <Radar className="mb-3 h-8 w-8" />
                Start with a question to see the retrieval pipeline light up.
              </div>
            ) : (
              retrievalResults.map((result, index) => (
                <RetrievalResultCard
                  key={result.chunk.id}
                  result={result}
                  query={query}
                  index={index}
                  mode={retrieverMode}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-emerald-200/60 bg-white/95 p-8 shadow-sm dark:border-emerald-900/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Answer formation theater</h2>
            <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80">See the exact prompt the model receives, the grounded draft it returns, and the token/latency footprint you should expect in production.</p>
          </div>
          <Sparkles className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />
        </div>

        {groundedAnswer ? (
          <PromptViewer
            prompt={groundedAnswer.prompt}
            answer={groundedAnswer.answer}
            metadata={{
              promptTokens: groundedAnswer.promptTokens,
              responseTokens: groundedAnswer.responseTokens,
              estimatedLatencyMs: groundedAnswer.estimatedLatencyMs,
              estimatedCostUsd: groundedAnswer.estimatedCostUsd,
              citations: groundedAnswer.citations
            }}
          />
        ) : (
          <div className="rounded-xl border border-emerald-200 border-dashed bg-emerald-50/40 p-8 text-center text-sm text-emerald-700/80 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200/80">
            Feed the microscope with a question to generate a grounded answer draft.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-8 shadow-lg dark:border-amber-400/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Premium RAG pipeline course
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Build the production pipeline this demo is inspired by
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/90">
              Follow the exact system I refined while leading RAG architecture at Pinecone. The premium tutorial includes the notebook that preprocesses your data, the Next.js app that ships to Vercel, and direct email support when you hit edge cases.
            </p>
            <div className="grid gap-3 text-sm text-white/90 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <NotebookPen className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>Step-by-step Jupyter notebook for chunking, embeddings, and Pinecone indexing.</span>
              </div>
              <div className="flex items-start gap-2">
                <LayoutDashboard className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>Production-ready Next.js + Vercel AI SDK interface with streaming, citations, and guardrails.</span>
              </div>
              <div className="flex items-start gap-2">
                <LifeBuoy className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>Direct email support from me while you adapt the pipeline to your stack.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/90">
            <Link
              href="/checkout?product=rag-pipeline-tutorial&type=blog"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-semibold text-amber-600 shadow-lg transition hover:bg-white/90"
            >
              Get the $149 tutorial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/products/rag-pipeline-tutorial"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              Preview the curriculum
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Production rollout checklist</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Keep crews aligned as you graduate this prototype into a live copilot.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Operational guardrails</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>- Monitor embedding drift and retrain on fresh docs quarterly.</li>
              <li>- Gate answers above a risk score threshold for human review.</li>
              <li>- Log every prompt/context pair for auditing and evals.</li>
            </ul>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Team enablement</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>- Ship a self-serve evaluation dashboard for product owners.</li>
              <li>- Document how to add new data sources and run regression tests.</li>
              <li>- Pair this UI with simple KPI alerts (latency, cost, accuracy).</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-8 text-white shadow-sm dark:border-blue-400/50">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Need this shipped for your org?</h2>
          <p className="text-base text-blue-50/90">
            I help teams stand up resilient RAG platforms - from data plumbing to developer experience - so they can deliver grounded copilots without burning headcount on custom model training.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 font-semibold text-blue-700 shadow-sm transition hover:bg-white"
            >
              Book a working session
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/50 px-4 py-2 text-blue-50">
              <ShieldCheck className="h-4 w-4" /> Senior AI/ML infrastructure & DX at WorkOS
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
