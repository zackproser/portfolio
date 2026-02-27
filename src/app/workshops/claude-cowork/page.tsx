import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SimpleLayout } from "@/components/SimpleLayout"
import { Clock, Users, Zap, CheckCircle, ArrowRight, Star, Code, Brain, Target, Mail } from "lucide-react"

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
    phase: "Demo",
    duration: "15 min",
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
    duration: "45 min",
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

export default function ClaudeCoworkWorkshop() {
  return (
    <SimpleLayout
      title="Claude Cowork Workshop"
      intro="A hands-on session where you don't just watch — you build. Real workflows, real output, real skills you'll use Monday morning."
    >
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

      {/* The Pitch */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-burnt-400/10 to-amber-500/10 dark:from-amber-500/10 dark:to-burnt-400/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">
            Most AI workshops teach you to prompt. This one teaches you to build.
          </h2>
          <p className="text-lg text-parchment-600 dark:text-slate-300 mb-4">
            I&apos;ve been shipping production code with Claude Code daily for over a year — from watchOS apps to MCP integrations
            to full-stack features. This workshop compresses months of hard-won patterns into a single hands-on session.
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

      {/* Credentials */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-6">Your Instructor</h2>
        <div className="bg-parchment-50 dark:bg-slate-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div>
              <h3 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-2">Zachary Proser</h3>
              <p className="text-burnt-400 dark:text-amber-400 font-medium mb-4">Applied AI Engineer · WorkOS</p>
              <ul className="space-y-2 text-parchment-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  14 years shipping production systems
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Previously Staff DevRel at Pinecone, Cloudflare, Gruntwork
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  DevSecCon 2025 keynote speaker
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  AI Engineering World Fair workshop instructor (70+ engineers)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Workshop co-hosted with Anthropic, February 2026
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  35,000+ readers on zackproser.com
                </li>
              </ul>
            </div>
          </div>
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
