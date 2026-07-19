'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type Pair = [string, string]
type MergeStep = { pair: Pair; count: number }

const TOY_CORPUS = [
  'low lower newest',
  'low lowest wider',
  'new newer newest',
  'wide wider widest',
  'token tokens tokenized',
  'merge merges merged',
]

const SAMPLE_LINE = 'newest token merge'
const INSPECTOR_RATE = 2.5
const TOKEN_COLORS = ['#ffd6a5', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff']

function wordsWithCounts(doubleNewest: boolean) {
  const counts = new Map<string, number>()
  for (const line of TOY_CORPUS) {
    for (const word of line.split(/\s+/)) counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  if (doubleNewest) counts.set('newest', (counts.get('newest') ?? 0) * 2)
  return [...counts].map(([word, frequency]) => ({ symbols: Array.from(`▁${word}`), frequency }))
}

function pairKey(a: string, b: string) {
  return `${a}\u0000${b}`
}

function mergeSymbols(symbols: string[], pair: Pair) {
  const next: string[] = []
  for (let i = 0; i < symbols.length; i += 1) {
    if (i < symbols.length - 1 && symbols[i] === pair[0] && symbols[i + 1] === pair[1]) {
      next.push(symbols[i] + symbols[i + 1])
      i += 1
    } else {
      next.push(symbols[i])
    }
  }
  return next
}

function trainToyBpe(doubleNewest: boolean, limit = 16): MergeStep[] {
  let words = wordsWithCounts(doubleNewest)
  const steps: MergeStep[] = []

  for (let step = 0; step < limit; step += 1) {
    const counts = new Map<string, { pair: Pair; count: number }>()
    for (const { symbols, frequency } of words) {
      for (let i = 0; i < symbols.length - 1; i += 1) {
        const pair: Pair = [symbols[i], symbols[i + 1]]
        const key = pairKey(...pair)
        const prior = counts.get(key)
        counts.set(key, { pair, count: (prior?.count ?? 0) + frequency })
      }
    }
    const winner = [...counts.values()].sort((a, b) => b.count - a.count || pairKey(...a.pair).localeCompare(pairKey(...b.pair)))[0]
    if (!winner) break
    steps.push(winner)
    words = words.map(({ symbols, frequency }) => ({ symbols: mergeSymbols(symbols, winner.pair), frequency }))
  }
  return steps
}

function encodeWithMerges(text: string, merges: MergeStep[]) {
  const encoded: string[] = []
  for (const word of text.split(/\s+/)) {
    let symbols = Array.from(`▁${word}`)
    for (const { pair } of merges) symbols = mergeSymbols(symbols, pair)
    encoded.push(...symbols)
  }
  return encoded
}

function visibleToken(token: string) {
  return token.replace(/^▁/, '␠')
}

function vocabularySize(merges: MergeStep[]) {
  const base = new Set(Array.from(TOY_CORPUS.join('').replace(/ /g, '▁')))
  return base.size + merges.length
}

export function BpeMergeBench({ fig = 3 }: { fig?: number } = {}) {
  const [step, setStep] = useState(6)
  const [doubleNewest, setDoubleNewest] = useState(false)
  const allSteps = useMemo(() => trainToyBpe(doubleNewest), [doubleNewest])
  const applied = allSteps.slice(0, step)
  const tokens = encodeWithMerges(SAMPLE_LINE, applied)

  return (
    <BpInteractive
      label={<>INTERACTIVE — BPE MERGE BENCH · STEP {step}/{allSteps.length}</>}
      controls={
        <label className="bp-slider-label">
          STEP
          <input
            type="range"
            min={0}
            max={allSteps.length}
            step={1}
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
          />
        </label>
      }
      footer={`FIG. ${fig} — REAL BPE PAIR COUNTING OVER A SIX-LINE TOY CORPUS. TIES BREAK LEXICOGRAPHICALLY. THE CORPUS AND RESULTING VOCABULARY ARE ILLUSTRATIVE.`}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <button type="button" className={`bp-attn-chip${doubleNewest ? ' bp-hot' : ''}`} onClick={() => setDoubleNewest((value) => !value)} aria-pressed={doubleNewest}>
          {doubleNewest ? '2× NEWEST FREQUENCY' : '1× NEWEST FREQUENCY'}
        </button>
        <span style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, alignSelf: 'center', color: 'var(--bp-fg-muted)' }}>
          VOCABULARY SIZE = {vocabularySize(applied)}
        </span>
      </div>
      <div className="bp-scroll-x">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: 18, minWidth: 560 }}>
          <div>
            <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>TOY CORPUS</div>
            {TOY_CORPUS.map((line) => <div key={line} style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, marginBottom: 5 }}>{line}</div>)}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>ORDERED MERGE TABLE</div>
            {applied.length === 0 ? <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11 }}>NO MERGES APPLIED</div> : applied.map(({ pair, count }, index) => (
              <div key={`${pairKey(...pair)}-${index}`} style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, marginBottom: 5 }}>
                {String(index + 1).padStart(2, '0')} · {visibleToken(pair[0])} + {visibleToken(pair[1])} → {visibleToken(pair[0] + pair[1])} · f={count}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--bp-line-soft)', marginTop: 16, paddingTop: 14 }}>
        <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>LIVE ENCODE · {SAMPLE_LINE}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tokens.map((token, index) => (
            <span key={`${token}-${index}`} className="bp-attn-chip" style={{ background: TOKEN_COLORS[index % TOKEN_COLORS.length], color: '#111' }}>
              {visibleToken(token)}
            </span>
          ))}
        </div>
      </div>
    </BpInteractive>
  )
}

const INSPECTOR_MERGES = trainToyBpe(false, 20)
const INSPECTOR_EXAMPLES = [
  { label: 'ENGLISH', text: 'newest tokens merge wider' },
  { label: 'CODE', text: 'const tokenCount = 2048;' },
  { label: 'EMOJI + CJK', text: '🍓を数える 漢字 token' },
  { label: 'DIGITS', text: '12345 + 678 = 13023' },
]

export function TokenBoundaryInspector({ fig = 6 }: { fig?: number } = {}) {
  const [selected, setSelected] = useState(0)
  const example = INSPECTOR_EXAMPLES[selected]
  const tokens = encodeWithMerges(example.text, INSPECTOR_MERGES)
  const cost = tokens.length * INSPECTOR_RATE / 1_000_000

  return (
    <BpInteractive
      label={<>INTERACTIVE — TOKEN BOUNDARY INSPECTOR · {example.label}</>}
      footer={`FIG. ${fig} — INSTRUCTIONAL TOKENIZER USING A FIXED TOY MERGE TABLE, NOT A SPECIFIC COMMERCIAL MODEL. COST USES AN ILLUSTRATIVE $${INSPECTOR_RATE.toFixed(2)}/1M-TOKEN RATE.`}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
        {INSPECTOR_EXAMPLES.map((item, index) => (
          <button
            type="button"
            key={item.label}
            className={`bp-attn-chip${index === selected ? ' bp-hot' : ''}`}
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="bp-scroll-x">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, minWidth: 360, padding: '8px 0 12px' }}>
          {tokens.map((token, index) => (
            <span key={`${token}-${index}`} className="bp-attn-chip" style={{ background: TOKEN_COLORS[index % TOKEN_COLORS.length], color: '#111' }}>
              {visibleToken(token)}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, borderTop: '1px solid var(--bp-line-soft)', paddingTop: 12, fontFamily: 'var(--bp-mono)', fontSize: 11 }}>
        <span>TOKENS = {tokens.length}</span>
        <span>INPUT COST ≈ ${cost.toFixed(6)} @ ${INSPECTOR_RATE.toFixed(2)}/1M</span>
      </div>
    </BpInteractive>
  )
}
