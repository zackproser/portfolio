'use client'

import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'

// RFP desk — the workshop-commission form, in the drawing metaphor.
// Where the RFI desk answers questions about the drawing, the RFP desk
// takes a request for the real thing: a workshop built for your room.
// Posts to the existing /api/consultation endpoint (Postmark email).

export function BlueprintRfpDesk({ drawingCode }: { drawingCode: string }) {
  const pathname = usePathname()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [started, setStarted] = useState(false)
  const [renderTs] = useState(() => Date.now())
  const location = `blueprint:rfp:${drawingCode}`

  const onFocusStart = () => {
    if (!started) {
      setStarted(true)
      track('blueprint-rfp-start', { location })
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const field = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value?.trim() ?? ''
    const name = field('name')
    const email = field('email')
    if (!name || !email) return
    setStatus('submitting')
    track('blueprint-rfp-submit', { location })
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: field('company'),
          phoneNumber: '',
          message: `[Workshop RFP via ${pathname}]\n\nRoom: ${field('room')}\n\nOutcome wanted: ${field('outcome')}`,
          hp: field('website_url'),
          _t: renderTs,
        }),
      })
      if (!response.ok) throw new Error('rfp failed')
      track('blueprint-rfp-success', { location })
      setStatus('done')
    } catch {
      track('blueprint-rfp-error', { location })
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="bp-rfp" id="rfp" data-sec="rfp" data-num="C" data-label="RFP desk">
        <div className="bp-rfp-strip">
          <span>APPENDIX C — RFP DESK · REQUEST FOR PROPOSAL</span>
          <span className="bp-num">{drawingCode}-C</span>
        </div>
        <div className="bp-rfp-body">
          <div className="bp-capture-recorded">
            ✓ RFP RECEIVED — YOU&apos;LL HEAR BACK WITHIN ONE BUSINESS DAY WITH A PROPOSED SCOPE
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="bp-rfp" id="rfp" data-sec="rfp" data-num="C" data-label="RFP desk" onSubmit={handleSubmit} noValidate>
      <div className="bp-rfp-strip">
        <span>APPENDIX C — RFP DESK · REQUEST FOR PROPOSAL</span>
        <span className="bp-num">{drawingCode}-C</span>
      </div>
      <div className="bp-rfp-body">
        <p className="bp-rfp-pitch">
          Commission this for your team. Describe the room and the outcome you want; you&apos;ll get back a
          proposed scope — artifacts included — within one business day.
        </p>
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" aria-hidden="true" className="bp-hp" />
        <div className="bp-rfp-grid">
          <label className="bp-rfp-field">
            <span>NAME</span>
            <input type="text" name="name" required autoComplete="name" onFocus={onFocusStart} className="bp-capture-input" />
          </label>
          <label className="bp-rfp-field">
            <span>WORK EMAIL</span>
            <input type="email" name="email" required autoComplete="email" onFocus={onFocusStart} className="bp-capture-input" />
          </label>
          <label className="bp-rfp-field">
            <span>COMPANY</span>
            <input type="text" name="company" autoComplete="organization" onFocus={onFocusStart} className="bp-capture-input" />
          </label>
          <label className="bp-rfp-field">
            <span>THE ROOM</span>
            <input
              type="text"
              name="room"
              placeholder="e.g. 40 engineers + 10 leaders, mixed AI experience"
              onFocus={onFocusStart}
              className="bp-capture-input"
            />
          </label>
          <label className="bp-rfp-field bp-rfp-field--wide">
            <span>WHAT SHOULD THE ROOM BE ABLE TO DO AFTERWARD?</span>
            <textarea
              name="outcome"
              rows={3}
              placeholder="e.g. every engineer ships one working agent; leaders can evaluate AI project proposals"
              onFocus={onFocusStart}
              className="bp-capture-input bp-rfp-textarea"
            />
          </label>
        </div>
        <div className="bp-rfp-actions">
          <button type="submit" className="bp-capture-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'FILING…' : 'FILE THE RFP →'}
          </button>
          {status === 'error' && (
            <span className="bp-capture-error">That didn&apos;t go through — try again or email directly.</span>
          )}
        </div>
      </div>
    </form>
  )
}
