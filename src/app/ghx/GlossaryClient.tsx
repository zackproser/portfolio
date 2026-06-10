'use client'

import { useMemo, useState } from 'react'

interface Demo {
  label: string
  href: string
}

interface Term {
  term: string
  definition: string
  hear?: string
  demo?: Demo
}

interface Section {
  id: string
  level: string
  name: string
  intro: string
  terms: Term[]
}

interface Glossary {
  title: string
  subtitle: string
  event: string
  updated: string
  sections: Section[]
}

function matches(t: Term, q: string) {
  const needle = q.toLowerCase()
  return (
    t.term.toLowerCase().includes(needle) ||
    t.definition.toLowerCase().includes(needle) ||
    (t.hear ?? '').toLowerCase().includes(needle)
  )
}

export default function GlossaryClient({ glossary }: { glossary: Glossary }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return glossary.sections
    return glossary.sections
      .map((s) => ({ ...s, terms: s.terms.filter((t) => matches(t, trimmed)) }))
      .filter((s) => s.terms.length > 0)
  }, [glossary.sections, query])

  const totalShown = filtered.reduce((n, s) => n + s.terms.length, 0)
  const total = glossary.sections.reduce((n, s) => n + s.terms.length, 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#262B6B] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-14 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F89B6C]">
            {glossary.event}
          </p>
          {/* explicit text-white: global.css h1 rule would otherwise win */}
          <h1 className="mt-3 text-4xl font-bold tracking-tight !text-white sm:text-5xl">
            {glossary.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-indigo-100">
            {glossary.subtitle}
          </p>
          <p className="mt-4 text-sm text-indigo-200">
            No dumb questions. If you hear a word today that isn&apos;t on this
            page, ask — out loud or by pointing at your phone.
          </p>
        </div>
      </header>

      {/* Search + section nav */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
        <div className="mx-auto max-w-3xl px-5 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${total} terms… (try “token” or “agent”)`}
            aria-label="Search glossary terms"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-[#F16025] focus:outline-none focus:ring-2 focus:ring-[#F16025]/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <nav className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm" aria-label="Glossary levels">
            {filtered.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-zinc-600 hover:border-[#262B6B] hover:text-[#262B6B] dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
              >
                {s.level}: {s.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto max-w-3xl px-5 pb-24">
        {query.trim() && (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            {totalShown === 0
              ? 'No matches — try a shorter word, or ask a facilitator (really).'
              : `${totalShown} match${totalShown === 1 ? '' : 'es'}`}
          </p>
        )}

        {filtered.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32 pt-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F16025]">
              {section.level}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              {section.name}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {section.intro}
            </p>

            <dl className="mt-6 space-y-5">
              {section.terms.map((t) => (
                <div
                  key={t.term}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60"
                >
                  <dt className="text-lg font-semibold text-[#262B6B] dark:text-indigo-300">
                    {t.term}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {t.definition}
                    {t.hear && (
                      <span className="mt-2 block text-sm italic text-zinc-500 dark:text-zinc-400">
                        You&apos;ll hear: {t.hear}
                      </span>
                    )}
                    {t.demo && (
                      <a
                        href={t.demo.href}
                        className="mt-2 inline-block text-sm font-medium text-[#F16025] underline decoration-[#F16025]/40 underline-offset-4 hover:decoration-[#F16025]"
                      >
                        {t.demo.label} →
                      </a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <footer className="mt-16 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          <p>
            Prepared for GHX by Mind On Fire — Zack Proser, Nick Nisi, and Nick
            Cannariato. Last updated {glossary.updated}. This page is private to
            the workshop: share the link inside GHX freely.
          </p>
        </footer>
      </main>
    </div>
  )
}
