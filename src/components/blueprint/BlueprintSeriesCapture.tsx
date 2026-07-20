'use client'

import { FormEvent, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'

// Newsletter capture for Blueprint Deep Dive posts, in the drawing
// metaphor. Two placements of one component:
//   - "next-sheet": full card at the end of the drawing (primary)
//   - "title-block": compact distribution row under the masthead
// One success anywhere hides every placement on this device.

export interface NextDrawing {
  number: string // "005"
  title?: string // "The Vector Database"
  subject?: string // "VECTOR SEARCH"
  status?: 'planned' | 'in-production' | 'issued'
}

const SUBSCRIBED_KEY = 'bp-series-subscribed'
const SYNC_EVENT = 'bp-series-subscribed'

export function useSeriesSubscribed(): [boolean, () => void] {
  const [subscribed, setSubscribed] = useState(false)
  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) === '1') setSubscribed(true)
    } catch {
      // storage unavailable — show the form
    }
    const onSync = () => setSubscribed(true)
    window.addEventListener(SYNC_EVENT, onSync)
    return () => window.removeEventListener(SYNC_EVENT, onSync)
  }, [])
  const markSubscribed = () => {
    setSubscribed(true)
    try {
      localStorage.setItem(SUBSCRIBED_KEY, '1')
    } catch {
      // in-memory state still hides the forms this session
    }
    window.dispatchEvent(new Event(SYNC_EVENT))
  }
  return [subscribed, markSubscribed]
}

export function BlueprintSeriesCapture({
  variant,
  drawingCode,
  next,
}: {
  variant: 'next-sheet' | 'title-block'
  drawingCode: string
  next?: NextDrawing
}) {
  const pathname = usePathname()
  const [subscribed, markSubscribed] = useSeriesSubscribed()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [started, setStarted] = useState(false)
  const [hasPlate, setHasPlate] = useState(false)
  const location = `blueprint:${variant}:${drawingCode}`

  // Coexistence rule: a drawing with a DETACHABLE PLATE never shows
  // three email fields. The title-block form collapses to a link that
  // scrolls to the plate offer.
  useLayoutEffect(() => {
    if (variant === 'title-block') {
      // Re-check per navigation: the App Router reconciles this client
      // component across /blog/[slug] params instead of remounting, so
      // a stale hasPlate would show the wrong row on the next drawing.
      setHasPlate(!!document.querySelector('.bp-plate'))
    }
  }, [variant, pathname])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    const hp = (form.elements.namedItem('hp') as HTMLInputElement)?.value ?? ''
    if (!email) return
    setStatus('submitting')
    track('blueprint-capture-submit', { location })
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          hp,
          referrer: pathname,
          tags: ['interest:blueprint-series', 'source:blog'],
        }),
      })
      if (!response.ok) throw new Error('subscribe failed')
      track('blueprint-capture-success', { location })
      markSubscribed()
    } catch {
      track('blueprint-capture-error', { location })
      setStatus('error')
    }
  }

  const onFocusStart = () => {
    if (!started) {
      setStarted(true)
      track('blueprint-capture-start', { location })
    }
  }

  if (subscribed) {
    if (variant === 'title-block') return null
    return (
      <div className="bp-capture bp-capture--done">
        <span className="bp-capture-kicker">REVISION DISTRIBUTION LIST</span>
        <span className="bp-capture-recorded">✓ ADDRESS RECORDED — THE NEXT DRAWING SHIPS TO YOUR INBOX</span>
      </div>
    )
  }

  const nextLine =
    next?.title && next?.number
      ? `${next.status === 'in-production' ? 'IN PRODUCTION' : 'NEXT SHEET'} · TDD-${next.number} · ${next.title.toUpperCase()}`
      : 'NEXT SUBJECT UNDER REVIEW'

  if (variant === 'title-block' && hasPlate) {
    return (
      <div className="bp-capture bp-capture--row">
        <span className="bp-capture-kicker">DISTRIBUTION</span>
        <button
          type="button"
          className="bp-rfi-loglink"
          onClick={() => {
            track('blueprint-capture-plate-link', { location })
            document.querySelector('.bp-plate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          GET THE DETACHABLE PLATE + FUTURE DRAWINGS →
        </button>
      </div>
    )
  }

  if (variant === 'title-block') {
    return (
      <form className="bp-capture bp-capture--row" onSubmit={handleSubmit} noValidate>
        <span className="bp-capture-kicker">DISTRIBUTION · REVISIONS ISSUED BY EMAIL</span>
        <span className="bp-capture-pitch">Get the next complete drawing.</span>
        <input type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="bp-hp" />
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          aria-label="Email for the next Blueprint drawing"
          className="bp-capture-input"
          onFocus={onFocusStart}
        />
        <button type="submit" className="bp-capture-btn" disabled={status === 'submitting'}>
          {status === 'submitting' ? '…' : 'ADD ME →'}
        </button>
        {status === 'error' && <span className="bp-capture-error">Try again in a moment.</span>}
      </form>
    )
  }

  return (
    <form className="bp-capture bp-capture--card" onSubmit={handleSubmit} noValidate>
      <div className="bp-capture-strip">
        <span>{nextLine}</span>
        <span className="bp-num">{drawingCode}-D</span>
      </div>
      <div className="bp-capture-body">
        <div className="bp-capture-headline">GET THE NEXT DRAWING</div>
        <p className="bp-capture-pitch">
          One complete technical schematic, issued by email when it is ready. Free; one-click unsubscribe.
        </p>
        <div className="bp-capture-inputrow">
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="bp-hp" />
          <input
            type="email"
            name="email"
            required
            placeholder="you@company.com"
            aria-label="Email for the next Blueprint drawing"
            className="bp-capture-input"
            onFocus={onFocusStart}
          />
          <button type="submit" className="bp-capture-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'RECORDING…' : 'SEND THE NEXT DRAWING →'}
          </button>
        </div>
        {status === 'error' && <span className="bp-capture-error">That didn&apos;t go through — try again in a moment.</span>}
      </div>
    </form>
  )
}
