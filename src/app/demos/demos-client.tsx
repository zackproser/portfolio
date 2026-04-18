'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { Content } from '@/types'
import { EditorialCard } from '@/components/EditorialCard'

interface DemosClientProps {
  demos: Content[]
  featuredVoiceDemo?: Content
  verticalVoiceDemos?: Content[]
  otherDemos?: Content[]
}

function kindFor(demo: Content): 'Voice' | 'RAG' | 'Tool' {
  const slug = (demo.slug || '').toLowerCase()
  if (slug.includes('voice')) return 'Voice'
  if (slug.includes('rag') || slug.includes('firecrawl')) return 'RAG'
  if (slug.includes('chat')) return 'RAG'
  return 'Tool'
}

export default function DemosClient({ demos }: DemosClientProps) {
  const [typeFilter, setTypeFilter] = useState<'All' | 'Voice' | 'RAG' | 'Tool'>('All')
  const [query, setQuery] = useState('')

  const indexed = useMemo(() => (
    demos.map((d, i) => ({
      demo: d,
      kind: kindFor(d),
      num: String(i + 1).padStart(3, '0'),
    }))
  ), [demos])

  const counts = useMemo(() => {
    const c = { All: indexed.length, Voice: 0, RAG: 0, Tool: 0 }
    for (const x of indexed) c[x.kind] += 1
    return c
  }, [indexed])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return indexed.filter(({ demo, kind }) => {
      if (typeFilter !== 'All' && kind !== typeFilter) return false
      if (!q) return true
      const hay = `${demo.title || ''} ${demo.description || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [indexed, typeFilter, query])

  const totalLive = indexed.length
  const years = Math.max(1, new Date().getFullYear() - 2023)

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero ----- */}
        <section className="pt-14 pb-8 md:pt-20 md:pb-10">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
                § 00 · Playground · Est. MMXXIII
              </div>
              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
                Things I built to{' '}
                <em className="text-burnt-400 dark:text-amber-400 italic font-extrabold">think</em>
                {' '}with.
              </h1>
              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                Not demos. Not case studies. Working artifacts — small machines
                I built to answer a real question about retrieval, cognition,
                or how an engineer stays legible to themselves.{' '}
                {indexed.length} of them, indexed below.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#index"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
                >
                  Jump to the index →
                </a>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
                >
                  Read the essays
                </Link>
              </div>
              <div className="editorial-stats text-charcoal-50 dark:text-parchment-100 mt-10">
                <div className="editorial-stat">
                  <div className="editorial-stat-num">
                    {indexed.length}<span className="unit">objects</span>
                  </div>
                  <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                    In rotation
                  </div>
                </div>
                <div className="editorial-stat">
                  <div className="editorial-stat-num">
                    {totalLive}<span className="unit">live</span>
                  </div>
                  <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                    Pokable in-browser
                  </div>
                </div>
                <div className="editorial-stat">
                  <div className="editorial-stat-num">
                    {years}<span className="unit">yrs</span>
                  </div>
                  <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                    Continuous field notes
                  </div>
                </div>
                <div className="editorial-stat">
                  <div className="editorial-stat-num">
                    {counts.Voice + counts.RAG}<span className="unit">ship</span>
                  </div>
                  <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                    Voice &amp; retrieval shipped
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal index on the right */}
            <div className="rounded-md overflow-hidden border border-charcoal-100/30 dark:border-slate-700 bg-[#141428] text-sm font-mono shadow-lg">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <span className="ml-3 text-[11px] tracking-wider uppercase text-slate-400">
                  ~/playground — ls -lah
                </span>
              </div>
              <div className="p-4 text-[12px] leading-relaxed text-slate-200 whitespace-nowrap overflow-x-auto">
                {indexed.slice(0, 8).map(({ demo, kind, num }) => (
                  <div key={demo.slug}>
                    <span className="text-slate-500">#{num}</span>
                    {'  '}
                    <span className="text-amber-400">{demo.title}</span>
                    {'  '}
                    <span className="text-slate-500 uppercase">{kind}</span>
                  </div>
                ))}
                {indexed.length > 8 ? (
                  <div className="mt-2 text-slate-500">
                    — — — + {indexed.length - 8} more below — — —
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ----- Filter bar ----- */}
        <section className="py-6 border-y border-parchment-300 dark:border-slate-700">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-500 dark:text-slate-500 mr-2">
                Type
              </span>
              {(['All', 'Voice', 'RAG', 'Tool'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-sm border transition-colors ${
                    typeFilter === t
                      ? 'border-burnt-400 dark:border-amber-400 text-burnt-400 dark:text-amber-400'
                      : 'border-parchment-300 dark:border-slate-700 text-parchment-600 dark:text-slate-400 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400'
                  }`}
                >
                  {t} <span className="opacity-60 ml-1">{String(counts[t]).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 lg:max-w-sm">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, stack, blurbs…"
                className="w-full px-4 py-2 rounded-sm border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800/60 text-[14px] text-charcoal-50 dark:text-parchment-100 placeholder:text-parchment-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-burnt-400 dark:focus:border-amber-400"
              />
            </div>
          </div>
        </section>

        {/* ----- Index grid ----- */}
        <section id="index" className="py-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              Showing {filtered.length} of {indexed.length} objects
            </div>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-xl text-parchment-600 dark:text-slate-400">
                  Nothing matches {query ? `"${query}"` : 'that filter'} yet.
                </p>
                <button
                  onClick={() => { setTypeFilter('All'); setQuery('') }}
                  className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 hover:underline"
                >
                  Clear filters →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(({ demo, kind }, i) => (
                  <EditorialCard
                    key={demo.slug}
                    article={demo}
                    index={i + 1}
                    kind={kind}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ----- Footer tagline ----- */}
        <section className="py-10 border-t border-parchment-300 dark:border-slate-700">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>© MMXXVI · Zachary Proser · Playground</span>
            <span>{indexed.length} objects · Source Serif 4 / Inter / JetBrains Mono</span>
          </div>
        </section>
      </main>
    </div>
  )
}
