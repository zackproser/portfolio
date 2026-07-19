'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

const SAMPLE = `A retrieval system starts with documents written for people, not machines. Headings carry structure, paragraphs carry claims, and tables compress relationships into very little space. The indexer has to preserve enough of that shape for a later question to recover the right evidence. Chunks that are too small lose their surrounding definitions. Chunks that are too large bury the useful sentence among unrelated material. Overlap can protect facts near a boundary, but it also stores repeated tokens and may return near-duplicate passages. A workable chunk is therefore a retrieval unit: one coherent idea with enough local context to stand on its own.`

function makeChunks(text: string, size: number, overlap: number) {
  const chunks: string[] = []
  const step = Math.max(1, size - overlap)
  for (let start = 0; start < text.length; start += step) {
    chunks.push(text.slice(start, start + size))
    if (start + size >= text.length) break
  }
  return chunks
}

export function ChunkingDemo({ fig = 4 }: { fig?: number } = {}) {
  const [size, setSize] = useState(160)
  const [overlap, setOverlap] = useState(30)
  const chunks = useMemo(() => makeChunks(SAMPLE, size, Math.min(overlap, size - 1)), [size, overlap])
  const verdict = size < 110 ? 'TOO FINE — CONTEXT SPLINTERS' : size > 220 ? 'TOO COARSE — SIGNAL GETS BURIED' : 'WORKABLE STARTING RANGE'

  return (
    <BpInteractive
      label={<>INTERACTIVE — CHARACTER CHUNKER · {chunks.length} CHUNKS</>}
      controls={
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <label className="bp-slider-label">
            SIZE {size}
            <input type="range" min={80} max={260} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </label>
          <label className="bp-slider-label">
            OVERLAP {overlap}
            <input type="range" min={0} max={60} step={10} value={overlap} onChange={(e) => setOverlap(Number(e.target.value))} />
          </label>
        </div>
      }
      footer={`FIG. ${fig} — FIXED-SIZE CHARACTER CHUNKS. BOUNDARIES ARE VISIBLE; PRODUCTION SYSTEMS USUALLY COUNT TOKENS.`}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        {chunks.map((chunk, index) => (
          <div key={`${index}-${size}-${overlap}`} style={{ borderLeft: '3px solid var(--bp-accent)', borderTop: '1px solid var(--bp-line-soft)', borderBottom: '1px solid var(--bp-line-soft)', padding: '10px 12px' }}>
            <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 5 }}>
              CHUNK {String(index + 1).padStart(2, '0')} · {chunk.length} CHARS
            </div>
            <div style={{ fontFamily: 'var(--bp-serif)', fontSize: 15, lineHeight: 1.55 }}>{chunk}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, color: 'var(--bp-accent)', marginTop: 14 }}>{verdict}</div>
    </BpInteractive>
  )
}

const PASSAGES = [
  { title: 'Cache invalidation runbook', dense: 0.92, keyword: 0.34 },
  { title: 'Redis TTL configuration', dense: 0.72, keyword: 0.91 },
  { title: 'Stale profile incident', dense: 0.88, keyword: 0.51 },
  { title: 'Database index maintenance', dense: 0.42, keyword: 0.62 },
  { title: 'CDN cache-control headers', dense: 0.68, keyword: 0.85 },
  { title: 'User session expiration', dense: 0.79, keyword: 0.29 },
]

export function RetrievalScoreDemo({ fig = 5 }: { fig?: number } = {}) {
  const [alpha, setAlpha] = useState(0.5)
  const ranked = useMemo(
    () => PASSAGES.map((passage) => ({ ...passage, score: alpha * passage.dense + (1 - alpha) * passage.keyword })).sort((a, b) => b.score - a.score),
    [alpha],
  )

  return (
    <BpInteractive
      label={<>INTERACTIVE — HYBRID RETRIEVAL · QUERY: ⟨WHY ARE PROFILES STALE AFTER TTL?⟩</>}
      controls={
        <label className="bp-slider-label">
          α {alpha.toFixed(2)}
          <input type="range" min={0} max={1} step={0.05} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
        </label>
      }
      footer={`FIG. ${fig} — α=0 IS KEYWORD-ONLY; α=1 IS DENSE-ONLY. COMPONENT SCORES ARE FIXED, NORMALIZED TEACHING VALUES.`}
    >
      <div className="bp-scroll-x">
        <div style={{ minWidth: 470 }}>
          <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 11, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>
            RANK · PASSAGE · HYBRID [DENSE / KEYWORD]
          </div>
          {ranked.map((passage, index) => (
            <div key={passage.title} style={{ display: 'grid', gridTemplateColumns: '34px minmax(180px, 1fr) 88px 120px', gap: 8, alignItems: 'center', borderTop: '1px solid var(--bp-line-soft)', padding: '10px 0', fontFamily: 'var(--bp-mono)', fontSize: 12 }}>
              <span style={{ color: index === 0 ? 'var(--bp-accent)' : 'var(--bp-fg-muted)' }}>{String(index + 1).padStart(2, '0')}</span>
              <span>{passage.title}</span>
              <span style={{ color: index === 0 ? 'var(--bp-accent)' : 'var(--bp-fg)' }}>{passage.score.toFixed(3)}</span>
              <span style={{ color: 'var(--bp-fg-muted)' }}>[{passage.dense.toFixed(2)} / {passage.keyword.toFixed(2)}]</span>
            </div>
          ))}
        </div>
      </div>
    </BpInteractive>
  )
}
