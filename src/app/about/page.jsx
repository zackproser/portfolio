import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import Newsletter from "@/components/NewsletterWrapper"
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
  SocialLink,
} from "@/components/SocialIcons"
import { MailIcon } from "@/components/icons"
import RenderNumYearsExperience from "@/components/NumYearsExperience"
import RandomPortrait from "@/components/RandomPortrait"
import { generateOgUrl } from "@/utils/ogUrl"
import { resumeData } from "@/data/resume"

const data = {
  title: "About Zachary Proser",
  description:
    "Full-stack open-source hacker, technical writer, and Developer Experience Engineer at WorkOS.",
}

const ogUrl = generateOgUrl(data)

export const metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: "https://zackproser.com/about" },
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: "Modern Coding",
    images: [{ url: ogUrl }],
    locale: "en_US",
    type: "website",
  },
}

// Career history with additional blurbs for the about page
const resume = resumeData.map((role) => {
  const blurbs = {
    'WorkOS-Developer Experience Engineer': "Applied AI work on developer-facing products. Retrieval, agent harnesses, and the writing that helps teams adopt them.",
    'WorkOS-Developer Education': "Built and led the developer-education surface at WorkOS — documentation, workshops, and video.",
    'Pinecone.io-Staff Developer Advocate': "Designed the RAG reference architectures and tutorials that thousands of teams used to go from embeddings to a shipped retrieval system.",
    'Gruntwork.io-Tech Lead': "Wrote, maintained, and open-sourced Terraform modules used by hundreds of companies to run their AWS infrastructure.",
    'Cloudflare-Senior Software Engineer': "Built and shipped developer-tooling features used by hundreds of thousands of developers per month.",
  }
  const key = `${role.company}-${role.title}`
  return {
    ...role,
    blurb: blurbs[key],
  }
})

const pressLogos = [
  "Pinecone",
  "Cloudflare",
  "Gruntwork",
  "WorkOS",
  "DevSecCon",
  "AI Engineering",
]

export default function About() {
  const years = RenderNumYearsExperience()

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero ----- */}
        <section className="pt-14 pb-12 md:pt-20 md:pb-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
                <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
                <span className="mx-2 opacity-40">/</span>
                <span>About</span>
              </div>
              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
                Hi, I&apos;m{' '}
                <span className="text-burnt-400 dark:text-amber-400">Zachary</span>.
              </h1>
              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                I&apos;m a full-stack open-source hacker with {years} years of
                software development experience at top startups and established
                enterprise companies. Currently a Developer Experience Engineer
                at{' '}
                <Link href="https://workos.com" className="text-burnt-400 dark:text-amber-400 hover:underline">
                  WorkOS
                </Link>
                , where we help companies add enterprise features to their apps
                in minutes, not months.
              </p>
              <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mt-6">
                <a href="#work">Work history →</a>
                <span>·</span>
                <Link href="/blog">Writing →</Link>
                <span>·</span>
                <Link href="/testimonials">Testimonials →</Link>
                <span>·</span>
                <Link href="/contact">Say hello →</Link>
              </div>
              <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
                <dt>Currently</dt>
                <dd>Developer Experience Engineer · WorkOS</dd>
                <dt>Formerly</dt>
                <dd>Pinecone · Cloudflare · Gruntwork</dd>
                <dt>Writes</dt>
                <dd>
                  <Link href="/newsletter" className="hover:text-burnt-400 dark:hover:text-amber-400">
                    The Modern Coding letter
                  </Link>
                  {' '}— read by 5,000+ engineers
                </dd>
              </dl>
            </div>

            <div className="lg:justify-self-end">
              <div className="editorial-portrait" style={{ maxWidth: 440 }}>
                <Suspense>
                  <RandomPortrait width={600} height={600} />
                </Suspense>
              </div>
              <div className="editorial-portrait-caption text-parchment-600 dark:text-slate-400">
                Plate I · Applied AI · MMXXVI
              </div>
            </div>
          </div>
        </section>

        {/* ----- Stats ----- */}
        <section className="pb-10">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-stats text-charcoal-50 dark:text-parchment-100">
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  {years}<span className="unit">yrs</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Shipping software
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  5,000<span className="unit">+</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Newsletter readers
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  6<span className="unit">cos</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Companies shipped at
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  1<span className="unit">focus</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Making AI survive production
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----- § 01 Bio ----- */}
        <section className="py-12">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              § 01 · Biography
            </div>
            <div className="prose-editorial text-[17px] leading-[1.7] text-charcoal-50 dark:text-parchment-100 space-y-5 mt-6">
              <p className="first-letter:float-left first-letter:font-serif first-letter:text-[64px] first-letter:leading-[0.9] first-letter:mr-2 first-letter:mt-1 first-letter:text-burnt-400 dark:first-letter:text-amber-400">
                I&apos;m a Developer Experience Engineer at{' '}
                <Link href="https://workos.com" className="underline decoration-burnt-400/40 hover:decoration-burnt-400 dark:decoration-amber-400/40 dark:hover:decoration-amber-400">
                  WorkOS
                </Link>
                . Before that I did developer-education and staff developer-
                advocacy work at Pinecone, senior engineering at Cloudflare, and
                tech-lead work at Gruntwork. {years} years in production,
                mostly building the thing underneath the thing.
              </p>
              <p>
                I offer{' '}
                <Link href="/services" className="underline decoration-burnt-400/40 hover:decoration-burnt-400 dark:decoration-amber-400/40 dark:hover:decoration-amber-400">
                  specialized AI engineering services
                </Link>
                {' '}focused on production-ready Next.js apps with vector-database
                integration. If your team was handed an LLM and a deadline, I
                can help you ship a RAG pipeline, an agent harness, or the evals
                that tell you whether any of it works.
              </p>
              <p>
                I&apos;ve been writing online since I was fifteen. The form has
                changed — blogs, newsletters, this site — but the reason
                hasn&apos;t. Writing is the only way I know to verify that I
                actually understand something. The{' '}
                <Link href="/newsletter" className="underline decoration-burnt-400/40 hover:decoration-burnt-400 dark:decoration-amber-400/40 dark:hover:decoration-amber-400">
                  Modern Coding letter
                </Link>
                {' '}is read by 5,000+ engineers and is where most of what I
                publish ends up first.
              </p>
              <p>
                Want to know what it&apos;s like to work with me? Read{' '}
                <Link href="/testimonials" className="underline decoration-burnt-400/40 hover:decoration-burnt-400 dark:decoration-amber-400/40 dark:hover:decoration-amber-400">
                  testimonials from past colleagues and clients
                </Link>
                . Or check my guide to the{' '}
                <Link href="/best-ai-tools" className="underline decoration-burnt-400/40 hover:decoration-burnt-400 dark:decoration-amber-400/40 dark:hover:decoration-amber-400">
                  best AI tools for small business owners
                </Link>
                {' '}— the exact stack I use daily.
              </p>
            </div>
          </div>
        </section>

        {/* ----- § 02 Work history ----- */}
        <section id="work" className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <header className="editorial-section-head text-charcoal-50 dark:text-parchment-100">
              <div className="editorial-section-num">§ 02</div>
              <h2 className="editorial-section-title">Where I&apos;ve worked</h2>
              <a
                href="https://linkedin.com/in/zackproser"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-section-more text-burnt-400 dark:text-amber-400 hover:underline"
              >
                LinkedIn →
              </a>
            </header>

            <ol className="space-y-6">
              {resume.map((role) => (
                <li
                  key={`${role.company}-${role.start}`}
                  className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-6 pb-6 border-b border-parchment-300/40 dark:border-slate-700/40 last:border-b-0"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 pt-1">
                    <div>{role.start} — {role.end}</div>
                    <div className="mt-3 w-8 h-8 relative opacity-80">
                      <Image
                        src={role.logo}
                        alt={role.company}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-xl font-bold leading-tight text-charcoal-50 dark:text-parchment-100">
                      {role.title}{' '}
                      <span className="text-burnt-400 dark:text-amber-400">
                        at {role.company}
                      </span>
                    </div>
                    {role.blurb ? (
                      <p className="mt-2 text-[15px] leading-relaxed text-parchment-600 dark:text-slate-300">
                        {role.blurb}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----- § 03 Written & spoken at ----- */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              § 03 · Written &amp; spoken at
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 font-serif text-xl md:text-2xl text-parchment-600 dark:text-slate-400">
              {pressLogos.map((name) => (
                <span key={name} className="opacity-70 hover:opacity-100 transition-opacity">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ----- § 04 Elsewhere ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <header className="editorial-section-head text-charcoal-50 dark:text-parchment-100">
              <div className="editorial-section-num">§ 04</div>
              <h2 className="editorial-section-title">Elsewhere on the internet</h2>
              <span />
            </header>

            <ul role="list" className="grid gap-3 md:grid-cols-2">
              <SocialLink href="https://twitter.com/zackproser" icon={TwitterIcon}>
                Follow on Twitter
              </SocialLink>
              <SocialLink href="https://youtube.com/@zackproser" icon={YouTubeIcon}>
                Subscribe on YouTube
              </SocialLink>
              <SocialLink href="https://github.com/zackproser" icon={GitHubIcon}>
                Follow on GitHub
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/zackproser" icon={LinkedInIcon}>
                Connect on LinkedIn
              </SocialLink>
              <SocialLink href="https://instagram.com/zackproser" icon={InstagramIcon}>
                Follow on Instagram
              </SocialLink>
              <SocialLink href="mailto:zackproser@gmail.com" icon={MailIcon}>
                zackproser@gmail.com
              </SocialLink>
            </ul>
          </div>
        </section>

        {/* ----- Newsletter ----- */}
        <section className="py-14">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              The Modern Coding letter
            </div>
            <Newsletter />
          </div>
        </section>

        {/* ----- CTA ----- */}
        <section className="py-16 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
            <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
              Say hello
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4 text-charcoal-50 dark:text-parchment-100">
              Consulting enquiries, speaking invitations, and the occasional
              note of pure curiosity all reach me the{' '}
              <span className="text-burnt-400 dark:text-amber-400">same way</span>.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              >
                Email me →
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              >
                View my services →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
