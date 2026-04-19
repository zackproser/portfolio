import Image from 'next/image'
import Link from 'next/link'
import { SubscribeForm } from '@/components/SubscribeForm'
import { resumeData } from '@/data/resume'

const HERO_PORTRAIT = 'https://zackproser.b-cdn.net/images/zack-sketch.webp'

const whatYouGet = [
  {
    num: '01',
    kind: 'Column',
    title: 'Tool reviews, with numbers.',
    body: 'Hands-on reviews of Cursor, Claude, GPT-4, WisprFlow, and other AI coding tools. Real performance benchmarks and workflow integration tips.',
  },
  {
    num: '02',
    kind: 'Column',
    title: 'AI implementation guides.',
    body: 'Step-by-step tutorials on building with LLMs, embeddings, vector databases, and RAG pipelines. Code examples included.',
  },
  {
    num: '03',
    kind: 'Column',
    title: 'Industry trends.',
    body: 'Analysis of the latest AI developments, new model releases, and emerging tools. Cut through the hype with data-driven insights.',
  },
  {
    num: '04',
    kind: 'Column',
    title: 'Productivity hacks.',
    body: 'Voice-to-code workflows, AI agent orchestration, and automation strategies. Learn how to 10x your development speed.',
  },
]

const faqs = [
  {
    num: 'Q.01',
    q: 'How often does it actually ship?',
    a: 'It ships when it ships. When something worth sending shows up, an issue goes out \u2014 no fixed cadence, no guarantees.',
  },
  {
    num: 'Q.02',
    q: 'Do you sell or share my email?',
    a: 'Never sold. The list has one purpose: delivering the newsletter to the inbox you signed up with.',
  },
  {
    num: 'Q.03',
    q: 'What if I hate it?',
    a: 'Hit the unsubscribe link at the bottom of any issue. No confirmation page, no exit survey. You\u2019re out inside three seconds.',
  },
  {
    num: 'Q.04',
    q: 'Is there a paid tier?',
    a: 'Not right now. If that changes, subscribers hear first \u2014 by email, before any public announcement.',
  },
]

const trustedCompanies = ['WorkOS', 'Pinecone', 'Gruntwork', 'Cloudflare', 'Cloudmark', 'BrightContext']

export default function SubscribePage() {
  const romanYear = 'MMXIX'
  const spanYears = new Date().getFullYear() - 2012
  const numCompanies = new Set(resumeData.map((r) => r.company)).size

  return (
    <div className="subscribe-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400 pt-6">
            <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <Link href="/newsletter" className="hover:text-burnt-400 dark:hover:text-amber-400">Newsletter</Link>
            <span className="mx-2 opacity-40">/</span>
            <span>Subscribe</span>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 md:px-6 pt-10 pb-20">
          {/* ============================================== */}
          {/* Masthead                                       */}
          {/* ============================================== */}
          <header className="postcard-mast">
            <span className="left">Modern Coding</span>
            <span className="title"><em>Subscribe</em></span>
            <span className="right">5,000+ subscribers &middot; Est. {romanYear}</span>
          </header>

          {/* ============================================== */}
          {/* Postcard hero                                  */}
          {/* ============================================== */}
          <article className="postcard">
            <div className="postcard-stamp" aria-hidden="true">
              <span>One<br />essay</span>
              <span className="big">/ mo</span>
              <span>Postage<br />free</span>
            </div>

            <p className="salutation">Dear builder,</p>

            <h1 className="display">
              Master <em>AI development</em>. One essay at a time.
            </h1>

            <p className="postcard-body">
              Real benchmarks, practical tutorials, and no-BS tool comparisons for developers, business owners, and investors shipping with AI today &mdash;{' '}
              <span className="em">hand-written the week something real shipped</span>.
            </p>

            <p className="postcard-body">
              Trusted by senior ICs, founders, and AI teams running production systems. Every issue distills what&apos;s working right now &mdash; tools, architectures, and workflows you can apply immediately.
            </p>

            <SubscribeForm fieldNum="01" submitLabel="Count me in" />

            <div className="sp-fine" aria-hidden="true">
              <span>5,000+ subscribers</span>
              <span className="dot" />
              <span>One-click unsubscribe</span>
            </div>
          </article>

          {/* ============================================== */}
          {/* Pros row                                       */}
          {/* ============================================== */}
          <div className="pros-row">
            <div className="p">
              <div className="n">P.01 &middot; Engineer-first</div>
              <div className="h">Built for builders.</div>
              <p className="d">Concrete tactics, stack breakdowns, and live demos from real client work &mdash; not vibes, not thought leadership.</p>
            </div>
            <div className="p">
              <div className="n">P.02 &middot; Actionable systems</div>
              <div className="h">Diffs over adjectives.</div>
              <p className="d">Repeatable playbooks for RAG pipelines, eval harnesses, agent orchestration, and developer tooling.</p>
            </div>
            <div className="p">
              <div className="n">P.03 &middot; Signals before hype</div>
              <div className="h">Vetted, not viral.</div>
              <p className="d">Benchmark data and shipping patterns before they trend on social. Cut the hype, keep the gain.</p>
            </div>
          </div>

          {/* ============================================== */}
          {/* Bio + career                                   */}
          {/* ============================================== */}
          <section className="sp-section">
            <div className="sp-section-head">
              <div className="sp-kicker">&sect; 02 &middot; <em>The desk</em></div>
              <h2>Learn from someone <em>building this stuff.</em></h2>
            </div>

            <div className="bio-grid">
              <div>
                <div className="bio-portrait">
                  <div className="bio-portrait-media">
                    <Image
                      src={HERO_PORTRAIT}
                      alt="Zachary Proser"
                      fill
                      sizes="(max-width: 820px) 100vw, 280px"
                      priority
                    />
                  </div>
                </div>
                <div className="bio-tag">
                  <span className="k">Desk</span>
                  <span>Modern Coding &middot; Est. {romanYear}</span>
                </div>
              </div>
              <div className="bio-prose">
                <p>
                  I&apos;m <b>Zachary Proser</b>, a Staff-level AI Engineer with 13+ years shipping production systems. I&apos;ve built RAG pipelines, vector-database features, and AI developer tools at companies you know.
                </p>
                <p>
                  I teach AI development through <b>interactive machine-learning examples</b> that break down complex concepts from the ground up &mdash; no prerequisites needed.
                </p>
                <p>
                  This newsletter shares what I&apos;m actually using and building. Real benchmarks, honest tool comparisons, and technical breakdowns that skip the marketing fluff.
                </p>
              </div>
            </div>

            <div className="career-table">
              <div className="career-head">
                <span className="k">&sect; 03 &middot; Career record</span>
                <span className="right">{spanYears}+ years &middot; {numCompanies} companies</span>
              </div>
              <ol className="career-list">
                {resumeData.map((role) => (
                  <li key={`${role.company}-${role.title}-${role.start}`}>
                    <span className="c-role">{role.title}</span>
                    <span className="c-at">
                      @ <b>{role.company}</b>
                    </span>
                    <span className="c-yr">
                      {role.start} &mdash;{' '}
                      {typeof role.end === 'object' ? role.end.label : role.end}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ============================================== */}
          {/* What you'll get                                */}
          {/* ============================================== */}
          <section className="sp-section">
            <div className="sp-section-head">
              <div className="sp-kicker">&sect; 04 &middot; <em>What you&apos;ll get</em></div>
              <h2>Cut through the AI hype with <em>practical, battle-tested</em> insights.</h2>
            </div>
            <div className="wyg-grid">
              {whatYouGet.map((card) => (
                <article className="wyg-card" key={card.num}>
                  <header className="wyg-card-head">
                    <span className="wyg-num">{card.num}</span>
                    <span>{card.kind}</span>
                  </header>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ============================================== */}
          {/* FAQ                                            */}
          {/* ============================================== */}
          <section className="sp-faq">
            <div className="sp-section-head">
              <div className="sp-kicker">&sect; FAQ &middot; <em>Before you hit subscribe</em></div>
              <h2>Four short answers.</h2>
            </div>
            <div className="sp-faq-grid">
              {faqs.map((f) => (
                <div className="sp-faq-q" key={f.num}>
                  <div className="num">{f.num}</div>
                  <h4>{f.q}</h4>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================== */}
          {/* Closing CTA                                    */}
          {/* ============================================== */}
          <section className="postcard-cta">
            <div className="sp-kicker">&sect; 05 &middot; <em>Last call</em></div>
            <h2>Ready to <em>master AI development?</em></h2>
            <p>Join 5,000+ subscribers getting smarter about AI tools.</p>
            <SubscribeForm fieldNum="02" submitLabel="Count me in" />
            <div className="cta-fine">Unsubscribe anytime</div>
          </section>

          {/* ============================================== */}
          {/* Trusted-by                                     */}
          {/* ============================================== */}
          <section className="sp-trusted">
            <div className="sp-trusted-label">Read by engineers shipping at</div>
            <div className="sp-trusted-row">
              {trustedCompanies.map((co) => (
                <div key={co} className="co">{co}</div>
              ))}
              <div className="co"><em>&amp; you</em></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
