import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SimpleLayout } from "@/components/SimpleLayout"
import YoutubeEmbed from "@/components/YoutubeEmbed"
import { Clock, Users, Zap, CheckCircle, ArrowRight, Star, Code, Brain, Target, Mail, Mic, Building2, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "Claude Cowork Workshop | Hands-On AI-Assisted Development | Zachary Proser",
  description: "A hands-on workshop where your team builds real workflows with Claude Code and Cowork. From ICP research to automated content production — in one session.",
  openGraph: {
    title: "Claude Cowork Workshop | Hands-On AI-Assisted Development",
    description: "A hands-on workshop where your team builds real workflows with Claude Code and Cowork.",
    images: [{ url: "https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp" }],
  },
}

const workshopPhases = [
  {
    phase: "Demo",
    duration: "30 min",
    icon: <Zap className="h-6 w-6" />,
    title: "What's possible with Claude Code",
    items: [
      "Real projects built with Claude: Oura MCP integration, Handwave watchOS app",
      "Walking-and-talking development — shipping code from mountain trails",
      "Voice-first workflows with WisprFlow at 179 WPM",
      "How far you can push AI-assisted development today",
    ],
  },
  {
    phase: "Hands-On",
    duration: "90 min",
    icon: <Code className="h-6 w-6" />,
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
    phase: "Patterns",
    duration: "Throughout",
    icon: <Brain className="h-6 w-6" />,
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
    title: "Engineering Teams",
    description: "Ship features faster by learning AI-assisted development patterns that actually work in production.",
    icon: <Code className="h-5 w-5" />,
  },
  {
    title: "GTM & Marketing Teams",
    description: "Build automated research and content pipelines that run while you sleep.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Technical Leaders",
    description: "Understand what AI-assisted development looks like in practice so you can set strategy for your org.",
    icon: <Star className="h-5 w-5" />,
  },
]

const speakingHistory = [
  {
    title: "Claude Cowork Workshop with Anthropic",
    event: "WorkOS x Anthropic",
    date: "February 2026",
    location: "San Francisco, CA",
    type: "workshop",
    highlight: "800 registrations, co-hosted with Anthropic's Claude Code team",
  },
  {
    title: "Keynote: DevSecCon 2025",
    event: "DevSecCon 2025",
    date: "2025",
    location: "Conference",
    type: "keynote",
    highlight: "Keynote address on AI-assisted development and security",
  },
  {
    title: "AI Pipelines and Agents in Pure TypeScript",
    event: "Mastra.ai Workshop",
    date: "2025",
    location: "Virtual",
    type: "workshop",
    highlight: "Live-coded agentic pipelines with the Mastra.ai framework",
  },
  {
    title: "Navigating from Jupyter Notebooks to Production",
    event: "Conference Talk",
    date: "2025",
    location: "Conference",
    type: "talk",
    highlight: "Shipping ML models from prototype to production infrastructure",
  },
  {
    title: "Voice-First Development & Claude Code Cowork",
    event: "WorkOS Internal",
    date: "2025–2026",
    location: "WorkOS",
    type: "training",
    highlight: "Enabled engineering team on voice-first agentic development patterns",
  },
  {
    title: "Claude Skills as Self-Documenting Runbooks",
    event: "WorkOS Internal",
    date: "2025",
    location: "WorkOS",
    type: "training",
    highlight: "Designed and delivered internal training on Claude Code skill patterns",
  },
  {
    title: "AI Fundamentals for Engineering Teams",
    event: "WorkOS Internal",
    date: "2025",
    location: "WorkOS",
    type: "training",
    highlight: "Multi-session training: embeddings, RAG, vector databases, deployment",
  },
  {
    title: "AI-Enabled Content Creation Workshop",
    event: "AI Engineering World Fair",
    date: "2024",
    location: "San Francisco, CA",
    type: "workshop",
    highlight: "70+ engineers, hands-on AI content pipeline building",
  },
]

const typeIcons: Record<string, React.ReactNode> = {
  keynote: <Mic className="h-4 w-4" />,
  workshop: <GraduationCap className="h-4 w-4" />,
  talk: <Mic className="h-4 w-4" />,
  training: <Building2 className="h-4 w-4" />,
}

export default function ClaudeCoworkWorkshop() {
  return (
    <SimpleLayout
      title="Claude Cowork Workshop"
      intro="A hands-on session where you don't just watch — you build. Real workflows, real output, real skills you'll use Monday morning."
    >
      {/* Hero Photo from the Anthropic Workshop */}
      <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-16">
        <Image
          src="https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp"
          alt="Zack Proser presenting at the Claude Cowork Workshop at WorkOS, co-hosted with Anthropic"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-lg font-semibold">WorkOS x Anthropic — San Francisco, February 2026</p>
          <p className="text-sm opacity-80">800 registrations. 150 seats. One hour of live building with Lydia from Anthropic&apos;s Claude Code team on Q&amp;A.</p>
        </div>
      </div>

      {/* Hero Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-6 text-center">
          <Clock className="h-8 w-8 text-burnt-400 dark:text-amber-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-charcoal-50 dark:text-slate-100">2 Hours</div>
          <div className="text-parchment-500 dark:text-slate-400">Hands-on, not lecture</div>
        </div>
        <div className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-6 text-center">
          <Users className="h-8 w-8 text-burnt-400 dark:text-amber-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-charcoal-50 dark:text-slate-100">Max 20 Seats</div>
          <div className="text-parchment-500 dark:text-slate-400">Small enough to be useful</div>
        </div>
        <div className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-6 text-center">
          <Zap className="h-8 w-8 text-burnt-400 dark:text-amber-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-charcoal-50 dark:text-slate-100">$750/person</div>
          <div className="text-parchment-500 dark:text-slate-400">Team pricing available</div>
        </div>
      </div>

      {/* Workshop Recording */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-6">Watch the Workshop</h2>
        <div className="rounded-xl overflow-hidden">
          <YoutubeEmbed urls="https://www.youtube.com/watch?v=8bjcx5Hkj5w" title="Claude Cowork Workshop with Anthropic — February 2026" />
        </div>
        <p className="text-sm text-parchment-500 dark:text-slate-400 mt-3">
          Recorded live at the WorkOS x Anthropic event in San Francisco, February 26, 2026.
        </p>
      </section>

      {/* Workshop Photos */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-72 rounded-xl overflow-hidden shadow-lg">
            <Image src="https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp"
              alt="Zack presenting at the Claude Cowork Workshop"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-72 rounded-xl overflow-hidden shadow-lg">
            <Image src="https://zackproser.b-cdn.net/images/workshop-audience-coding-v2.webp"
              alt="Workshop attendees building with Claude Cowork"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-72 rounded-xl overflow-hidden shadow-lg">
            <Image src="https://zackproser.b-cdn.net/images/workshop-qa-lydia-zack-v2.webp"
              alt="Q&A with Lydia from Anthropic's Claude Code team"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <p className="text-sm text-parchment-500 dark:text-slate-400 mt-3 text-center">
          From the WorkOS x Anthropic workshop, February 2026. Photos by Mark Robinson.
        </p>
      </section>

      {/* The Pitch */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-burnt-400/10 to-amber-500/10 dark:from-amber-500/10 dark:to-burnt-400/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">
            Most AI workshops teach you to prompt. This one teaches you to build.
          </h2>
          <p className="text-lg text-parchment-600 dark:text-slate-300 mb-4">
            I&apos;ve been shipping production code with Claude Code daily for over a year — from watchOS apps to MCP integrations
            to full-stack features at WorkOS. This workshop compresses months of hard-won patterns into a single hands-on session.
          </p>
          <p className="text-lg text-parchment-600 dark:text-slate-300">
            You&apos;ll walk in knowing Claude exists. You&apos;ll walk out knowing how to make it do real work — and how to
            set up Cowork tasks that keep producing while you&apos;re offline.
          </p>
        </div>
      </section>

      {/* Workshop Flow */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-8">What You&apos;ll Build</h2>
        <div className="space-y-8">
          {workshopPhases.map((phase, index) => (
            <div key={index} className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-burnt-400/20 dark:bg-amber-500/20 text-burnt-500 dark:text-amber-400">
                  {phase.icon}
                </div>
                <div>
                  <span className="text-sm font-medium text-burnt-400 dark:text-amber-400">{phase.phase} · {phase.duration}</span>
                  <h3 className="text-xl font-bold text-charcoal-50 dark:text-slate-100">{phase.title}</h3>
                </div>
              </div>
              <ul className="space-y-3 ml-16">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-parchment-600 dark:text-slate-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-8">Who This Is For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <div key={index} className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-burnt-400 dark:text-amber-400">{audience.icon}</div>
                <h3 className="font-bold text-charcoal-50 dark:text-slate-100">{audience.title}</h3>
              </div>
              <p className="text-parchment-600 dark:text-slate-300">{audience.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY ME — Instructor + CV */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-6">Why Me</h2>
        <div className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp"
                  alt="Zachary Proser presenting"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-2">Zachary Proser</h3>
              <p className="text-burnt-400 dark:text-amber-400 font-medium mb-4">Applied AI Engineer · WorkOS</p>
              <p className="text-parchment-600 dark:text-slate-300 mb-6">
                I eat, sleep, and breathe this stuff. I&apos;ve been building production AI systems for over three years — not writing blog posts about the future,
                but actually shipping code that runs in production, training teams, and delivering workshops. Very few engineers have been doing agentic AI development
                this long, and even fewer have been teaching it simultaneously.
              </p>

              <h4 className="font-bold text-charcoal-50 dark:text-slate-100 mb-3">Career</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-burnt-400 dark:bg-amber-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal-50 dark:text-slate-100">Applied AI Engineer — WorkOS</span>
                    <span className="text-parchment-500 dark:text-slate-400 text-sm ml-2">(current)</span>
                    <p className="text-sm text-parchment-500 dark:text-slate-400">Building and maintaining production AI applications. Full-stack JS/TS deployed on Cloudflare and Vercel. Led the Hilltop review process for AI features.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-burnt-400 dark:bg-amber-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal-50 dark:text-slate-100">Staff Developer Relations Engineer — Pinecone</span>
                    <p className="text-sm text-parchment-500 dark:text-slate-400">RAG pipelines, embedding models, vector databases. Built and documented end-to-end AI search and retrieval systems. Open-sourced reference architectures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-burnt-400 dark:bg-amber-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal-50 dark:text-slate-100">Staff Developer Relations Engineer — Cloudflare</span>
                    <p className="text-sm text-parchment-500 dark:text-slate-400">Infrastructure as Code, Terraform provider development. Built cf-terraforming (open source).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-burnt-400 dark:bg-amber-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal-50 dark:text-slate-100">Senior Software Engineer — Gruntwork</span>
                    <p className="text-sm text-parchment-500 dark:text-slate-400">End-to-end AWS deployments, Infrastructure as Code at scale. Built git-xargs (run commands across many GitHub repos) and cloud-nuke (AWS resource cleanup). Popularized the Bubbletea state machine pattern.</p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-charcoal-50 dark:text-slate-100 mb-3">By the Numbers</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-burnt-400 dark:text-amber-400">14 years</div>
                  <div className="text-xs text-parchment-500 dark:text-slate-400">shipping production systems</div>
                </div>
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-burnt-400 dark:text-amber-400">3+ years</div>
                  <div className="text-xs text-parchment-500 dark:text-slate-400">building with AI daily</div>
                </div>
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-burnt-400 dark:text-amber-400">35,000+</div>
                  <div className="text-xs text-parchment-500 dark:text-slate-400">readers on zackproser.com</div>
                </div>
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-burnt-400 dark:text-amber-400">4,300+</div>
                  <div className="text-xs text-parchment-500 dark:text-slate-400">newsletter subscribers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking History — Overwhelming Credibility */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">Talks, Workshops &amp; Training</h2>
        <p className="text-parchment-500 dark:text-slate-400 mb-8">
          Video, in-person, and corporate training. Keynotes, conferences, internal enablement. This is what I do.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {speakingHistory.map((talk, index) => (
            <div key={index} className="bg-parchment-50 dark:bg-slate-800 rounded-lg p-4 border border-parchment-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-burnt-400 dark:text-amber-400">
                  {typeIcons[talk.type]}
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-burnt-400 dark:text-amber-400">{talk.type}</span>
              </div>
              <h3 className="font-bold text-sm text-charcoal-50 dark:text-slate-100 mb-1 leading-tight">{talk.title}</h3>
              <p className="text-xs text-parchment-500 dark:text-slate-400 mb-2">{talk.event} · {talk.date}</p>
              <p className="text-xs text-parchment-600 dark:text-slate-300">{talk.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-burnt-400 to-burnt-500 dark:from-amber-500 dark:to-amber-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to level up your team?</h2>
        <p className="text-lg mb-2 opacity-90">
          Available for on-site workshops, virtual sessions, and conference appearances.
        </p>
        <p className="text-lg mb-8 opacity-90">
          Team pricing available for groups of 5+.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-burnt-500 font-bold rounded-lg hover:bg-parchment-50 transition-colors text-lg"
          >
            <Mail className="h-5 w-5" />
            Book a Workshop
          </Link>
          <Link
            href="/speaking"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors text-lg"
          >
            View All Speaking
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </SimpleLayout>
  )
}
