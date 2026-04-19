import { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { getAllContent } from '@/lib/content-handlers'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'
import Link from 'next/link'
import { SubscribeForm } from '@/components/SubscribeForm'
import { resumeData } from '@/data/resume'
import { WHAT_YOU_GET, BIO_PROSE } from '@/data/newsletter-content'

const HERO_PORTRAIT = 'https://zackproser.b-cdn.net/images/zack-sketch.webp'

export const metadata: Metadata = createMetadata({
  title: 'AI & Developer Tools Newsletter - Zachary Proser',
  description: 'Applied-AI essays on coding tools, vector databases, and developer productivity. Join 5,000+ subscribers reading when something worth sending ships.',
})

export const revalidate = 3600

const INSIDE_COLUMNS = [
  {
    section: 'Opening · Every issue',
    headline: 'A paragraph on what shipped, what broke, and what I\u2019m chewing on.',
    dek: 'Written the week of, not the quarter of. Light on adjectives, heavy on diffs.',
  },
  {
    section: 'Feature \u00B7 10\u201314 min',
    headline: 'One long essay \u2014 usually a production postmortem or a technique at depth.',
    dek: 'Usually code, diagrams, or both. No takes about GPT-Next. No Medium roundups.',
  },
  {
    section: 'Sidebar \u00B7 3 min',
    headline: 'One smaller piece \u2014 a prompt, a trick, a "do this instead of that."',
    dek: 'The kind of note I\u2019d otherwise text to a friend. Sometimes it\u2019s a snippet.',
  },
  {
    section: 'Links \u00B7 Hand-picked',
    headline: 'Four to six things I\u2019ve been reading, with a sentence on why.',
    dek: 'Papers, repos, essays, talks. No aggregator regurgitation \u2014 if I didn\u2019t read it, it isn\u2019t there.',
  },
  {
    section: 'Desk note \u00B7 Short',
    headline: 'What I\u2019m reading on my actual bookshelf, not the curated one.',
    dek: 'A closing note. Sometimes it\u2019s a paper, sometimes it\u2019s a poem. It\u2019s fine.',
  },
  {
    section: 'Archive \u00B7 Open',
    headline: 'Every back issue lives on the archive, ungated and searchable.',
    dek: 'Paywall-free. Subscribing just gets it to your inbox the day it ships.',
  },
]

function formatIssueDate(date?: string | Date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '")
}

export default async function NewsletterPage() {
  const articles = await getAllContent('newsletter')
  const latest = articles[0]
  const issueCount = articles.length
  const establishedYear = 2019
  const currentYear = new Date().getFullYear()

  return (
    <div className="newsletter-page editorial-home min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main>
        {/* Breadcrumb */}
        <Container>
          <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400 pt-6">
            <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <span>Newsletter</span>
          </div>
        </Container>

        {/* ============================================== */}
        {/* Masthead + hero split                          */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto pt-8">
            <header className="nl-masthead">
              <div className="mh-l">
                <span>Vol. {currentYear - establishedYear + 1} &middot; {issueCount} issues</span>
                <span>Essays when something ships</span>
              </div>
              <h1 className="mh-title">
                Modern <em>Coding</em>
              </h1>
              <div className="mh-r">
                <span>Est. {establishedYear}</span>
                <span>Applied AI</span>
              </div>
              <p className="mh-strapline">
                Applied-AI essays written by someone actually shipping it. 5,000+ subscribers and counting.
              </p>
            </header>

            <div className="nl-split">
              <div className="nl-pitch">
                <div className="nl-kicker">
                  &sect; N &middot; <em>Newsletter</em> &middot; Open to readers
                </div>
                <h2 className="nl-display">
                  The <em>applied-AI</em> reading list I actually wish I&apos;d had in <em>2022</em>.
                </h2>
                <p className="nl-lead">
                  No predictions. No hot takes. Essays written the week something real shipped &mdash; production RAG that earned its keep, an agent loop that failed informatively, a retrieval experiment that saved me six weeks. The parts nobody tutorials until two years after the hype.
                </p>

                <SubscribeForm fieldNum="01" submitLabel="Subscribe" />

                <div className="sp-fine" style={{ marginTop: 18 }}>
                  <span>5,000+ subscribers</span>
                  <span className="dot" />
                  <span>One-click unsubscribe</span>
                </div>
              </div>

              {latest && (
                <aside className="nl-cover" aria-label="Sample issue preview">
                  <div className="nl-cover-stamp" aria-hidden="true">
                    Free<br />Sample<br />Issue
                  </div>
                  <div className="nl-cover-top">
                    <span>Modern Coding</span>
                    <span className="issue">{formatIssueDate(latest.date)}</span>
                  </div>
                  <h3 className="nl-cover-title">{latest.title}</h3>
                  {latest.description && (
                    <p className="nl-cover-dek">{latest.description}</p>
                  )}
                  <div className="nl-cover-foot">
                    <span>Latest issue</span>
                    <Link
                      href={`/newsletter/${latest.slug}`}
                      className="hover:underline"
                    >
                      Read online &rarr;
                    </Link>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </Container>

        {/* ============================================== */}
        {/* What's inside                                  */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <section className="nl-inside">
              <header className="nl-inside-head">
                <span className="num">&sect; 01</span>
                <h2>What actually shows up in your inbox.</h2>
                <span className="more">I.01 &mdash; I.06</span>
              </header>
              <div className="nl-columns">
                {INSIDE_COLUMNS.map((c) => (
                  <article className="nl-column" key={c.section}>
                    <div className="section">{c.section}</div>
                    <h3 className="headline">{c.headline}</h3>
                    <p className="dek">{c.dek}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </Container>

        {/* ============================================== */}
        {/* Primer: Start here (editorial "New to AI?")    */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <section className="nl-primer">
              <div className="nl-primer-kicker">&sect; 02 &middot; <em>Start here</em></div>
              <div className="nl-primer-body">
                <h3>New to AI? Skip the learning curve.</h3>
                <p>
                  I tested hundreds of AI tools so you don&apos;t have to. Here are the four that actually matter for running a business in {currentYear}.
                </p>
                <Link href="/best-ai-tools" className="nl-primer-link">
                  See the stack &rarr;
                </Link>
              </div>
            </section>
          </div>
        </Container>

        {/* ============================================== */}
        {/* The desk: bio + career                         */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <section className="nl-section">
              <div className="nl-section-head-centered">
                <div className="nl-kicker">&sect; 03 &middot; <em>The desk</em></div>
                <h2>Learn from someone <em>building this stuff.</em></h2>
              </div>

              <div className="nl-bio-grid">
                <div>
                  <div className="nl-bio-portrait">
                    <div className="nl-bio-portrait-media">
                      <Image
                        src={HERO_PORTRAIT}
                        alt="Zachary Proser"
                        fill
                        sizes="(max-width: 820px) 100vw, 280px"
                      />
                    </div>
                  </div>
                  <div className="nl-bio-tag">
                    <span className="k">Desk</span>
                    <span>Modern Coding &middot; Est. {establishedYear}</span>
                  </div>
                </div>
                <div className="nl-bio-prose">
                  <p>
                    I&apos;m <b>Zachary Proser</b>, {BIO_PROSE.intro.replace("I'm Zachary Proser, ", '')}
                  </p>
                  <p>
                    I teach AI development through <b>interactive machine-learning examples</b> that break down complex concepts from the ground up &mdash; no prerequisites needed.
                  </p>
                  <p>
                    {BIO_PROSE.newsletter}
                  </p>
                </div>
              </div>

              <div className="nl-career-table">
                <div className="nl-career-head">
                  <span className="k">&sect; 04 &middot; Career record</span>
                  <span className="right">
                    {currentYear - 2012}+ years &middot; {new Set(resumeData.map((r) => r.company)).size} companies
                  </span>
                </div>
                <ol className="nl-career-list">
                  {resumeData.map((role) => (
                    <li key={`${role.company}-${role.title}-${role.start}`}>
                      <span className="c-role">{role.title}</span>
                      <span className="c-at">
                        @ <b>{role.company}</b>
                      </span>
                      <span className="c-yr">
                        {role.start} &mdash; {role.end}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </Container>

        {/* ============================================== */}
        {/* What you'll get (editorial 2x2)                */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <section className="nl-section">
              <div className="nl-section-head-centered">
                <div className="nl-kicker">&sect; 05 &middot; <em>What you&apos;ll get</em></div>
                <h2>Cut through the AI hype with <em>practical, battle-tested</em> insights.</h2>
              </div>
              <div className="nl-wyg-grid">
                {WHAT_YOU_GET.map((card) => (
                  <article className="nl-wyg-card" key={card.num}>
                    <header className="nl-wyg-card-head">
                      <span className="nl-wyg-num">{card.num}</span>
                      <span>{card.kind}</span>
                    </header>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </Container>

        {/* ============================================== */}
        {/* Recent episodes                                */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <header className="nl-section-head">
              <span className="num">&sect; 06</span>
              <h2>Recent episodes.</h2>
              <span className="more">
                {articles.length > 0 ? `E.${String(Math.max(articles.length - 6, 1)).padStart(2, '0')} \u2014 E.${String(articles.length).padStart(2, '0')}` : ''}
              </span>
            </header>

            <div className="pt-10 pb-4">
              {latest && (
                <div className="nl-latest-wrap">
                  <div className="nl-latest-badge">Latest</div>
                  <ContentCard article={latest} />
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {articles.slice(1, 7).map((article) => (
                  <ContentCard key={article.slug} article={article} />
                ))}
              </div>

              {articles.length > 7 && (
                <div className="text-center mt-12">
                  <p className="text-parchment-600 dark:text-slate-400 text-sm font-mono uppercase tracking-widest">
                    <strong className="text-charcoal-50 dark:text-white">{articles.length - 7} more episodes</strong> in the archive
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* ============================================== */}
        {/* Signup band                                    */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
            <section className="nl-signup-band">
              <div className="nl-chip">
                <span className="dot" />
                <span className="accent">Open</span>
                <span>&middot; 5,000+ subscribers</span>
              </div>
              <h2>Get the next issue in your inbox <em>the day it ships.</em></h2>
              <p>No double-opt-in theatre. Enter an email, click a link, done. Unsubscribing is equally uneventful.</p>
              <SubscribeForm fieldNum="02" submitLabel="Subscribe" />
            </section>
          </div>
        </Container>
      </main>
    </div>
  )
}
