'use client'

import { useState } from 'react'

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

  const trimmed = email.trim()
  const validShape = trimmed.length === 0 ? null : EMAIL_RE.test(trimmed)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validShape || state === 'submitting') return
    setState('submitting')
    setErrMsg(null)
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          referrer: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setState('ok')
      onSuccess?.(trimmed)
    } catch (err) {
      setState('error')
      setErrMsg('Something broke. Try again in a moment.')
    }
  }

  if (state === 'ok') {
    return (
      <div className="sp-ok" role="status" aria-live="polite">
        <div className="sp-ok-stamp">
          <span className="sp-ok-stamp-line">Received</span>
          <span className="mark">✓</span>
          <span className="sp-ok-stamp-line">Confirm</span>
          <span className="sp-ok-stamp-line">via email</span>
        </div>
        <h1>Almost there. Check <em>your inbox</em>.</h1>
        <p className="sp-ok-lead">
          A confirmation is en route to <code className="sp-ok-email">{trimmed}</code>. Click the link inside and you&apos;re on the list. If it doesn&apos;t arrive in a couple minutes, check the promotions folder.
        </p>
        <ol className="sp-ok-steps">
          <li>
            <span className="sp-ok-step-body">
              Open the email from <b className="sp-ok-email">zack@zackproser.com</b> &mdash; one line, one link.
            </span>
          </li>
          <li>
            <span className="sp-ok-step-body">
              Click <b>Confirm subscription</b>. No form, no redirect gymnastics.
            </span>
          </li>
          <li>
            <span className="sp-ok-step-body">
              The next issue ships when something worth sending is ready. Nothing else hits your inbox in between.
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
