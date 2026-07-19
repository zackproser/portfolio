'use client'

import { useState } from 'react'
import { BpInteractive } from './bits'

// Interactive panels for Blueprint Deep Dive posts. All math runs
// client-side; these are teaching toys, not model calls.

/* ---------------- Attention hover demo ---------------- */

const ATTN_TOKENS = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired']

// Hand-tuned raw scores for a few interesting rows; softmaxed below.
const ATTN_LINKS: Record<number, Record<number, number>> = {
  7: { 1: 3.4, 10: 2.1, 5: 1.1, 7: 0.9 }, // "it" → animal
  10: { 7: 2.5, 1: 2.1, 9: 1.7, 10: 0.9 }, // "tired" → it/animal
  1: { 0: 1.6, 7: 1.5, 3: 1.1, 1: 1.2 }, // "animal"
  5: { 4: 1.7, 3: 1.9, 1: 0.9, 5: 1.2 }, // "street"
}

function attnWeights(i: number): number[] {
  const n = ATTN_TOKENS.length
  const scores: number[] = []
  for (let j = 0; j < n; j++) {
    let s = 0.15
    if (ATTN_LINKS[i] && ATTN_LINKS[i][j] != null) s = ATTN_LINKS[i][j]
    else {
      if (j === i) s = 1.3
      if (Math.abs(j - i) === 1) s = 0.9
    }
    scores.push(s)
  }
  const m = Math.max(...scores)
  const ex = scores.map((s) => Math.exp(s - m))
  const sum = ex.reduce((a, b) => a + b, 0)
  return ex.map((e) => e / sum)
}

export function AttentionDemo({ fig = 4 }: { fig?: number } = {}) {
  const [hov, setHov] = useState(7)
  const w = attnWeights(hov)
  const maxW = Math.max(...w)
  const hovTok = ATTN_TOKENS[hov]

  return (
    <BpInteractive
      label={
        <>
          INTERACTIVE — HOVER A TOKEN · SHOWING ATTENTION FROM ⟨{hovTok}⟩
        </>
      }
      footer={
        <>
          FIG. {fig} — ILLUSTRATIVE WEIGHTS FOR ONE ATTENTION HEAD, ROW ⟨{hovTok}⟩, HAND-DRAWN TO MATCH
          PUBLISHED VISUALIZATIONS. WEIGHTS SUM TO 1.00.
        </>
      }
    >
      <div className="bp-attn-row">
        {ATTN_TOKENS.map((text, j) => {
          const isHov = j === hov
          const h = Math.round((w[j] / maxW) * 86)
          return (
            <div key={j} className="bp-attn-col">
              <div className="bp-attn-pct">{(w[j] * 100).toFixed(0)}%</div>
              <div className="bp-attn-barwrap">
                <div
                  className={`bp-attn-bar${isHov ? ' bp-hot' : ''}`}
                  style={{ height: h, opacity: isHov ? 1 : 0.35 + 0.65 * (w[j] / maxW) }}
                />
              </div>
              <button
                type="button"
                className={`bp-attn-chip${isHov ? ' bp-hot' : ''}`}
                onMouseEnter={() => setHov(j)}
                onFocus={() => setHov(j)}
                onClick={() => setHov(j)}
              >
                {text}
              </button>
            </div>
          )
        })}
      </div>
    </BpInteractive>
  )
}

/* ---------------- Temperature demo ---------------- */

const TEMP_LOGITS: Array<[string, number]> = [
  ['soup', 2.2],
  ['dish', 1.7],
  ['broth', 1.2],
  ['stew', 0.9],
  ['car', -1.6],
]

export function TemperatureDemo({ fig = 8 }: { fig?: number } = {}) {
  const [temp, setTemp] = useState(1)
  const ex = TEMP_LOGITS.map(([, l]) => Math.exp(l / temp))
  const sum = ex.reduce((a, b) => a + b, 0)

  return (
    <BpInteractive
      label={
        <>
          INTERACTIVE — p(NEXT TOKEN | &quot;THE CHEF SEASONED THE ___&quot;) · T = {temp.toFixed(2)}
        </>
      }
      controls={
        <label className="bp-slider-label">
          T
          <input
            type="range"
            min={0.1}
            max={2.5}
            step={0.05}
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
          />
        </label>
      }
      footer={`FIG. ${fig} — SOFTMAX WITH TEMPERATURE. T→0: ARGMAX (DETERMINISTIC). T→∞: UNIFORM (NOISE). LOGITS FIXED.`}
    >
      <div className="bp-temp-bars">
        {TEMP_LOGITS.map(([word], i) => {
          const p = ex[i] / sum
          return (
            <div key={word} className="bp-temp-col">
              <div className="bp-attn-pct">{(p * 100).toFixed(1)}%</div>
              <div
                className={`bp-temp-bar${i === 0 ? ' bp-hot' : ''}`}
                style={{ height: Math.max(2, Math.round(p * 130)) }}
              />
            </div>
          )
        })}
      </div>
      <div className="bp-temp-words">
        {TEMP_LOGITS.map(([word]) => (
          <div key={word} className="bp-temp-word">
            &quot;{word}&quot;
          </div>
        ))}
      </div>
    </BpInteractive>
  )
}

/* ---------------- Positional encoding demo ---------------- */

export function PositionalEncodingDemo({ fig = 6 }: { fig?: number } = {}) {
  const [dim, setDim] = useState(2)
  const freq = 1 / Math.pow(10000, dim / 8)
  let sin = ''
  let cos = ''
  for (let p = 0; p <= 100; p++) {
    const x = 20 + p * 8.2
    const ys = 90 - Math.sin(p * freq * 2.2) * 62
    const yc = 90 - Math.cos(p * freq * 2.2) * 62
    sin += (p ? 'L' : 'M') + x.toFixed(1) + ' ' + ys.toFixed(1)
    cos += (p ? 'L' : 'M') + x.toFixed(1) + ' ' + yc.toFixed(1)
  }
  const lambda = Math.round((2 * Math.PI) / (freq * 2.2)) || 3

  return (
    <BpInteractive
      label={
        <>
          INTERACTIVE — DIMENSION PAIR i = {dim} · λ ≈ {lambda} TOKENS
        </>
      }
      controls={
        <label className="bp-slider-label">
          i
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={dim}
            onChange={(e) => setDim(parseInt(e.target.value, 10))}
            style={{ width: 180 }}
          />
        </label>
      }
      footer={`FIG. ${fig} — ONE FREQUENCY PAIR OF THE POSITIONAL BARCODE. SLIDE i: EARLY DIMS OSCILLATE FAST, LATE DIMS SLOWLY.`}
    >
      <svg viewBox="0 0 860 180" style={{ width: '100%', color: 'var(--bp-line)' }}>
        <g stroke="currentColor" strokeWidth={0.5} opacity={0.35}>
          <path d="M20 90 H840" fill="none" />
          <path d="M20 20 V160 M840 20 V160" fill="none" />
        </g>
        <path d={sin} fill="none" stroke="currentColor" strokeWidth={1.6} />
        <path d={cos} fill="none" stroke="var(--bp-accent)" strokeWidth={1.4} strokeDasharray="5 4" />
        <g className="bp-svg-t10" fill="currentColor">
          <text x={20} y={176}>
            pos = 0
          </text>
          <text x={780} y={176}>
            pos = 100
          </text>
          <text x={26} y={32}>
            +1
          </text>
          <text x={26} y={158}>
            −1
          </text>
        </g>
        <g className="bp-svg-t10">
          <text x={700} y={32} fill="currentColor">
            — sin (dim 2i)
          </text>
          <text x={700} y={48} fill="var(--bp-accent)">
            --- cos (dim 2i+1)
          </text>
        </g>
      </svg>
    </BpInteractive>
  )
}
