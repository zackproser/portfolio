'use client'

import { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { track } from '@vercel/analytics'
import QuizMe from './QuizMe'
import GlossaryChat from './GlossaryChat'
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
  added?: string
}

interface Reading {
  title: string
  blurb: string
  href: string
  image: string
}

interface Section {
  id: string
  level: string
  name: string
  intro: string
  difficulty?: string
  terms: Term[]
  reading?: Reading
}

interface Support {
  from: string
  until: string
  headline: string
  body: string
}

interface Glossary {
  title: string
  subtitle: string
  event: string
  updated: string
  sections: Section[]
  support?: Support
}

// "new" badge for terms added in the last 21 days; SSR-safe (date check
// runs identically on server and client within the same day).
function isNew(added?: string) {
  if (!added) return false
  return Date.now() - new Date(added).getTime() < 21 * 86400 * 1000
}

function inWindow(s?: Support) {
  if (!s) return false
  const now = Date.now()
  // Parse ISO date strings as local midnight, not UTC
  const [fromY, fromM, fromD] = s.from.split('-').map(Number)
  const [untilY, untilM, untilD] = s.until.split('-').map(Number)
  const fromTime = new Date(fromY, fromM - 1, fromD).getTime()
  const untilTime = new Date(untilY, untilM - 1, untilD).getTime()
  // "through July 1" means through the end of July 1 local time
  return now >= fromTime && now < untilTime + 86400 * 1000
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

// Counts unique term entries that have scrolled into view — feeds the
// "n/47" chip in the jump bar and unlocks the finale at 100%.
const SEEN_KEY = 'ghx-glossary-seen'

function useSeenTerms(filterKey: string, validSlugs: Set<string>) {
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  // hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[]
      const valid = stored.filter((id) => validSlugs.has(id))
      if (valid.length) setSeen((prev) => new Set([...prev, ...valid]))
    } catch {}
  }, [validSlugs])
  useEffect(() => {
    if (seen.size) {
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]))
      } catch {}
    }
  }, [seen])
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.gg-entry[id]'))
    const obs = new IntersectionObserver(
      (entries) => {
        const hits = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).id)
        if (hits.length) {
          setSeen((prev) => {
            const next = new Set(prev)
            hits.forEach((h) => next.add(h))
            return next.size === prev.size ? prev : next
          })
        }
      },
      { threshold: 0.6 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [filterKey])
  return seen
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

  const allTerms = useMemo(
    () => glossary.sections.flatMap((s) => s.terms.map((t) => ({ term: t.term, definition: t.definition }))),
    [glossary.sections]
  )
  const total = glossary.sections.reduce((n, s) => n + s.terms.length, 0)
  const embedCount = glossary.sections.reduce(
    (n, s) => n + s.terms.filter((t) => t.embed).length,
    0,
  )
  const validSlugs = useMemo(
    () => new Set(glossary.sections.flatMap((s) => s.terms.map((t) => slugify(t.term)))),
    [glossary.sections],
  )
  const seen = useSeenTerms(q, validSlugs)
  const fluent = seen.size >= total

  // page is statically prerendered: evaluate the support window on the
  // client clock after mount so it appears on June 17 without a rebuild
  // (and without a hydration mismatch)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // ---- lightweight analytics (renewal-deck fuel) ----
  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get('src')
    track('ghx_visit', { src: src ?? 'direct' })
  }, [])
  useEffect(() => {
    if (q.length < 2) return
    const t = setTimeout(() => track('ghx_search', { query: q.slice(0, 60) }), 1200)
    return () => clearTimeout(t)
  }, [q])
  const fluentTracked = useRef(false)
  useEffect(() => {
    if (fluent && !fluentTracked.current) {
      fluentTracked.current = true
      track('ghx_fluent', { total })
    }
  }, [fluent, total])

  return (
    <MotionConfig reducedMotion="user">
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

          {/* the path: a staircase you can't miss — tap a step to jump */}
          <nav className="gg-steps" aria-label="Difficulty path">
            <p className="gg-steps-label">
              The path runs <span className="d-easy">easy</span> →{' '}
              <span className="d-advanced">advanced</span>. Start where you are — tap a step.
            </p>
            <div className="gg-steps-row">
              {glossary.sections.map((sec, i) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`gg-step d-${sec.difficulty ?? 'easy'} ${activeSection === sec.id ? 'here' : ''}`}
                >
                  <span className="gg-step-lvl">L{i}</span>
                  <span className="gg-step-name">{JUMP_LABELS[sec.id]}</span>
                  <span className="gg-step-diff">{sec.difficulty}</span>
                  <span className="gg-step-bar" style={{ height: `${8 + i * 7}px` }} />
                </a>
              ))}
            </div>
          </nav>

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
                {embedCount}<span className="unit">try them</span>
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
              <span className={`lvl d-${s.difficulty ?? 'easy'}`}>L{i}</span>{' '}
              {JUMP_LABELS[s.id] ?? s.name}
            </a>
          ))}
          <span className={`gg-seen ${fluent ? 'fluent' : ''}`} title="Terms you've scrolled past">
            {fluent ? 'fluent ✓' : `${seen.size}/${total}`}
          </span>
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
        {mounted && inWindow(glossary.support) && !q && (
          <aside className="gg-support">
            <p className="gg-support-head">{glossary.support!.headline}</p>
            <p className="gg-support-body">{glossary.support!.body}</p>
          </aside>
        )}
        {filtered.length === 0 && (
          <div className="gg-empty">
            <span className="big">Nothing matches “{query}”.</span>
            Try a shorter word — or just ask:
            <button
              type="button"
              className="gg-empty-ask"
              onClick={() =>
                window.dispatchEvent(new CustomEvent('ghx-ask', { detail: query.trim() }))
              }
            >
              ask the glossary: “{query}”
            </button>
          </div>
        )}

        {filtered.map((section) => {
          const realIndex = glossary.sections.findIndex(s => s.id === section.id)
          return (
          <section key={section.id} id={section.id} className="gg-level">
            <div className="gg-level-head">
              <span className="gg-level-num">{'0' + section.level.replace(/\D/g, '')}</span>
              <h2 className="gg-level-name">{section.name}</h2>
              <span className="gg-level-tag">
                <span className={`gg-diff d-${section.difficulty ?? 'easy'}`}>
                  <span className="ramp" aria-hidden="true">
                    {glossary.sections.map((x, xi) => (
                      <i key={x.id} className={xi <= realIndex ? 'on' : ''} />
                    ))}
                  </span>
                  {section.difficulty}
                </span>
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
                    {mounted && isNew(t.added) && <span className="gg-new">new</span>}
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

            {section.reading && !q && (
              <motion.a
                href={section.reading.href}
                className="gg-reading"
                onClick={() => track('ghx_reading_click', { href: section.reading!.href })}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={section.reading.image} alt="" loading="lazy" />
                <span className="gg-reading-body">
                  <span className="gg-reading-kicker">go deeper · from Zack&apos;s writing</span>
                  <strong>{section.reading.title}</strong>
                  <em>{section.reading.blurb}</em>
                  <span className="gg-reading-cta">Read it →</span>
                </span>
              </motion.a>
            )}
          </section>
        )})}

        {/* finale */}
        {!q && (
          <motion.section
            className="gg-finale"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="gg-kicker">
              <span className="ghx-mark">GHX</span> you made it
            </p>
            <h2>
              That&apos;s the whole vocabulary. <em>You speak AI now.</em>
            </h2>
            <div className="gg-finale-levels">
              {glossary.sections.map((s, i) => (
                <motion.span
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 * i }}
                >
                  ✓ L{i} {JUMP_LABELS[s.id]}
                </motion.span>
              ))}
            </div>
            <p className="gg-finale-sub">
              Keep this page — it stays live after the workshop. Next time someone says a word
              that isn&apos;t on it, that&apos;s a question worth asking out loud.
            </p>
            <QuizMe terms={allTerms} />
          </motion.section>
        )}

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
      <GlossaryChat />
    </div>
    </MotionConfig>
  )
}
