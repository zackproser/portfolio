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
              className={`plviz-rung ${phase === i ? 'on' : ''}`}
              animate={{ scale: phase === i ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
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
              className={`mcp-svc ${phase === i ? 'on' : ''}`}
              animate={{ scale: phase === i ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
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
              className={`sk-person ${phase === i + 1 ? 'on' : ''}`}
              animate={{ opacity: phase > i ? 1 : 0.3 }}
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

// ---- Context engineering: interactive — curate what the model sees ------------

interface CeItem {
  label: string
  delta: number
  help: boolean
}
const CE_ITEMS: CeItem[] = [
  { label: 'CLAUDE.md — how we work', delta: 20, help: true },
  { label: 'the actual contract', delta: 30, help: true },
  { label: 'last meeting’s notes', delta: 20, help: true },
  { label: 'a clear ask: “flag the renewal risks”', delta: 25, help: true },
  { label: '47 stale email threads', delta: -25, help: false },
  { label: 'the entire shared drive', delta: -30, help: false },
]

export function ContextEngineeringViz() {
  const [included, setIncluded] = useState<boolean[]>(CE_ITEMS.map(() => true))
  const score = Math.max(
    5,
    Math.min(100, CE_ITEMS.reduce((n, it, i) => n + (included[i] ? it.delta : 0), 0)),
  )
  const verdict =
    score >= 85
      ? 'Sharp, grounded answer — it knows exactly what matters.'
      : score >= 50
        ? 'Decent answer with some guessing around the edges.'
        : 'Confidently wrong mush — it’s drowning in noise.'
  const fill = score >= 85 ? 'var(--good)' : score >= 50 ? 'var(--accent)' : 'var(--bad)'

  return (
    <div className="gg-viz">
      <div className="ceviz">
        <div className="ce-items">
          {CE_ITEMS.map((it, i) => (
            <button
              key={it.label}
              type="button"
              className={`ce-item ${included[i] ? `in ${it.help ? 'help' : 'hurt'}` : ''}`}
              onClick={() =>
                setIncluded((prev) => prev.map((v, j) => (j === i ? !v : v)))
              }
              aria-pressed={included[i]}
            >
              {included[i] ? '− ' : '+ '}
              {it.label}
            </button>
          ))}
        </div>
        <div className="ce-meter">
          <div className="ce-fill" style={{ width: `${score}%`, background: fill }} />
        </div>
        <p className="ce-verdict">{verdict}</p>
      </div>
      <p className="viz-caption">
        tap to add or remove — <strong>more is not better</strong>; exactly enough is better
      </p>
    </div>
  )
}

// ---- Verification → validation -------------------------------------------------

const VV_CHECKS = ['run the tests', 'compare output to the spec', 'meet every success criterion']

export function VerificationValidationViz() {
  const phase = usePhase(6, 1300) // 0 idle · 1-3 checks · 4 evidence · 5 approved
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="vvviz">
        <div className="vv-row">
          <div className={`vv-card ${phase >= 1 && phase <= 3 ? 'on' : ''}`}>
            <h6>1 · verification — proves it to itself</h6>
            <ul>
              {VV_CHECKS.map((c, i) => (
                <li key={c} className={phase >= i + 1 ? 'done' : ''}>
                  {phase >= i + 1 ? '✓' : '·'} {c}
                </li>
              ))}
            </ul>
          </div>
          <div className={`vv-card ${phase >= 4 ? 'on' : ''}`}>
            <h6>2 · validation — proves it to you</h6>
            <ul>
              <li className={phase >= 4 ? 'done' : ''}>{phase >= 4 ? '✓' : '·'} screen recording of it working</li>
              <li className={phase >= 4 ? 'done' : ''}>{phase >= 4 ? '✓' : '·'} test report attached</li>
              <li className={phase >= 4 ? 'done' : ''}>{phase >= 4 ? '✓' : '·'} before / after</li>
            </ul>
          </div>
        </div>
        <span className={`vv-human ${phase >= 5 ? 'approved' : ''}`}>
          {phase >= 5 ? 'you: approved ✓ — without reading a line of code' : 'you: waiting on evidence…'}
        </span>
      </div>
      <p className="viz-caption">
        the difference between <strong>“it says it’s done”</strong> and <strong>“it’s done”</strong>
      </p>
    </div>
  )
}

// ---- Subagent fan-out -----------------------------------------------------------

const SA_JOBS = ['research the vendor', 'draft the summary', 'check the numbers']

export function SubagentViz() {
  const phase = usePhase(4, 1500) // 0 job · 1 busy · 2 done · 3 merged
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="saviz">
        <span className="sa-parent">
          {phase === 3 ? 'one clean answer, assembled ✓' : 'one big job'}
        </span>
        <span className="tiviz-arrow" style={{ lineHeight: 0.7 }}>↙ ↓ ↘</span>
        <div className="sa-workers">
          {SA_JOBS.map((j) => (
            <span key={j} className={`sa-worker ${phase === 1 ? 'busy' : phase >= 2 ? 'done' : ''}`}>
              {j} {phase >= 2 ? '✓' : ''}
              <span className="badge">own clean context</span>
            </span>
          ))}
        </div>
      </div>
      <p className="viz-caption">
        three workers, <strong>in parallel</strong>, none confused by the others&apos; clutter
      </p>
    </div>
  )
}

// ---- Reasoning: instant vs extended thinking ------------------------------------

export function ReasoningViz() {
  const phase = usePhase(6, 1200) // 0-1 instant answers · 2-4 thinking dots · 5 payoff
  const thinking = Math.min(Math.max(phase - 1, 0), 3)
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="vv-row">
        <div className={`vv-card ${phase <= 1 ? 'on' : ''}`}>
          <h6>instant answer</h6>
          <p className="rs-answer">“Looks fine to me.”</p>
          <p className="rs-meta bad-note">✗ missed that clause 7 conflicts with the renewal date</p>
        </div>
        <div className={`vv-card ${phase >= 2 ? 'on' : ''}`}>
          <h6>extended thinking</h6>
          <p className="rs-answer">
            {phase < 5 ? (
              <span className="rs-dots">{'thinking' + '.'.repeat(thinking + 1)}</span>
            ) : (
              '“Clause 7 conflicts with the renewal date — flag before signing.”'
            )}
          </p>
          <p className="rs-meta">{phase >= 5 ? '✓ caught it · more tokens, more time, better answer' : 'working through it privately…'}</p>
        </div>
      </div>
      <p className="viz-caption">
        hard problems deserve thinking time — that&apos;s what <strong>ultrathink</strong> buys you
      </p>
    </div>
  )
}

// ---- System prompt: the message stack --------------------------------------------

const STACK_LAYERS = [
  { name: 'system prompt', desc: 'its job description — set by the builder', cls: 'base' },
  { name: 'CLAUDE.md + memory', desc: 'how your team works — set by you, once', cls: 'mid' },
  { name: 'your message', desc: 'the ask — what you type', cls: 'top' },
]

export function PromptStackViz() {
  const phase = usePhase(5, 1300) // 0-2 layers stack · 3 all · 4 → model
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="psviz">
        <div className="ps-stack">
          {STACK_LAYERS.map((l, i) => (
            <motion.div
              key={l.name}
              className={`ps-layer ${l.cls}`}
              initial={false}
              animate={{ opacity: phase >= i ? 1 : 0.15, y: phase >= i ? 0 : -8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <strong>{l.name}</strong>
              <em>{l.desc}</em>
            </motion.div>
          ))}
        </div>
        <motion.span
          className="tiviz-arrow"
          animate={{ opacity: phase >= 4 ? 1 : 0.25 }}
        >
          →
        </motion.span>
        <motion.span
          className="ps-model"
          animate={{ scale: phase >= 4 ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          model reads
          <br />
          <em>all of it, every time</em>
        </motion.span>
      </div>
      <p className="viz-caption">
        your message rides on top of <strong>standing instructions</strong> — that&apos;s why Claude behaves consistently
      </p>
    </div>
  )
}

// ---- Retro / agent memory ----------------------------------------------------------

export function RetroMemoryViz() {
  const phase = usePhase(6, 1300) // 0-1 run1 stuck · 2 retro writes · 3-4 run2 sails · 5 done
  const run1Step = phase === 0 ? 2 : 3
  return (
    <div className="gg-viz" aria-hidden="true">
      <div className="rmviz">
        <div className="rm-run">
          <span className="rm-label">run 1</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`rm-step ${s < run1Step ? 'ok' : s === 3 && phase >= 1 ? 'stuck' : ''}`}
            >
              {s === 3 && phase >= 1 ? '✗' : s < run1Step ? '✓' : s}
            </span>
          ))}
          <em className="rm-note">{phase >= 1 ? 'stuck at step 3 — twice' : 'working…'}</em>
        </div>
        <motion.div
          className="rm-memory"
          animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.9 }}
          transition={{ duration: 0.4 }}
        >
          retro → memory: “step 3 needs the auth header set first”
        </motion.div>
        <div className="rm-run">
          <span className="rm-label">run 2</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`rm-step ${phase >= 3 && s <= (phase - 2) * 2 ? 'ok' : ''}`}>
              {phase >= 3 && s <= (phase - 2) * 2 ? '✓' : s}
            </span>
          ))}
          <em className="rm-note">{phase >= 5 ? 'sailed through — never stuck there again' : phase >= 3 ? 'memory loaded…' : 'queued'}</em>
        </div>
      </div>
      <p className="viz-caption">
        agents that review their own transcripts <strong>compound</strong> — the rest repeat themselves
      </p>
    </div>
  )
}

// ---- Prompt: vague vs engineered (interactive) ---------------------------------------

const PU_MODES = [
  {
    id: 'vague',
    tab: 'the vague ask',
    prompt: '“make the report better”',
    out: [
      '? better how — shorter? friendlier? more detail?',
      '~ rewrites everything in a generic “professional” voice',
      '~ touches the one table you wanted left alone',
    ],
    verdict: 'It has to guess. You get mush, then you iterate for an hour.',
    good: false,
  },
  {
    id: 'engineered',
    tab: 'the engineered ask',
    prompt:
      '“Tighten the executive summary to one page for the CFO. Keep the renewal-risk table untouched. Done = she can make the call in five minutes.”',
    out: [
      '✓ summary cut to one page, CFO framing',
      '✓ renewal-risk table preserved exactly',
      '✓ checks itself against your “done” before replying',
    ],
    verdict: 'Outcome + audience + what done looks like. One pass.',
    good: true,
  },
]

export function PromptUpgradeViz() {
  const [mode, setMode] = useState(0)
  const m = PU_MODES[mode]
  return (
    <div className="gg-viz">
      <div className="puviz">
        <div className="pu-tabs">
          {PU_MODES.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`pu-tab ${mode === i ? 'on' : ''}`}
              onClick={() => setMode(i)}
            >
              {t.tab}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="pu-prompt">{m.prompt}</p>
            <ul className="pu-out">
              {m.out.map((o) => (
                <li key={o} className={m.good ? 'good' : 'meh'}>
                  {o}
                </li>
              ))}
            </ul>
            <p className={`pu-verdict ${m.good ? 'good' : ''}`}>{m.verdict}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="viz-caption">
        tap both — same model, <strong>wildly different result</strong>; the difference is the ask
      </p>
    </div>
  )
}
