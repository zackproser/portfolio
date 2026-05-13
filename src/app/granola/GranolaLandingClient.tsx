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
    const hpField = form.elements.namedItem('company') as HTMLInputElement | null
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
      setErrMsg('Something broke on our end. Try again or use the direct link below.')
    }
  }

  if (state === 'ok') {
    return (
      <div role="status" aria-live="polite" className="space-y-4">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
          <span aria-hidden>✓</span>
          <span>You&apos;re on the list.</span>
        </div>
        <p className="text-stone-700 dark:text-stone-300">
          The workflow guide email lands in a few minutes. In the meantime,
          claim your Granola access:
        </p>
        <a
          href={affiliateLink}
          rel="sponsored noopener"
          target="_blank"
          className="block w-full text-center py-4 px-6 rounded-xl bg-charcoal-500 dark:bg-parchment-50 text-parchment-50 dark:text-charcoal-500 font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Open Granola with my partner link →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot field — hidden from humans, auto-filled by bots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="granola-hp-company">Company (leave blank)</label>
        <input
          id="granola-hp-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="granola-email" className="sr-only">
          Email address
        </label>
        <input
          id="granola-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
          className="w-full px-4 py-4 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-charcoal-200 text-charcoal-500 dark:text-parchment-100 text-lg focus:outline-none focus:border-charcoal-500 dark:focus:border-parchment-300"
        />
      </div>

      {state === 'error' && errMsg && (
        <div role="alert" className="text-sm text-red-700 dark:text-red-400">
          {errMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting' || validShape === false}
        className="w-full py-4 px-6 rounded-xl bg-charcoal-500 dark:bg-parchment-50 text-parchment-50 dark:text-charcoal-500 font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'submitting' ? 'Sending…' : 'Send me the guide + my Granola link'}
      </button>
    </form>
  )
}
