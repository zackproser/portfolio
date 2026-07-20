'use client'

import { useMemo, useState } from 'react'
import { BpInteractive } from './bits'

type DefenseKey = 'sourceLabeling' | 'contextAssembly' | 'policyCheck' | 'authorization' | 'toolExecution' | 'outputHandling'

interface Defense {
  key: DefenseKey
  label: string
  boundary: string
}

interface PreparedCase {
  id: string
  task: string
  hostileClass: string
  stoppedBy: DefenseKey[]
}

interface Outcome {
  taskSuccess: number
  attackSuccess: number
  blockedLegitimate: number
  caseResults: Array<{ id: string; stopped: boolean }>
}

const DEFENSES: Defense[] = [
  { key: 'sourceLabeling', label: 'SOURCE LABELING', boundary: 'SOURCE → INGEST' },
  { key: 'contextAssembly', label: 'CONTEXT ASSEMBLY', boundary: 'INGEST → CONTEXT' },
  { key: 'policyCheck', label: 'POLICY CHECK', boundary: 'PROPOSAL → DECISION' },
  { key: 'authorization', label: 'AUTHORIZATION', boundary: 'DECISION → GRANT' },
  { key: 'toolExecution', label: 'TOOL EXECUTION', boundary: 'GRANT → EFFECT' },
  { key: 'outputHandling', label: 'OUTPUT HANDLING', boundary: 'OUTPUT → RENDERER' },
]

const PREPARED_CASES: PreparedCase[] = [
  { id: 'C-01', task: 'Find a meeting request and propose an available time.', hostileClass: 'A message contains instructions unrelated to the user task.', stoppedBy: ['sourceLabeling', 'contextAssembly', 'policyCheck', 'authorization'] },
  { id: 'C-02', task: 'Summarize a named email thread.', hostileClass: 'A retrieved message requests disclosure through an available tool.', stoppedBy: ['contextAssembly', 'policyCheck', 'authorization', 'toolExecution'] },
  { id: 'C-03', task: 'Draft a reply without sending it.', hostileClass: 'Untrusted content attempts to turn a draft into an outbound action.', stoppedBy: ['policyCheck', 'authorization', 'toolExecution'] },
  { id: 'C-04', task: 'Display a prepared calendar summary.', hostileClass: 'Model-produced content could be interpreted by a downstream renderer.', stoppedBy: ['outputHandling'] },
  { id: 'C-05', task: 'Read events inside the named calendar and date range.', hostileClass: 'A hostile record diverts the agent within an already granted read scope.', stoppedBy: ['sourceLabeling', 'contextAssembly', 'policyCheck'] },
]

const LEGITIMATE_CASES = 8

function stateForMask(mask: number): Record<DefenseKey, boolean> {
  return DEFENSES.reduce((state, defense, index) => {
    state[defense.key] = Boolean(mask & (1 << index))
    return state
  }, {} as Record<DefenseKey, boolean>)
}

function outcomeForMask(mask: number): Outcome {
  const enabled = stateForMask(mask)
  const caseResults = PREPARED_CASES.map((prepared) => ({
    id: prepared.id,
    stopped: prepared.stoppedBy.some((key) => enabled[key]),
  }))
  const blockedLegitimate = Number(enabled.sourceLabeling) + Number(enabled.policyCheck) + Number(enabled.authorization)
  return {
    taskSuccess: LEGITIMATE_CASES - blockedLegitimate,
    attackSuccess: caseResults.filter((result) => !result.stopped).length,
    blockedLegitimate,
    caseResults,
  }
}

const OUTCOME_TABLE: Record<number, Outcome> = Object.fromEntries(
  Array.from({ length: 64 }, (_, mask) => [mask, outcomeForMask(mask)]),
)

export function TrustBoundaryDemo({ fig = 3 }: { fig?: number } = {}) {
  const [enabled, setEnabled] = useState<Record<DefenseKey, boolean>>({
    sourceLabeling: true,
    contextAssembly: true,
    policyCheck: true,
    authorization: true,
    toolExecution: true,
    outputHandling: true,
  })
  const [selectedCase, setSelectedCase] = useState(PREPARED_CASES[0].id)

  const mask = useMemo(
    () => DEFENSES.reduce((value, defense, index) => value | (enabled[defense.key] ? 1 << index : 0), 0),
    [enabled],
  )
  const outcome = OUTCOME_TABLE[mask]
  const prepared = PREPARED_CASES.find((item) => item.id === selectedCase) ?? PREPARED_CASES[0]
  const preparedResult = outcome.caseResults.find((item) => item.id === prepared.id)

  return (
    <BpInteractive
      label={<>INTERACTIVE — EMAIL / CALENDAR TRUST-BOUNDARY TABLE · CONFIG {String(mask).padStart(2, '0')}</>}
      footer={`FIG. ${fig} — ILLUSTRATIVE PREPARED CASES, NOT A SECURITY BENCHMARK. ALL 64 CONFIGURATIONS AND OUTCOMES ARE FIXED; NO MODEL, ATTACK GENERATION, OR ATTACK TEXT.`}
    >
      <div className="bp-scroll-x">
        <div style={{ minWidth: 760 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(112px, 1fr))', gap: 8, marginBottom: 14 }}>
            {DEFENSES.map((defense, index) => (
              <button
                key={defense.key}
                type="button"
                className={`bp-attn-chip${enabled[defense.key] ? ' bp-hot' : ''}`}
                aria-pressed={enabled[defense.key]}
                onClick={() => setEnabled((current) => ({ ...current, [defense.key]: !current[defense.key] }))}
                style={{ minHeight: 70, textAlign: 'left', whiteSpace: 'normal', lineHeight: 1.35 }}
              >
                {String(index + 1).padStart(2, '0')} · {defense.label}<br />
                <span style={{ opacity: 0.72 }}>{defense.boundary}</span><br />
                {enabled[defense.key] ? 'ON' : 'OFF'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 14, fontFamily: 'var(--bp-mono)' }}>
            {[
              ['TASK SUCCESS', `${outcome.taskSuccess} / ${LEGITIMATE_CASES}`],
              ['ATTACK SUCCESS', `${outcome.attackSuccess} / ${PREPARED_CASES.length}`],
              ['BLOCKED LEGITIMATE', `${outcome.blockedLegitimate} / ${LEGITIMATE_CASES}`],
            ].map(([label, value]) => (
              <div key={label} style={{ borderTop: '2px solid var(--bp-accent)', paddingTop: 8 }}>
                <div style={{ color: 'var(--bp-fg-muted)', fontSize: 10 }}>{label}</div>
                <div style={{ fontSize: 18 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, border: '1px solid var(--bp-line-soft)', padding: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--bp-mono)', fontSize: 10, color: 'var(--bp-fg-muted)', marginBottom: 8 }}>PREPARED CASE</div>
              <select value={selectedCase} onChange={(event) => setSelectedCase(event.target.value)} style={{ width: '100%', fontFamily: 'var(--bp-mono)' }}>
                {PREPARED_CASES.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
              </select>
              <div style={{ marginTop: 12, fontFamily: 'var(--bp-mono)', color: preparedResult?.stopped ? 'var(--bp-fg)' : 'var(--bp-accent)' }}>
                {preparedResult?.stopped ? 'ATTACK CLASS STOPPED' : 'ATTACK CLASS SUCCEEDS'}
              </div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div><strong>USER TASK:</strong> {prepared.task}</div>
              <div><strong>HOSTILE SOURCE CLASS:</strong> {prepared.hostileClass}</div>
              <div><strong>STOP CONDITIONS:</strong> {prepared.stoppedBy.map((key) => DEFENSES.find((defense) => defense.key === key)?.label).join(' · ')}</div>
              <div style={{ marginTop: 8, color: 'var(--bp-fg-muted)' }}>The hostile message is represented only by its class and expected effect. No payload is stored or rendered.</div>
            </div>
          </div>
        </div>
      </div>
    </BpInteractive>
  )
}
