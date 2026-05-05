'use client'

import { useState } from 'react'
import Link from 'next/link'

const PARTNERSHIPS_EMAIL = 'zackproser@gmail.com'

const rates = [
  {
    num: 'P.01 · Sponsored article (deep review)',
    status: { label: '2 slots / mo', tone: 'ok' },
    title: 'A long-form, hands-on review of your product.',
    desc:
      "I install it, build something real with it, and write 3,000+ words about what worked and what didn't. Disclosure on top. You don't get edit rights; you get the kind of review that actually persuades engineers.",
    meta: [
      ['Format', '3,000+ words'],
      ['Lead time', '4–6 wks'],
      ['Reach', 'Newsletter + SEO'],
    ],
    price: { from: 'From', amount: '$8,500' },
  },
  {
    num: 'P.02 · Newsletter — primary sponsor',
    status: { label: 'Booking 8 wks out', tone: 'warn' },
    title: 'Top slot in the monthly Modern Coding send.',
    desc:
      "Above-the-fold placement: 100-word write-up in my voice, your CTA, your logo. One sponsor per issue. I've read the docs and used the product before I'll write the slot.",
    meta: [
      ['Reach', '5,000+ seniors'],
      ['Cadence', 'Monthly'],
      ['Lead time', '4–6 wks'],
    ],
    price: { from: 'From', amount: '$2,400', suffix: '/ send' },
  },
  {
    num: 'P.03 · Newsletter — dedicated send',
    status: { label: '1 / quarter', tone: 'ok' },
    title: 'A whole issue, just about your product.',
    desc:
      "Reserved for products I'd actually write about unsponsored. Same editorial standard, same disclosure. One per quarter, max.",
    meta: [
      ['Format', 'Full issue'],
      ['Lead time', '6–8 wks'],
      ['Frequency', '≤ 4 / yr'],
    ],
    price: { from: 'From', amount: '$6,800' },
  },
  {
    num: 'P.04 · Newsletter classified',
    status: { label: '3 slots / issue', tone: 'ok' },
    title: 'A clearly-labeled, lower-friction slot.',
    desc:
      'A short job listing, product launch, or event. ~60 words, one link, marked “Classified.” Quick to book, quick to ship.',
    meta: [
      ['Format', '~60 words'],
      ['Lead time', '1–2 wks'],
      ['Slots', '3 / issue'],
    ],
    price: { from: 'From', amount: '$650' },
  },
  {
    num: 'P.05 · Affiliate partnership',
    status: { label: 'Open · selectively', tone: 'ok' },
    title: 'Long-tail evergreen reviews + tooling pages.',
    desc:
      "For tools I already cover or am about to. Performance-based, with a public disclosure on every page. I won't add affiliate links to existing articles retroactively.",
    meta: [
      ['Model', 'Rev-share'],
      ['Term', '12-mo min'],
      ['Categories', 'AI / dev tools'],
    ],
    price: { from: 'Typically', amount: '15–30%' },
  },
  {
    num: 'P.06 · Workshop & training collab',
    status: { label: 'Q3+ MMXXVI', tone: 'ok' },
    title: 'Co-built, co-branded applied-AI training.',
    desc:
      'For platform & tooling companies whose customers I would already train. Co-developed curriculum, joint promotion, your logo on the cert.',
    meta: [
      ['Format', '½ — 3 days'],
      ['Audience', 'Your users + mine'],
      ['Lead time', '8–12 wks'],
    ],
    price: { from: 'From', amount: '$25k' },
  },
  {
    num: 'P.07 · Podcast / YouTube sponsorship',
    status: { label: 'Limited inventory', tone: 'warn' },
    title: 'Read or shown on the next applied-AI essay-video.',
    desc:
      'Pre-roll or mid-roll, scripted in my voice, capped at one sponsor per video. Slow cadence, real attention from people who already lean in.',
    meta: [
      ['Format', '60–90 sec'],
      ['Cadence', '~1 / mo'],
      ['Channels', 'YT + podcast'],
    ],
    price: { from: 'From', amount: '$1,800' },
  },
  {
    num: 'P.08 · Quarterly retainer',
    status: { label: '1–2 partners', tone: 'ok' },
    title: 'A predictable presence, with a real plan behind it.',
    desc:
      'Bundled article + newsletter + classified + video coverage across the quarter, with a roadmap call up front and a reporting note at the end. The way to stop negotiating one slot at a time.',
    meta: [
      ['Term', 'Quarterly'],
      ['Mix', 'Article + 3 sends'],
      ['Cap', '2 partners / qtr'],
    ],
    price: { from: 'From', amount: '$28k', suffix: '/ qtr' },
  },
]

const editorial = [
  {
    lede: 'I have to use the tool first.',
    gloss:
      'Before I write a slot, I install it, run it on something real, and form an opinion. That is the entire reason this audience reads me.',
  },
  {
    lede: 'Recommendations are honest.',
    gloss:
      "If something is mid, the slot says so or it doesn't run. You're paying for placement, not a verdict.",
  },
  {
    lede: 'Sponsored content is disclosed.',
    gloss:
      'Above the fold, in plain language: “This is sponsored by X.” FTC-compliant, and the disclosure stays after the campaign ends.',
  },
  {
    lede: 'No edit rights, but there is a review.',
    gloss:
      'You see the draft and can flag factual errors and confidential claims. The shape of the take is mine.',
  },
  {
    lede: 'Affiliate links are evergreen, not retrofitted.',
    gloss:
      "I don't sneak affiliate links into old articles. New coverage carries its own disclosure block.",
  },
]

const wontRun = [
  {
    lede: 'Link exchanges.',
    gloss:
      'Trading links to game search rankings — even via a “guest post.” Auto-archived to spam.',
  },
  {
    lede: 'Generic guest posts.',
    gloss:
      'Filler written for backlinks, not readers. There is no version of this I publish.',
  },
  {
    lede: 'Aggregator / SEO-mill content.',
    gloss:
      "Roundups built from re-skinned listicles. If you've sent the same pitch to fifty sites this week, no.",
  },
  {
    lede: 'AI-generated placements.',
    gloss:
      "Drafts the model wrote and you didn't read. I won't put my name on it; you shouldn't either.",
  },
  {
    lede: 'Pay-for-positive-review.',
    gloss:
      'A guaranteed positive verdict in exchange for money. Not what this audience pays attention for.',
  },
  {
    lede: 'Crypto, gambling, get-rich-quick.',
    gloss: 'Out of scope for this property regardless of budget.',
  },
]

const procSteps = [
  {
    pn: '01 · Inquire',
    title: 'You send a brief.',
    body:
      'The form below, or an email. Specific beats polished. Tell me what the product is, who it is for, the format you want.',
    when: 'Same week',
  },
  {
    pn: '02 · Fit check',
    title: 'I say yes, no, or “let’s talk.”',
    body:
      "If your product fits the audience and there's a slot, I send back a quote and a calendar window. If it doesn't, I'll say so.",
    when: '~1 week',
  },
  {
    pn: '03 · Brief & access',
    title: 'I get hands-on.',
    body:
      'You give me access, docs, and a contact for technical questions. I install, build, and form a take.',
    when: '1–3 weeks',
  },
  {
    pn: '04 · Draft & review',
    title: 'You see the draft.',
    body:
      'One round of fact-checking. Confidentiality flags honored. Disclosure block included from the first version.',
    when: '~3 days',
  },
  {
    pn: '05 · Ship & report',
    title: 'It runs. You get numbers.',
    body:
      'Article publishes, newsletter sends, slot drops. Two weeks later you get a short report: opens, clicks, traffic, anything notable.',
    when: 'Day-of + 14d',
  },
]

export function PartnershipsContent() {
  const [format, setFormat] = useState('article')
  const [budget, setBudget] = useState('')
  const [timing, setTiming] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.elements.namedItem('name')?.value?.trim()
    const email = form.elements.namedItem('email')?.value?.trim()
    const company = form.elements.namedItem('company')?.value?.trim()
    const brief = form.elements.namedItem('brief')?.value?.trim()

    if (!name || !email || !brief) {
      setStatus('err')
      setErrorMessage('Please fill in Name, Email, and the brief.')
      return
    }

    const formatLabel =
      rates.find((r) => r.num.toLowerCase().includes(format))?.num ||
      `Format: ${format}`
    const lines = [
      `Partnership inquiry — ${formatLabel}`,
      budget ? `Budget: ${budget}` : null,
      timing ? `Timing: ${timing}` : null,
      '',
      brief,
    ].filter(x => x != null)

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          message: lines.join('\n'),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong')
      }
      setStatus('ok')
      form.reset()
      setBudget('')
      setTiming('')
      setFormat('article')
    } catch (err) {
      setStatus('err')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="contact-page partnerships-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="post-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">Partnerships</span>
        </div>
      </div>

      {/* Hero */}
      <section className="c-hero">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="kicker">
            § P · <em>Partnerships</em> · Sponsored Articles · Newsletter ·
            Affiliates · Workshops
          </div>

          <div className="dispatch">
            <div>
              <div className="brand-lockup">
                <b>Modern Coding</b> <span className="slash">/</span>{' '}
                <em>zackproser.com</em> <span className="slash">·</span> rate
                card
              </div>
              <h1 className="dispatch-display">
                A senior-engineering audience that{' '}
                <em>actually reads</em> the long stuff.
              </h1>
              <p className="dispatch-lead">
                If your product is good and your team has done the work, there
                are real ways for us to work together. Below is what I run, who
                reads it, what it costs, and the editorial line I won&apos;t
                cross. No agencies, no aggregators, no link-for-link trades.
              </p>
            </div>
            <aside className="dispatch-side">
              <span className="label">Issued</span>
              <div className="a-plate">ZP</div>
              <div className="who">Zachary Proser</div>
              <div className="role">
                Editor &amp; Publisher · Brooklyn, NY · GMT−5 · current rate
                card
              </div>
            </aside>
          </div>

          {/* Audience numbers — only the two confirmed metrics + qualitative cells */}
          <div className="aud-slab">
            <div className="aud-cell">
              <div className="aud-k">Newsletter</div>
              <div className="aud-v">
                5,000<span className="unit">+ readers</span>
              </div>
              <div className="aud-sub">Modern Coding · monthly</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Search impressions</div>
              <div className="aud-v">
                8.77<span className="unit">M / yr</span>
              </div>
              <div className="aud-sub">Google Search Console · trailing 12 months</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Audience</div>
              <div className="aud-v"><em>Senior</em> eng.</div>
              <div className="aud-sub">Staff/principal, EM, founders. Applied AI &amp; infra.</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Editorial</div>
              <div className="aud-v">
                1<span className="unit">human</span>
              </div>
              <div className="aud-sub">No syndication. No outsourced drafts.</div>
            </div>
          </div>

          <div className="avail-strip" style={{ marginTop: 24 }}>
            <span className="slot">
              <span className="dot" />
              <span className="k">Sponsored articles</span>&nbsp;
              <span className="v">2 slots / mo</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot warn" />
              <span className="k">Newsletter primary</span>&nbsp;
              <span className="v">Booking 8 weeks out</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot" />
              <span className="k">Affiliates</span>&nbsp;
              <span className="v">Open · selectively</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot" />
              <span className="k">Workshops &amp; events</span>&nbsp;
              <span className="v">Q3+</span>
            </span>
          </div>
        </div>
      </section>

      {/* Rate card */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 rates-wrap">
          <header className="rates-head">
            <div className="num">§ 01</div>
            <h2>What&apos;s <em>on offer</em>.</h2>
            <span className="more">P.01 — P.08</span>
          </header>

          <div className="rates-grid">
            {rates.map((r) => (
              <a key={r.num} className="rate" href="#intake">
                <div className="rate-top">
                  <span className="rate-num">{r.num}</span>
                  <span className={`rate-status${r.status.tone === 'warn' ? ' warn' : ''}`}>
                    <span className="dot" />
                    {r.status.label}
                  </span>
                </div>
                <h3 className="rate-title">{r.title}</h3>
                <p className="rate-desc">{r.desc}</p>
                <div className="rate-meta">
                  {r.meta.map(([k, v]) => (
                    <div key={k} className="m">
                      <div className="mk">{k}</div>
                      <div className="mv">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rate-foot">
                  <div className="price">
                    <span className="from">{r.price.from}</span>{' '}
                    <b>{r.price.amount}</b>
                    {r.price.suffix && (
                      <span className="suffix">{r.price.suffix}</span>
                    )}
                  </div>
                  <div className="cta">Inquire →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial standards / Won't run */}
      <section>
        <div className="standards-wrap">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 standards-grid">
            <div>
              <header className="stand-head">
                <span className="num">§ 02</span>
                <h3>The <em>editorial line</em>.</h3>
              </header>
              <ul className="stand-list">
                {editorial.map((s) => (
                  <li key={s.lede}>
                    <span className="glyph">✓</span>
                    <span>
                      <span className="lede">{s.lede}</span>
                      <span className="gloss">{s.gloss}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <header className="stand-head">
                <span className="num">§ 03</span>
                <h3>What I <em>won&apos;t</em> run.</h3>
              </header>
              <ul className="stand-list">
                {wontRun.map((s) => (
                  <li key={s.lede}>
                    <span className="glyph no">×</span>
                    <span>
                      <span className="lede">{s.lede}</span>
                      <span className="gloss">{s.gloss}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 proc-wrap">
          <header className="proc-head">
            <span className="num">§ 04</span>
            <h2>How a <em>campaign</em> actually runs.</h2>
          </header>
          <div className="proc-grid">
            {procSteps.map((s) => (
              <div key={s.pn} className="proc-step">
                <div className="pn">{s.pn}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <span className="when">{s.when}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intake */}
      <section id="intake">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 intake-wrap">
          <div className="intake-grid">
            <div>
              <div className="db-head">
                <div className="num">§ 05</div>
                <h3>Send a brief.</h3>
              </div>
              <p className="intake-lead">
                A paragraph or two of real context beats five rounds of
                pleasantries. Forwarded to{' '}
                <code>{PARTNERSHIPS_EMAIL}</code>.
              </p>

              <form className="ed-form" onSubmit={handleSubmit} noValidate>
                <div className="ed-field">
                  <div className="ed-label">
                    <span>Format</span>
                    <span className="num">01</span>
                  </div>
                  <div className="ed-seg" role="radiogroup" aria-label="Partnership format">
                    {[
                      ['article', 'Article'],
                      ['newsletter', 'Newsletter'],
                      ['affiliate', 'Affiliate'],
                      ['retainer', 'Retainer'],
                      ['other', 'Not sure'],
                    ].map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="format"
                          value={value}
                          checked={format === value}
                          onChange={() => setFormat(value)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ed-row">
                  <div className="ed-field">
                    <div className="ed-label">
                      <span>Your name</span>
                      <span className="num">02</span>
                    </div>
                    <input
                      className="ed-input"
                      type="text"
                      name="name"
                      placeholder="Who's writing"
                      required
                    />
                  </div>
                  <div className="ed-field">
                    <div className="ed-label">
                      <span>Email</span>
                      <span className="num">03</span>
                    </div>
                    <input
                      className="ed-input"
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="ed-row">
                  <div className="ed-field">
                    <div className="ed-label">
                      <span>Company / product</span>
                      <span className="num">04</span>
                    </div>
                    <input
                      className="ed-input"
                      type="text"
                      name="company"
                      placeholder="Acme Vector DB · acme.dev"
                    />
                  </div>
                  <div className="ed-field">
                    <div className="ed-label">
                      <span>Budget tier</span>
                      <span className="num">05</span>
                    </div>
                    <select
                      className="ed-select"
                      name="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="">Select —</option>
                      <option>Under $2.5k · classified / single send</option>
                      <option>$2.5k – $10k · single placement</option>
                      <option>$10k – $30k · article or workshop</option>
                      <option>$30k+ · quarterly retainer</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div className="ed-field">
                  <div className="ed-label">
                    <span>What is it &amp; who&apos;s it for?</span>
                    <span className="num">06</span>
                  </div>
                  <textarea
                    className="ed-textarea"
                    name="brief"
                    placeholder="One paragraph: what the product does, who it's built for, and why this audience in particular. If you've used my work before, mention what you read."
                    required
                  />
                </div>

                <div className="ed-field">
                  <div className="ed-label">
                    <span>Timing</span>
                    <span className="num">07</span>
                  </div>
                  <select
                    className="ed-select"
                    name="timing"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                  >
                    <option value="">Select —</option>
                    <option>ASAP — within 4 wks</option>
                    <option>Next quarter</option>
                    <option>Next 6 months</option>
                    <option>Flexible</option>
                  </select>
                </div>

                {status === 'ok' ? (
                  <div className="form-status ok" role="status">
                    ✓ Sent. I&apos;ll reply within ~5 business days.
                  </div>
                ) : status === 'err' ? (
                  <div className="form-status err" role="alert">
                    {errorMessage || `Something went wrong. Email ${PARTNERSHIPS_EMAIL} instead.`}
                  </div>
                ) : null}

                <div className="ed-submit-row">
                  <span className="fine">
                    → {PARTNERSHIPS_EMAIL} · reply within 5 business days
                  </span>
                  <button
                    className="ed-submit"
                    type="submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send brief'}{' '}
                    <span>→</span>
                  </button>
                </div>
              </form>
            </div>

            <aside className="intake-side">
              <div>
                <h4>Why publish pricing</h4>
                <p>
                  Because we&apos;d both rather skip the &ldquo;send budget&rdquo;
                  back-and-forth. Numbers above are real{' '}
                  <span className="dim">starting</span> rates — quarterly
                  retainers and bundles drop them; rush turnaround raises them.
                </p>
              </div>

              <div>
                <h4>Direct line</h4>
                <p className="direct">
                  <a href={`mailto:${PARTNERSHIPS_EMAIL}`}>{PARTNERSHIPS_EMAIL}</a>
                </p>
                <p>
                  For serious inquiries with a brief attached. Auto-replies and
                  pitch templates land in spam.
                </p>
              </div>

              <div>
                <h4>Engineering background</h4>
                <p className="partners">
                  Pinecone (vector DB / RAG) · Gruntwork (Terragrunt &amp;
                  OpenTofu) · Cloudflare (workers, edge) · Cloudmark / Proofpoint
                  (anti-spam) ·{' '}
                  <em>currently WorkOS, applied AI</em>.
                </p>
              </div>

              <div>
                <h4>See for yourself</h4>
                <ul className="proof-links">
                  <li>
                    <Link href="/speaking">
                      <span className="pl-num">→ 01</span>
                      <span className="pl-name">Speaking</span>
                      <span className="pl-meta">conferences &amp; podcasts</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/publications">
                      <span className="pl-num">→ 02</span>
                      <span className="pl-name">Publications</span>
                      <span className="pl-meta">where my writing runs</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonials">
                      <span className="pl-num">→ 03</span>
                      <span className="pl-name">Testimonials</span>
                      <span className="pl-meta">what colleagues &amp; clients say</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/videos">
                      <span className="pl-num">→ 04</span>
                      <span className="pl-name">Videos</span>
                      <span className="pl-meta">essay-videos &amp; demos</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
