'use client'

import { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import InlineDemo from './InlineDemos'

// ────────────────────────────────────────────────────────────────────────
// GHX glossary (/ghx) — editorial layout in the site's parchment/serif
// design language (see src/styles/ghx-glossary.css), with:
//   - reading progress + level scroll-spy jump bar (granola-page pattern)
//   - auto cross-links: term names mentioned in other definitions become
//     dashed links that scroll + flash the target entry
//   - live embeds of the site's real interactive demos (tokenizer,
//     embeddings, RAG) and three self-running animated diagrams
//     (context window, agent loop, orchestrator) — see InlineDemos.tsx
// ────────────────────────────────────────────────────────────────────────

interface Demo {
  label: string
  href: string
}

interface Term {
  term: string
  definition: string
  hear?: string
  demo?: Demo
  embed?: string
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

// ---- helpers ---------------------------------------------------------------

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// "CLI (command-line interface)" → ["CLI", "command-line interface"]
function aliasesFor(name: string): string[] {
  const m = name.match(/^(.+?)\s*\((.+?)\)\s*$/)
  const out = m ? [m[1].trim(), m[2].trim()] : [name.trim()]
  // "Claude vs. Claude.ai vs. ..." style names don't cross-link well
  return out.filter((a) => a.length >= 3 && !a.includes(' vs'))
}

interface XrefIndex {
  regex: RegExp
  bySlugKey: Map<string, { slug: string; term: string }>
}

function buildXrefIndex(sections: Section[]): XrefIndex {
  const bySlugKey = new Map<string, { slug: string; term: string }>()
  const patterns: string[] = []
  for (const s of sections) {
    for (const t of s.terms) {
      const slug = slugify(t.term)
      for (const a of aliasesFor(t.term)) {
        bySlugKey.set(a.toLowerCase(), { slug, term: t.term })
        patterns.push(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      }
    }
  }
  patterns.sort((a, b) => b.length - a.length)
  return { regex: new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi'), bySlugKey }
}

function flashEntry(slug: string) {
  const el = document.getElementById(slug)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el.classList.remove('flash')
  // restart the animation on repeat clicks
  void el.offsetWidth
  el.classList.add('flash')
}

// Definition text with the first mention of up to 3 other terms cross-linked.
function CrossLinkedText({
  text,
  selfSlug,
  index,
}: {
  text: string
  selfSlug: string
  index: XrefIndex
}) {
  const nodes = useMemo(() => {
    const out: Array<string | { slug: string; text: string }> = []
    const seen = new Set<string>()
    let last = 0
    let links = 0
    index.regex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = index.regex.exec(text)) !== null && links < 3) {
      const hit = index.bySlugKey.get(m[1].toLowerCase())
      if (!hit || hit.slug === selfSlug || seen.has(hit.slug)) continue
      out.push(text.slice(last, m.index))
      out.push({ slug: hit.slug, text: m[1] })
      seen.add(hit.slug)
      last = m.index + m[1].length
      links++
    }
    out.push(text.slice(last))
    return out
  }, [text, selfSlug, index])

  return (
    <>
      {nodes.map((n, i) =>
        typeof n === 'string' ? (
          <Fragment key={i}>{n}</Fragment>
        ) : (
          <a
            key={i}
            className="xref"
            href={`#${n.slug}`}
            onClick={(e) => {
              e.preventDefault()
              history.replaceState(null, '', `#${n.slug}`)
              flashEntry(n.slug)
            }}
          >
            {n.text}
          </a>
        ),
      )}
    </>
  )
}

// ---- chrome ----------------------------------------------------------------

function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100
      if (fillRef.current) fillRef.current.style.width = `${Math.max(0, Math.min(100, pct))}%`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="gg-progress" aria-hidden="true">
      <div ref={fillRef} className="gg-progress-fill" />
    </div>
  )
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 160
      let cur: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])
  return active
}

// Short labels so all five levels + search fit the jump bar on one line.
const JUMP_LABELS: Record<string, string> = {
  'level-0': 'Computer',
  'level-1': 'The AI',
  'level-2': 'Claude',
  'level-3': 'Abilities',
  'level-4': 'Agents',
}

// ---- page ------------------------------------------------------------------

export default function GlossaryClient({ glossary }: { glossary: Glossary }) {
  const [query, setQuery] = useState('')
  const xref = useMemo(() => buildXrefIndex(glossary.sections), [glossary.sections])
  const sectionIds = useMemo(() => glossary.sections.map((s) => s.id), [glossary.sections])
  const activeSection = useScrollSpy(sectionIds)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return glossary.sections
    return glossary.sections
      .map((s) => ({
        ...s,
        terms: s.terms.filter(
          (t) =>
            t.term.toLowerCase().includes(q) ||
            t.definition.toLowerCase().includes(q) ||
            (t.hear ?? '').toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.terms.length > 0)
  }, [glossary.sections, q])

  const total = glossary.sections.reduce((n, s) => n + s.terms.length, 0)

  return (
    <div className="ghx-glossary">
      <ReadingProgress />

      {/* hero */}
      <header className="gg-hero">
        <div className="gg-measure">
          <p className="gg-kicker">
            <span className="ghx-mark">GHX</span> Collaboration Week · June 17, 2026 · Denver
          </p>
          <h1 className="gg-title">
            Speak <em>AI</em> like you&apos;ve been doing this for years.
          </h1>
          <p className="gg-dek">{glossary.subtitle}</p>
          <p className="gg-promise">
            No dumb questions. If you hear a word today that isn&apos;t on this page, ask — out
            loud, or by quietly pointing your phone at it.
          </p>
          <dl className="gg-stats">
            <div>
              <dt>Terms</dt>
              <dd>{total}</dd>
            </div>
            <div>
              <dt>Levels</dt>
              <dd>
                5<span className="unit">zero → hero</span>
              </dd>
            </div>
            <div>
              <dt>Live demos inside</dt>
              <dd>
                6<span className="unit">try them</span>
              </dd>
            </div>
            <div>
              <dt>Dumb questions</dt>
              <dd>
                0<span className="unit">they don&apos;t exist</span>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* jump bar */}
      <nav className="gg-jumpbar" aria-label="Glossary levels">
        <div className="gg-measure gg-jumpbar-inner">
          {glossary.sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className={activeSection === s.id ? 'active' : ''}>
              <span className="lvl">L{i}</span> {JUMP_LABELS[s.id] ?? s.name}
            </a>
          ))}
          <div className="gg-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${total} terms`}
              aria-label="Search glossary terms"
            />
          </div>
        </div>
      </nav>

      {/* body */}
      <main className="gg-measure">
        {filtered.length === 0 && (
          <div className="gg-empty">
            <span className="big">Nothing matches “{query}”.</span>
            Try a shorter word — or ask a facilitator. Really. That&apos;s the whole point of
            today.
          </div>
        )}

        {filtered.map((section, si) => (
          <section key={section.id} id={section.id} className="gg-level">
            <div className="gg-level-head">
              <span className="gg-level-num">{'0' + section.level.replace(/\D/g, '')}</span>
              <h2 className="gg-level-name">{section.name}</h2>
              <span className="gg-level-tag">
                {section.terms.length} term{section.terms.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="gg-level-intro">{section.intro}</p>

            {section.terms.map((t) => {
              const slug = slugify(t.term)
              return (
                <motion.article
                  key={t.term}
                  id={slug}
                  className="gg-entry"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <h3>
                    {t.term}
                    <a className="anchor" href={`#${slug}`} aria-label={`Link to ${t.term}`}>
                      #
                    </a>
                  </h3>
                  <p className="gg-def">
                    <CrossLinkedText text={t.definition} selfSlug={slug} index={xref} />
                  </p>
                  {t.hear && (
                    <p className="gg-hear">
                      <span className="tag">you&apos;ll hear</span>
                      <span>{t.hear}</span>
                    </p>
                  )}
                  {t.demo && (
                    <p className="gg-demo">
                      <span className="tag">try it live</span>
                      <a href={t.demo.href}>{t.demo.label}</a>
                    </p>
                  )}
                  {t.embed && <InlineDemo kind={t.embed} />}
                </motion.article>
              )
            })}
          </section>
        ))}

        {/* footer */}
        <footer className="gg-foot">
          <div className="cols">
            <div>
              <h5>Prepared for GHX</h5>
              <p>
                By Mind On Fire — Zack Proser, Nick Nisi, and Nick Cannariato. Last updated{' '}
                {glossary.updated}. Share the link inside GHX freely; it isn&apos;t indexed
                anywhere.
              </p>
            </div>
            <div>
              <h5>Keep going</h5>
              <p>
                Every demo embedded above lives on this site in full size — and the workshop repo
                you&apos;re taking home links back here. Point Claude at either one and ask it
                anything.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
