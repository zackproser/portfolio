'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { Content } from '@/types'
import { RfiMarkdown } from './rfi-markdown'
import { BlueprintSeriesCapture, NextDrawing } from './BlueprintSeriesCapture'

// Blueprint Deep Dive article layout — the engineering-drawing chrome
// around an MDX body: grid paper, title block, INDEX OF SHEETS rail,
// scroll progress, colophon, and the RFI (Request For Information)
// desk + drawer. Posts opt in via `"blogStyle": "blueprint"` in
// metadata.json; drawing fields live under `metadata.blueprint`.

export interface BlueprintMeta {
  number?: string // "001"
  subject?: string // "ATTENTION"
  project?: string // "DEEP DIVES"
  scale?: string // "1 : 1"
  drawnBy?: string // "Z. PROSER"
  readTime?: string // "25 MIN"
  eyebrow?: string // masthead eyebrow line
  subtitle?: string // serif italic dek under the H1
  revision?: string // "REV A"
  rfiSuggestions?: string[]
  nextDrawing?: NextDrawing
}

interface TocEntry {
  id: string
  num: string
  label: string
}

interface ChatMsg {
  role: 'user' | 'assistant'
  text: string
}

interface LogEntry {
  q: string
  a: string
  via: string
  t: number
}

const DEFAULT_SUGGESTIONS = [
  'What should I read next after this?',
  'Explain the hardest idea on this sheet more slowly',
  'Where does this break down in practice?',
]

const THEME_KEY = 'bp-article-theme'

function monthYear(date?: string): string {
  if (!date) return ''
  try {
    return new Date(`${date.slice(0, 10)}T00:00:00Z`)
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
      .toUpperCase()
      .replace(' ', ' ')
  } catch {
    return ''
  }
}

export function BlueprintArticleLayout({
  metadata,
  children,
}: {
  metadata: Content & { blueprint?: BlueprintMeta }
  children: React.ReactNode
}) {
  const bp = metadata.blueprint || {}
  const number = bp.number || '001'
  const drawingId = `tdd-${number}`
  const drawingCode = `TDD-${number}`
  const suggestions = bp.rfiSuggestions?.length ? bp.rfiSuggestions : DEFAULT_SUGGESTIONS

  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [prog, setProg] = useState(0)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [active, setActive] = useState('s0')
  // The RFI desk takes the next appendix letter after any MDX
  // appendices (BpReferences, BlueprintRfpDesk): none → A, one → B,
  // two → C.
  const [rfiLetter, setRfiLetter] = useState<'A' | 'B' | 'C'>('A')

  // Chat drawer state
  const [chatOpen, setChatOpen] = useState(false)
  const [view, setView] = useState<'chat' | 'log'>('chat')
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const [inlineQ, setInlineQ] = useState('')
  const [log, setLog] = useState<LogEntry[]>([])
  const chatBodyRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const drawerInputRef = useRef<HTMLInputElement | null>(null)
  const rfiTabRef = useRef<HTMLButtonElement | null>(null)
  const drawerWasOpen = useRef(false)
  const logKey = `bp-rfi-${drawingId}`

  // The server-rendered button has no handler yet. Keep it visibly inactive
  // until hydration completes, then restore the reader's last print mode.
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY)
      if (storedTheme === 'light') setDark(false)
      if (storedTheme === 'dark') setDark(true)
    } catch {
      // Storage may be unavailable; the in-memory theme still works.
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      // Storage may be unavailable; keep the current in-memory theme.
    }
  }, [dark, mounted])

  // Build the INDEX OF SHEETS from the rendered MDX and track scroll.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const secs = Array.from(root.querySelectorAll<HTMLElement>('[data-sec]'))
    const appendixCount = secs.filter((s) =>
      ['refs', 'rfp'].includes(s.getAttribute('data-sec') || ''),
    ).length
    const desk = (['A', 'B', 'C'] as const)[Math.min(appendixCount, 2)]
    setRfiLetter(desk)
    setToc(
      secs.map((s) => ({
        id: s.getAttribute('data-sec') || '',
        // The RFI desk's rail letter follows the MDX appendices
        num: s.getAttribute('data-sec') === 's9' ? desk : s.getAttribute('data-num') || '',
        label: s.getAttribute('data-label') || '',
      })),
    )
    const onScroll = () => {
      let current = secs.length ? secs[0].getAttribute('data-sec') || 's0' : 's0'
      for (const s of secs) {
        if (s.getBoundingClientRect().top < 160) current = s.getAttribute('data-sec') || current
      }
      const doc = document.documentElement
      const p = Math.min(1, Math.max(0, doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1)))
      setActive(current)
      setProg(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Restore the RFI log from this device. Anything that isn't a
  // well-formed entry array (older versions, corruption) is dropped.
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(logKey) || '[]')
      if (Array.isArray(parsed)) {
        setLog(
          parsed
            .filter(
              (e): e is LogEntry =>
                !!e &&
                typeof e === 'object' &&
                typeof e.q === 'string' &&
                typeof e.a === 'string' &&
                typeof e.t === 'number',
            )
            .slice(-200),
        )
      }
    } catch {
      // blocked or corrupted storage — start with an empty log
    }
  }, [logKey])

  // Persist outside any state updater: React re-throws updater
  // exceptions during render, where a blocked-storage SecurityError
  // would take down the whole article.
  useEffect(() => {
    if (log.length === 0) return
    try {
      localStorage.setItem(logKey, JSON.stringify(log))
    } catch {
      // storage unavailable — the in-memory log still works
    }
  }, [log, logKey])

  // Drawer focus + Escape handling: move focus in on open, restore to
  // the tab on close, and let Escape close the drawer.
  useEffect(() => {
    if (chatOpen) {
      drawerWasOpen.current = true
      drawerInputRef.current?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setChatOpen(false)
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    if (drawerWasOpen.current) {
      rfiTabRef.current?.focus()
    }
  }, [chatOpen])

  const scrollChat = useCallback(() => {
    setTimeout(() => {
      const el = chatBodyRef.current
      if (el) el.scrollTop = el.scrollHeight
    }, 80)
  }, [])

  const send = useCallback(
    async (qRaw: string, via: string) => {
      const q = String(qRaw || '').trim()
      if (!q || busy) return
      const history = [...msgs, { role: 'user' as const, text: q }]
      setMsgs(history)
      setBusy(true)
      setChatOpen(true)
      setView('chat')
      setDraft('')
      setInlineQ('')
      scrollChat()

      let answer = ''
      let ok = false
      try {
        const res = await fetch('/api/blueprint-rfi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drawingId,
            via,
            messages: history.slice(-12).map((m) => ({ role: m.role, content: m.text })),
          }),
        })
        if (!res.ok || !res.body) throw new Error(`rfi ${res.status}`)
        // Show the assistant bubble as soon as the stream opens.
        setMsgs((s) => [...s, { role: 'assistant', text: '' }])
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          answer += decoder.decode(value, { stream: true })
          const snapshot = answer
          setMsgs((s) => {
            const next = [...s]
            next[next.length - 1] = { role: 'assistant', text: snapshot }
            return next
          })
          scrollChat()
        }
        // Flush any multibyte sequence split across the final chunk
        answer += decoder.decode()
        if (!answer.trim()) {
          answer = 'That one didn’t go through — give it a few seconds and try again.'
        } else {
          ok = true
        }
        // Sync the visible bubble with the final text — the in-loop
        // snapshots never include the flushed tail bytes.
        const finalAnswer = answer
        setMsgs((s) => {
          const next = [...s]
          next[next.length - 1] = { role: 'assistant', text: finalAnswer }
          return next
        })
      } catch {
        answer = 'That one didn’t go through — give it a few seconds and try again.'
        setMsgs((s) => {
          const last = s[s.length - 1]
          const base = last?.role === 'assistant' ? s.slice(0, -1) : s
          return [...base, { role: 'assistant', text: answer }]
        })
      } finally {
        setBusy(false)
        scrollChat()
      }

      // Only completed answers go in the drawing log — a transport
      // error is not an RFI on record. Persistence happens in the
      // effect above, keeping this updater pure.
      if (ok) {
        const entry: LogEntry = { q, a: answer, via, t: Date.now() }
        setLog((prev) => [...prev, entry].slice(-200))
      }
    },
    [busy, drawingId, msgs, scrollChat],
  )

  const titleblockCells: Array<[string, string, boolean?]> = [
    ['PROJECT', bp.project || 'DEEP DIVES'],
    ['DRAWING Nº', drawingCode],
    ['SUBJECT', bp.subject || ''],
    ['SCALE', bp.scale || '1 : 1'],
    ['DRAWN BY', bp.drawnBy || 'Z. PROSER'],
    ['READ TIME', bp.readTime || '', true],
  ]

  return (
    <div ref={rootRef} className={`bp${dark ? ' bp-dark' : ''}`}>
      <div className="bp-progress-track">
        <div className="bp-progress-bar" style={{ width: `${(prog * 100).toFixed(1)}%` }} />
      </div>

      <button
        type="button"
        className="bp-theme-toggle"
        onClick={() => setDark((d) => !d)}
        disabled={!mounted}
        aria-label={mounted ? `Switch to ${dark ? 'light print' : 'blueprint'} theme` : 'Theme control loading'}
      >
        {mounted ? (dark ? '◑ Light print' : '◑ Blueprint') : '◑ Theme loading'}
      </button>

      {toc.length > 0 && (
        <nav className="bp-rail" aria-label="Index of sheets">
          <div className="bp-rail-title">INDEX OF SHEETS</div>
          {toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={active === t.id ? 'bp-active' : ''}>
              <span className="bp-rail-num">{t.num}</span>
              {t.label}
            </a>
          ))}
        </nav>
      )}

      <header className="bp-masthead">
        <div className="bp-titleblock">
          <div className="bp-titleblock-strip">
            <span>zackproser.com · Blueprint Deep Dive</span>
            <span className="bp-num">Nº {number}</span>
          </div>
          <div className="bp-titleblock-main">
            {bp.eyebrow ? <div className="bp-eyebrow">{bp.eyebrow}</div> : null}
            <h1>{metadata.title}</h1>
            {bp.subtitle ? <p className="bp-subtitle">{bp.subtitle}</p> : null}
          </div>
          <dl className="bp-titleblock-grid">
            {titleblockCells.map(([label, value, accent]) =>
              value ? (
                <div key={label} className="bp-titleblock-cell">
                  <dt>{label}</dt>
                  <dd className={accent ? 'bp-num' : ''}>{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
          <BlueprintSeriesCapture variant="title-block" drawingCode={drawingCode} next={bp.nextDrawing} />
        </div>
      </header>

      <article className="bp-article">
        {children}

        {/* APPENDIX — RFI desk (references, when present, are Appendix A) */}
        <div id="s9" data-sec="s9" data-num={rfiLetter} data-label="RFI desk" className="bp-rfi-desk">
          <div className="bp-rfi-desk-strip">
            <span>APPENDIX {rfiLetter} — RFI DESK · REQUEST FOR INFORMATION</span>
            <span className="bp-num">
              {drawingCode}-{rfiLetter}
            </span>
          </div>
          <div className="bp-rfi-desk-body">
            <p>
              Anything on this sheet still unclear — or anything you were too polite to ask out loud? File an
              RFI. Answers come from the drawing itself and cite their sheet numbers, and every question is
              recorded in the drawing log so the next revision can answer it in print.
            </p>
            <div className="bp-rfi-inputrow">
              <input
                className="bp-rfi-input"
                value={inlineQ}
                onChange={(e) => setInlineQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(inlineQ, 'rfi-desk')
                }}
                placeholder={'“why is this designed this way?” · anything at all'}
                aria-label="File an RFI — ask a question about this drawing"
              />
              <button type="button" className="bp-rfi-file" onClick={() => send(inlineQ, 'rfi-desk')}>
                ASK A QUESTION →
              </button>
            </div>
            <div className="bp-rfi-chips">
              {suggestions.map((text) => (
                <button key={text} type="button" className="bp-rfi-chip" onClick={() => send(text, 'chip')}>
                  {text}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="bp-rfi-loglink"
              onClick={() => {
                setChatOpen(true)
                setView('log')
              }}
            >
              {log.length} RFIs ON RECORD — OPEN THE DRAWING LOG
            </button>
          </div>
        </div>

        <BlueprintSeriesCapture variant="next-sheet" drawingCode={drawingCode} next={bp.nextDrawing} />

        <div className="bp-colophon">
          <div className="bp-colophon-meta">
            END OF DRAWING · {drawingCode} · {bp.revision || 'REV A'}
            {metadata.date ? ` · ${monthYear(metadata.date as string)}` : ''}
          </div>
          <div className="bp-stamp">✓ CHECKED — YOU ARE NOW AN EXPERT</div>
        </div>
      </article>

      {!chatOpen && (
        <button ref={rfiTabRef} type="button" className="bp-rfi-tab" onClick={() => setChatOpen(true)}>
          ✦ ASK A QUESTION OF THIS BLUEPRINT
        </button>
      )}

      {chatOpen && (
        <aside className="bp-drawer" role="dialog" aria-label="Ask a question of this blueprint">
          <div className="bp-drawer-head">
            <div className="bp-drawer-title">
              <div className="bp-drawer-title-main">ASK A QUESTION OF THIS BLUEPRINT</div>
              <div className="bp-drawer-title-sub">RFI DESK · SCOPED TO {drawingCode} · EVERY QUESTION FILED</div>
            </div>
            <button
              type="button"
              className="bp-drawer-btn"
              onClick={() => setView((v) => (v === 'log' ? 'chat' : 'log'))}
            >
              {view === 'log' ? 'CHAT' : `LOG (${log.length})`}
            </button>
            <button
              type="button"
              className="bp-drawer-btn"
              onClick={() => setChatOpen(false)}
              aria-label="Close the RFI panel"
            >
              ✕
            </button>
          </div>

          {view === 'chat' ? (
            <>
              <div ref={chatBodyRef} className="bp-drawer-body" aria-live="polite">
                {msgs.length === 0 && !busy ? (
                  <div className="bp-drawer-empty">
                    <p>
                      Ask anything on this drawing — or anything you&apos;ve been too polite to ask out loud.
                      Answers come from the sheets above and cite their section numbers.
                    </p>
                    <div className="bp-rfi-chips">
                      {suggestions.map((text) => (
                        <button
                          key={text}
                          type="button"
                          className="bp-rfi-chip"
                          onClick={() => send(text, 'chip')}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {msgs.map((m, mi) =>
                  m.role === 'user' ? (
                    <div key={mi} className="bp-msg-user-wrap">
                      <div className="bp-msg-user">{m.text}</div>
                    </div>
                  ) : (
                    <div key={mi} className="bp-msg-assistant-wrap">
                      <div className="bp-msg-assistant">
                        <RfiMarkdown text={m.text} kb={`msg${mi}`} />
                      </div>
                    </div>
                  ),
                )}
                {busy && <div className="bp-busy">DRAFTING RESPONSE…</div>}
              </div>
              <div className="bp-drawer-inputrow">
                <input
                  ref={drawerInputRef}
                  className="bp-drawer-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(draft, 'typed')
                  }}
                  placeholder="Type a question…"
                  aria-label="Ask the drawing a question"
                />
                <button
                  type="button"
                  className="bp-drawer-send"
                  onClick={() => send(draft, 'typed')}
                  aria-label="Send question"
                >
                  →
                </button>
              </div>
            </>
          ) : (
            <div className="bp-drawer-body">
              <div>
                <div className="bp-log-head">DRAWING LOG — ALL RFIs FILED FROM THIS DEVICE</div>
                {log.length === 0 && <p className="bp-log-empty">No RFIs on record yet.</p>}
                {[...log].reverse().map((e, li) => (
                  <div key={`${e.t}-${li}`} className="bp-log-entry">
                    <div className="bp-log-when">
                      {new Date(e.t).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · VIA {(e.via || 'typed').toUpperCase()}
                    </div>
                    <div className="bp-log-q">Q — {e.q}</div>
                    <div className="bp-log-a">
                      <RfiMarkdown text={e.a} kb={`log${li}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  )
}
