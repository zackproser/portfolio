'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'

// ────────────────────────────────────────────────────────────────────────
// Interactive terminal simulator for the GHX glossary's "Terminal" entry.
// Guides a first-timer through `ls` (see your files) and then `claude`
// (watch Claude Code work on those same files). Everything is simulated —
// nothing touches the visitor's machine.
// ────────────────────────────────────────────────────────────────────────

interface Line {
  kind: 'cmd' | 'out' | 'claude' | 'result' | 'hint-inline'
  text: string
}

const FILES = [
  'Contracts/',
  'price-file-aug.csv',
  'meeting-notes.md',
  'vendor-list.csv',
  'logo-draft.png',
]

const CLAUDE_SCRIPT: Array<{ text: string; delay: number; kind: Line['kind'] }> = [
  { text: '✻ Claude Code — connected to this folder', delay: 500, kind: 'claude' },
  { text: '> summarize meeting-notes.md and draft the follow-up emails', delay: 1300, kind: 'cmd' },
  { text: '● Read meeting-notes.md (84 lines)', delay: 1100, kind: 'claude' },
  { text: '● Read vendor-list.csv — matched 3 attendees to vendors', delay: 900, kind: 'claude' },
  { text: '✓ Wrote follow-ups.md — 3 drafts ready for your review', delay: 1200, kind: 'claude' },
  { text: 'Here’s where things stand:', delay: 1100, kind: 'result' },
  { text: '· Budget approved for the Q3 pilot — legal wants clause 7 reworded first', delay: 700, kind: 'result' },
  { text: '· Deadline: revised SOW to Meditrust by Friday', delay: 700, kind: 'result' },
  { text: '· Drafted: Meditrust (SOW), CarePoint (pricing), Stillwater (demo invite)', delay: 700, kind: 'result' },
]

export default function TerminalSim() {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<'ls' | 'claude' | 'running' | 'done'>('ls')
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const timeouts = useRef<number[]>([])

  useEffect(() => () => timeouts.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const push = (...ls: Line[]) => setLines((prev) => [...prev, ...ls])

  function runClaude() {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setStage('running')
    let t = 0
    CLAUDE_SCRIPT.forEach((step, i) => {
      t += step.delay
      timeouts.current.push(
        window.setTimeout(() => {
          push({ kind: step.kind, text: step.text })
          if (i === CLAUDE_SCRIPT.length - 1) {
            setStage('done')
            track('ghx_terminal', { step: 'done' })
          }
        }, t),
      )
    })
  }

  function handleCommand(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    push({ kind: 'cmd', text: `$ ${cmd}` })
    const word = cmd.split(/\s+/)[0].toLowerCase()

    if (word === 'ls') {
      push({ kind: 'out', text: FILES.join('   ') })
      if (stage === 'ls') {
        setStage('claude')
        track('ghx_terminal', { step: 'ls' })
      }
    } else if (word === 'claude') {
      runClaude()
    } else if (word === 'pwd') {
      push({ kind: 'out', text: '/Users/you/q3-review' })
    } else if (word === 'clear') {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
      setLines([])
      if (stage === 'running' || stage === 'done') {
        setStage('claude')
      }
    } else if (word === 'cd') {
      push({ kind: 'out', text: 'sure — though once you run claude, it does the navigating for you.' })
    } else if (word === 'help') {
      push({ kind: 'out', text: 'try: ls · pwd · claude · clear' })
    } else {
      push({ kind: 'out', text: `command not found: ${word} — try “ls”` })
    }
  }

  const hint =
    stage === 'ls'
      ? { cmd: 'ls', why: 'list what’s in this folder' }
      : stage === 'claude'
        ? { cmd: 'claude', why: 'start Claude Code right here' }
        : null

  return (
    <div className="gg-term" onClick={() => inputRef.current?.focus()}>
      <div className="gg-term-chrome">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="label">you@your-mac — q3-review</span>
      </div>
      <div className="gg-term-body" ref={bodyRef}>
        <div className="gg-term-line out">
          This is a terminal. It can&apos;t hurt you. Type the highlighted command and press
          Enter.
        </div>
        {lines.map((l, i) => (
          <div key={i} className={`gg-term-line ${l.kind}`}>
            {l.text}
          </div>
        ))}
        {stage !== 'running' && (
          <div className="gg-term-prompt">
            <span>$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(input)
                  setInput('')
                }
              }}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              aria-label="Terminal input — try typing ls"
            />
          </div>
        )}
        {hint && (
          <button
            type="button"
            className="gg-term-hint"
            onClick={(e) => {
              e.stopPropagation()
              handleCommand(hint.cmd)
              setInput('')
              inputRef.current?.focus()
            }}
          >
            type <code>{hint.cmd}</code> — {hint.why} (or tap this)
          </button>
        )}
        {stage === 'done' && (
          <div className="gg-term-line moral">
            Count the apps you never opened: no doc, no spreadsheet, no PDF viewer, no
            copy-paste between them. You asked once, in plain words, in the place where the
            files live — and the finished work appeared. Effective AI use is{' '}
            <strong>compression</strong>: the distance between your ask and the outcome
            collapses to a single sentence.
          </div>
        )}
      </div>
    </div>
  )
}
