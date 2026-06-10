'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ────────────────────────────────────────────────────────────────────────
// Self-running animated explainers for the GHX glossary — one per concept
// that dies as text. Same navy-plate visual language as Diagrams.tsx.
// ────────────────────────────────────────────────────────────────────────

function usePhase(count: number, ms: number) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % count), ms)
    return () => clearInterval(t)
  }, [count, ms])
  return phase
}

// ---- Training vs inference -------------------------------------------------

const CORPUS = ['every book', 'all the code', 'the open web', 'papers', 'manuals', 'forums']
const OUTPUT = ['Here', 'are', 'the', 'three', 'follow-ups', 'you', 'need…']

export function TrainingInferenceViz() {
  // 0–5: training ticks · 6–13: inference (one output word per tick)
  const phase = usePhase(14, 900)
  const training = phase < 6

  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="tiviz">
        <div className="tiviz-stage">
          <span className={`tiviz-mode ${training ? 'on' : ''}`}>1 · training</span>
          <span className={`tiviz-mode ${!training ? 'on' : ''}`}>2 · inference</span>
        </div>
        <div className="tiviz-row">
          <div className="tiviz-side">
            <AnimatePresence mode="popLayout">
              {training ? (
                <motion.span
                  key={`in-${phase}`}
                  className="tiviz-doc"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.4 }}
                >
                  {CORPUS[phase % CORPUS.length]}
                </motion.span>
              ) : (
                <motion.span
                  key="prompt"
                  className="tiviz-doc you"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  “draft my follow-ups”
                </motion.span>
              )}
            </AnimatePresence>
            <span className="tiviz-arrow">→</span>
          </div>
          <div className={`tiviz-net ${training ? 'tuning' : 'frozen'}`}>
            {Array.from({ length: 18 }, (_, i) => (
              <motion.span
                key={i}
                className="n"
                animate={
                  training
                    ? { opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }
                    : { opacity: 0.9, scale: 1 }
                }
                transition={
                  training
                    ? { duration: 1.1, repeat: Infinity, delay: (i % 6) * 0.14 }
                    : { duration: 0.3 }
                }
              />
            ))}
            <span className="tiviz-netlabel">{training ? 'billions of dials adjusting' : 'dials frozen'}</span>
          </div>
          <div className="tiviz-side">
            <span className="tiviz-arrow">→</span>
            <span className="tiviz-out">
              {training
                ? 'predict · check · adjust · repeat'
                : OUTPUT.slice(0, Math.max(1, phase - 5)).join(' ')}
            </span>
          </div>
        </div>
      </div>
      <p className="viz-caption">
        {training ? (
          <>it reads (most of) everything we&apos;ve written, <strong>in a loop</strong>, until its guesses stop being wrong</>
        ) : (
          <>then the same network just <strong>predicts</strong> — and the predictions happen to be insanely useful</>
        )}
      </p>
    </div>
  )
}

// ---- Repo history ------------------------------------------------------------

export function RepoHistoryViz() {
  // 0..3 commits appear, 4 = rollback highlight, 5 = recovered
  const phase = usePhase(6, 1300)
  const commits = [
    { v: 'v1', label: 'first draft' },
    { v: 'v2', label: 'legal edits' },
    { v: 'v3', label: 'oops — broke it' },
    { v: 'v4', label: 'rolled back ✓' },
  ]
  const shown = Math.min(phase + 1, 4)

  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="rhviz">
        {commits.slice(0, shown).map((c, i) => (
          <span key={c.v} style={{ display: 'contents' }}>
            {i > 0 && <span className="rh-link" />}
            <motion.span
              className={`rh-commit ${phase >= 4 && i === 1 ? 'safe' : ''} ${i === 2 && phase >= 4 ? 'bad' : ''}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {c.v}
              <em>{c.label}</em>
            </motion.span>
          </span>
        ))}
      </div>
      <p className="viz-caption">
        every change is a snapshot — <strong>nothing is ever lost</strong>, so it&apos;s a safe sandbox
      </p>
    </div>
  )
}

// ---- Product ladder ----------------------------------------------------------

const RUNGS = [
  { name: 'Claude.ai', sub: 'chats with you', reach: 1 },
  { name: 'Cowork', sub: 'works in one folder', reach: 2 },
  { name: 'Claude Code', sub: 'works on your whole machine', reach: 3 },
]

export function ProductLadderViz() {
  const phase = usePhase(3, 1700)
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="plviz">
        <div className="plviz-brain">Claude<br /><em>the same model behind all three</em></div>
        <div className="plviz-rungs">
          {RUNGS.map((r, i) => (
            <motion.div
              key={r.name}
              className="plviz-rung"
              animate={{
                scale: phase === i ? 1.05 : 1,
                borderColor: phase === i ? '#F16025' : 'rgba(255,255,255,.25)',
              }}
              transition={{ duration: 0.35 }}
            >
              <strong>{r.name}</strong>
              <em>{r.sub}</em>
              <span className="plviz-meter">
                {Array.from({ length: 3 }, (_, b) => (
                  <i key={b} className={b < r.reach ? 'on' : ''} />
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="viz-caption">
        same brain, <strong>bigger reach</strong> — when Cowork feels cramped, Claude Code is the answer
      </p>
    </div>
  )
}

// ---- MCP plug ---------------------------------------------------------------

const SERVICES = ['Slack', 'Notion', 'Gong', 'your database', 'your CRM']

export function McpViz() {
  const phase = usePhase(SERVICES.length, 1400)
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="mcpviz">
        <span className="mcp-claude">Claude</span>
        <span className="mcp-cable">
          <motion.i
            key={phase}
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: '88%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1 }}
          />
        </span>
        <span className="mcp-port">MCP</span>
        <div className="mcp-services">
          {SERVICES.map((s, i) => (
            <motion.span
              key={s}
              className="mcp-svc"
              animate={{
                borderColor: phase === i ? '#F16025' : 'rgba(255,255,255,.25)',
                scale: phase === i ? 1.06 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
      <p className="viz-caption">
        <strong>one plug standard</strong> — anything with an MCP connector, Claude can reach
      </p>
    </div>
  )
}

// ---- Skill share ------------------------------------------------------------

export function SkillShareViz() {
  const phase = usePhase(4, 1400) // 0 write · 1-3 reuse by teammates
  const people = ['you', 'teammate', 'whole team']
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="skviz">
        <motion.div
          className="sk-card"
          animate={{ scale: phase === 0 ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <strong>release-notes.skill</strong>
          <em>“here&apos;s exactly how we write ours”</em>
        </motion.div>
        <span className="tiviz-arrow">→</span>
        <div className="sk-people">
          {people.map((p, i) => (
            <motion.span
              key={p}
              className="sk-person"
              animate={{
                opacity: phase > i ? 1 : 0.3,
                borderColor: phase === i + 1 ? '#F16025' : 'rgba(255,255,255,.25)',
              }}
              transition={{ duration: 0.3 }}
            >
              {p} <i>{phase > i ? '✓ same quality' : '…'}</i>
            </motion.span>
          ))}
        </div>
      </div>
      <p className="viz-caption">
        written once in plain language — <strong>every Claude on the team</strong> does it your way
      </p>
    </div>
  )
}

// ---- Ideation confidence loop -------------------------------------------------

const QA = [
  { q: '“What outcome do you actually want?”', pct: 35 },
  { q: '“Who reads this, and what must they do next?”', pct: 60 },
  { q: '“What does done look like — concretely?”', pct: 80 },
  { q: '“Anything I should NOT touch?”', pct: 95 },
]

export function IdeationViz() {
  const phase = usePhase(QA.length + 1, 1500)
  const step = Math.min(phase, QA.length - 1)
  const ready = phase === QA.length
  const pct = ready ? 95 : QA[step].pct

  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="idviz">
        <AnimatePresence mode="wait">
          <motion.p
            key={ready ? 'go' : step}
            className={`id-q ${ready ? 'go' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {ready ? '95% confident — NOW the work starts.' : QA[step].q}
          </motion.p>
        </AnimatePresence>
        <div className="id-meter">
          <motion.div
            className="id-fill"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
          <span className="id-pct">{pct}% understood</span>
        </div>
      </div>
      <p className="viz-caption">
        it interviews you <strong>before</strong> burning tokens — the cheapest insurance in this glossary
      </p>
    </div>
  )
}

// ---- Hallucination: grounded vs invented ---------------------------------------

export function HallucinationViz() {
  const phase = usePhase(2, 2400)
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="haviz">
        <motion.div
          className="ha-card bad"
          animate={{ opacity: phase === 0 ? 1 : 0.45, scale: phase === 0 ? 1 : 0.97 }}
          transition={{ duration: 0.4 }}
        >
          <strong>✗ invented</strong>
          <em>“Per the Q3 vendor audit PDF…”</em>
          <span>no such PDF was ever provided</span>
        </motion.div>
        <motion.div
          className="ha-card good"
          animate={{ opacity: phase === 1 ? 1 : 0.45, scale: phase === 1 ? 1 : 0.97 }}
          transition={{ duration: 0.4 }}
        >
          <strong>✓ grounded</strong>
          <em>“contract.pdf, page 4, clause 7 says…”</em>
          <span>checkable — because you gave it the source</span>
        </motion.div>
      </div>
      <p className="viz-caption">
        the fix is boring: <strong>hand it the real source</strong> and ask it to verify against something checkable
      </p>
    </div>
  )
}
