'use client'

import { useEffect, useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type Policy = 'static' | 'continuous'
type Phase = 'future' | 'queue' | 'prefill' | 'decode' | 'done'

interface SimRequest {
  id: string
  arrival: number
  prompt: number
  output: number
  phase: Phase
  prefilled: number
  decoded: number
  blocks: number
  firstToken?: number
  completed?: number
  evictions: number
}

interface Frame {
  tick: number
  requests: SimRequest[]
  usedBlocks: number
  totalBlocks: number
  evictions: number
}

const ARRIVALS = [0, 1, 2, 4, 6, 7, 10, 13]
const PROMPT_FACTORS = [1, 0.5, 1.5, 0.75, 1.25, 0.625, 1.75, 0.875]
const OUTPUT_FACTORS = [1, 0.6, 1.4, 0.8, 1.2, 0.7, 1.5, 0.9]
const TICK_SECONDS = 0.02

function percentile(values: number[], p: number) {
  if (!values.length) return 0
  const ordered = [...values].sort((a, b) => a - b)
  return ordered[Math.max(0, Math.ceil((p / 100) * ordered.length) - 1)]
}

function cloneRequests(requests: SimRequest[]) {
  return requests.map((request) => ({ ...request }))
}

function runSimulation(promptLength: number, outputLength: number, memoryMiB: number, blockSize: number, policy: Policy, replicas: number) {
  const requests: SimRequest[] = ARRIVALS.map((arrival, index) => ({
    id: `R${index + 1}`,
    arrival,
    prompt: Math.max(32, Math.round((promptLength * PROMPT_FACTORS[index]) / 16) * 16),
    output: Math.max(4, Math.round(outputLength * OUTPUT_FACTORS[index])),
    phase: 'future',
    prefilled: 0,
    decoded: 0,
    blocks: 0,
    evictions: 0,
  }))
  // Teaching assumption: one cached token occupies 64 KiB across all layers.
  const totalBlocks = Math.max(1, Math.floor((memoryMiB * 16) / blockSize))
  const slots = replicas * 3
  const frames: Frame[] = []
  let evictions = 0

  for (let tick = 0; tick < 800; tick += 1) {
    requests.forEach((request) => {
      if (request.phase === 'future' && request.arrival <= tick) request.phase = 'queue'
    })

    const active = () => requests.filter((request) => request.phase === 'prefill' || request.phase === 'decode')
    const used = () => active().reduce((sum, request) => sum + request.blocks, 0)
    const canOpenStaticBatch = policy === 'continuous' || active().length === 0

    if (canOpenStaticBatch) {
      const waiting = requests.filter((request) => request.phase === 'queue').sort((a, b) => a.arrival - b.arrival)
      for (const request of waiting) {
        if (active().length >= slots) break
        const promptBlocks = Math.ceil(request.prompt / blockSize)
        if (used() + promptBlocks <= totalBlocks) {
          request.phase = 'prefill'
          request.blocks = promptBlocks
          continue
        }

        // Continuous schedulers may preempt one resident sequence and later recompute it.
        if (policy === 'continuous' && tick - request.arrival >= 4) {
          const victim = active()
            .filter((candidate) => candidate.id !== request.id)
            .sort((a, b) => b.blocks - a.blocks || b.decoded - a.decoded)[0]
          if (victim && used() - victim.blocks + promptBlocks <= totalBlocks) {
            victim.phase = 'queue'
            victim.prefilled = 0
            victim.decoded = 0
            victim.blocks = 0
            victim.evictions += 1
            evictions += 1
            request.phase = 'prefill'
            request.blocks = promptBlocks
          }
        }
      }
    }

    const prefills = requests.filter((request) => request.phase === 'prefill')
    prefills.forEach((request) => {
      request.prefilled = Math.min(request.prompt, request.prefilled + 256)
      if (request.prefilled >= request.prompt) {
        request.phase = 'decode'
        request.firstToken ??= tick + 1
      }
    })

    const decodeAllowed = prefills.length === 0 || policy === 'continuous' ? tick % (prefills.length ? 2 : 1) === 0 : false
    if (decodeAllowed) {
      requests.filter((request) => request.phase === 'decode').forEach((request) => {
        const nextSequenceLength = request.prompt + request.decoded + 1
        const neededBlocks = Math.ceil(nextSequenceLength / blockSize)
        if (neededBlocks > request.blocks && used() < totalBlocks) request.blocks = neededBlocks
        if (neededBlocks <= request.blocks) request.decoded += 1
        if (request.decoded >= request.output) {
          request.phase = 'done'
          request.completed = tick + 1
          request.blocks = 0
        }
      })
    }

    frames.push({ tick, requests: cloneRequests(requests), usedBlocks: used(), totalBlocks, evictions })
    if (requests.every((request) => request.phase === 'done')) break
  }

  const final = frames[frames.length - 1]
  const completed = final.requests.filter((request) => request.completed !== undefined)
  const ttft = completed.map((request) => ((request.firstToken ?? final.tick) - request.arrival) * TICK_SECONDS * 1000)
  const outputTokens = completed.reduce((sum, request) => sum + request.output, 0)
  const durationSeconds = Math.max(TICK_SECONDS, (final.tick + 1) * TICK_SECONDS)

  return {
    frames,
    p50: percentile(ttft, 50),
    p95: percentile(ttft, 95),
    tokensPerSecond: outputTokens / durationSeconds,
  }
}

function Control({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="bp-slider-label">
      {label} {value}{unit}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export function RequestSchedulerDemo({ fig = 4 }: { fig?: number } = {}) {
  const [promptLength, setPromptLength] = useState(512)
  const [outputLength, setOutputLength] = useState(24)
  const [memoryMiB, setMemoryMiB] = useState(256)
  const [blockSize, setBlockSize] = useState(16)
  const [policy, setPolicy] = useState<Policy>('continuous')
  const [replicas, setReplicas] = useState(1)
  const [frameIndex, setFrameIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const result = useMemo(
    () => runSimulation(promptLength, outputLength, memoryMiB, blockSize, policy, replicas),
    [promptLength, outputLength, memoryMiB, blockSize, policy, replicas],
  )
  const frame = result.frames[Math.min(frameIndex, result.frames.length - 1)]

  useEffect(() => {
    setFrameIndex(0)
    setPlaying(false)
  }, [result])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current >= result.frames.length - 1) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 100)
    return () => window.clearInterval(timer)
  }, [playing, result.frames.length])

  const columns: Array<{ phase: Exclude<Phase, 'future' | 'done'>; label: string }> = [
    { phase: 'queue', label: 'QUEUE' },
    { phase: 'prefill', label: 'PREFILL' },
    { phase: 'decode', label: 'DECODE' },
  ]

  return (
    <BpInteractive
      label={<>INTERACTIVE — REQUEST SCHEDULER · T+{String(frame.tick).padStart(3, '0')} TICKS</>}
      controls={<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" className={`bp-attn-chip${playing ? ' bp-hot' : ''}`} onClick={() => setPlaying((value) => !value)}>{playing ? 'PAUSE' : 'RUN'}</button>
        <button type="button" className="bp-attn-chip" onClick={() => setFrameIndex((value) => Math.min(value + 1, result.frames.length - 1))}>STEP</button>
        <button type="button" className="bp-attn-chip" onClick={() => { setPlaying(false); setFrameIndex(0) }}>RESET</button>
      </div>}
      footer={`FIG. ${fig} — ILLUSTRATIVE DETERMINISTIC SCHEDULER, NOT A GPU BENCHMARK. FIXED ARRIVALS; 20 MS TICKS; 64 KIB OF KV PER TOKEN; PREFILL PROCESSES 256 TOKENS/TICK.`}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--bp-line-soft)' }}>
        <Control label="PROMPT" value={promptLength} min={128} max={1024} step={128} unit=" TOK" onChange={setPromptLength} />
        <Control label="OUTPUT" value={outputLength} min={8} max={48} step={4} unit=" TOK" onChange={setOutputLength} />
        <Control label="KV BUDGET" value={memoryMiB} min={64} max={512} step={64} unit=" MIB" onChange={setMemoryMiB} />
        <label className="bp-slider-label">BLOCK {blockSize} TOK
          <select value={blockSize} onChange={(event) => setBlockSize(Number(event.target.value))} style={{ fontFamily: 'var(--bp-mono)', marginLeft: 8 }}>
            <option value={8}>8</option><option value={16}>16</option><option value={32}>32</option><option value={64}>64</option>
          </select>
        </label>
        <label className="bp-slider-label">POLICY
          <select value={policy} onChange={(event) => setPolicy(event.target.value as Policy)} style={{ fontFamily: 'var(--bp-mono)', marginLeft: 8 }}>
            <option value="continuous">CONTINUOUS</option><option value="static">STATIC</option>
          </select>
        </label>
        <Control label="REPLICAS" value={replicas} min={1} max={3} step={1} unit="" onChange={setReplicas} />
      </div>

      <div className="bp-scroll-x" style={{ paddingTop: 14 }}>
        <div style={{ minWidth: 680 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 160px', gap: 10 }}>
            {columns.map((column) => (
              <div key={column.phase} style={{ border: '1px solid var(--bp-line-soft)', minHeight: 142, padding: 10 }}>
                <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>{column.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {frame.requests.filter((request) => request.phase === column.phase).map((request) => (
                    <span key={request.id} className="bp-attn-chip" title={`${request.prompt} prompt tokens · ${request.output} output tokens · ${request.blocks} blocks`}>
                      {request.id} · {column.phase === 'prefill' ? `${request.prefilled}/${request.prompt}` : column.phase === 'decode' ? `${request.decoded}/${request.output}` : `A${request.arrival}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ border: '1px solid var(--bp-line-soft)', minHeight: 142, padding: 10, fontFamily: 'var(--bp-mono)', fontSize: 11, lineHeight: 1.8 }}>
              <div style={{ color: 'var(--bp-fg-muted)', fontSize: 10 }}>KV PAGES</div>
              <div>{frame.usedBlocks} / {frame.totalBlocks} BLOCKS</div>
              <div>{(frame.usedBlocks * blockSize * 64 / 1024).toFixed(1)} / {memoryMiB} MIB</div>
              <div style={{ color: frame.evictions ? 'var(--bp-accent)' : 'inherit' }}>{frame.evictions} EVICTIONS</div>
              <div>{frame.requests.filter((request) => request.phase === 'done').length} / {frame.requests.length} DONE</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginTop: 14, fontFamily: 'var(--bp-mono)' }}>
        {[
          ['P50 TTFT', `${result.p50.toFixed(0)} MS`],
          ['P95 TTFT', `${result.p95.toFixed(0)} MS`],
          ['OUTPUT RATE', `${result.tokensPerSecond.toFixed(1)} TOK/S`],
        ].map(([label, value]) => <div key={label} style={{ borderTop: '2px solid var(--bp-accent)', paddingTop: 8 }}><div style={{ fontSize: 10, color: 'var(--bp-fg-muted)' }}>{label}</div><div style={{ fontSize: 17 }}>{value}</div></div>)}
      </div>
    </BpInteractive>
  )
}

export function KvLedgerDemo({ fig = 3 }: { fig?: number } = {}) {
  const [layers, setLayers] = useState(32)
  const [kvHeads, setKvHeads] = useState(8)
  const [headDim, setHeadDim] = useState(128)
  const [precision, setPrecision] = useState(2)
  const [sequence, setSequence] = useState(4096)
  const [concurrency, setConcurrency] = useState(16)
  const bytesPerToken = 2 * layers * kvHeads * headDim * precision
  const bytesPerRequest = bytesPerToken * sequence
  const totalBytes = bytesPerRequest * concurrency
  const gib = (bytes: number) => bytes / 2 ** 30

  return (
    <BpInteractive
      label={<>INTERACTIVE — KV CACHE LEDGER · BINARY UNITS</>}
      footer={`FIG. ${fig} — CACHE CAPACITY FROM MODEL SHAPE AND LIVE TOKENS. EXCLUDES WEIGHTS, ACTIVATIONS, ALLOCATOR RESERVE, AND BLOCK ROUNDING.`}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <Control label="LAYERS" value={layers} min={16} max={80} step={8} unit="" onChange={setLayers} />
        <Control label="KV HEADS" value={kvHeads} min={1} max={16} step={1} unit="" onChange={setKvHeads} />
        <Control label="HEAD DIM" value={headDim} min={64} max={256} step={64} unit="" onChange={setHeadDim} />
        <label className="bp-slider-label">PRECISION
          <select value={precision} onChange={(event) => setPrecision(Number(event.target.value))} style={{ fontFamily: 'var(--bp-mono)', marginLeft: 8 }}>
            <option value={1}>8-BIT · 1 B</option><option value={2}>BF16/FP16 · 2 B</option><option value={4}>FP32 · 4 B</option>
          </select>
        </label>
        <Control label="SEQUENCE" value={sequence} min={1024} max={16384} step={1024} unit=" TOK" onChange={setSequence} />
        <Control label="CONCURRENCY" value={concurrency} min={1} max={64} step={1} unit="" onChange={setConcurrency} />
      </div>
      <div className="bp-scroll-x"><div style={{ minWidth: 620, border: '1px solid var(--bp-line-soft)', padding: 14, fontFamily: 'var(--bp-mono)', fontSize: 12, lineHeight: 1.9 }}>
        <div>KV/TOKEN = 2 × {layers} LAYERS × {kvHeads} KV HEADS × {headDim} ELEMENTS/HEAD × {precision} BYTES/ELEMENT</div>
        <div>= {bytesPerToken.toLocaleString()} BYTES/TOKEN = {(bytesPerToken / 1024).toFixed(1)} KIB/TOKEN</div>
        <div>KV/REQUEST = {bytesPerToken.toLocaleString()} BYTES/TOKEN × {sequence.toLocaleString()} TOKENS = {gib(bytesPerRequest).toFixed(3)} GIB</div>
        <div style={{ color: 'var(--bp-accent)' }}>TOTAL KV = {gib(bytesPerRequest).toFixed(3)} GIB/REQUEST × {concurrency} REQUESTS = {gib(totalBytes).toFixed(2)} GIB</div>
      </div></div>
    </BpInteractive>
  )
}
