'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Route } from 'next'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConsultationForm from '@/components/ConsultationForm'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { sendGTMEvent } from '@next/third-parties/google'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import HeroPortrait from '@/components/HeroPortrait'
import { PenLine, Video, Monitor, Rocket, Sparkles } from 'lucide-react'

// Dynamically import the NeuralNetworkPulse with no SSR
const NeuralNetworkPulse = dynamic(
  () => import('@/components/NeuralNetworkPulse').then(mod => mod.NeuralNetworkPulse),
  {
    ssr: false,
    loading: () => (
      <div className="w-[400px] h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading visualization...</div>
      </div>
    )
  }
)

export default function AuthorityHero() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/form', {
        body: JSON.stringify({ email, referrer: '/' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      sendGTMEvent({ event: 'newsletter-signup-conversion', method: 'newsletter' })
      track('newsletter-signup', { method: 'newsletter' })
      setFormSuccess(true)
      setEmail('')
    } catch (error) {
      console.error(error)
    }
  }

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <>
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
          : 'bg-gradient-to-b from-white via-parchment-50 to-parchment-100'
      }`}>
        {/* Light mode: Subtle paper texture - clean and modern */}
        {!isDark && (
          <>
            <div
              className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '300px 300px',
              }}
            />
            {/* Subtle warm accent in corner */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-burnt-400/[0.03] to-transparent pointer-events-none" />
          </>
        )}

        {/* Dark mode: Subtle grid pattern */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )}

        {/* Container */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 lg:gap-12 items-start">

            {/* Left Column: Headline + Lead Capture + Credibility */}
            <div className="flex flex-col order-2 lg:order-1">
              {/* Identity Headlines */}
              <h1
                className={`font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight ${
                  isDark ? 'text-slate-100' : 'text-charcoal-50'
                }`}
                style={{
                  textShadow: isDark
                    ? '2px 2px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(255,255,255,0.1)'
                    : '2px 2px 0 rgba(255,255,255,0.9), -1px -1px 0 rgba(0,0,0,0.08)',
                }}
              >
                AI Engineer <span className={`${isDark ? 'text-slate-500' : 'text-parchment-400'}`}>&amp;</span>
              </h1>
              <h1
                className={`font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 md:mb-4 ${
                  isDark ? '!text-amber-400' : '!text-burnt-400'
                }`}
                style={{
                  textShadow: isDark
                    ? '2px 2px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(255,255,255,0.1)'
                    : '2px 2px 0 rgba(255,255,255,0.9), -1px -1px 0 rgba(0,0,0,0.1)',
                }}
              >
                Cognitive Interface Researcher
              </h1>

              {/* Value Proposition */}
              <p className={`text-lg md:text-xl leading-relaxed mb-3 md:mb-5 max-w-xl ${isDark ? 'text-slate-200' : 'text-charcoal-100'}`}>
                14 years shipping production systems. Now on the Applied AI team at WorkOS, testing and building AI workflows daily. Here&apos;s what actually works.
              </p>

              {/* Lead Capture Card */}
              <div className={`px-[18px] py-5 md:px-6 md:py-6 lg:px-7 lg:py-7 rounded-xl mb-5 ${
                isDark
                  ? 'bg-slate-800/60 border border-amber-500/30'
                  : 'bg-white border border-burnt-400/20 shadow-md'
              }`}>
                {formSuccess ? (
                  <div className="text-center py-4">
                    <p className={`text-base font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      You&apos;re in!
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                      Check your inbox for your free guides.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Text content container with constrained measure */}
                    <div className="max-w-[56ch]">
                      <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                        Practical AI patterns that survive contact with reality
                      </p>
                      <div className={`space-y-3 text-[15px] leading-[1.6] ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                        <p>
                          If you&apos;re building with AI and want fewer surprises, I break down the exact RAG patterns, tools, and defaults I use in production&mdash;what scales, what doesn&apos;t, and why.
                        </p>
                        <p>
                          This is for engineers shipping features, founders figuring out where AI actually pays off, and anyone trying to see past the demo layer.
                        </p>
                      </div>
                    </div>
                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mt-5">
                      {/* Mobile: short placeholder */}
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`flex-1 h-10 text-sm md:hidden ${
                          isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                            : 'bg-parchment-50 border-parchment-300 text-charcoal-50 placeholder:text-parchment-400'
                        }`}
                        required
                      />
                      {/* Desktop: longer placeholder */}
                      <Input
                        type="email"
                        placeholder="Work or personal email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`flex-1 h-10 text-sm hidden md:block ${
                          isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                            : 'bg-parchment-50 border-parchment-300 text-charcoal-50 placeholder:text-parchment-400'
                        }`}
                        required
                      />
                      <Button
                        type="submit"
                        className={`h-10 px-4 font-semibold text-sm whitespace-nowrap ${
                          isDark
                            ? 'bg-amber-500 hover:bg-amber-400 text-white'
                            : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                        }`}
                      >
                        Show me what works
                      </Button>
                    </form>
                    {/* Mobile only: extra helper text */}
                    <p className={`text-[10px] mt-1.5 md:hidden ${isDark ? 'text-slate-500' : 'text-parchment-400'}`}>
                      Work or personal is fine.
                    </p>
                    <p className={`text-[11px] mt-2 md:mt-3 ${isDark ? 'text-slate-500' : 'text-parchment-400'}`}>
                      Read by 4,000+ builders. No hype. Unsub anytime.
                    </p>
                  </>
                )}
              </div>

              {/* Company Experience with Labels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className={`flex flex-col items-center text-center p-2 rounded-lg ${
                  isDark ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/70 border border-parchment-200'
                }`}>
                  <img src="/images/logos/workos.svg" alt="WorkOS" className={`h-5 mb-1 ${isDark ? 'brightness-0 invert' : ''}`} />
                  <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>WorkOS</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>Applied AI</span>
                </div>
                <div className={`flex flex-col items-center text-center p-2 rounded-lg ${
                  isDark ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/70 border border-parchment-200'
                }`}>
                  <img src="/images/logos/pinecone.png" alt="Pinecone" className="h-5 mb-1" />
                  <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>Pinecone</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>RAG &amp; Vectors</span>
                </div>
                <div className={`flex flex-col items-center text-center p-2 rounded-lg ${
                  isDark ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/70 border border-parchment-200'
                }`}>
                  <img src="/images/logos/cloudflare.svg" alt="Cloudflare" className={`h-5 mb-1 ${isDark ? 'brightness-0 invert' : ''}`} />
                  <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>Cloudflare</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>APIs &amp; Edge</span>
                </div>
                <div className={`flex flex-col items-center text-center p-2 rounded-lg ${
                  isDark ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/70 border border-parchment-200'
                }`}>
                  <img src="/images/logos/gruntwork.png" alt="Gruntwork" className="h-5 mb-1" />
                  <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>Gruntwork</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>AWS &amp; IaC</span>
                </div>
              </div>

              {/* Content Pills */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href="/best-ai-tools"
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:border-amber-400 hover:text-amber-300'
                      : 'bg-burnt-400/10 border border-burnt-400/40 text-burnt-500 hover:border-burnt-400 hover:text-burnt-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Tools
                </Link>
                <Link
                  href="/blog"
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400/50 hover:text-sky-400'
                      : 'bg-white border border-parchment-200 text-parchment-600 hover:border-burnt-400/50 hover:text-burnt-500'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Writing
                </Link>
                <Link
                  href="/videos"
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400/50 hover:text-sky-400'
                      : 'bg-white border border-parchment-200 text-parchment-600 hover:border-burnt-400/50 hover:text-burnt-500'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  Videos
                </Link>
                <Link
                  href="/demos"
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400/50 hover:text-sky-400'
                      : 'bg-white border border-parchment-200 text-parchment-600 hover:border-burnt-400/50 hover:text-burnt-500'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Demos
                </Link>
                <Link
                  href="/projects"
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400/50 hover:text-sky-400'
                      : 'bg-white border border-parchment-200 text-parchment-600 hover:border-burnt-400/50 hover:text-burnt-500'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Projects
                </Link>
              </div>
            </div>

            {/* Right Column: Portrait */}
            <div className="order-1 lg:order-2">
              <HeroPortrait />
            </div>
          </div>

          {/* Secondary CTAs below hero */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => {
                track('authority_hero_cta', { action: 'book_consultation' })
                setIsConsultationOpen(true)
              }}
              className={`h-12 px-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-burnt-400 hover:bg-burnt-500 text-white'
              }`}
            >
              Book a Consultation
            </Button>
            <Link
              href="/demos"
              className={`inline-flex items-center justify-center h-12 px-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-burnt-400 hover:bg-burnt-500 text-white'
              }`}
            >
              Try Interactive Demos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured: Oura MCP Integration */}
      <section className={`py-16 md:py-20 transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-b from-slate-950 to-slate-900'
          : 'bg-parchment-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                Cognitive Infrastructure in Practice
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Real systems I&apos;ve built to transform how I work
              </p>
            </div>

            {/* Featured: Claude as External Brain */}
            <div className={`p-8 rounded-2xl mb-8 overflow-hidden ${
              isDark ? 'bg-slate-800/60 border border-amber-500/30' : 'bg-white border border-burnt-400/20'
            }`}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-burnt-400/10 text-burnt-500'
                  }`}>
                    Featured: Neurodivergent Engineering
                  </span>
                  <h3 className={`font-serif text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                    Claude as My External Brain
                  </h3>
                  <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                    How I use Claude as external executive function&mdash;autistic, ADHD, and finally supported. Biometric-aware planning, voice-to-structure workflows, and agent orchestration from mountain trails.
                  </p>
                  <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                    <strong className={isDark ? 'text-white' : 'text-charcoal-50'}>The insight:</strong> LLMs mirror how neurodivergent minds process&mdash;dependency graphs, verbal buffers, pattern matching. Building with this alignment unlocks sustainable productivity.
                  </p>
                  <Link
                    href="/blog/claude-external-brain-adhd-autistic"
                    className={`inline-flex items-center gap-2 font-semibold ${
                      isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                    }`}
                  >
                    Read the full guide
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
                <div className="flex-shrink-0 w-full md:w-56 h-56 rounded-xl overflow-hidden relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/claude.webp"
                    alt="Claude AI as external brain"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Research Areas Grid - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Training Claude for Neurological Patterns */}
              <Link
                href="/blog/training-claude-neurological-patterns"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/claude-support.webp"
                    alt="Training Claude for neurological patterns"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  Training Claude for My Brain
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  Systematically teaching AI to compensate for ADHD/autism patterns. Collaborative intelligence.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Read the research
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Handwave - Talk to Claude Code from Apple Watch */}
              <Link
                href="/blog/handwave"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/handwave-blog-hero.webp"
                    alt="Handwave - Talk to Claude Code from your Apple Watch"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  Handwave: Watch + Claude Code
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  Voice control Claude Code sessions from your wrist. When you can&apos;t sit still, bring your AI with you.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  See the project
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Claude Skills as Runbooks */}
              <Link
                href="/blog/claude-skills-internal-training"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/claude-skills.webp"
                    alt="Claude Skills as self-documenting runbooks"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  Skills as Living Runbooks
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  Self-documenting processes you share with your team. Maybe bigger than MCP.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Explore the pattern
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Research Areas Grid - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* WisprFlow Review */}
              <Link
                href="/blog/wisprflow-review"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/wisprflow.webp"
                    alt="WisprFlow voice-to-text review"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  WisprFlow: 179 WPM Dev
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  The voice-to-text tool that unlocked untethered development. Full hands-on review.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Read the review
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Oura Ring MCP */}
              <Link
                href="/blog/connect-oura-ring-to-claude-desktop-with-mcp"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/oura-and-claude.webp"
                    alt="Oura Ring and Claude integration"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  Biometric + AI Loop
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  Oura Ring data feeds Claude to prevent burnout. External signals for internal blind spots.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Learn more
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* In the LLM I Saw Myself */}
              <Link
                href="/blog/in-the-llm-i-saw-myself"
                className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50' : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                }`}
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src="https://zackproser.b-cdn.net/images/llm-mirror.webp"
                    alt="In the LLM I saw myself"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  In the LLM, I Saw Myself
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  How LLMs mirror neurodivergent cognition. Diagnosis, patterns, and building with alignment.
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Learn more
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pioneer Voice-Driven Development Section */}
      <section className={`py-16 md:py-20 transition-colors duration-500 ${
        isDark
          ? 'bg-slate-900'
          : 'bg-parchment-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
                isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
              }`}>
                DevSecCon 2025 Keynote &bull; 32 Minutes
              </span>
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                Ship Production Code from Mountain Trails
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                I traded the desk for the trail and kept shipping. Voice at 179 WPM, background AI agents, and hardened CI/CD that makes speed safe. Watch the full workflow in action.
              </p>
            </div>

            {/* YouTube Video Embed */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className={`rounded-xl overflow-hidden shadow-2xl ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-parchment-300'
              }`}>
                <YoutubeEmbed
                  urls="https://www.youtube.com/watch?v=kwIzRkzO_Z4"
                  title="Untethered Software Development - DevSecCon 2025 Keynote"
                />
              </div>
            </div>

            {/* Key Points */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-100 border border-parchment-300'
              }`}>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>
                  Voice-Native Workflows
                </h3>
                <p className="text-sm">
                  Ship production code at 179 WPM while hiking mountain trails. Voice-first development with AI transcription.
                </p>
              </div>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-100 border border-parchment-300'
              }`}>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>
                  Agent-Driven CI/CD
                </h3>
                <p className="text-sm">
                  Orchestrate background AI agents with hardened pipelines. Speed requires safety.
                </p>
              </div>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-100 border border-parchment-300'
              }`}>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`}>
                  Untethered Development
                </h3>
                <p className="text-sm">
                  Think where you think best. Orchestrate, don&apos;t micromanage. Ship from anywhere.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 pt-8 border-t ${
              isDark ? 'border-slate-700' : 'border-parchment-300'
            }`}>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  4,000+
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Newsletter subscribers
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  14 Years
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Shipping production systems
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-amber-400' : 'text-burnt-400'
                }`}>
                  Staff
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  DevRel at Pinecone
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neural Network Visualization Section */}
      <section className={`py-16 md:py-20 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950'
          : 'bg-parchment-100'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Neural Network Animation */}
            <div className="flex-1 flex justify-center">
              <Suspense fallback={
                <div className="w-[400px] h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-slate-400">Loading visualization...</div>
                </div>
              }>
                <div className="scale-[0.8] origin-center">
                  <NeuralNetworkPulse />
                </div>
              </Suspense>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-lg">
              <h3 className={`font-serif text-2xl md:text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                Hands-On Demos & Production Code
              </h3>
              <p className={`text-lg leading-relaxed mb-6 ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Don&apos;t just read about AI&mdash;interact with it. My live RAG demos, open-source projects, and battle-tested tutorials show you what actually works in production. From embeddings to fine-tuning, see the code that ships.
              </p>
              <Link
                href="/demos"
                className={`inline-flex items-center font-semibold ${
                  isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                }`}
              >
                Try Interactive AI Demos
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Writing Section */}
      <section className={`py-16 md:py-20 transition-colors duration-500 ${
        isDark
          ? 'bg-slate-900'
          : 'bg-parchment-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                134+ Articles & Growing
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Deep dives on AI tools, voice workflows, infrastructure, and developer productivity. Real experiences from building production systems.
              </p>
            </div>

            {/* Writing Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'AI & ML', count: '40+', href: '/collections/ai' as Route },
                { label: 'DevTools', count: '25+', href: '/devtools' as Route },
                { label: 'Infrastructure', count: '20+', href: '/blog' as Route },
                { label: 'Projects', count: '25+', href: '/projects' as Route },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`p-4 rounded-xl text-center transition-all hover:-translate-y-1 ${
                    isDark
                      ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-parchment-100 border border-parchment-300 hover:border-burnt-400/50'
                  }`}
                >
                  <span className={`block text-2xl font-bold font-mono ${
                    isDark ? 'text-amber-400' : 'text-burnt-400'
                  }`}>
                    {cat.count}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-600'}`}>
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA to Blog */}
            <div className="text-center">
              <Link
                href="/blog"
                onClick={() => track('featured_writing_cta')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-amber-500 hover:bg-amber-400 text-white'
                    : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                }`}
              >
                Browse All Articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-16 md:py-20 transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950'
          : 'bg-parchment-100'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? '!text-amber-400' : '!text-burnt-400'
            }`}>
              Let&apos;s Work Together
            </h2>
            <p className={`text-lg mb-8 max-w-xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              Have a project in mind? I&apos;d love to hear about it. Reach out and let&apos;s discuss how I can help.
            </p>
            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                isDark
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-burnt-400 hover:bg-burnt-500 text-white'
              }`}
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <ConsultationForm
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  )
}
