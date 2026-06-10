'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  { text: 'Claude’s answer', kind: 'tok' },
  { text: 'follow-up', kind: 'you' },
  { text: 'meeting notes', kind: 'file' },
  { text: 'revised draft', kind: 'tok' },
  { text: 'one more ask', kind: 'you' },
  { text: 'spreadsheet.xlsx', kind: 'file' },
  { text: 'final answer', kind: 'tok' },
]
const WINDOW_SIZE = 6

export function ContextWindowViz() {
  const [cursor, setCursor] = useState(2)

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => c + 1), 1900)
    return () => clearInterval(t)
  }, [])

  const items = Array.from({ length: Math.min(cursor, WINDOW_SIZE) }, (_, i) => {
    const idx = (cursor - Math.min(cursor, WINDOW_SIZE) + i) % STREAM.length
    return { ...STREAM[idx], key: cursor - Math.min(cursor, WINDOW_SIZE) + i }
  })
  const full = cursor >= WINDOW_SIZE

  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="cwviz">
        <div className="cwviz-window">
          <span className="cwviz-label">context window · the model sees only this</span>
          <AnimatePresence mode="popLayout">
            {items.map((it, i) => (
              <motion.span
                layout
                key={it.key}
                className={`tok ${it.kind === 'tok' ? '' : it.kind} ${full && i === 0 ? 'old' : ''}`}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: full && i === 0 ? 0.45 : 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45 }}
              >
                {it.text}
              </motion.span>
            ))}
          </AnimatePresence>
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
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % LOOP_STEPS.length), 1300)
    return () => clearInterval(t)
  }, [])

  const nodes = [
    { label: 'model', sub: 'reasons + decides', core: true, on: step === 0 },
    { label: 'tools', sub: 'files · web · slack', core: false, on: step === 1 },
    { label: 'result', sub: 'meets the bar?', core: false, on: step === 2 },
  ]

  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="alviz">
        {nodes.map((n, i) => (
          <span key={n.label} style={{ display: 'contents' }}>
            <motion.span
              className={`node ${n.core ? 'core' : ''}`}
              animate={{
                scale: n.on ? 1.07 : 1,
                boxShadow: n.on
                  ? '0 0 0 3px rgba(248,155,108,.45)'
                  : '0 0 0 0px rgba(248,155,108,0)',
              }}
              transition={{ duration: 0.35 }}
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
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1500)
    return () => clearInterval(t)
  }, [])

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
    <div className="gg-viz" aria-hidden="true">
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
              className="node"
              animate={{
                scale: a.rework ? 1.07 : 1,
                borderColor: a.rework ? '#F16025' : 'rgba(255,255,255,.25)',
              }}
              transition={{ duration: 0.3 }}
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
