import Link from 'next/link'

const CONTACT_EMAIL = 'zackproser@gmail.com'

const roles = [
  {
    num: 'R.01 · AI/ML engineering',
    status: { label: 'Selectively', tone: 'ok' },
    title: 'Senior+ engineer building applied AI in production.',
    desc:
      'Retrieval, agents, evals, ML infra. Real systems shipping to real users. Not research-only — I ship; I don’t write papers.',
    meta: [
      ['Level', 'Senior → Principal'],
      ['Stack', 'Python/TS · LLMs · infra'],
      ['Mode', 'IC'],
    ],
  },
  {
    num: 'R.02 · Applied AI / ML platform',
    status: { label: 'Open', tone: 'ok' },
    title: 'Build the substrate teams use to ship AI internally.',
    desc:
      'Eval frameworks, model-routing, agent runtimes, retrieval pipelines, observability. The closer to the metal of real LLM systems, the better.',
    meta: [
      ['Type', 'Platform / infra'],
      ['Team', '∼5–25 engineers'],
      ['Mode', 'IC or TL'],
    ],
  },
  {
    num: 'R.03 · Anthropic / OpenAI · any role',
    status: { label: 'Always · any role', tone: 'ok' },
    title: 'The two labs I’d hear out for almost anything.',
    desc:
      'Engineering, applied research, infra — happy to chat. The frontier labs are the exception to most of my other filters.',
    meta: [
      ['Companies', 'Anthropic · OpenAI'],
      ['Roles', 'Engineering / applied'],
      ['Bar', 'Their bar, I trust'],
    ],
  },
  {
    num: 'R.04 · Anthropic / OpenAI DevRel',
    status: { label: 'Sole DevRel exception', tone: 'ok' },
    title: 'The only DevRel role I’d actively consider.',
    desc:
      "Everywhere else, I'm not interested in DevRel. The frontier labs are the exception — their audience is the one worth speaking to from that seat.",
    meta: [
      ['Roles', 'DevRel · DX · Advocate'],
      ['Companies', 'Anthropic · OpenAI'],
      ['Mode', 'Hybrid OK'],
    ],
  },
]

const yesSignals = [
  {
    lede: 'Personalized.',
    gloss:
      'Addresses me by name. References something I’ve actually written or shipped — a specific post, talk, or repo.',
  },
  {
    lede: 'Comp range upfront.',
    gloss:
      'A concrete TC range, or an explicit “compensation is openly discussed.” Below my floor? Just say so — saves us both a round-trip.',
  },
  {
    lede: 'Real role description.',
    gloss:
      'Team size, reporting line, scope, remote policy, on-call. Specifics that signal you’ve talked to the hiring manager.',
  },
  {
    lede: 'Sent by someone close to the role.',
    gloss:
      'Internal recruiter or hiring manager directly. Agency outreach is fine when it carries the same level of detail.',
  },
]

const noSignals = [
  {
    lede: 'Template blasts.',
    gloss:
      'Generic openings, “Hi {first_name}”, no personalization, mass-CC headers. Auto-declined with a one-liner.',
  },
  {
    lede: 'DevRel / Developer Advocate / DX.',
    gloss:
      'I’m an engineer, not in DevRel. The only exception is Anthropic and OpenAI — see R.04.',
  },
  {
    lede: 'Engineering outside AI.',
    gloss:
      'Mobile, frontend without an AI angle, sales engineering, full-stack web, embedded, blockchain. Not what I do.',
  },
  {
    lede: 'Total comp below my floor.',
    gloss:
      'I’m an AI engineer on an Applied AI team supporting the whole org. To consider leaving a place I’m still happy and learning at, I need real upside in scope and comp.',
  },
  {
    lede: 'Pre-approved content · paid placements · link exchanges.',
    gloss:
      'Different bucket — see /partnerships for editorial standards. Don’t pitch a job in the same email as a sponsorship ask.',
  },
]

const procSteps = [
  {
    pn: '01 · Confirm fit',
    title: 'Check the bar before sending.',
    body:
      'AI engineering role. Comp well above my current package. Not DevRel (unless Anthropic / OpenAI). Not outside the AI domain.',
    when: '30 seconds',
  },
  {
    pn: '02 · Write a real email',
    title: 'Address me by name. Lead with role + comp.',
    body:
      'First three lines: who you are, what the role is, the TC range. Then team / reporting / remote. Two paragraphs is plenty.',
    when: '5 minutes',
  },
  {
    pn: '03 · Send it directly',
    title: 'No InMail · no agency CRM blasts.',
    body:
      'Direct email beats LinkedIn — InMail is high-noise and easy to miss. Forwarded chains and CRM templates land in spam.',
    when: 'Same day',
  },
  {
    pn: '04 · I reply within ~5 business days',
    title: 'Yes, no, or a question.',
    body:
      'Hand-drafted, well-targeted outreach gets a real reply. Template blasts get a one-line decline that points back here.',
    when: '≤ 5 business days',
  },
]

export function RecruitersContent() {
  return (
    <div className="contact-page partnerships-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="post-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">For recruiters</span>
        </div>
      </div>

      {/* Hero */}
      <section className="c-hero">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="kicker">
            § R · <em>Recruiter brief</em> · Status · What I&apos;d consider ·
            How to reach me
          </div>

          <div className="dispatch">
            <div>
              <div className="brand-lockup">
                <b>Zack Proser</b> <span className="slash">/</span>{' '}
                <em>zackproser.com</em> <span className="slash">·</span> hiring
                me
              </div>
              <h1 className="dispatch-display">
                AI engineer on an Applied AI team,{' '}
                <em>supporting the whole org</em>.
              </h1>
              <p className="dispatch-lead">
                If we both spend 30 seconds reading this page before writing the
                email, we save a lot of back-and-forth. I&apos;m not actively
                looking — I&apos;m still happy and learning where I am — but I
                do hear out the right roles. Below is what those look like and
                what they don&apos;t.
              </p>
            </div>
            <aside className="dispatch-side">
              <span className="label">Issued</span>
              <div className="a-plate">ZP</div>
              <div className="who">Zachary Proser</div>
              <div className="role">
                AI Engineer · Applied AI · Brooklyn, NY · GMT−5
              </div>
            </aside>
          </div>

          {/* Status slab — mirrors aud-slab on /partnerships */}
          <div className="aud-slab">
            <div className="aud-cell">
              <div className="aud-k">Current role</div>
              <div className="aud-v">AI engineer</div>
              <div className="aud-sub">Applied AI · supporting whole org</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Tenure</div>
              <div className="aud-v">
                ∼2<span className="unit">years</span>
              </div>
              <div className="aud-sub">Still happy and learning</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Status</div>
              <div className="aud-v"><em>Not</em> looking</div>
              <div className="aud-sub">Open to the right thing</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Bar</div>
              <div className="aud-v">Real upside</div>
              <div className="aud-sub">Scope and comp both</div>
            </div>
          </div>

          <div className="avail-strip" style={{ marginTop: 24 }}>
            <span className="slot">
              <span className="dot" />
              <span className="k">AI engineering</span>&nbsp;
              <span className="v">Selectively</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot" />
              <span className="k">Anthropic / OpenAI</span>&nbsp;
              <span className="v">Always</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot warn" />
              <span className="k">DevRel elsewhere</span>&nbsp;
              <span className="v">Closed</span>
            </span>
            <span className="sep">·</span>
            <span className="slot">
              <span className="dot warn" />
              <span className="k">Below minimal TC</span>&nbsp;
              <span className="v">Save us both the email</span>
            </span>
          </div>
        </div>
      </section>

      {/* Roles I'd actually consider */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 rates-wrap">
          <header className="rates-head">
            <div className="num">§ 01</div>
            <h2>Roles I&apos;d <em>actually consider</em>.</h2>
            <span className="more">R.01 — R.04</span>
          </header>

          <div className="rates-grid">
            {roles.map((r) => (
              <div key={r.num} className="rate">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yes signals / No signals */}
      <section>
        <div className="standards-wrap">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 standards-grid">
            <div>
              <header className="stand-head">
                <span className="num">§ 02</span>
                <h3>What gets a <em>real reply</em>.</h3>
              </header>
              <ul className="stand-list">
                {yesSignals.map((s) => (
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
                <h3>What I <em>won&apos;t engage with</em>.</h3>
              </header>
              <ul className="stand-list">
                {noSignals.map((s) => (
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

      {/* Process */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 proc-wrap">
          <header className="proc-head">
            <span className="num">§ 04</span>
            <h2>How to <em>reach me</em>.</h2>
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

      {/* Direct line / Why */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 intake-wrap">
          <div className="intake-grid">
            <div>
              <div className="db-head">
                <div className="num">§ 05</div>
                <h3>Direct line.</h3>
              </div>
              <p className="intake-lead">
                For roles that clear the bar above —{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}><code>{CONTACT_EMAIL}</code></a>.
                Lead with the role, the TC range, the team, and the remote
                policy. Two paragraphs is plenty.
              </p>
              <p className="intake-lead">
                I reply within ~5 business days when there&apos;s a fit. Template
                blasts get a one-line decline that points back here so you know
                for next time.
              </p>
            </div>

            <aside className="intake-side">
              <div>
                <h4>Why this page exists</h4>
                <p>
                  Engineering attention is expensive. We both win when low-fit
                  outreach gets a fast &ldquo;no&rdquo; so high-fit roles get a
                  fast &ldquo;tell me more.&rdquo; This page lets you self-screen
                  in 30 seconds.
                </p>
              </div>

              <div>
                <h4>About my work</h4>
                <p className="partners">
                  Pinecone (vector DB / RAG) · Gruntwork (Terragrunt &amp;
                  OpenTofu) · Cloudflare (workers, edge) · Cloudmark / Proofpoint
                  (anti-spam) · <em>currently Applied AI</em>.
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
                      <span className="pl-meta">what colleagues say</span>
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
