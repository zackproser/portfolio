'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'
import exportData from './data/induction-gpt2.json'

type Condition = {
  targetLogit: number
  targetProbability: number
  copyingScore: number
  targetLogitDelta: number
  copyingScoreDelta: number
}

const demo = exportData.demo
const conditions = demo.conditions as Record<string, Condition>

function visibleToken(token: string) {
  return token.replace(/^Ġ/, '␠')
}

function Toggle({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className={`bp-attn-chip${enabled ? ' bp-hot' : ''}`}
      onClick={onChange}
      aria-pressed={enabled}
    >
      {enabled ? 'ON' : 'ZERO'} · {label}
    </button>
  )
}

export function InductionCircuitDemo({ fig = 5 }: { fig?: number } = {}) {
  const [previous, setPrevious] = useState(true)
  const [induction, setInduction] = useState(true)
  const [mlp, setMlp] = useState(true)
  const [headIndex, setHeadIndex] = useState(0)
  const key = `p${Number(previous)}-i${Number(induction)}-m${Number(mlp)}`
  const result = conditions[key]
  const head = demo.attentionHeads[headIndex]
  const activeRow = head.activeRow
  const maxWeight = Math.max(...activeRow)
  const baseline = conditions['p1-i1-m1']
  const summary = useMemo(() => {
    const direction = result.copyingScoreDelta < 0 ? 'below' : 'above'
    return `${Math.abs(result.copyingScoreDelta).toFixed(2)} ${direction} the intact run`
  }, [result.copyingScoreDelta])

  return (
    <BpInteractive
      label={<>INTERACTIVE — GPT-2 INDUCTION CIRCUIT · ACTIVE POSITION {demo.activePosition}</>}
      footer={<>FIG. {fig} — REAL GPT-2 (124M) EXPORT, GENERATED {exportData.provenance.generationDate}. TOGGLES SELECT PRECOMPUTED ZERO-ABLATION RUNS; THEY DO NOT RUN A MODEL IN THE BROWSER. THE COPY SCORE IS THE TARGET LOGIT MINUS THE MEAN LOGIT OF THE OTHER CYCLE TOKENS. THIS IS A SMALL REPLICATION, NOT A CLAIM ABOUT EVERY HEAD OR PROMPT.</>}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
        <Toggle label={`PREVIOUS L${demo.candidatePreviousTokenHead.layer}H${demo.candidatePreviousTokenHead.head}`} enabled={previous} onChange={() => setPrevious((value) => !value)} />
        <Toggle label={`INDUCTION L${demo.candidateInductionHead.layer}H${demo.candidateInductionHead.head}`} enabled={induction} onChange={() => setInduction((value) => !value)} />
        <Toggle label={`MLP L${demo.mlpLayer}`} enabled={mlp} onChange={() => setMlp((value) => !value)} />
      </div>

      <div className="bp-scroll-x">
        <div style={{ minWidth: 680 }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 18 }}>
            {demo.tokens.map((token, index) => (
              <span
                key={`${token}-${index}`}
                className={`bp-attn-chip${index === demo.activePosition ? ' bp-hot' : ''}`}
                style={index === demo.targetPosition ? { outline: '1px dashed var(--bp-accent)', outlineOffset: 2 } : undefined}
                aria-label={`${visibleToken(token)}, position ${index}${index === demo.activePosition ? ', active query' : ''}${index === demo.targetPosition ? ', copied target' : ''}`}
              >
                {visibleToken(token)}<sup style={{ opacity: 0.55 }}>{index}</sup>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {demo.attentionHeads.map((item, index) => (
              <button
                type="button"
                key={`${item.layer}-${item.head}`}
                className={`bp-attn-chip${index === headIndex ? ' bp-hot' : ''}`}
                onClick={() => setHeadIndex(index)}
                aria-pressed={index === headIndex}
              >
                L{item.layer}H{item.head} · PATTERN {item.meanInductionScore.toFixed(2)}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeRow.length}, minmax(32px, 1fr))`, gap: 4, height: 128, alignItems: 'end', borderBottom: '1px solid var(--bp-line-soft)', paddingBottom: 5 }} aria-label={`Attention row for layer ${head.layer}, head ${head.head}`}>
            {activeRow.map((weight, index) => (
              <div key={index} style={{ display: 'grid', alignItems: 'end', height: '100%', gap: 4 }}>
                <div title={`position ${index}: ${weight.toFixed(5)}`} style={{ height: `${Math.max(2, (weight / maxWeight) * 92)}%`, background: index === demo.targetPosition ? 'var(--bp-accent)' : 'currentColor', opacity: index === demo.targetPosition ? 0.82 : 0.22 }} />
                <span style={{ fontFamily: 'var(--bp-mono)', fontSize: 9, textAlign: 'center' }}>{index}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 18, fontFamily: 'var(--bp-mono)' }} aria-live="polite">
        <div><div style={{ fontSize: 10, color: 'var(--bp-fg-muted)' }}>COPY TARGET</div><div style={{ fontSize: 18 }}>{visibleToken(demo.targetToken)}</div></div>
        <div><div style={{ fontSize: 10, color: 'var(--bp-fg-muted)' }}>COPY SCORE</div><div style={{ fontSize: 18 }}>{result.copyingScore.toFixed(2)}</div><div style={{ fontSize: 10 }}>{summary}</div></div>
        <div><div style={{ fontSize: 10, color: 'var(--bp-fg-muted)' }}>TARGET PROBABILITY</div><div style={{ fontSize: 18 }}>{(result.targetProbability * 100).toFixed(2)}%</div></div>
        <div><div style={{ fontSize: 10, color: 'var(--bp-fg-muted)' }}>TARGET LOGIT Δ</div><div style={{ fontSize: 18 }}>{result.targetLogitDelta >= 0 ? '+' : ''}{result.targetLogitDelta.toFixed(2)}</div><div style={{ fontSize: 10 }}>VS {baseline.targetLogit.toFixed(2)} INTACT</div></div>
      </div>
    </BpInteractive>
  )
}
