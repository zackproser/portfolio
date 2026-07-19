'use client'

import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'
import { useSeriesSubscribed } from './BlueprintSeriesCapture'

// DETACHABLE PLATE — the gated-artifact exchange from the wave-3
// strategy: a drawing offers one separately valuable work product
// (poster, worksheet, evidence bundle); the reader trades an email for
// it and joins the series distribution list. The article itself is
// never gated. Assets resolve server-side (/api/blueprint-asset).

export function BpDetachablePlate({
  drawingCode,
  assetId,
  name,
  format,
  contents,
  fileUrl,
  buttonLabel = 'EMAIL ME THIS PLATE →',
}: {
  drawingCode: string
  assetId: string
  name: string
  format: string
  contents: string[]
  fileUrl: string
  buttonLabel?: string
}) {
  const pathname = usePathname()
  const [subscribed, markSubscribed] = useSeriesSubscribed()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [delivered, setDelivered] = useState<string | null>(null)
  const location = `blueprint:plate:${assetId}`
  const plateCode = `${drawingCode}-PLATE`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    const hp = (form.elements.namedItem('hp') as HTMLInputElement)?.value ?? ''
    if (!email) return
    setStatus('submitting')
    track('blueprint-plate-submit', { location })
    try {
      const res = await fetch('/api/blueprint-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hp, assetId, referrer: pathname }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'failed')
      track('blueprint-plate-success', { location })
      setDelivered(data.fileUrl || fileUrl)
      setStatus('done')
      markSubscribed()
    } catch {
      track('blueprint-plate-error', { location })
      setStatus('error')
    }
  }

  return (
    <div className="bp-plate" data-sec-ignore>
      <div className="bp-plate-strip">
        <span>DETACHABLE PLATE · {plateCode}</span>
        <span className="bp-plate-format">{format}</span>
      </div>
      <div className="bp-plate-body">
        <div className="bp-plate-name">{name}</div>
        <ul className="bp-plate-contents">
          {contents.map((c) => (
            <li key={c}>
              <span className="bp-plate-tick">▸</span>
              {c}
            </li>
          ))}
        </ul>

        {status === 'done' || (subscribed && delivered) ? (
          <div className="bp-plate-delivered">
            <span className="bp-capture-recorded">✓ PLATE ISSUED — A COPY IS ALSO ON ITS WAY TO YOUR INBOX</span>
            <a className="bp-capture-btn bp-plate-download" href={delivered || fileUrl} target="_blank" rel="noreferrer">
              OPEN {name.toUpperCase()} →
            </a>
          </div>
        ) : subscribed ? (
          // Already on the distribution list: no second consent ask
          <div className="bp-plate-delivered">
            <a
              className="bp-capture-btn bp-plate-download"
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('blueprint-plate-direct', { location })}
            >
              GET {name.toUpperCase()} →
            </a>
            <span className="bp-plate-note">You&apos;re on the distribution list — no email needed.</span>
          </div>
        ) : !open ? (
          <button type="button" className="bp-capture-btn" onClick={() => {
            setOpen(true)
            track('blueprint-plate-open', { location })
          }}>
            {buttonLabel}
          </button>
        ) : (
          <form className="bp-plate-form" onSubmit={handleSubmit} noValidate>
            <p className="bp-plate-consent">
              Send the {name} to my inbox. I&apos;ll also receive future Blueprint drawings when they are
              issued. Free; one-click unsubscribe.
            </p>
            <input type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="bp-hp" />
            <div className="bp-plate-inputrow">
              <input
                type="email"
                name="email"
                required
                autoFocus
                placeholder="you@company.com"
                aria-label={`Email for the ${name}`}
                className="bp-capture-input"
              />
              <button type="submit" className="bp-capture-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'ISSUING…' : 'SEND THE FILE →'}
              </button>
            </div>
            {status === 'error' && (
              <span className="bp-capture-error">That didn&apos;t go through — try again in a moment.</span>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
