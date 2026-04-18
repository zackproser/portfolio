'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, FormEvent } from 'react'
import type { Route } from 'next'
import { track } from '@vercel/analytics'
import { sendGTMEvent } from '@next/third-parties/google'
import { EditorialCard } from '@/components/EditorialCard'
import ConsultationForm from '@/components/ConsultationForm'
import type { Content } from '@/types/content'

/* ------------------------------------------------------------------
 * Editorial homepage — restrained, engineering-paper aesthetic.
 * See src/styles/editorial-home.css for the primitive styles.
 * ------------------------------------------------------------------ */

type Article = Content

interface Props {
  deepMLTutorials: Article[]
  mlProjects: Article[]
  aiDev: Article[]
  refArchitectures: Article[]
  careerAdvice: Article[]
  videos: Article[]
  isMobile: boolean
}

// ----- Hero ---------------------------------------------------------

function EditorialHero({ onConsult }: { onConsult: () => void }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    if (!email) return

    setStatus('submitting')
    setErrorMessage('')

    track('newsletter_subscribe_submit', { location: 'hero' })
    sendGTMEvent({
      event: 'newsletter-signup-conversion',
      method: 'newsletter',
      source: '/',
      position: 'hero',
      tags: '',
      slug: 'homepage',
    })

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer: '/', tags: [] }),
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
    <section className="pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
            Applied AI · WorkOS
          </div>
          <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
            AI engineering for teams that actually{' '}
            <span className="text-burnt-400 dark:text-amber-400">ship</span>.
          </h1>
          <p className="editorial-lede text-parchment-600 dark:text-slate-300">
            I build retrieval pipelines, agent harnesses, and ship-ready
            developer tools at WorkOS. Fourteen years in production. Writing,
            workshops, and consulting for teams that got handed an LLM and a
            deadline.
          </p>

          {/* Newsletter — the primary CTA. Inline under the lede. */}
          <form className="editorial-capture" onSubmit={handleSubscribe} noValidate>
            <div className="editorial-capture-label text-parchment-600 dark:text-slate-400">
              <span className="text-burnt-400 dark:text-amber-400">✱</span>
              <span>The Modern Coding letter</span>
            </div>
            <div className="editorial-capture-title text-burnt-400 dark:text-amber-400">
              Applied AI dispatches read by 5,000+ engineers
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
                  {status === 'error' && errorMessage
                    ? errorMessage
                    : 'No spam. Unsubscribe in one click.'}
                </div>
              </>
            )}
          </form>

          <div className="editorial-secondary text-parchment-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => {
                onConsult()
                track('main_cta_click', { destination: 'consultation' })
              }}
              className="bg-transparent border-0 p-0 cursor-pointer font-inherit text-inherit"
              style={{ borderBottom: '1px solid currentColor', paddingBottom: 1 }}
            >
              Book a consult →
            </button>
            <span>·</span>
            <Link href="/blog">Read the essays →</Link>
            <span>·</span>
            <Link href="/services">Workshops →</Link>
          </div>

          <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
            <dt>Current</dt>
            <dd>Applied AI · WorkOS</dd>
            <dt>Recent</dt>
            <dd>Pinecone · Cloudflare · Gruntwork</dd>
          </dl>
        </div>

        <div className="lg:justify-self-end">
          <div className="editorial-portrait">
            <Image
              src="https://zackproser.b-cdn.net/images/zack-sketch.webp"
              alt="Portrait of Zachary Proser"
              fill
              sizes="(max-width: 1024px) 80vw, 340px"
              className="editorial-portrait-image"
              priority
            />
          </div>
          <div className="editorial-portrait-caption text-parchment-600 dark:text-slate-400">
            Plate I · Applied AI · MMXXVI
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- Stat row -----------------------------------------------------

function StatRow() {
  const stats = [
    { num: '14', unit: 'yrs', label: 'Shipping software' },
    { num: '5,000', unit: '+', label: 'Newsletter readers' },
    { num: '184', unit: 'wpm', label: 'Voice-coding velocity' },
    { num: '30', unit: 'yrs', label: 'Writing online since' },
  ]
  return (
    <section className="pb-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-stats text-charcoal-50 dark:text-parchment-100">
          {stats.map((s, i) => (
            <div key={i} className="editorial-stat">
              <div className="editorial-stat-num">
                {s.num}
                <span className="unit">{s.unit}</span>
              </div>
              <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Featured Project ---------------------------------------------

function FeaturedProject() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
          Featured project
        </div>
        <article className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400/50">
                Premium · $149
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold font-mono uppercase tracking-wider text-green-700 dark:text-green-300 border border-green-600/40">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                Shipping
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100">
              Build a chatbot that actually knows your shit.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[52ch]">
              End-to-end RAG with Pinecone, the Vercel AI SDK, and Next.js 15.
              No hallucinations. No magic. A production harness you can hand to
              your team and they&apos;ll still understand it in six months.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4 max-w-md">
              {[
                ['Runtime', 'Node 20'],
                ['Vector DB', 'Pinecone'],
                ['Eval', 'Ragas++'],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500">
                    {label}
                  </div>
                  <div className="font-mono text-sm font-semibold text-charcoal-50 dark:text-parchment-100 mt-1">
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/checkout?product=rag-pipeline-tutorial&type=blog"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
                onClick={() =>
                  track('featured_product_click', {
                    location: 'hero_section',
                    product: 'rag_tutorial',
                    action: 'buy',
                  })
                }
              >
                Buy tutorial — $149
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
                onClick={() =>
                  track('featured_product_click', {
                    location: 'hero_section',
                    product: 'rag_tutorial',
                    action: 'demo',
                  })
                }
              >
                Try the live demo →
              </Link>
            </div>
          </div>

          {/* Terminal readout — site index */}
          <div className="rounded-md overflow-hidden border border-charcoal-100/30 dark:border-slate-700 bg-[#141428] text-sm font-mono shadow-lg">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/20">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              <span className="ml-3 text-[11px] tracking-wider uppercase text-slate-400">~/zackproser.com — index</span>
            </div>
            <div className="p-4 text-[12px] leading-relaxed text-slate-200 whitespace-nowrap overflow-x-auto">
              <div><span className="text-slate-500">zp@work ~ $</span> ls -lh ./content</div>
              <div><span className="text-slate-500">drwx  </span>writing/<span className="text-slate-500">        218 essays       </span><span className="text-amber-400">&quot;modern-coding&quot;</span></div>
              <div><span className="text-slate-500">drwx  </span>builds/<span className="text-slate-500">          37 projects     </span><span className="text-amber-400">&quot;rag, tools, tuis&quot;</span></div>
              <div><span className="text-slate-500">drwx  </span>videos/<span className="text-slate-500">          24 screencasts  </span><span className="text-amber-400">&quot;long-form&quot;</span></div>
              <div><span className="text-slate-500">drwx  </span>workshops/<span className="text-slate-500">        6 decks        </span><span className="text-amber-400">&quot;cowork, claude&quot;</span></div>
              <div><span className="text-slate-500">zp@work ~ $</span> cat ./status.json</div>
              <div>{'{ '}<span className="text-amber-400">&quot;current&quot;</span>: <span className="text-green-400">&quot;applied-ai @ workos&quot;</span>, <span className="text-amber-400">&quot;open_to&quot;</span>: [<span className="text-green-400">&quot;workshops&quot;</span>, <span className="text-green-400">&quot;retainers&quot;</span>], <span className="text-amber-400">&quot;wpm&quot;</span>: <span className="text-green-400">184</span> {'}'}</div>
              <div><span className="text-slate-500">zp@work ~ $</span> <span className="inline-block w-2 h-3.5 bg-amber-400 align-middle animate-pulse ml-1" /></div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

// ----- Section head + Content rail ----------------------------------

function SectionHead({
  num,
  title,
  moreHref,
  moreLabel = 'Archive →',
}: {
  num: string
  title: string
  moreHref: string
  moreLabel?: string
}) {
  return (
    <header className="editorial-section-head text-charcoal-50 dark:text-parchment-100">
      <div className="editorial-section-num">§ {num}</div>
      <h2 className="editorial-section-title">{title}</h2>
      <Link
        href={moreHref as Route}
        className="editorial-section-more text-burnt-400 dark:text-amber-400 hover:underline"
      >
        {moreLabel}
      </Link>
    </header>
  )
}

function ContentRail({
  num,
  title,
  moreHref,
  moreLabel,
  articles,
  alt,
  keyPrefix,
  kind,
}: {
  num: string
  title: string
  moreHref: string
  moreLabel?: string
  articles: Article[]
  alt?: boolean
  keyPrefix: string
  kind?: string
}) {
  return (
    <section className={`py-14 ${alt ? 'editorial-section-alt' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHead num={num} title={title} moreHref={moreHref} moreLabel={moreLabel} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((a, i) => (
            <EditorialCard
              key={`${keyPrefix}-${i}`}
              article={a}
              index={i + 1}
              kind={kind}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Colophon footer ----------------------------------------------

function ColophonFooter() {
  return (
    <footer className="mt-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 editorial-colophon text-charcoal-50 dark:text-parchment-100">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-lg leading-snug mb-2">
              Zachary Proser writes, ships, and teaches applied AI.
            </p>
            <p className="text-parchment-600 dark:text-slate-400 leading-relaxed text-[13px] max-w-[52ch]">
              Currently Applied AI at WorkOS. Formerly Pinecone, Cloudflare,
              Gruntwork. Before that, a very long stretch of infrastructure.
            </p>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Writing</h4>
            <ul>
              <li><Link href="/blog">All essays</Link></li>
              <li><Link href="/blog">Archive</Link></li>
              <li><Link href="/rss/feed.xml">RSS feed</Link></li>
              <li><Link href="/newsletter">Newsletter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Work with me</h4>
            <ul>
              <li><Link href="/services">Consulting</Link></li>
              <li><Link href="/services">Workshops</Link></li>
              <li><Link href="/speaking">Speaking</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Elsewhere</h4>
            <ul>
              <li><a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://youtube.com/@zackproser" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://x.com/zackproser" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
            </ul>
          </div>
        </div>
        <div className="editorial-colophon-rule text-parchment-600 dark:text-slate-500">
          <div>© MMXXVI Zachary Proser · Set in Source Serif 4 &amp; JetBrains Mono</div>
          <div>Built with Next.js · Hosted on Vercel</div>
        </div>
      </div>
    </footer>
  )
}

// ----- Main component -----------------------------------------------

export default function HomepageClientComponent({
  deepMLTutorials,
  mlProjects,
  aiDev,
  refArchitectures,
  careerAdvice,
  videos,
}: Props) {
  const [isConsultOpen, setIsConsultOpen] = useState(false)

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        <EditorialHero onConsult={() => setIsConsultOpen(true)} />
        <StatRow />
        <FeaturedProject />

        <ContentRail
          num="01"
          title="Deep &amp; machine learning, by hand"
          moreHref="/blog"
          articles={deepMLTutorials}
          alt
          keyPrefix="ml-tutorial"
          kind="Tutorial"
        />

        <ContentRail
          num="02"
          title="Open-source projects"
          moreHref="/projects"
          moreLabel="All projects →"
          articles={mlProjects}
          keyPrefix="ml-project"
          kind="Project"
        />

        <ContentRail
          num="03"
          title="AI-assisted development"
          moreHref="/blog"
          moreLabel="More essays →"
          articles={aiDev}
          alt
          keyPrefix="ai-dev"
          kind="Essay"
        />

        <ContentRail
          num="04"
          title="Reference architectures"
          moreHref="/blog"
          articles={refArchitectures}
          keyPrefix="ref-arch"
          kind="Ref arch"
        />

        <ContentRail
          num="05"
          title="Career notes — from the field"
          moreHref="/blog"
          moreLabel="All advice →"
          articles={careerAdvice}
          alt
          keyPrefix="career"
          kind="Field note"
        />

        <ContentRail
          num="06"
          title="Video &amp; screencasts"
          moreHref="/videos"
          moreLabel="All videos →"
          articles={videos}
          keyPrefix="video"
          kind="Video"
        />

        <ColophonFooter />
      </main>

      <ConsultationForm
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
      />
    </div>
  )
}
