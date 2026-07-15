'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdvisorChat from './AdvisorChat'
import { ConvergenceField } from './ConvergenceField'
import type { AdvisorSignal } from './advisor-types'
import styles from './AdvisorExperience.module.css'

const PHASE_COPY = {
  idle: 'listening',
  listening: 'taking in the signal…',
  thinking: 'narrowing it down…',
  resolved: 'recommendation ready',
} as const

export default function AdvisorExperience() {
  const [signal, setSignal] = useState<AdvisorSignal>({ phase: 'idle' })
  const [playEntrance, setPlayEntrance] = useState(false)
  const updateSignal = useCallback((next: AdvisorSignal) => {
    setSignal((current) => (
      current.phase === next.phase && current.accent === next.accent ? current : next
    ))
  }, [])

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('advisorEntranceSeen') === '1'
      sessionStorage.setItem('advisorEntranceSeen', '1')
      if (!seen) setPlayEntrance(true)
    } catch {
      setPlayEntrance(true)
    }
  }, [])
  const style = useMemo(
    () => ({ '--advisor-accent': signal.accent ?? '#6ae1ff' }) as React.CSSProperties,
    [signal.accent],
  )

  return (
    <div
      className={`${styles.page} ${playEntrance ? styles.play : ''}`}
      style={style}
      data-phase={signal.phase}
    >
      <ConvergenceField signal={signal} />
      <div className={styles.veil} aria-hidden="true" />
      <main className={styles.content}>
        <header className={styles.cover}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            AI tool advisor
          </p>
          <h1>Bring the need. Leave with one clear answer.</h1>
          <p className={styles.status} aria-live="polite">
            <span className={styles.statusMark} aria-hidden="true" />
            {PHASE_COPY[signal.phase]}
          </p>
        </header>
        <div className={styles.chatWrap} data-advisor-chat>
          <AdvisorChat onSignalChange={updateSignal} />
        </div>
      </main>
    </div>
  )
}
