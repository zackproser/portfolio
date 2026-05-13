'use client'

import { useRef, useState } from 'react'
import { getAffiliateLink } from '@/lib/affiliate'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type State = 'idle' | 'submitting' | 'ok' | 'error'

const affiliateLink = getAffiliateLink({
  product: 'granola',
  campaign: 'granola-landing',
  medium: 'homepage',
  placement: 'hero-card',
})

export function GranolaLandingClient() {
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
          referrer: typeof window !== 'undefined' ? window.location.pathname : '/granola',
          tags: ['interest:granola', 'interest:meetings', 'source:granola-landing'],
          hp,
        }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setState('ok')
    } catch (err) {
      inFlight.current = false
      setState('error')
      setErrMsg('Something broke on our end. Try again, or use the direct link in the sidebar.')
    }
  }

  if (state === 'ok') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: 'grid',
          gap: 14,
          padding: '22px 24px',
          border: '1px solid var(--rule)',
          borderRadius: 8,
          background: 'var(--bg-secondary)',
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          ✓ on the list
        </div>
        <p
          style={{
            fontFamily: "var(--font-serif, 'Crimson Pro'), Georgia, serif",
            fontSize: 18,
            lineHeight: 1.5,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          Workflow guide lands in your inbox in a few minutes. If you want to try Granola in the meantime, it&apos;s one click away.
        </p>
        <a
          href={affiliateLink}
          rel="sponsored noopener"
          target="_blank"
          className="ed-submit"
          style={{
            textAlign: 'center',
            display: 'block',
            textDecoration: 'none',
          }}
        >
          Go to granola.ai <span>→</span>
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="ed-form">
      {/* Honeypot field — hidden from humans, auto-filled by bots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="granola-hp-website">Website (leave blank)</label>
        <input
          id="granola-hp-website"
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="ed-field">
        <div className="ed-label">
          <span>Email</span>
          <span className="num">01</span>
        </div>
        <input
          id="granola-email"
          className="ed-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
      </div>

      {state === 'error' && errMsg && (
        <div className="form-status err" role="alert">
          {errMsg}
        </div>
      )}

      <div className="ed-submit-row">
        <span className="fine">→ one email, the workflow guide, then nothing</span>
        <button
          type="submit"
          className="ed-submit"
          disabled={state === 'submitting' || !validShape}
        >
          {state === 'submitting' ? 'Sending…' : 'Send it'} <span>→</span>
        </button>
      </div>
    </form>
  )
}
