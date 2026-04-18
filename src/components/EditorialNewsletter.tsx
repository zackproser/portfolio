'use client'

import { useState, FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'
import { sendGTMEvent } from '@next/third-parties/google'

interface EditorialNewsletterProps {
  location?: string
  label?: string
  title?: string
  fine?: string
}

export function EditorialNewsletter({
  location = 'inline',
  label = 'The Modern Coding letter',
  title = 'Applied AI dispatches read by 5,000+ engineers',
  fine = 'No spam. Unsubscribe in one click.',
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

  return (
    <form className="editorial-capture" onSubmit={handleSubscribe} noValidate>
      <div className="editorial-capture-label text-parchment-600 dark:text-slate-400">
        <span className="text-burnt-400 dark:text-amber-400">✱</span>
        <span>{label}</span>
      </div>
      <div className="editorial-capture-title text-burnt-400 dark:text-amber-400">
        {title}
      </div>
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
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe →'}
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
