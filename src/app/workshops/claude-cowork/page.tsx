import type { Metadata, Route } from "next"
import Image from "next/image"
import Link from "next/link"
import YoutubeEmbed from "@/components/YoutubeEmbed"

export const metadata: Metadata = {
  title: "Claude Cowork Workshop | Hands-On AI-Assisted Development | Zachary Proser",
  description: "A hands-on workshop where your team builds real workflows with Claude Code and Cowork. From ICP research to automated content production — in one session.",
  openGraph: {
    title: "Claude Cowork Workshop | Hands-On AI-Assisted Development",
    description: "A hands-on workshop where your team builds real workflows with Claude Code and Cowork.",
    images: [{ url: "https://zackproser.b-cdn.net/images/claude-cowork-workshop.webp" }],
  },
}

const workshopPhases = [
  {
    num: "01",
    phase: "Demo",
    duration: "30 min",
    title: "What's possible with Claude Code",
    items: [
      "Real projects built with Claude: Oura MCP integration, Handwave watchOS app",
      "Walking-and-talking development — shipping code from mountain trails",
      "Voice-first workflows with WisprFlow at 179 WPM",
      "How far you can push AI-assisted development today",
    ],
  },
  {
    num: "02",
    phase: "Hands-on",
    duration: "90 min",
    title: "Build a complete GTM workflow",
    items: [
      "ICP identification and data scraping",
      "Data enrichment and competitive analysis",
      "Battlecard creation from live competitive data",
      "Pain point messaging tailored to each ICP",
      "Cold email generation for identified prospects",
      "Blog post drafting and content scheduling",
      "Scheduled Cowork tasks for automated production",
    ],
  },
  {
    num: "03",
    phase: "Patterns",
    duration: "Throughout",
    title: "Context management and session craft",
    items: [
      "Managing context across long Claude Code sessions",
      "Carrying work forward without losing fidelity",
      "When to start fresh vs. continue a session",
      "Setting up Cowork for autonomous task execution",
    ],
  },
]

const audiences = [
  {
    idx: "A.01",
    title: "Engineering teams",
    description: "Ship features faster with AI-assisted development patterns that actually hold up in production.",
  },
  {
    idx: "A.02",
    title: "GTM & marketing teams",
    description: "Build automated research and content pipelines that run while you sleep.",
  },
  {
    idx: "A.03",
    title: "Technical leaders",
    description: "See what AI-assisted development looks like in practice so you can set strategy for your org.",
  },
]

const credentials = [
  "14 years shipping production systems",
  "Previously Staff DevRel at Pinecone, Cloudflare, Gruntwork",
  "DevSecCon 2025 keynote speaker",
  "AI Engineering World Fair workshop instructor (70+ engineers)",
  "Workshop co-hosted with Anthropic, February 2026",
  "35,000+ readers on zackproser.com",
]

function SectionHead({
  num,
  title,
  moreHref,
  moreLabel = 'Archive →',
}: {
  num: string
  title: string
  moreHref?: string
  moreLabel?: string
}) {
  return (
    <header className="editorial-section-head text-charcoal-50 dark:text-parchment-100">
      <div className="editorial-section-num">§ {num}</div>
      <h2 className="editorial-section-title">{title}</h2>
      {moreHref ? (
        <Link href={moreHref as Route} className="editorial-section-more text-burnt-400 dark:text-amber-400 hover:underline">
          {moreLabel}
        </Link>
      ) : <span />}
    </header>
  )
}

export default function ClaudeCoworkWorkshop() {
  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero ----- */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
                Workshop · Hands-on · 2 hours
              </div>
              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
                Claude Cowork —{' '}
                <span className="text-burnt-400 dark:text-amber-400">build</span>, don&apos;t watch.
              </h1>
              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                Most AI workshops teach you to prompt. This one teaches you to ship.
                A two-hour, hands-on session where your team builds a real GTM workflow
                — ICP research, competitive data, cold email, content — with Claude Code
                and Cowork running autonomously.
              </p>
              <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mt-6">
                <Link href="/contact">Book a workshop →</Link>
                <span>·</span>
                <Link href="/speaking">All talks →</Link>
                <span>·</span>
                <a href="#flow">Jump to the flow →</a>
              </div>
              <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
                <dt>Format</dt>
                <dd>Hands-on. Not a lecture. Attendees build alongside.</dd>
                <dt>Co-hosted</dt>
                <dd>WorkOS × Anthropic, February 2026</dd>
              </dl>
            </div>

            <div>
              <div className="editorial-rule-label text-parchment-600 dark:text-slate-400 mb-3">
                Recorded live
              </div>
              <div className="rounded-md overflow-hidden border border-parchment-300 dark:border-slate-700 shadow-lg">
                <YoutubeEmbed
                  urls="https://www.youtube.com/watch?v=8bjcx5Hkj5w"
                  title="Claude Cowork Workshop with Anthropic — February 2026"
                />
              </div>
              <p className="mt-3 text-[12px] font-mono uppercase tracking-wider text-parchment-600 dark:text-slate-400">
                SF · WorkOS × Anthropic · Feb 2026
              </p>
            </div>
          </div>
        </section>

        {/* ----- Stat slab ----- */}
        <section className="pb-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-stats text-charcoal-50 dark:text-parchment-100">
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  2<span className="unit">hr</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Hands-on, not lecture
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  20<span className="unit">seats</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Max per session
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  $750<span className="unit">/pp</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Team pricing available
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  70<span className="unit">+</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Engineers trained at AIE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----- Photo strip ----- */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              In the room · SF · Feb 2026
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { src: 'https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp', alt: 'Zack presenting at the Claude Cowork Workshop' },
                { src: 'https://zackproser.b-cdn.net/images/workshop-audience-coding-v2.webp', alt: 'Workshop attendees building with Claude Cowork' },
                { src: 'https://zackproser.b-cdn.net/images/workshop-qa-lydia-zack-v2.webp', alt: "Q&A with Lydia from Anthropic's Claude Code team" },
              ].map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm border border-parchment-300 dark:border-slate-700 shadow-md"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] font-mono uppercase tracking-wider text-parchment-600 dark:text-slate-400 text-center">
              Photos by Mark Robinson
            </p>
          </div>
        </section>

        {/* ----- The pitch (serif pull quote) ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              The pitch
            </div>
            <blockquote className="font-serif text-2xl md:text-[32px] leading-[1.25] tracking-tight text-charcoal-50 dark:text-parchment-100">
              I&apos;ve been shipping production code with Claude Code daily for over
              a year — watchOS apps, MCP integrations, full-stack features. This
              workshop compresses months of hard-won patterns into a single
              hands-on session. You&apos;ll walk in knowing Claude exists. You&apos;ll
              walk out knowing how to{' '}
              <span className="text-burnt-400 dark:text-amber-400">make it do real work</span>
              {' '}— and how to set up Cowork tasks that keep producing while
              you&apos;re offline.
            </blockquote>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400">
              — Zachary Proser · Applied AI @ WorkOS
            </div>
          </div>
        </section>

        {/* ----- § 01 Workshop flow ----- */}
        <section id="flow" className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead num="01" title="What you'll build" moreHref="/contact" moreLabel="Book a session →" />
            <div className="grid gap-6 md:grid-cols-3">
              {workshopPhases.map((phase) => (
                <article key={phase.num} className="editorial-card">
                  <div className="editorial-card-link">
                    <div className="editorial-card-meta flex items-center justify-between">
                      <span>P{phase.num} · {phase.phase}</span>
                      <span className="text-burnt-400 dark:text-amber-400">{phase.duration}</span>
                    </div>
                    <div className="editorial-card-body" style={{ padding: '20px' }}>
                      <h3 className="editorial-card-title">{phase.title}</h3>
                      <ul className="mt-2 space-y-2 text-[14px] leading-snug text-parchment-600 dark:text-slate-300">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-burnt-400 dark:text-amber-400 font-mono mt-0.5">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="editorial-card-footer">
                        <span className="editorial-card-read">Phase {phase.num}</span>
                        <span className="editorial-card-index">P.{phase.num}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----- § 02 Who it's for ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead num="02" title="Who this is for" moreHref="/contact" moreLabel="Tell me about your team →" />
            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map((a) => (
                <article key={a.idx} className="editorial-card">
                  <div className="editorial-card-link">
                    <div className="editorial-card-meta flex items-center justify-between">
                      <span>{a.idx} · Audience</span>
                    </div>
                    <div className="editorial-card-body" style={{ padding: '20px' }}>
                      <h3 className="editorial-card-title">{a.title}</h3>
                      <p className="editorial-card-desc" style={{ WebkitLineClamp: 4 }}>{a.description}</p>
                      <div className="editorial-card-footer">
                        <span className="editorial-card-read">Fit check →</span>
                        <span className="editorial-card-index">{a.idx}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----- Instructor colophon ----- */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              Your instructor
            </div>
            <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] items-start">
              <div>
                <h3 className="font-serif text-3xl font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100">
                  Zachary <span className="text-burnt-400 dark:text-amber-400">Proser</span>
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400">
                  Applied AI · WorkOS
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[48ch]">
                  I ship production systems daily with Claude Code, Cowork, and voice-first
                  tooling. I teach the patterns I actually use — no vapor.
                </p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[14px] border-t border-parchment-300 dark:border-slate-700 pt-5">
                {credentials.map((c, i) => (
                  <div key={c} className="contents">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-500 dark:text-slate-500 pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </dt>
                    <dd className="text-charcoal-50 dark:text-parchment-100">{c}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ----- Final CTA ----- */}
        <section className="py-20 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
            <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
              Ready when you are
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4 text-charcoal-50 dark:text-parchment-100">
              On-site, virtual, conference, or private team session —
              tell me what you need and when.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              >
                Book a workshop →
              </Link>
              <Link
                href="/speaking"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              >
                View all talks →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
