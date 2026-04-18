'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { NewsletterSignupInline } from '@/components/NewsletterSignupInline'

export type TheaterVideo = {
  slug: string
  title: string
  description: string
  date: string
  durSec: number
  views: number
  kind: string
  tags: string[]
  series: string | null
  seriesPart: number | null
  glyph: string
  ytId: string | null
  image: string | null
  thumbStyle: 't-warm' | 't-cool' | 't-plate' | 't-mono'
}

type Props = { videos: TheaterVideo[] }

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtDur = (s: number) => {
  if (s == null || isNaN(s)) return '—'
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return h ? `${h}:${pad2(m)}:${pad2(sec)}` : `${m}:${pad2(sec)}`
}
const fmtMon = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }
  catch { return iso }
}
const fmtViews = (n: number) => {
  if (!n) return '—'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function posterUrl(v: TheaterVideo): string | null {
  if (v.image) return v.image
  if (v.ytId) return `https://i.ytimg.com/vi/${v.ytId}/hqdefault.jpg`
  return null
}

function Thumb({ v, plInner = false }: { v: TheaterVideo; plInner?: boolean }) {
  const cls = plInner ? `thumb pl-inner-thumb ${v.thumbStyle}` : `thumb ${v.thumbStyle}`
  const src = posterUrl(v)
  return (
    <div className={cls}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="thumb-img" src={src} alt="" loading="lazy" />
      ) : (
        <span className="thumb-glyph">{v.glyph}</span>
      )}
      {!plInner && <span className="thumb-rule" />}
      {v.durSec > 0 && <span className="thumb-dur">{fmtDur(v.durSec)}</span>}
    </div>
  )
}

export default function VideosTheaterClient({ videos }: Props) {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('All')
  const [tag, setTag] = useState('All')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'popular' | 'longest' | 'shortest'>('newest')
  const [playingSlug, setPlayingSlug] = useState<string | null>(null)
  const [embedLive, setEmbedLive] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const { kinds, tags } = useMemo(() => {
    const kc: Record<string, number> = {}
    const tc: Record<string, number> = {}
    videos.forEach(v => {
      kc[v.kind] = (kc[v.kind] || 0) + 1
      v.tags.forEach(t => { tc[t] = (tc[t] || 0) + 1 })
    })
    return { kinds: kc, tags: tc }
  }, [videos])

  const kindOrder = useMemo(
    () => ['All', ...Object.keys(kinds).sort((a, b) => kinds[b] - kinds[a])],
    [kinds]
  )
  const tagOrder = useMemo(
    () => ['All', ...Object.keys(tags).sort((a, b) => tags[b] - tags[a]).slice(0, 10)],
    [tags]
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return videos.filter(v => {
      if (kind !== 'All' && v.kind !== kind) return false
      if (tag !== 'All' && !v.tags.includes(tag)) return false
      if (needle) {
        const hay = `${v.title} ${v.description} ${v.tags.join(' ')} ${v.kind} ${v.series || ''}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    }).sort((a, b) => {
      if (sort === 'newest') return a.date < b.date ? 1 : -1
      if (sort === 'oldest') return a.date > b.date ? 1 : -1
      if (sort === 'popular') return b.views - a.views
      if (sort === 'longest') return b.durSec - a.durSec
      if (sort === 'shortest') return a.durSec - b.durSec
      return 0
    })
  }, [videos, q, kind, tag, sort])

  const current = useMemo(() => {
    if (!filtered.length) return null
    return filtered.find(v => v.slug === playingSlug) || filtered[0]
  }, [filtered, playingSlug])

  useEffect(() => { setEmbedLive(false) }, [current?.slug])

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

  const totalSec = useMemo(() => videos.reduce((s, v) => s + v.durSec, 0), [videos])
  const totalViews = useMemo(() => videos.reduce((s, v) => s + v.views, 0), [videos])
  const lastDate = useMemo(() => {
    const sorted = [...videos].sort((a, b) => (a.date < b.date ? 1 : -1))
    return sorted[0]?.date ? fmtMon(sorted[0].date) : ''
  }, [videos])

  const chapterTitles = [
    "Cold open & what we're building",
    'Setup, repo, and prerequisites',
    'First end-to-end pass',
    'The part that always breaks',
    'Hardening for production',
    'Wrap, gotchas, and resources',
  ]
  const chN = current ? Math.min(6, Math.max(3, Math.round((current.durSec || 900) / 600))) : 0

  return (
    <div className="videos-page">
      <section className="vid-header">
        <div className="vb-container">
          <div className="vid-eyebrow">Videos · Tutorials · Talks · Live coding</div>
          <h1 className="vid-title">
            Watch me <em>build</em>, break, and explain applied AI.
          </h1>
          <p className="vid-dek">
            Long-form tutorials, working sessions, and short explainers.
            No course bundles, no upsells — just the same material I&apos;d use in a workshop.
          </p>
          <div className="vid-rule">
            <span><b>{videos.length}</b> videos</span>
            <span><b>{(totalSec / 3600).toFixed(1)}</b> hours</span>
            <span><b>{fmtViews(totalViews)}</b> views</span>
            <span>Updated <b>{lastDate}</b></span>
            <span />
            <a className="yt" href="https://www.youtube.com/@zackproser" target="_blank" rel="noreferrer">
              Subscribe on YouTube ↗
            </a>
          </div>
        </div>
      </section>

      <section className="filter-bar">
        <div className="vb-container">
          <div className="filter-row">
            <div className="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                placeholder="Search videos — try 'rag', 'agents', 'fine-tune' …"
                aria-label="Search videos"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              <span className="kbd">⌘K</span>
            </div>
            <div className="chip-group" role="tablist" aria-label="Filter by kind">
              {kindOrder.map(k => {
                const n = k === 'All' ? videos.length : kinds[k]
                return (
                  <button
                    key={k}
                    className={`chip ${kind === k ? 'active' : ''}`}
                    onClick={() => setKind(k)}
                    type="button"
                  >
                    {k}<span className="count">{n}</span>
                  </button>
                )
              })}
            </div>
            <select
              className="sort-select"
              aria-label="Sort"
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
            >
              <option value="newest">↓ Newest</option>
              <option value="oldest">↑ Oldest</option>
              <option value="popular">★ Most watched</option>
              <option value="longest">⟷ Longest</option>
              <option value="shortest">⟷ Shortest</option>
            </select>
          </div>
          {tagOrder.length > 1 && (
            <div className="filter-secondary">
              <span className="label">Topics</span>
              <div className="chip-group">
                {tagOrder.map(t => {
                  const label = t === 'All' ? 'All topics' : `#${t}`
                  const n = t === 'All' ? videos.length : tags[t]
                  return (
                    <button
                      key={t}
                      className={`chip ${tag === t ? 'active' : ''}`}
                      onClick={() => setTag(t)}
                      type="button"
                    >
                      {label}<span className="count">{n}</span>
                    </button>
                  )
                })}
              </div>
              <span className="results-count">
                <b>{filtered.length}</b> of <span>{videos.length}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      <main>
        <div className="vb-container">
          {!filtered.length ? (
            <div className="empty-state">
              <h3>No videos match those filters.</h3>
              <p>Try clearing a topic or searching with a different term.</p>
            </div>
          ) : current && (
            <div className="theater-wrap">
              <div className="player">
                <div className="player-frame">
                  {embedLive && current.ytId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${current.ytId}?autoplay=1`}
                      title={current.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className="player-poster"
                      type="button"
                      onClick={() => { if (current.ytId) setEmbedLive(true) }}
                      aria-label={current.ytId ? `Play ${current.title}` : current.title}
                      disabled={!current.ytId}
                    >
                      {posterUrl(current) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="poster-img" src={posterUrl(current)!} alt="" />
                      ) : (
                        <span className="glyph">{current.glyph}</span>
                      )}
                      <div className="play" />
                    </button>
                  )}
                </div>
                <div className="player-meta">
                  <div className="badge">
                    {current.series ? `${current.series} · pt ${current.seriesPart} · ` : ''}Now playing
                  </div>
                  <h2>{current.title}</h2>
                  <div className="stats">
                    <span><b>{current.kind}</b></span><span className="sep">·</span>
                    <span>{fmtMon(current.date)}</span><span className="sep">·</span>
                    <span>{fmtDur(current.durSec)}</span><span className="sep">·</span>
                    <span>{fmtViews(current.views)} views</span>
                    {current.tags.length > 0 && (<><span className="sep">·</span><span>{current.tags.slice(0, 3).map(t => `#${t}`).join(' · ')}</span></>)}
                  </div>
                  {current.description && <p className="player-dek">{current.description}</p>}
                  <Link className="player-link" href={current.slug as any}>
                    Open full write-up →
                  </Link>
                </div>
                <div className="chapters">
                  <div className="ch-head"><span>Chapters</span><span>{chN} sections</span></div>
                  <ol>
                    {chapterTitles.slice(0, chN).map((t, i) => (
                      <li key={t}>
                        <span className="t">{fmtDur(Math.floor(current.durSec * i / chN))}</span>
                        <span className="l">{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <aside className="playlist">
                <div className="playlist-head">
                  <h3>{kind === 'All' && tag === 'All' && !q ? 'Up next' : 'Filtered queue'}</h3>
                  <span className="count">{filtered.length} videos</span>
                </div>
                <div className="playlist-list">
                  {filtered.map((v, i) => (
                    <button
                      key={v.slug}
                      className={`pl-item ${v.slug === current.slug ? 'active' : ''}`}
                      type="button"
                      onClick={() => setPlayingSlug(v.slug)}
                    >
                      <span className="pl-num">{pad2(i + 1)}</span>
                      <div className="pl-thumb"><Thumb v={v} plInner /></div>
                      <div className="pl-body">
                        <h4 className="pl-title">{v.title}</h4>
                        <div className="pl-meta">
                          <span>{v.kind}</span>
                          <span>{fmtMon(v.date)}</span>
                          {v.views > 0 && <span>{fmtViews(v.views)}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          )}

          <div className="newsletter-strip">
            <div>
              <h3>New videos, in your inbox.</h3>
              <p>One email per drop. Usually a tutorial, sometimes a workshop, never a launch announcement. Unsubscribe in one click.</p>
            </div>
            <div>
              <NewsletterSignupInline />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
