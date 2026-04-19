'use client'

import { useState } from 'react'
import Link from 'next/link'

const tracks = [
  {
    id: 'consulting',
    num: 'T.01 · Consulting',
    title: 'Retainer or project work.',
    desc: 'RAG pipelines, agent harnesses, eval, developer-tool scoping. Usually 4–12 weeks, part-time.',
    specs: [
      ['Rate', 'From low-thousands'],
      ['Availability', 'Selective'],
      ['Lead time', '2–3 wks'],
    ],
    cta: 'Start a thread →',
    label: 'Consulting',
  },
  {
    id: 'workshops',
    num: 'T.02 · Workshops',
    title: 'Hands-on team training.',
    desc: 'Applied-AI for engineering teams. Half-day, full-day, or multi-day. Remote or on-site.',
    specs: [
      ['Team size', '4–40'],
      ['Pricing', 'Per-head'],
      ['Lead time', '4–6 wks'],
    ],
    cta: 'Request syllabus →',
    label: 'Workshops',
  },
  {
    id: 'speaking',
    num: 'T.03 · Speaking',
    title: 'Conferences & podcasts.',
    desc: 'Applied AI, retrieval, voice-coding velocity, the real-world shape of agent failure modes.',
    specs: [
      ['Format', 'Keynote · Panel'],
      ['Travel', 'Global'],
      ['Lead time', '6–8 wks'],
    ],
    cta: 'Send brief →',
    label: 'Speaking',
  },
  {
    id: 'hello',
    num: 'T.04 · Press & readers',
    title: 'Press, students, readers.',
    desc: 'Interviews, cited essays, students working on something specific, readers of the newsletter. A specific question goes a long way.',
    specs: [
      ['Best for', 'Specific Qs'],
      ['Reply', 'When I can'],
      ['Rate', 'Free'],
    ],
    cta: 'Say hi →',
    label: 'Press / Hello',
  },
]

const faqs = [
  {
    q: 'Are you currently taking new consulting work?',
    a: "Selectively — but always the right thing. I'm only adding work that's a strong fit: applied-AI problems where the plan matters more than the hours. If yours sounds like that, write anyway. Worst case I point you somewhere useful.",
  },
  {
    q: "What's the smallest engagement that makes sense?",
    a: 'Engagements generally start in the low-thousands and scale from there depending on scope. A paid one-day advisory is usually the lightest shape: you get a written plan and a clear next step; it often turns into a longer retainer.',
  },
  {
    q: 'Can you sign our NDA / MSA?',
    a: "Yes — once we've agreed the work is happening. I sign NDAs and MSAs as part of accepting the engagement, not as a step toward one. Standard mutual NDAs are usually same-day; MSAs with heavier indemnity clauses take 1–2 weeks with counsel.",
  },
  {
    q: 'Do you travel for workshops?',
    a: 'Yes. Workshops are priced per head with a minimum, and travel for multi-day engagements is built into that. North America and EU most easily; Asia-Pacific doable with enough lead time. Half-day formats run best remote.',
  },
  {
    q: 'Will you take a commission / advisory equity?',
    a: "Yes — open to both. Commission arrangements and advisory equity work well for early-stage teams where applied AI is a load-bearing part of the product. Structure's flexible; cash + equity mixes are usually where we land.",
  },
  {
    q: 'How fast do you reply?',
    a: "I don't SLA it. Paid-work inquiries get my attention first and usually land a reply within a week or so. Other notes go in the queue and come back when I've got something useful to say. If two weeks go by, a polite nudge is welcome — I'd rather you nudge than assume I'm not interested.",
  },
]

export function ContactContent() {
  const [track, setTrack] = useState('consulting')
  const [scope, setScope] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.elements.namedItem('name')?.value?.trim()
    const email = form.elements.namedItem('email')?.value?.trim()
    const company = form.elements.namedItem('company')?.value?.trim()
    const rawMessage = form.elements.namedItem('message')?.value?.trim()
    if (!name || !email || !rawMessage) {
      setStatus('err')
      setErrorMessage('Please fill in all required fields (Name, Email, and Message)')
      return
    }

    const trackLabel = tracks.find((t) => t.id === track)?.num || track
    const scopeLine = scope ? `Budget / Timeline: ${scope}\n\n` : ''
    const message = `Track: ${trackLabel}\n${scopeLine}${rawMessage}`

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong')
      }
      setStatus('ok')
      form.reset()
      setScope('')
    } catch (err) {
      setStatus('err')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  function handleCopy(value) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(value).then(() => {
      setToast(`Copied ${value}`)
      setTimeout(() => setToast(''), 1600)
    }).catch(() => { /* ignore */ })
  }

  return (
    <div className="contact-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="post-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">Contact</span>
        </div>
      </div>

      {/* Hero */}
      <section className="c-hero">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="kicker">
            § C · <em>Contact</em> · Consulting · Workshops · Speaking
          </div>

          <div className="dispatch">
            <div>
              <h1 className="dispatch-display">
                Send a dispatch. I&apos;ll <em>write back</em> when I&apos;ve got something useful to say.
              </h1>
              <p className="dispatch-lead">
                Four lanes below. Consulting and workshop slots are limited and
                get answered first. I work alone and I reply in waves, not
                minutes — but the more specific your note, the faster I&apos;ll
                have something real to send back.
              </p>
            </div>
            <aside className="dispatch-side">
              <span className="label">Signed</span>
              <div className="a-plate">ZP</div>
              <div className="who">Zachary Proser</div>
              <div className="role">Applied AI · WorkOS</div>
            </aside>
          </div>

          <div className="avail-strip">
            <span className="slot"><span className="dot warn" /><span className="k">Consulting</span>&nbsp;<span className="v">Selective · right fit only</span></span>
            <span className="sep">·</span>
            <span className="slot"><span className="dot" /><span className="k">Workshops</span>&nbsp;<span className="v">Booking · per-head</span></span>
            <span className="sep">·</span>
            <span className="slot"><span className="dot" /><span className="k">Speaking</span>&nbsp;<span className="v">Selectively</span></span>
            <span className="sep">·</span>
            <span className="slot"><span className="dot" /><span className="k">Advisory / equity</span>&nbsp;<span className="v">Open to the right team</span></span>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 tracks-wrap">
          <header className="tracks-head">
            <div className="num">§ 01</div>
            <h2>Pick a track.</h2>
            <span className="more">T.01 — T.04</span>
          </header>

          <div className="tracks-grid">
            {tracks.map((t) => (
              <a
                key={t.id}
                className="track"
                href="#form"
                onClick={() => setTrack(t.id)}
              >
                <div className="track-num">{t.num}</div>
                <h3 className="track-title">{t.title}</h3>
                <p className="track-desc">{t.desc}</p>
                <div className="track-specs">
                  {t.specs.map(([label, value]) => (
                    <div key={label} className="r">
                      <span>{label}</span>
                      <b>{value}</b>
                    </div>
                  ))}
                </div>
                <span className="track-cta">{t.cta}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Form + channels */}
        <div className="container mx-auto max-w-6xl px-4 md:px-6" id="form">
          <div className="dispatch-body">
            {/* Form */}
            <div>
              <div className="db-head">
                <div className="num">§ 02</div>
                <h3>Draft a message.</h3>
              </div>

              <form className="ed-form" onSubmit={handleSubmit} noValidate>
                <div className="ed-field">
                  <div className="ed-label"><span>Track</span><span className="num">01</span></div>
                  <div className="ed-seg" role="radiogroup" aria-label="Engagement track">
                    {tracks.map((t) => (
                      <label key={t.id}>
                        <input
                          type="radio"
                          name="track"
                          value={t.id}
                          checked={track === t.id}
                          onChange={() => setTrack(t.id)}
                        />
                        <span>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ed-row">
                  <div className="ed-field">
                    <div className="ed-label"><span>Name</span><span className="num">02</span></div>
                    <input className="ed-input" type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className="ed-field">
                    <div className="ed-label"><span>Email</span><span className="num">03</span></div>
                    <input className="ed-input" type="email" name="email" placeholder="you@company.com" required />
                  </div>
                </div>

                <div className="ed-row">
                  <div className="ed-field">
                    <div className="ed-label"><span>Company</span><span className="num">04</span></div>
                    <input className="ed-input" type="text" name="company" placeholder="Optional" />
                  </div>
                  <div className="ed-field">
                    <div className="ed-label"><span>Budget / Timeline</span><span className="num">05</span></div>
                    <select
                      className="ed-select"
                      name="scope"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                    >
                      <option value="">Select —</option>
                      <option>Under $10k · 1–2 wks</option>
                      <option>$10–25k · 1 month</option>
                      <option>$25–75k · 1 quarter</option>
                      <option>$75k+ · Ongoing retainer</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div className="ed-field">
                  <div className="ed-label"><span>Message</span><span className="num">06</span></div>
                  <textarea
                    className="ed-textarea"
                    name="message"
                    placeholder="What are you trying to ship? What shape is the team? What have you tried? A short paragraph is fine."
                    required
                  />
                </div>

                {status === 'ok' ? (
                  <div className="form-status ok" role="status">
                    ✓ Sent. I&apos;ll reply in waves — paid work first.
                  </div>
                ) : status === 'err' ? (
                  <div className="form-status err" role="alert">
                    {errorMessage || 'Something went wrong. Email zackproser@gmail.com instead.'}
                  </div>
                ) : null}

                <div className="ed-submit-row">
                  <span className="fine">Forwarded to zackproser@gmail.com · paid work answered first</span>
                  <button className="ed-submit" type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending…' : 'Send dispatch'} <span>→</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Channels */}
            <aside>
              <div className="db-head">
                <div className="num">§ 03</div>
                <h3>Or reach directly.</h3>
              </div>

              <div className="channels">
                <button
                  type="button"
                  className="channel"
                  onClick={() => handleCopy('zackproser@gmail.com')}
                >
                  <div className="ch-icon">@</div>
                  <div className="ch-body">
                    <div className="ch-title">Email</div>
                    <div className="ch-sub">zackproser@gmail.com</div>
                  </div>
                  <div className="ch-go">Copy →</div>
                </button>
                <a className="channel" href="https://cal.com/zackproser/30min" target="_blank" rel="noopener noreferrer">
                  <div className="ch-icon">◷</div>
                  <div className="ch-body">
                    <div className="ch-title">Book a 30-min intro</div>
                    <div className="ch-sub">cal.com/zackproser · usually same-week</div>
                  </div>
                  <div className="ch-go">Schedule →</div>
                </a>
                <a className="channel" href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">
                  <div className="ch-icon">in</div>
                  <div className="ch-body">
                    <div className="ch-title">LinkedIn</div>
                    <div className="ch-sub">linkedin.com/in/zackproser</div>
                  </div>
                  <div className="ch-go">Open →</div>
                </a>
                <a className="channel" href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">
                  <div className="ch-icon">{'{ }'}</div>
                  <div className="ch-body">
                    <div className="ch-title">GitHub</div>
                    <div className="ch-sub">github.com/zackproser</div>
                  </div>
                  <div className="ch-go">Open →</div>
                </a>
                <a className="channel" href="https://x.com/zackproser" target="_blank" rel="noopener noreferrer">
                  <div className="ch-icon">𝕏</div>
                  <div className="ch-body">
                    <div className="ch-title">Twitter / X</div>
                    <div className="ch-sub">@zackproser</div>
                  </div>
                  <div className="ch-go">Open →</div>
                </a>
                <Link className="channel" href="/newsletter">
                  <div className="ch-icon">✉</div>
                  <div className="ch-body">
                    <div className="ch-title">Modern Coding newsletter</div>
                    <div className="ch-sub">5,000+ engineers · monthly</div>
                  </div>
                  <div className="ch-go">Subscribe →</div>
                </Link>
              </div>

              <div className="channels-foot">
                <span>GMT−5</span>
                <span>PGP on request</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-wrap">
        <div className="faq-inner">
          <div className="faq-head">
            <span>§ 04 · Before you write</span>
            <strong>Six quick answers</strong>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={i} open={i === 0}>
                <summary>
                  <span className="num">Q.{String(i + 1).padStart(2, '0')}</span>
                  <span className="q">{f.q}</span>
                  <span className="chev">+</span>
                </summary>
                <p className="a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Copy toast */}
      <div className={`toast${toast ? ' visible' : ''}`} aria-live="polite">
        {toast}
      </div>
    </div>
  )
}
