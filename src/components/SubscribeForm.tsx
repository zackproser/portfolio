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
          Received
          <span className="mark">✓</span>
          confirm via email
        </div>
        <h1>Almost there. Check <em>your inbox</em>.</h1>
        <p className="sp-ok-lead">
          A confirmation is en route to <code>{trimmed}</code>. Click the link inside and you&apos;re on the list. If it doesn&apos;t arrive within a couple minutes, check the promotions folder.
        </p>
        <ol>
          <li>
            Open the email from <b>zack@zackproser.com</b>. One line, one link.
          </li>
          <li>
            Click <b>Confirm subscription</b>. No form, no redirect gymnastics.
          </li>
          <li>
            The next issue lands on the first of the month. Nothing else hits your inbox between now and then.
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
      ? '· looks good · press subscribe'
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
        disabled={state === 'submitting' || validShape === false}
      >
        {state === 'submitting' ? 'Sending…' : submitLabel}
        <span className="arrow">→</span>
      </button>
    </form>
  )
}
