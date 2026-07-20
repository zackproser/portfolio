'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type Scorer = 'exact' | 'tests' | 'pairwise' | 'rubric'
type ModelKey = 'A' | 'B' | 'C'

const MODELS: ModelKey[] = ['A', 'B', 'C']
const BASE: Record<Scorer, Record<ModelKey, number[]>> = {
  exact: { A: [92, 88, 46], B: [82, 78, 76], C: [74, 72, 86] },
  tests: { A: [58, 44, 28], B: [52, 62, 58], C: [40, 52, 72] },
  pairwise: { A: [72, 54, 42], B: [64, 68, 60], C: [50, 58, 78] },
  rubric: { A: [82, 70, 48], B: [72, 74, 70], C: [60, 66, 80] },
}

function seededJitter(model: ModelKey, noise: number, scorer: Scorer) {
  const sign = ({ A: 1, B: -0.35, C: -0.8 } as const)[model]
  const scale = scorer === 'pairwise' || scorer === 'rubric' ? 1 : 0.35
  return sign * noise * scale
}

export function ScoringDemo({ fig = 4 }: { fig?: number } = {}) {
  const [scorer, setScorer] = useState<Scorer>('exact')
  const [weights, setWeights] = useState([50, 30, 20])
  const [noise, setNoise] = useState(6)
  const [sampleSize, setSampleSize] = useState(120)
  const [contaminated, setContaminated] = useState(false)

  const ranking = useMemo(() => MODELS.map((model) => {
    const values = BASE[scorer][model]
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let score = values.reduce((sum, value, i) => sum + value * weights[i], 0) / totalWeight
    score += seededJitter(model, noise, scorer)
    if (contaminated) score += ({ A: 8, B: 2, C: 0 } as const)[model]
    const p = Math.max(0.05, Math.min(0.95, score / 100))
    const sampling = 1.96 * Math.sqrt((p * (1 - p)) / sampleSize) * 100
    const judge = (scorer === 'pairwise' || scorer === 'rubric') ? noise * 0.28 : noise * 0.08
    return { model, score, ci: sampling + judge }
  }).sort((a, b) => b.score - a.score), [scorer, weights, noise, sampleSize, contaminated])

  return <BpInteractive
    label={<>INTERACTIVE — ONE PREPARED OUTPUT SET · {scorer.toUpperCase()}</>}
    footer={`FIG. ${fig} — ILLUSTRATIVE, NOT A MODEL BENCHMARK. FIXED LOCAL VALUES; INTERVALS USE A TEACHING NORMAL APPROXIMATION PLUS A DECLARED JUDGE-NOISE TERM.`}
  >
    <div className="bp-scroll-x"><div style={{ minWidth: 760, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 22 }}>
      <div>
        <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, marginBottom: 10 }}>RANKING · SCORE ± 95% INTERVAL</div>
        {ranking.map((row, index) => <div key={row.model} style={{ display: 'grid', gridTemplateColumns: '44px 88px 1fr', gap: 10, alignItems: 'center', margin: '11px 0' }}>
          <strong>{index + 1}. M{row.model}</strong><span>{row.score.toFixed(1)} ± {row.ci.toFixed(1)}</span>
          <div style={{ height: 12, border: '1px solid currentColor', position: 'relative' }}><span style={{ display: 'block', width: `${row.score}%`, height: '100%', background: index === 0 ? 'var(--bp-accent)' : 'currentColor', opacity: index === 0 ? 0.8 : 0.28 }} /></div>
        </div>)}
        <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, marginTop: 20 }}>TASK WEIGHTS · KNOWLEDGE / CODE / SERVICE</div>
        {weights.map((weight, i) => <label key={i} className="bp-slider-label">{['KNOWLEDGE', 'CODE', 'SERVICE'][i]} · {weight}<input type="range" min={5} max={80} value={weight} onChange={(e) => setWeights(weights.map((v, j) => j === i ? Number(e.target.value) : v))} /></label>)}
      </div>
      <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11 }}>
        <div>SCORER</div>
        {(['exact', 'tests', 'pairwise', 'rubric'] as Scorer[]).map((value) => <button type="button" key={value} className={`bp-attn-chip${scorer === value ? ' bp-hot' : ''}`} aria-pressed={scorer === value} onClick={() => setScorer(value)}>{value.toUpperCase()}</button>)}
        <label className="bp-slider-label">JUDGE NOISE · {noise}<input type="range" min={0} max={16} value={noise} onChange={(e) => setNoise(Number(e.target.value))} /></label>
        <label className="bp-slider-label">SAMPLE SIZE · {sampleSize}<input type="range" min={30} max={480} step={30} value={sampleSize} onChange={(e) => setSampleSize(Number(e.target.value))} /></label>
        <button type="button" className={`bp-attn-chip${contaminated ? ' bp-hot' : ''}`} aria-pressed={contaminated} onClick={() => setContaminated((v) => !v)}>CONTAMINATED SUBSET · {contaminated ? 'ON' : 'OFF'}</button>
        <p style={{ opacity: 0.72, lineHeight: 1.55 }}>Change the scorer or task mix. Reduce the sample to widen intervals. The contaminated toggle gives Model A an artificial lift.</p>
      </div>
    </div></div>
  </BpInteractive>
}
