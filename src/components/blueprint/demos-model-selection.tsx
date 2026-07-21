'use client'

import { useState, type CSSProperties } from 'react'

/**
 * ModelFitDemo — will it run, and how fast?
 * Real arithmetic over toy inputs. Weight memory = params × bits ÷ 8;
 * generation speed ≈ bandwidth ÷ bytes-read-per-token (active params only).
 * Illustrative teaching model, not a benchmark.
 */

type Preset = {
  name: string
  total: number // B params
  active: number // B params (== total for dense)
  bits: number // bits per weight
}

const PRESETS: Preset[] = [
  { name: 'Qwen2.5-Coder-32B · dense · Q5', total: 32, active: 32, bits: 5.5 },
  { name: 'Llama-3.3-70B · dense · Q4', total: 70, active: 70, bits: 4.5 },
  { name: 'GLM-4.5-Air · 106B/12B MoE · Q5', total: 106, active: 12, bits: 5.5 },
  { name: 'Qwen3-235B-A22B · MoE · Q3', total: 235, active: 22, bits: 3.4 },
]

const QUANTS: { label: string; bits: number }[] = [
  { label: 'Q8', bits: 8.5 },
  { label: 'Q6', bits: 6.6 },
  { label: 'Q5', bits: 5.5 },
  { label: 'Q4', bits: 4.5 },
  { label: 'Q3', bits: 3.4 },
  { label: 'Q2', bits: 2.6 },
]

const gb = (n: number) => `${n.toFixed(1)} GB`

export function ModelFitDemo({ fig = 4 }: { fig?: number } = {}) {
  const [total, setTotal] = useState(106)
  const [active, setActive] = useState(12)
  const [bits, setBits] = useState(5.5)
  const [ctxK, setCtxK] = useState(16)
  const [mem, setMem] = useState(128) // usable GB
  const [bw, setBw] = useState(600) // GB/s
  const [moe, setMoe] = useState(true)

  const eff = moe ? active : total
  const weightGB = (total * bits) / 8
  const kvGB = ctxK * 0.12 * Math.sqrt(Math.max(total, 1) / 7)
  const overhead = 2
  const needGB = weightGB + kvGB + overhead
  const fits = needGB <= mem
  const bytesPerTok = (eff * bits) / 8 // GB read per token
  const tps = bw / bytesPerTok
  const pct = Math.min(100, (needGB / mem) * 100)

  const applyPreset = (p: Preset) => {
    setTotal(p.total)
    setActive(p.active)
    setBits(p.bits)
    setMoe(p.active !== p.total)
  }

  const label: CSSProperties = { fontSize: 11, letterSpacing: '0.12em', opacity: 0.7, textTransform: 'uppercase' }
  const val: CSSProperties = { fontVariantNumeric: 'tabular-nums', fontWeight: 600 }
  const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0' }

  return (
    <div style={{ border: '1px solid currentColor', padding: 18, margin: '1.5rem 0', fontSize: 14 }}>
      <div style={{ ...label, marginBottom: 10 }}>
        FIG. {fig} — FIT &amp; SPEED CALCULATOR · ADJUST THE SPEC, READ THE RESULT
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            className="bp-attn-chip"
            onClick={() => applyPreset(p)}
            style={{ border: '1px solid currentColor', background: 'transparent', color: 'inherit', padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 24px' }}>
        <div>
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Total params</span>
            <input type="range" min={1} max={400} value={total} onChange={(e) => { const newTotal = +e.target.value; setTotal(newTotal); setActive(a => Math.min(a, newTotal)) }} style={{ flex: 1 }} />
            <span style={{ ...val, width: 56, textAlign: 'right' }}>{total}B</span>
          </div>
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Architecture</span>
            <button
              onClick={() => { const n = !moe; setMoe(n); if (n) { setActive(a => Math.min(a, total)) } else { setActive(total) } }}
              style={{ border: '1px solid currentColor', background: 'transparent', color: 'inherit', padding: '3px 10px', fontSize: 12, cursor: 'pointer' }}
            >
              {moe ? 'MoE' : 'DENSE'}
            </button>
          </div>
          {moe && (
            <div style={row}>
              <span style={{ ...label, width: 120 }}>Active params</span>
              <input type="range" min={1} max={Math.max(2, total)} value={Math.min(active, total)} onChange={(e) => setActive(+e.target.value)} style={{ flex: 1 }} />
              <span style={{ ...val, width: 56, textAlign: 'right' }}>{Math.min(active, total)}B</span>
            </div>
          )}
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Quantization</span>
            <select value={bits} onChange={(e) => setBits(+e.target.value)} style={{ background: 'transparent', color: 'inherit', border: '1px solid currentColor', padding: '3px 6px' }}>
              {QUANTS.map((q) => (
                <option key={q.label} value={q.bits} style={{ color: '#000' }}>{q.label} · {q.bits} bpw</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Context</span>
            <input type="range" min={2} max={128} step={2} value={ctxK} onChange={(e) => setCtxK(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ ...val, width: 56, textAlign: 'right' }}>{ctxK}K</span>
          </div>
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Usable memory</span>
            <input type="range" min={8} max={192} step={8} value={mem} onChange={(e) => setMem(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ ...val, width: 56, textAlign: 'right' }}>{mem}GB</span>
          </div>
          <div style={row}>
            <span style={{ ...label, width: 120 }}>Bandwidth</span>
            <input type="range" min={100} max={4000} step={50} value={bw} onChange={(e) => setBw(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ ...val, width: 56, textAlign: 'right' }}>{bw}</span>
          </div>
        </div>
      </div>

      {/* memory bar */}
      <div style={{ marginTop: 16, height: 18, border: '1px solid currentColor', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'currentColor', opacity: fits ? 0.25 : 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 8, fontSize: 11, letterSpacing: '0.08em' }}>
          {gb(needGB)} of {mem} GB
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 14 }}>
        <div>
          <div style={label}>Fits?</div>
          <div style={{ ...val, fontSize: 20 }}>{fits ? 'YES — loads' : 'NO — out of memory'}</div>
        </div>
        <div>
          <div style={label}>Weights + KV</div>
          <div style={{ ...val, fontSize: 20 }}>{gb(weightGB)} + {gb(kvGB)}</div>
        </div>
        <div>
          <div style={label}>Est. generation</div>
          <div style={{ ...val, fontSize: 20 }}>{fits ? `~${tps.toFixed(0)} tok/s` : '—'}</div>
        </div>
      </div>

      <div style={{ ...label, marginTop: 14, opacity: 0.55, lineHeight: 1.5 }}>
        ILLUSTRATIVE — NOT A BENCHMARK. Speed reads active params only, which is why an MoE with low active
        params generates far faster than a dense model of the same total size. KV estimate is a rough function
        of context and model size. Real numbers vary with runtime, attention scheme, batching, and OS overhead.
      </div>
    </div>
  )
}
