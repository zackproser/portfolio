import Link from 'next/link'

const CONTACT_EMAIL = 'zackproser@gmail.com'

const rules = [
  {
    num: 'R.01 · The bar',
    status: { label: 'Hard floor', tone: 'warn' },
    title: 'Base $300K+ AND meaningful equity.',
    desc:
      'Both. Either alone is not enough. If your role doesn’t clear both dimensions, the message is auto-filtered before I see it. There is no negotiation around this — it’s the line.',
  },
  {
    num: 'R.02 · The status',
    status: { label: 'Where I am', tone: 'ok' },
    title: 'Not actively looking — but always listening for the right thing.',
    desc:
      'I’m an AI engineer on an Applied AI team supporting the whole org. The roles likely to make it past this page: principal-level Applied AI at top-tier teams, or any role at Anthropic / OpenAI. Everything else is a stretch.',
  },
  {
    num: 'R.03 · The pitch',
    status: { label: 'How to clear it', tone: 'ok' },
    title: 'Hand-crafted, or auto-filtered.',
    desc:
      'If you clear the bar, send a hand-crafted email — name the role, the comp range, and what about my work prompted you to reach out. Templates get flagged. Templates you ran through ChatGPT or Claude to disguise still get flagged — the classifier reads those too.',
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
            § R · <em>For recruiters</em> · Not looking · How to reach me
            anyway
          </div>

          <div className="dispatch">
            <div>
              <div className="brand-lockup">
                <b>Zack Proser</b> <span className="slash">/</span>{' '}
                <em>zackproser.com</em> <span className="slash">·</span> hiring
                me
              </div>
              <h1 className="dispatch-display">
                Not actively looking.{' '}
                <em>Here&apos;s the bar your pitch has to clear.</em>
              </h1>
              <p className="dispatch-lead">
                My inbox runs through an AI classifier. It auto-filters anything
                below the bar so we both save time. The three rules below are
                what your message has to clear before I read it. If you&apos;re
                confident, the direct line is at the bottom.
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

          {/* Status slab — 4 cells, all short */}
          <div className="aud-slab">
            <div className="aud-cell">
              <div className="aud-k">Role</div>
              <div className="aud-v">AI engineer</div>
              <div className="aud-sub">Applied AI</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Team</div>
              <div className="aud-v"><em>Whole</em> org</div>
              <div className="aud-sub">Cross-functional support</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Status</div>
              <div className="aud-v"><em>Not</em> looking</div>
              <div className="aud-sub">Open to the right thing</div>
            </div>
            <div className="aud-cell">
              <div className="aud-k">Bar</div>
              <div className="aud-v">Both</div>
              <div className="aud-sub">$300K+ base · equity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three rules — replaces rate grid + yes/no + process */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 rates-wrap">
          <header className="rates-head">
            <div className="num">§ 01</div>
            <h2>The <em>three rules</em>.</h2>
            <span className="more">R.01 — R.03</span>
          </header>

          <div className="rates-grid">
            {rules.map((r) => (
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct line + Why */}
      <section>
        <div className="container mx-auto max-w-6xl px-4 md:px-6 intake-wrap">
          <div className="intake-grid">
            <div>
              <div className="db-head">
                <div className="num">§ 02</div>
                <h3>Direct line.</h3>
              </div>
              <p className="intake-lead">
                If your role clears all three rules —{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}><code>{CONTACT_EMAIL}</code></a>.
                Three sentences is plenty. Name the role, the comp, the reason
                you&apos;re writing.
              </p>
              <p className="intake-lead">
                Real replies within ~5 business days. Templates get a one-line
                decline that points back here so you know for next time.
              </p>
            </div>

            <aside className="intake-side">
              <div>
                <h4>Why this page exists</h4>
                <p>
                  Engineering attention is expensive. Both of us win when low-fit
                  outreach gets a fast &ldquo;no&rdquo; so high-fit roles get a
                  fast &ldquo;tell me more.&rdquo;
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
