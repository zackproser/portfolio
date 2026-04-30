'use client'

import Link from 'next/link'
import Image from 'next/image'
import { track } from '@vercel/analytics'
import { EditorialCard } from '@/components/EditorialCard'
import { SectionHead } from '@/components/SectionHead'
import { EditorialNewsletter } from '@/components/EditorialNewsletter'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
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
}

// ----- Hero ---------------------------------------------------------

function EditorialHero() {
  return (
    <section className="pt-8 pb-8 md:pt-10 md:pb-10">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-8 lg:gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="editorial-hero-c-main">
          <div className="editorial-eyebrow editorial-eyebrow--ruled text-parchment-600 dark:text-slate-400">
            <span className="editorial-eyebrow-rule" aria-hidden />
            <span>
              <span className="editorial-eyebrow-section text-burnt-400 dark:text-amber-400">§ 00</span>
              {' · From inside the building'}
            </span>
          </div>
          <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
            Most AI advice{' '}
            <span className="editorial-strike">is bullshit.</span>
            <br />
            <em className="editorial-h1-em text-burnt-400 dark:text-amber-400">
              Here&rsquo;s what actually ships.
            </em>
          </h1>
          <p className="editorial-greeting text-parchment-600 dark:text-slate-300">
            Hi, I&rsquo;m <span className="text-burnt-400 dark:text-amber-400">Zack</span>{' '}
            <span className="editorial-greeting-wave" role="img" aria-label="waving hand">👋</span>
          </p>
          <p className="editorial-lede editorial-lede--tight text-parchment-600 dark:text-slate-300">
            I&rsquo;m an AI engineer on the Applied AI team at WorkOS &mdash; we power
            authentication for OpenAI, Cursor, and a lot of the labs you&rsquo;ve
            heard of. Fifteen years of web engineering before that. I help with
            the AI enablement function for our whole org: internal tooling,
            workshops, harnesses for teammates, helping everyone level up. I
            write down what I learn.
          </p>

          {/* Newsletter — the dominant CTA, rendered as a bordered card. */}
          <EditorialNewsletter
            location="hero"
            variant="card"
            label="The Modern Coding letter"
            meta="5,000+ engineers"
            title="Dispatches from the edge of applied AI."
            promise={
              <>
                <b>What lands in your inbox:</b> what I&rsquo;m building, what I&rsquo;m
                learning, the tools I&rsquo;d actually pay for, and the occasional
                workshop or tutorial. Names named, vendors graded, evals included.
              </>
            }
            fine="Unsubscribe in one click · No spam, ever"
            ctaLabel="Subscribe →"
          />

          <div className="editorial-secondary text-parchment-600 dark:text-slate-400">
            <Link href="/blog">Read the archive →</Link>
            <span>·</span>
            <Link href="/services">Workshops &amp; AI enablement →</Link>
          </div>

        </div>

        <aside className="editorial-hero-c-side">
          <div className="editorial-portrait editorial-portrait--c">
            <Image
              src="https://zackproser.b-cdn.net/images/zack-sketch.webp"
              alt="Portrait of Zachary Proser"
              fill
              sizes="(max-width: 1024px) 80vw, 320px"
              className="editorial-portrait-image"
              priority
            />
          </div>
          <div className="editorial-portrait-plate text-parchment-600 dark:text-slate-400">
            <span>Plate I · Duotone</span>
            <span>Source Serif</span>
          </div>

          <div className="editorial-erratum">
            <span className="editorial-erratum-stamp">Errata</span>
            <div className="editorial-erratum-head text-burnt-400 dark:text-amber-400">
              <span>Things I will not write about</span>
            </div>
            <ul className="editorial-erratum-list">
              <li>&ldquo;Agents are eating SaaS&rdquo;</li>
              <li>Frameworks I tried for 20 minutes</li>
              <li>Demos that don&rsquo;t pass an eval</li>
              <li>&ldquo;5 prompts that changed my life&rdquo;</li>
              <li className="editorial-erratum-keep">
                What I&rsquo;m actually building
                <br />for engineers who ship.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ----- Stat row -----------------------------------------------------

function StatRow() {
  const yearsExperience = RenderNumYearsExperience()
  const yearsWritingOnline = Math.abs(new Date('January 1 2005').getFullYear() - new Date().getFullYear())
  const stats = [
    { num: String(yearsExperience), unit: 'yrs', label: 'Shipping software' },
    { num: '5,000', unit: '+', label: 'Newsletter readers' },
    { num: '184', unit: 'wpm', label: 'Voice-coding velocity' },
    { num: String(yearsWritingOnline), unit: 'yrs', label: 'Writing online' },
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

// ----- Content rail ----------------------------------

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
          <div>
            <span className="text-burnt-400 dark:text-amber-400">●</span>{' '}
            Currently: Applied AI @ WorkOS · Open to{' '}
            <Link href="/speaking" className="underline decoration-dotted underline-offset-4 hover:text-burnt-400 dark:hover:text-amber-400">workshops</Link>
            {' '}and{' '}
            <Link href="/contact" className="underline decoration-dotted underline-offset-4 hover:text-burnt-400 dark:hover:text-amber-400">retainers</Link>
          </div>
          <div>
            <Link href="/contact" className="hover:text-burnt-400 dark:hover:text-amber-400">Get in touch →</Link>
          </div>
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
  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        <EditorialHero />
        <StatRow />
        <FeaturedProject />

        <ContentRail
          num="01"
          title="Deep & machine learning, by hand"
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
          title="Video & screencasts"
          moreHref="/videos"
          moreLabel="All videos →"
          articles={videos}
          keyPrefix="video"
          kind="Video"
        />
      </main>

      <ColophonFooter />
    </div>
  )
}
