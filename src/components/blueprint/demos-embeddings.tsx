'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type Point = { word: string; x: number; y: number }

const POINTS: Point[] = [
  { word: 'king', x: 126, y: -42 },
  { word: 'queen', x: 114, y: -68 },
  { word: 'man', x: 88, y: -18 },
  { word: 'woman', x: 78, y: -54 },
  { word: 'dog', x: -82, y: -48 },
  { word: 'puppy', x: -103, y: -57 },
  { word: 'car', x: -56, y: 105 },
  { word: 'truck', x: -35, y: 119 },
]

function cosine(a: Point, b: Point) {
  return (a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y))
}

export function CosineSimilarityDemo() {
  const [selected, setSelected] = useState(0)
  const active = POINTS[selected]
  const ranked = useMemo(
    () => POINTS.map((point, index) => ({ point, index, score: cosine(active, point) })).sort((a, b) => b.score - a.score),
    [active],
  )
  const neighbor = ranked[1].point
  const originX = 235
  const originY = 155
  const scale = 0.9
  const ax = originX + active.x * scale
  const ay = originY + active.y * scale
  const nx = originX + neighbor.x * scale
  const ny = originY + neighbor.y * scale
  const angleA = Math.atan2(active.y, active.x)
  let angleB = Math.atan2(neighbor.y, neighbor.x)
  while (angleB - angleA > Math.PI) angleB -= Math.PI * 2
  while (angleB - angleA < -Math.PI) angleB += Math.PI * 2
  const angleDegrees = Math.abs(((angleB - angleA) * 180) / Math.PI)
  const arcRadius = 42
  const arcStartX = originX + Math.cos(angleA) * arcRadius
  const arcStartY = originY + Math.sin(angleA) * arcRadius
  const arcEndX = originX + Math.cos(angleB) * arcRadius
  const arcEndY = originY + Math.sin(angleB) * arcRadius

  return (
    <BpInteractive
      label={<>INTERACTIVE — SELECT A WORD · QUERY = ⟨{active.word}⟩</>}
      footer="FIG. 3 — COSINE COMPARES DIRECTION FROM THE ORIGIN. COORDINATES ARE A HAND-DRAWN 2D TEACHING EXAMPLE."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(180px, 1fr)', gap: 24 }}>
        <svg viewBox="0 0 470 310" style={{ width: '100%', color: 'var(--bp-line)' }}>
          <g fill="none" stroke="currentColor" strokeWidth={0.7} opacity={0.45}>
            <path d="M20 155 H450 M235 18 V292" />
            <path d="M20 75 H450 M20 235 H450 M115 18 V292 M355 18 V292" strokeDasharray="2 5" />
          </g>
          <g fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="4 4" className="bp-dash">
            <path d={`M${originX} ${originY} L${ax} ${ay}`} />
            <path d={`M${originX} ${originY} L${nx} ${ny}`} opacity={0.6} />
            <path
              d={`M${arcStartX} ${arcStartY} A${arcRadius} ${arcRadius} 0 0 ${angleB > angleA ? 1 : 0} ${arcEndX} ${arcEndY}`}
            />
          </g>
          <g className="bp-svg-t10" fill="currentColor" opacity={0.7}>
            <text x={430} y={149}>x₁</text>
            <text x={242} y={28}>x₂</text>
            <text x={245} y={172}>0</text>
            <text x={20} y={296}>θ({active.word}, {neighbor.word}) = {angleDegrees.toFixed(1)}°</text>
          </g>
          {POINTS.map((point, index) => {
            const x = originX + point.x * scale
            const y = originY + point.y * scale
            const hot = index === selected
            return (
              <g
                key={point.word}
                role="button"
                tabIndex={0}
                aria-label={`Select ${point.word}`}
                onMouseEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelected(index)
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={x} cy={y} r={hot ? 6 : 4} fill={hot ? 'var(--bp-accent)' : 'currentColor'} />
                <text x={x + 8} y={y - 7} className="bp-svg-t12" fill={hot ? 'var(--bp-accent)' : 'currentColor'}>
                  {point.word}
                </text>
              </g>
            )
          })}
        </svg>
        <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 12 }}>
          <div style={{ color: 'var(--bp-fg-muted)', marginBottom: 10 }}>RANK · COS(θ)</div>
          {ranked.map(({ point, index, score }, rank) => (
            <button
              type="button"
              key={point.word}
              className={`bp-attn-chip${index === selected ? ' bp-hot' : ''}`}
              onMouseEnter={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}
            >
              <span>{String(rank + 1).padStart(2, '0')} · {point.word}</span>
              <span>{score.toFixed(3)}</span>
            </button>
          ))}
        </div>
      </div>
    </BpInteractive>
  )
}

const SEARCH_STEPS = [
  { probes: 8, found: [0, 2], latency: 1 },
  { probes: 16, found: [0, 1, 2], latency: 2 },
  { probes: 32, found: [0, 1, 2, 4], latency: 4 },
  { probes: 64, found: [0, 1, 2, 3, 4], latency: 8 },
]

export function NearestNeighborDemo() {
  const [step, setStep] = useState(1)
  const state = SEARCH_STEPS[step]
  const recall = state.found.length / 5

  return (
    <BpInteractive
      label={<>INTERACTIVE — ANN SEARCH · {state.probes} CANDIDATES PROBED</>}
      controls={
        <label className="bp-slider-label">
          PROBES
          <input type="range" min={0} max={3} step={1} value={step} onChange={(e) => setStep(Number(e.target.value))} />
        </label>
      }
      footer="FIG. 7 — MORE SEARCH WORK RAISES RECALL AND COST. LATENCY UNITS AND RESULTS ARE ILLUSTRATIVE, NOT A BENCHMARK."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(54px, 1fr))', gap: 10 }}>
        {[0, 1, 2, 3, 4].map((neighbor) => {
          const found = state.found.includes(neighbor)
          return (
            <div key={neighbor} style={{ border: '1px solid var(--bp-line-soft)', padding: '18px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)' }}>TRUE #{neighbor + 1}</div>
              <div style={{ color: found ? 'var(--bp-accent)' : 'var(--bp-fg-subtle)', fontSize: 26, marginTop: 8 }}>
                {found ? '●' : '○'}
              </div>
              <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10 }}>{found ? 'FOUND' : 'MISSED'}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--bp-mono)', fontSize: 12, marginTop: 16 }}>
        <span>RECALL@5 = {(recall * 100).toFixed(0)}%</span>
        <span>RELATIVE SEARCH COST = {state.latency}×</span>
      </div>
    </BpInteractive>
  )
}
