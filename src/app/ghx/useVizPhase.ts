'use client'

import { useEffect, useRef, useState } from 'react'

// Visibility-gated animation clock for the glossary's self-running visuals.
// The interval only ticks while the element is near the viewport, and never
// starts at all under prefers-reduced-motion — 20+ permanently-running
// timers would chew phone batteries in a room of 100 people.
export function useVizPhase(count: number, ms: number) {
  const [phase, setPhase] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer: number | null = null
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && timer === null) {
          timer = window.setInterval(() => setPhase((p) => (p + 1) % count), ms)
        } else if (!entry.isIntersecting && timer !== null) {
          clearInterval(timer)
          timer = null
        }
      },
      { rootMargin: '120px' },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (timer !== null) clearInterval(timer)
    }
  }, [count, ms])

  return [phase, ref] as const
}

// Same gating for components that run their own effects (e.g. the feedable
// context window's auto-stream).
export function useOnScreen() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '120px',
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [visible, ref] as const
}
