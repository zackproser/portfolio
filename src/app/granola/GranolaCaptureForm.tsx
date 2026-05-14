'use client'

import { useRef, useState } from 'react'
import { getAffiliateLink } from '@/lib/affiliate'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type State = 'idle' | 'submitting' | 'ok' | 'error'

const successLink = getAffiliateLink({
  product: 'granola',
  campaign: 'granola-pillar',
  medium: 'blog',
  placement: 'hero-card',
  term: 'form-success',
})

// ────────────────────────────────────────────────────────────────────────
// GranolaCaptureForm — uses the design's `.g-capture .field` styling.
// Wires to the site's /api/form endpoint with honeypot + dedup guard.
// On success: replaces the form with a confirmation + affiliate link.
// ────────────────────────────────────────────────────────────────────────

export function GranolaCaptureForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const inFlight = useRef(false)

  const trimmed = email.trim()
  const validShape = trimmed.length === 0 ? null : EMAIL_RE.test(trimmed)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validShape || inFlight.current) return
    inFlight.current = true
    setState('submitting')
    setErrMsg(null)

    const form = e.currentTarget
    const hpField = form.elements.namedItem('website_url') as HTMLInputElement | null
    const hp = hpField?.value ?? ''

    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          referrer:
            typeof window !== 'undefined' ? window.location.pathname : '/granola',
          tags: ['interest:granola', 'interest:meetings', 'source:granola-pillar'],
          hp,
        }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setState('ok')
    } catch (err) {
      inFlight.current = false
      setState('error')
      setErrMsg('Something broke on our end. Try again or use the link in the sidebar.')
    }
  }

  if (state === 'ok') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          borderTop: '2px solid var(--accent)',
          borderBottom: '1px solid var(--border)',
          padding: '18px 0 22px',
          marginBottom: 16,
          display: 'grid',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 700,
          }}
        >
          ✓ on the list
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-serif, 'Source Serif 4'), Georgia, serif",
            fontSize: 18,
            lineHeight: 1.55,
            color: 'var(--fg)',
          }}
        >
          The workflow guide lands in your inbox in a few minutes. If you want
          to try Granola in the meantime, it&apos;s one click away.
        </p>
        <a
          href={successLink}
          rel="sponsored noopener"
          target="_blank"
          className="g-btn g-btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          Go to granola.ai <span aria-hidden>↗</span>
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -10000,
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="granola-hp">Website (leave blank)</label>
        <input
          id="granola-hp"
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="granola-email">Email</label>
        <span className="count">01</span>
        <input
          id="granola-email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {state === 'error' && errMsg && (
        <p
          role="alert"
          style={{
            margin: '10px 0 0',
            fontFamily: "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '.08em',
            color: '#b45309',
            textTransform: 'uppercase',
          }}
        >
          {errMsg}
        </p>
      )}

      <div className="form-foot">
        <span className="hint">→ One email, the workflow guide, then nothing</span>
        <button
          className="btn-send"
          type="submit"
          disabled={state === 'submitting' || validShape === false}
        >
          {state === 'submitting' ? 'Sending…' : 'Send it'} <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  )
}
