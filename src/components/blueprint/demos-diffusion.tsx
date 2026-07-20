'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type Point = readonly [number, number]
type Schedule = 'linear' | 'cosine'
type Solver = 'euler' | 'heun'

// Fixed coordinates and fixed pseudo-Gaussian offsets. Every control reuses them.
const CLEAN: Point[] = Array.from({ length: 96 }, (_, i) => {
  const arm = i % 2
  const u = Math.floor(i / 2) / 47
  const angle = Math.PI * (1.08 * u + arm)
  return [(u - 0.5) * 1.62 + 0.34 * Math.cos(angle), (arm ? -1 : 1) * 0.22 + 0.48 * Math.sin(angle)] as Point
})
const OFFSETS: Point[] = CLEAN.map((_, i) => {
  const a = Math.sin((i + 1) * 12.9898) * 43758.5453
  const b = Math.sin((i + 1) * 78.233) * 19341.1717
  return [((a - Math.floor(a)) * 2 - 1) * 1.45, ((b - Math.floor(b)) * 2 - 1) * 1.45] as Point
})

function noiseLevel(t: number, schedule: Schedule) {
  return schedule === 'linear' ? t : Math.sin((Math.PI / 2) * t) ** 2
}

function makeCloud(t: number, schedule: Schedule, guidance: number, steps: number, solver: Solver): Point[] {
  const n = noiseLevel(t, schedule)
  const discretization = solver === 'euler' ? 0.2 / steps : 0.065 / steps
  const pull = Math.min(1.24, 0.82 + guidance * 0.035)
  return CLEAN.map(([x, y], i) => {
    const [nx, ny] = OFFSETS[i]
    const guidedX = x * pull + (i % 2 ? 0.022 : -0.022) * guidance
    const guidedY = y * pull
    const wobble = discretization * Math.sin((i + 3) * 2.17 + t * 8)
    return [guidedX * (1 - n) + nx * n + wobble, guidedY * (1 - n) + ny * n - wobble] as Point
  })
}

function Cloud({ points }: { points: Point[] }) {
  return <svg viewBox="0 0 520 320" role="img" aria-label="Two-dimensional teaching point cloud">
    <rect x={1} y={1} width={518} height={318} fill="none" stroke="currentColor" opacity={0.25} />
    <path d="M260 18 V302 M24 160 H496" fill="none" stroke="currentColor" opacity={0.16} />
    <g fill="var(--bp-accent)">{points.map(([x, y], i) => <circle key={i} cx={260 + x * 150} cy={160 - y * 150} r={2.7} opacity={0.76} />)}</g>
    <g className="bp-svg-t10" fill="currentColor"><text x={468} y={153}>x₁</text><text x={268} y={30}>x₂</text></g>
  </svg>
}

export function NoiseReverseDemo({ fig = 3 }: { fig?: number } = {}) {
  const [timestep, setTimestep] = useState(58)
  const [schedule, setSchedule] = useState<Schedule>('cosine')
  const [guidance, setGuidance] = useState(5)
  const [steps, setSteps] = useState(24)
  const [solver, setSolver] = useState<Solver>('euler')
  const cloud = useMemo(() => makeCloud(timestep / 100, schedule, guidance, steps, solver), [timestep, schedule, guidance, steps, solver])
  return <BpInteractive
    label={<>INTERACTIVE — ONE FIXED 2D DISTRIBUTION · t={timestep}/100</>}
    footer={`FIG. ${fig} — ILLUSTRATIVE 2D TEACHING MODEL, NOT A REAL IMAGE MODEL OR MODEL OUTPUT. FIXED POINTS AND OFFSETS; CONTROLS APPLY PREPARED TRANSFORMATIONS.`}
  >
    <div className="bp-scroll-x"><div style={{ minWidth: 720, display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) 240px', gap: 18 }}>
      <Cloud points={cloud} />
      <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11 }}>
        <label className="bp-slider-label">TIMESTEP · {timestep}<input type="range" min={0} max={100} value={timestep} onChange={(e) => setTimestep(Number(e.target.value))} /></label>
        <label className="bp-slider-label">GUIDANCE · {guidance.toFixed(1)}<input type="range" min={0} max={12} step={0.5} value={guidance} onChange={(e) => setGuidance(Number(e.target.value))} /></label>
        <label className="bp-slider-label">STEPS · {steps}<input type="range" min={4} max={64} step={4} value={steps} onChange={(e) => setSteps(Number(e.target.value))} /></label>
        <div style={{ marginTop: 12 }}>NOISE SCHEDULE</div>
        {(['linear', 'cosine'] as Schedule[]).map((v) => <button type="button" key={v} className={`bp-attn-chip${schedule === v ? ' bp-hot' : ''}`} aria-pressed={schedule === v} onClick={() => setSchedule(v)}>{v.toUpperCase()}</button>)}
        <div style={{ marginTop: 12 }}>PREPARED SOLVER</div>
        {(['euler', 'heun'] as Solver[]).map((v) => <button type="button" key={v} className={`bp-attn-chip${solver === v ? ' bp-hot' : ''}`} aria-pressed={solver === v} onClick={() => setSolver(v)}>{v.toUpperCase()}</button>)}
        <div style={{ marginTop: 14, opacity: 0.72 }}>RIGHT = MORE CORRUPTION<br />GUIDANCE TIGHTENS / SHIFTS MODES<br />FEWER STEPS INCREASE PATH ERROR</div>
      </div>
    </div></div>
  </BpInteractive>
}
