'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { track } from '@vercel/analytics'

export type ProjectCategory = 'Tutorial' | 'Open source' | 'Infra' | 'Demo' | 'Talk'

export type ProjectItem = {
  id: string
  name: string
  title: string
  description: string
  url: string
  blogLink?: string
  demoUrl?: string
  company?: string
  category: ProjectCategory
  kind: 'github' | 'premium' | 'infra' | 'talk'
  language: string
  topics: string[]
  stars?: number
  startedYear: number
  updatedAt: string
  pinned: boolean
  premium: boolean
  price?: number
  deprecated: boolean
  cover: 'grid' | 'dots' | 'rule' | 'diag' | 'wave'
  glyph: string
}

type Props = { projects: ProjectItem[] }

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  HCL: '#844FBA',
  Shell: '#89e051',
  Lua: '#000080',
  Keynote: '#e67e22',
  Workshop: '#b84a00',
}

const CAT_ORDER: (ProjectCategory | 'All')[] = ['All', 'Tutorial', 'Open source', 'Infra', 'Demo', 'Talk']

const pad2 = (n: number) => String(n).padStart(2, '0')

function relTime(iso: string, now: Date): string {
  const then = new Date(iso)
  if (isNaN(then.getTime())) return ''
  const diff = (now.getTime() - then.getTime()) / 86400000
  if (diff < 1) return 'today'
  if (diff < 2) return 'yesterday'
  if (diff < 14) return Math.round(diff) + 'd ago'
  if (diff < 60) return Math.round(diff / 7) + 'w ago'
  if (diff < 365) return Math.round(diff / 30) + 'mo ago'
  return Math.round(diff / 365) + 'y ago'
}

function fmtMonthDay(iso: string): { day: string; mon: string } | null {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  }
}

function kSuffix(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function Cover({ p }: { p: ProjectItem }) {
  return (
    <div className={`cover cover-${p.cover}`}>
      <span className="cap">
        {p.category.toUpperCase()} · {p.language}
      </span>
      <span className="glyph">{p.glyph}</span>
    </div>
  )
}

function Pills({ p }: { p: ProjectItem }) {
  return (
    <>
      {p.pinned && <span className="kind-pill pinned-pill">★ Pinned</span>}
      {p.premium && <span className="kind-pill premium-pill">◆ Premium{p.price ? ` · $${p.price}` : ''}</span>}
      {p.deprecated && <span className="kind-pill deprecated-pill">Deprecated</span>}
      <span className="kind-pill">{p.category}</span>
    </>
  )
}

function LangDot({ language }: { language: string }) {
  return <span className="dot" style={{ background: LANG_COLORS[language] || '#999' }} />
}

export default function ProjectsClient({ projects }: Props) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<(typeof CAT_ORDER)[number]>('All')
  const [lang, setLang] = useState<string>('All')
  const [tag, setTag] = useState<string>('All')
  const [sort, setSort] = useState<'updated' | 'stars' | 'oldest' | 'newest' | 'alpha'>('updated')
  const [variation, setVariation] = useState<'A' | 'B' | 'F'>('A')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const now = useRef(new Date()).current

  const { langCounts, tagCounts, catCounts } = useMemo(() => {
    const lc: Record<string, number> = {}
    const tc: Record<string, number> = {}
    const cc: Record<string, number> = {}
    projects.forEach((p) => {
      lc[p.language] = (lc[p.language] || 0) + 1
      cc[p.category] = (cc[p.category] || 0) + 1
      p.topics.forEach((t) => (tc[t] = (tc[t] || 0) + 1))
    })
    return { langCounts: lc, tagCounts: tc, catCounts: cc }
  }, [projects])

  const langOrder = useMemo(
    () => ['All', ...Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])],
    [langCounts],
  )
  const tagOrder = useMemo(
    () => ['All', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 14)],
    [tagCounts],
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return projects
      .filter((p) => {
        if (cat !== 'All' && p.category !== cat) return false
        if (lang !== 'All' && p.language !== lang) return false
        if (tag !== 'All' && !p.topics.includes(tag)) return false
        if (needle) {
          const hay = `${p.title} ${p.name} ${p.description} ${p.topics.join(' ')} ${p.category} ${p.language}`.toLowerCase()
          if (!hay.includes(needle)) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sort === 'updated') {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
          return a.updatedAt < b.updatedAt ? 1 : -1
        }
        if (sort === 'stars') return (b.stars || 0) - (a.stars || 0)
        if (sort === 'oldest') return a.startedYear - b.startedYear
        if (sort === 'newest') return b.startedYear - a.startedYear
        if (sort === 'alpha') return a.name.localeCompare(b.name)
        return 0
      })
  }, [projects, q, cat, lang, tag, sort])

  // Analytics
  useEffect(() => {
    const needle = q.trim()
    if (!needle) return
    const handle = setTimeout(() => {
      track('projects_search', { query: needle, result_count: filtered.length })
    }, 700)
    return () => clearTimeout(handle)
  }, [q, filtered.length])

  // ⌘K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const totalStars = useMemo(() => projects.reduce((s, p) => s + (p.stars || 0), 0), [projects])
  const ossCount = useMemo(() => projects.filter((p) => p.kind === 'github').length, [projects])
  const activeFilterCount =
    (cat !== 'All' ? 1 : 0) +
    (lang !== 'All' ? 1 : 0) +
    (tag !== 'All' ? 1 : 0) +
    (sort !== 'updated' ? 1 : 0)

  const resetFilters = () => {
    setCat('All')
    setLang('All')
    setTag('All')
    setSort('updated')
    setQ('')
  }

  const onVariation = (v: typeof variation) => {
    if (v === variation) return
    track('projects_view_change', { view: v })
    setVariation(v)
  }

  return (
    <div className="projects-page">
      <section className="proj-header">
        <div className="pb-container">
          <div className="proj-eyebrow">Builds · Open source · Workshops · Infra</div>
          <h1 className="proj-title">
            Things I&apos;ve <em>shipped</em>, written, or open-sourced.
          </h1>
          <p className="proj-dek">
            An index of my public work — tutorials, reference architectures, OSS repos, and the talks and workshops that
            went with them. Curated by hand for now; a pre-build GitHub sync is on the way.
          </p>
          <div className="proj-rule">
            <span>
              <b>{projects.length}</b> builds
            </span>
            <span>
              <b>{ossCount}</b> open&nbsp;source
            </span>
            {totalStars > 0 ? (
              <span>
                <b>{kSuffix(totalStars)}</b> ★&nbsp;on&nbsp;GitHub
              </span>
            ) : (
              <span />
            )}
            <span />
            <a
              className="kind-pill"
              href="https://github.com/zackproser"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              github.com/zackproser ↗
            </a>
          </div>
        </div>
      </section>

      <section className="filter-bar">
        <div className="pb-container">
          <div className="filter-row">
            <div className="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                placeholder="Search builds, repos, topics…"
                aria-label="Search projects"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <span className="kbd">⌘K</span>
            </div>
            <button
              type="button"
              className="filters-toggle"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Filter {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>
            <span className="results-count">
              <b>{filtered.length}</b> {filtered.length === 1 ? 'build' : 'builds'}
              {filtered.length !== projects.length ? ` of ${projects.length}` : ''}
            </span>
            <div className="view-toggle" role="tablist" aria-label="Layout">
              <button
                type="button"
                className={variation === 'A' ? 'active' : ''}
                onClick={() => onVariation('A')}
                title="Gallery"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Gallery
              </button>
              <button
                type="button"
                className={variation === 'B' ? 'active' : ''}
                onClick={() => onVariation('B')}
                title="List by year"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                List
              </button>
              <button
                type="button"
                className={variation === 'F' ? 'active' : ''}
                onClick={() => onVariation('F')}
                title="Field journal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Journal
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div className="filter-drawer">
              <div className="drawer-row">
                <span className="drawer-label">Category</span>
                <div className="chip-group">
                  {CAT_ORDER.map((c) => {
                    const n = c === 'All' ? projects.length : catCounts[c] || 0
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`chip ${cat === c ? 'active' : ''}`}
                        onClick={() => setCat(c)}
                      >
                        {c}
                        <span className="count">{n}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="drawer-row">
                <span className="drawer-label">Language</span>
                <div className="chip-group">
                  {langOrder.map((l) => {
                    const n = l === 'All' ? projects.length : langCounts[l]
                    return (
                      <button
                        key={l}
                        type="button"
                        className={`chip ${lang === l ? 'active' : ''}`}
                        onClick={() => setLang(l)}
                      >
                        {l !== 'All' && <LangDot language={l} />}
                        {l}
                        <span className="count">{n}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="drawer-row">
                <span className="drawer-label">Topic</span>
                <div className="chip-group">
                  {tagOrder.map((t) => {
                    const n = t === 'All' ? projects.length : tagCounts[t]
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`chip ${tag === t ? 'active' : ''}`}
                        onClick={() => setTag(t)}
                      >
                        {t === 'All' ? 'All topics' : `#${t}`}
                        <span className="count">{n}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="drawer-row">
                <span className="drawer-label">Sort</span>
                <select
                  className="sort-select"
                  aria-label="Sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                >
                  <option value="updated">Recently updated</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="alpha">A–Z</option>
                </select>
                <button type="button" className="clear-filters" onClick={resetFilters}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <main>
        <div className="pb-container">
          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>No builds match.</h3>
              <p>Try a different filter or clear the search.</p>
            </div>
          )}

          {variation === 'A' && filtered.length > 0 && (
            <GalleryView items={filtered} now={now} />
          )}
          {variation === 'B' && filtered.length > 0 && (
            <LedgerView items={filtered} sort={sort} />
          )}
          {variation === 'F' && filtered.length > 0 && (
            <JournalView items={filtered} now={now} />
          )}
        </div>
      </main>
    </div>
  )
}

/* ---------------- VIEW: GALLERY ---------------- */
function GalleryView({ items, now }: { items: ProjectItem[]; now: Date }) {
  return (
    <div className="gallery">
      {items.map((p, i) => {
        const isLead = i === 0 && p.pinned
        const classes = ['proj-card']
        if (isLead) classes.push('is-lead')
        if (p.premium) classes.push('is-premium')
        const href = p.blogLink || p.url
        const isExternal = href.startsWith('http')
        const rel = relTime(p.updatedAt, now)
        const arrowLabel = p.premium ? 'Buy →' : p.demoUrl ? 'Demo →' : p.blogLink ? 'Read →' : 'Repo →'
        return (
          <a
            key={p.id}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={classes.join(' ')}
          >
            <Cover p={p} />
            <div className="body">
              <div className="meta-row">
                <Pills p={p} />
                {p.premium && p.price ? (
                  <>
                    <span style={{ flex: 1 }} />
                    <span className="price">${p.price}</span>
                  </>
                ) : null}
              </div>
              <h3 className={isLead || p.premium ? 'serif' : ''}>{p.title}</h3>
              <p className="dek">{p.description}</p>
              {p.topics.length > 0 && (
                <div className="topics">
                  {p.topics.slice(0, 4).map((t) => (
                    <span key={t} className="topic">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <div className="foot">
                <span className="lang-pill">
                  <LangDot language={p.language} />
                  {p.language}
                </span>
                {typeof p.stars === 'number' && p.stars > 0 && (
                  <span className="stat-dot" title="GitHub stars">
                    ★ {kSuffix(p.stars)}
                  </span>
                )}
                {rel && (
                  <span className="stat-dot" title="Last update">
                    ↻ {rel}
                  </span>
                )}
                <span className="spacer" />
                <span className="arrow">{arrowLabel}</span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}

/* ---------------- VIEW: LEDGER ---------------- */
function LedgerView({ items, sort }: { items: ProjectItem[]; sort: string }) {
  const byYear: Record<string, ProjectItem[]> = {}
  items.forEach((p) => {
    const y = String(p.startedYear)
    ;(byYear[y] = byYear[y] || []).push(p)
  })
  const years = Object.keys(byYear).sort((a, b) => (sort === 'oldest' ? Number(a) - Number(b) : Number(b) - Number(a)))
  let n = 0
  return (
    <div className="ledger">
      {years.map((y) => {
        const group = byYear[y]
        const starSum = group.reduce((s, p) => s + (p.stars || 0), 0)
        const topicCount = new Set(group.flatMap((p) => p.topics)).size
        return (
          <div key={y}>
            <header className="ledger-year">
              <div className="y-num">{y}</div>
              <div className="y-meta">
                <b>{group.length}</b> builds{starSum > 0 ? ` · ★ ${kSuffix(starSum)}` : ''} · {topicCount} topics
              </div>
            </header>
            {group.map((p) => {
              n++
              const href = p.blogLink || p.url
              const isExternal = href.startsWith('http')
              return (
                <a
                  key={p.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="ledger-row"
                >
                  <div className="num">№ {pad2(n)}</div>
                  <div className="title-col">
                    <h3 className={p.premium || p.pinned ? 'serif' : ''}>
                      {p.title}
                      {p.pinned && ' ★'}
                    </h3>
                    <p className="dek">{p.description}</p>
                  </div>
                  <div className="cat">
                    {p.category}
                    {p.premium && ' · Premium'}
                    {p.deprecated && ' · Archived'}
                  </div>
                  <div className="lang">
                    <LangDot language={p.language} />
                    {p.language}
                  </div>
                  <div className="arr">→</div>
                </a>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- VIEW: JOURNAL ---------------- */
function JournalView({ items, now }: { items: ProjectItem[]; now: Date }) {
  const featured = items.find((p) => p.pinned) || items[0]
  const rest = items.filter((p) => p !== featured)
  const issueYear = String(now.getFullYear())

  return (
    <div className="journal">
      <header className="jrn-masthead">
        <div className="left">Issue · {issueYear}</div>
        <div className="title-lg">
          The <em>Builds</em> Journal
        </div>
        <div className="right">A catalogue of public work</div>
      </header>
      <div className="jrn-sub-rule">
        <span>An editorial index of zackproser/*</span>
        <span>Curated by hand · github sync soon</span>
        <span>{items.length} entries</span>
      </div>

      {featured && (
        <section className="jrn-hero">
          <div className="pane">
            <Cover p={featured} />
          </div>
          <div className="feat">
            <div className="eyebrow">
              Featured · {featured.category}
              {featured.premium ? ' · Premium' : ''}
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="meta">
              <span>{featured.language}</span>
              {typeof featured.stars === 'number' && featured.stars > 0 && <span>★ {kSuffix(featured.stars)}</span>}
              <span>↻ {relTime(featured.updatedAt, now)}</span>
              <span>started {featured.startedYear}</span>
              {featured.premium && featured.price ? <span style={{ color: 'var(--pb-accent)' }}>${featured.price}</span> : null}
            </div>
            <a
              className="cta"
              href={featured.blogLink || featured.url}
              target={(featured.blogLink || featured.url).startsWith('http') ? '_blank' : undefined}
              rel={(featured.blogLink || featured.url).startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {featured.premium ? 'Buy the tutorial' : featured.demoUrl ? 'Try the demo' : featured.blogLink ? 'Read the write-up' : 'View on GitHub'} →
            </a>
          </div>
        </section>
      )}

      <div className="jrn-cards">
        {rest.map((p, i) => {
          const href = p.blogLink || p.url
          const isExternal = href.startsWith('http')
          const md = fmtMonthDay(p.updatedAt)
          return (
            <a
              key={p.id}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="jrn-card"
            >
              <div className="no">
                № {pad2(i + 2)} · {p.category}
              </div>
              <h3>{p.title}</h3>
              <p className="dek">{p.description}</p>
              <div className="meta">
                <span>{p.language}</span>
                {typeof p.stars === 'number' && p.stars > 0 && <span>★ {kSuffix(p.stars)}</span>}
                {md && (
                  <span>
                    {md.day} {md.mon} {p.updatedAt.slice(0, 4)}
                  </span>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
