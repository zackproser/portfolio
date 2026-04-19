import { Metadata } from 'next'
import { Container } from '@/components/Container'
import { getAllContent } from '@/lib/content-handlers'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'
import { Zap, TrendingUp, Code, Sparkles, ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'
import { SubscribeForm } from '@/components/SubscribeForm'
import { Suspense } from 'react'
import CV from '@/components/CV'
import RandomPortrait from '@/components/RandomPortrait'
import { NewsletterSocialProof } from '@/components/NewsletterSocialProof'

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
        {/* Featured: AI Tools Guide                       */}
        {/* ============================================== */}
        <section className="py-12 bg-gradient-to-r from-amber-500/10 via-burnt-400/10 to-amber-500/10 dark:from-amber-900/20 dark:via-amber-800/20 dark:to-amber-900/20 border-y border-amber-500/20 dark:border-amber-700/30 mt-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-amber-500/20 dark:bg-amber-500/30 rounded-2xl flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-charcoal-50 dark:text-white mb-2">
                    New to AI? Skip the Learning Curve
                  </h2>
                  <p className="text-lg text-parchment-600 dark:text-slate-300">
                    I tested hundreds of AI tools so you don&apos;t have to. Here are the 4 that actually matter for running a business in {currentYear}.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/best-ai-tools"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    See the Stack
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <NewsletterSocialProof />

        {/* ============================================== */}
        {/* About section                                  */}
        {/* ============================================== */}
        <section className="py-24 bg-parchment-100/50 dark:bg-slate-800/50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="w-full max-w-[400px] mx-auto lg:mx-0">
                    <Suspense fallback={<div className="w-full aspect-square bg-parchment-200 dark:bg-slate-700 rounded-2xl animate-pulse" />}>
                      <RandomPortrait width={400} height={400} />
                    </Suspense>
                  </div>
                  <div>
                    <CV showHeading={false} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="font-serif text-4xl font-bold text-charcoal-50 dark:text-white">
                    Learn from Someone <span className="text-burnt-400 dark:text-amber-400">Building This Stuff</span>
                  </h2>
                  <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
                    I&apos;m <strong className="text-charcoal-50 dark:text-white">Zachary Proser</strong>, a Staff-level AI Engineer with 13+ years shipping production systems. I&apos;ve built RAG pipelines, vector database features, and AI developer tools at companies you know.
                  </p>
                  <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
                    I teach AI development through <strong className="text-charcoal-50 dark:text-white">interactive machine learning examples</strong> that break down complex concepts from the ground up&mdash;no prerequisites needed.
                  </p>
                  <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
                    This newsletter shares what I&apos;m actually using and building&mdash;real benchmarks, honest tool comparisons, and technical breakdowns that skip the marketing fluff.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ============================================== */}
        {/* Recent episodes                                */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <header className="nl-section-head">
              <span className="num">&sect; 02</span>
              <h2>Recent episodes.</h2>
              <span className="more">
                {articles.length > 0 ? `E.${String(Math.max(articles.length - 6, 1)).padStart(2, '0')} \u2014 E.${String(articles.length).padStart(2, '0')}` : ''}
              </span>
            </header>

            <div className="pt-10 pb-4">
              {latest && (
                <div className="mb-12 bg-gradient-to-br from-burnt-400/5 to-burnt-600/10 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-8 border border-burnt-400/20 dark:border-amber-700">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="px-3 py-1 bg-burnt-400 dark:bg-amber-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      Latest
                    </div>
                  </div>
                  <ContentCard article={latest} />
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-8">
                {articles.slice(1, 7).map((article) => (
                  <ContentCard key={article.slug} article={article} />
                ))}
              </div>

              {articles.length > 7 && (
                <div className="text-center mt-12">
                  <p className="text-parchment-600 dark:text-slate-400 text-lg">
                    <strong className="text-charcoal-50 dark:text-white">{articles.length - 7} more episodes</strong> in the archive
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* ============================================== */}
        {/* What You'll Get                                */}
        {/* ============================================== */}
        <Container>
          <div className="max-w-6xl mx-auto mt-16 mb-16">
            <header className="nl-section-head">
              <span className="num">&sect; 03</span>
              <h2>What you&apos;ll get.</h2>
              <span className="more">4 columns</span>
            </header>

            <div className="grid md:grid-cols-2 gap-8 pt-10">
              <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                  Tool Reviews
                </h3>
                <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                  Hands-on reviews of Cursor, Claude, GPT-4, WisprFlow, and other AI coding tools. Real performance benchmarks and workflow integration tips.
                </p>
              </div>

              <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                  AI Implementation Guides
                </h3>
                <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                  Step-by-step tutorials on building with LLMs, embeddings, vector databases, and RAG pipelines. Code examples included.
                </p>
              </div>

              <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                  Industry Trends
                </h3>
                <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                  Analysis of the latest AI developments, new model releases, and emerging tools. Cut through the hype with data-driven insights.
                </p>
              </div>

              <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                  Productivity Hacks
                </h3>
                <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                  Voice-to-code workflows, AI agent orchestration, and automation strategies. Learn how to 10x your development speed.
                </p>
              </div>
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
