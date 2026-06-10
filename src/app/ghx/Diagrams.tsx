'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVizPhase, useOnScreen } from './useVizPhase'

// ────────────────────────────────────────────────────────────────────────
// Small, self-running animated diagrams for the GHX glossary (/ghx).
// Navy plates (GHX brand) with orange highlights; each loops forever and
// needs no interaction — they explain the term by motion alone.
// ────────────────────────────────────────────────────────────────────────

// ---- Context window: tokens stream in; when full, the oldest fall out ----

const STREAM: Array<{ text: string; kind: 'you' | 'file' | 'tok' }> = [
  { text: 'your question', kind: 'you' },
  { text: 'CLAUDE.md', kind: 'file' },
  { text: 'contract.pdf', kind: 'file' },
  { text: 'Claude\u2019s answer', kind: 'tok' },
  { text: 'follow-up', kind: 'you' },
  { text: 'meeting notes', kind: 'file' },
  { text: 'revised draft', kind: 'tok' },
  { text: 'one more ask', kind: 'you' },
  { text: 'price-file.csv', kind: 'file' },
  { text: 'final answer', kind: 'tok' },
]
const WINDOW_SIZE = 6
const FEED_FILES = ['Q3-budget.xlsx', 'board-deck.pptx', 'old-notes.md']
const FEED_ASKS = ['\u201cwhat changed?\u201d', '\u201cdraft the email\u201d', '\u201cwhy that number?\u201d']

interface CwItem {
  text: string
  kind: 'you' | 'file' | 'tok'
  key: number
}

export function ContextWindowViz() {
  const [items, setItems] = useState<CwItem[]>(() =>
    STREAM.slice(0, 3).map((s, i) => ({ ...s, key: i })),
  )
  const [evicted, setEvicted] = useState<string | null>(null)
  const keyRef = useRef(3)
  const autoRef = useRef(3)
  const [visible, rootRef] = useOnScreen()
  const fileRef = useRef(0)
  const askRef = useRef(0)

  const add = (it: { text: string; kind: 'you' | 'file' | 'tok' }) => {
    let evictedText: string | null = null
    setItems((prev) => {
      const next = [...prev, { ...it, key: keyRef.current++ }]
      if (next.length > WINDOW_SIZE) {
        evictedText = next[0].text
        return next.slice(1)
      }
      return next
    })
    if (evictedText !== null) {
      setEvicted(evictedText)
    }
  }

  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      add(STREAM[autoRef.current++ % STREAM.length])
    }, 2600)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div className="gg-viz" ref={rootRef}>
      <div className="cwviz">
        <div className="cwviz-window">
          <span className="cwviz-label">context window · the model sees only this</span>
          <AnimatePresence mode="popLayout">
            {items.map((it, i) => (
              <motion.span
                layout
                key={it.key}
                className={`tok ${it.kind === 'tok' ? '' : it.kind} ${
                  items.length === WINDOW_SIZE && i === 0 ? 'old' : ''
                }`}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: items.length === WINDOW_SIZE && i === 0 ? 0.45 : 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45 }}
              >
                {it.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div className="cw-buttons">
          <button
            type="button"
            onClick={() => add({ text: FEED_FILES[fileRef.current++ % FEED_FILES.length], kind: 'file' })}
          >
            + drop in a file
          </button>
          <button
            type="button"
            onClick={() => add({ text: FEED_ASKS[askRef.current++ % FEED_ASKS.length], kind: 'you' })}
          >
            + ask something
          </button>
          <span className="cw-evicted">
            {evicted ? `just fell out: ${evicted}` : 'fill it up \u2014 watch what happens'}
          </span>
        </div>
      </div>
      <p className="viz-caption">
        when it fills, the <strong>oldest falls out</strong> — “it forgot” usually means “it scrolled off”
      </p>
    </div>
  )
}

// ---- Agent: a model core wrapped in a harness, looping ----

const LOOP_STEPS = ['reason', 'act', 'check'] as const

export function AgentLoopViz() {
  const [step, vizRef] = useVizPhase(LOOP_STEPS.length, 1300)

  const nodes = [
    { label: 'model', sub: 'reasons + decides', core: true, on: step === 0 },
    { label: 'tools', sub: 'files · web · slack', core: false, on: step === 1 },
    { label: 'result', sub: 'meets the bar?', core: false, on: step === 2 },
  ]

  return (
    <div className="gg-viz" aria-hidden="true" ref={vizRef}>
      <div className="alviz">
        {nodes.map((n, i) => (
          <span key={n.label} style={{ display: 'contents' }}>
            <motion.span
              className={`node ${n.core ? 'core' : ''} ${n.on ? 'on' : ''}`}
              animate={{ scale: n.on ? 1.07 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {n.label}
              <span className="sub">{n.sub}</span>
            </motion.span>
            {i < nodes.length - 1 && <span className="arrow">→</span>}
          </span>
        ))}
        <span className="arrow">↺</span>
      </div>
      <p className="viz-caption">
        agent = <strong>model + harness</strong>, running in a loop toward a goal
      </p>
    </div>
  )
}

// ---- Orchestrator: one coordinator, several agents, one sent back ----

export function OrchestratorViz() {
  // phases: 0 dispatch, 1 working, 2 one comes back for rework, 3 done
  const [phase, vizRef] = useVizPhase(4, 1500)

  const agents = [
    { name: 'agent 1', state: phase >= 1 ? (phase >= 3 ? '✓ done' : 'working…') : 'queued' },
    {
      name: 'agent 2',
      state:
        phase === 2 ? '↩ redo it' : phase >= 3 ? '✓ done' : phase >= 1 ? 'working…' : 'queued',
      rework: phase === 2,
    },
    { name: 'agent 3', state: phase >= 1 ? (phase >= 3 ? '✓ done' : 'working…') : 'queued' },
  ]

  return (
    <div className="gg-viz" aria-hidden="true" ref={vizRef}>
      <div className="alviz" style={{ flexDirection: 'column', gap: 12 }}>
        <motion.span
          className="node core"
          animate={{ scale: phase === 0 || phase === 2 ? 1.06 : 1 }}
          transition={{ duration: 0.3 }}
        >
          orchestrator
          <span className="sub">hands out work · checks results</span>
        </motion.span>
        <span className="arrow" style={{ lineHeight: 0.6 }}>
          ↙ ↓ ↘
        </span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {agents.map((a) => (
            <motion.span
              key={a.name}
              className={`node ${a.rework ? 'rework' : ''}`}
              animate={{ scale: a.rework ? 1.07 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {a.name}
              <span className="sub">{a.state}</span>
            </motion.span>
          ))}
        </div>
      </div>
      <p className="viz-caption">
        an agent is one worker — an <strong>orchestrator runs the crew</strong> (and sends sloppy work back)
      </p>
    </div>
  )
}
