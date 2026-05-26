'use client'

import { useRef, useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type State = 'idle' | 'submitting' | 'ok' | 'error'

export function SubscribeForm({
  fieldNum = '01',
  submitLabel = 'Count me in',
  onSuccess,
}: {
  fieldNum?: string
  submitLabel?: string
  onSuccess?: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  // Honeypot bait. Real humans never see or touch this — bots that auto-fill
  // every field by name do, which is the spam signal we forward to the server.
  const [hp, setHp] = useState('')
  // Synchronous in-flight flag. React's setState is async, so two rapid
  // clicks could both pass `state === 'submitting'` before the state update
  // propagates. The ref flips immediately so the second handler bails out.
  const inFlightRef = useRef(false)

  const trimmed = email.trim()
  const validShape = trimmed.length === 0 ? null : EMAIL_RE.test(trimmed)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validShape || inFlightRef.current) return
    inFlightRef.current = true
    setState('submitting')
    setErrMsg(null)
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          referrer: typeof window !== 'undefined' ? window.location.pathname : '',
          hp,
        }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setState('ok')
      onSuccess?.(trimmed)
    } catch (err) {
      setState('error')
      setErrMsg('Something broke. Try again in a moment.')
      // Release the guard only on error so the user can retry. Success paths
      // stay locked (the success UI replaces the form anyway).
      inFlightRef.current = false
    }
  }

  if (state === 'ok') {
    return (
      <div className="sp-ok" role="status" aria-live="polite">
        <div className="sp-ok-stamp">
          <span className="sp-ok-stamp-line">On the</span>
          <span className="mark">✓</span>
          <span className="sp-ok-stamp-line">list</span>
        </div>
        <h1>You&apos;re in. Welcome email <em>incoming</em>.</h1>
        <p className="sp-ok-lead">
          <code className="sp-ok-email">{trimmed}</code> is on the list. Your first email lands in a few minutes &mdash; check the promotions folder if it&apos;s slow to arrive.
        </p>
        <ol className="sp-ok-steps">
          <li>
            <span className="sp-ok-step-body">
              The welcome series is six emails over six weeks. Each one short, each one useful.
            </span>
          </li>
          <li>
            <span className="sp-ok-step-body">
              After that, you&apos;ll get one essay per week — a year-long curated drip of my best work, then new writing as it ships.
            </span>
          </li>
          <li>
            <span className="sp-ok-step-body">
              One-click unsubscribe in every email. No form, no redirect gymnastics.
            </span>
          </li>
        </ol>
      </div>
    )
  }

  const validateClass =
    validShape === true ? 'valid' : validShape === false ? 'invalid' : ''
  const validateMsgClass =
    validShape === true ? 'ok' : validShape === false ? 'bad' : ''
  const validateMsg =
    validShape === true
      ? `· looks good · press ${submitLabel.toLowerCase()}`
      : validShape === false
      ? '· expected shape: name@domain.tld'
      : ''

  return (
    <form className="sp-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot. Off-screen + aria/tab hidden — real users never see, focus,
          or submit this. Most form-spam bots auto-fill every named input,
          which becomes the spam signal the server short-circuits on. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor={`sp-hp-${fieldNum}`}>Leave this empty</label>
        <input
          id={`sp-hp-${fieldNum}`}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>
      <div className={`sp-field ${validateClass}`}>
        <label className="sp-field-label" htmlFor={`sp-email-${fieldNum}`}>
          <span>Your email</span>
          <span className="num">{fieldNum}</span>
        </label>
        <input
          id={`sp-email-${fieldNum}`}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'submitting'}
        />
        <div className={`sp-validate ${validateMsgClass}`} role="status">
          {state === 'error' && errMsg ? `· ${errMsg}` : validateMsg}
        </div>
      </div>
      <button
        type="submit"
        className="sp-submit"
        disabled={state === 'submitting' || validShape !== true}
      >
        {state === 'submitting' ? 'Sending…' : submitLabel}
        <span className="arrow">→</span>
      </button>
    </form>
  )
}
