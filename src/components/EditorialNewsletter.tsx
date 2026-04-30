'use client'

import { useState, FormEvent, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'
import { sendGTMEvent } from '@next/third-parties/google'

interface EditorialNewsletterProps {
  location?: string
  label?: string
  title?: string
  fine?: string
  /** Rendering style. `inline` (default) is the bare under-lede form;
   * `card` is the bordered, accent-shadowed capture card used in the hero. */
  variant?: 'inline' | 'card'
  /** Optional secondary copy block shown between title and form (card variant). */
  promise?: ReactNode
  /** Optional meta caption shown next to the label (card variant). */
  meta?: string
  /** Submit button label. Defaults to "Subscribe →". */
  ctaLabel?: string
}

export function EditorialNewsletter({
  location = 'inline',
  label = 'The Modern Coding letter',
  title = 'Applied AI dispatches read by 5,000+ engineers',
  fine = 'No spam. Unsubscribe in one click.',
  variant = 'inline',
  promise,
  meta,
  ctaLabel = 'Subscribe →',
}: EditorialNewsletterProps) {
  const referrer = usePathname()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    if (!email) return

    setStatus('submitting')
    setErrorMessage('')

    track('newsletter-signup', { location })
    sendGTMEvent({
      event: 'newsletter-signup-conversion',
      method: 'newsletter',
      source: referrer,
      position: location,
      tags: '',
      slug: referrer?.split('/').pop() || 'homepage',
    })

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer, tags: [] }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.data || 'Failed to subscribe')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const isCard = variant === 'card'

  return (
    <form
      className={isCard ? 'editorial-capture editorial-capture--card' : 'editorial-capture'}
      onSubmit={handleSubscribe}
      noValidate
    >
      <div
        className={
          isCard
            ? 'editorial-capture-label editorial-capture-label--card text-burnt-400 dark:text-amber-400'
            : 'editorial-capture-label text-parchment-600 dark:text-slate-400'
        }
      >
        <span className={isCard ? 'editorial-capture-tick' : 'text-burnt-400 dark:text-amber-400'}>✱</span>
        <span>{label}</span>
        {isCard && meta ? (
          <span className="editorial-capture-meta text-parchment-500 dark:text-slate-400">{meta}</span>
        ) : null}
      </div>
      <div
        className={
          isCard
            ? 'editorial-capture-title editorial-capture-title--card text-charcoal-50 dark:text-parchment-100'
            : 'editorial-capture-title text-burnt-400 dark:text-amber-400'
        }
      >
        {title}
      </div>
      {isCard && promise ? (
        <p className="editorial-capture-promise text-parchment-600 dark:text-slate-300">{promise}</p>
      ) : null}
      {status === 'success' ? (
        <div className="editorial-capture-fine text-burnt-400 dark:text-amber-400" role="status">
          ✓ Subscribed. Check your inbox to confirm.
        </div>
      ) : (
        <>
          <div className="editorial-capture-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              aria-label="Email"
              disabled={status === 'submitting'}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center px-5 py-[13px] text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors disabled:opacity-60"
            >
              {status === 'submitting' ? 'Subscribing…' : ctaLabel}
            </button>
          </div>
          <div className="editorial-capture-fine text-parchment-500 dark:text-slate-500">
            {status === 'error' && errorMessage ? errorMessage : fine}
          </div>
        </>
      )}
    </form>
  )
}
