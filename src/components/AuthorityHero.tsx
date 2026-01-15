'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConsultationForm from '@/components/ConsultationForm'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { sendGTMEvent } from '@next/third-parties/google'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import HeroPortrait from '@/components/HeroPortrait'

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

// Company logos from CDN - with display names
const companyLogos = [
  { name: 'WorkOS', logo: 'https://zackproser.b-cdn.net/images/logos/workos.svg' },
  { name: 'Pinecone', logo: 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.png' },
  { name: 'Cloudflare', logo: 'https://zackproser.b-cdn.net/images/logos/cloudflare.svg' },
  { name: 'Gruntwork', logo: 'https://zackproser.b-cdn.net/images/logos/grunty.png' },
]

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-charcoal-50 dark:bg-parchment-100 text-parchment-100 dark:text-charcoal-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-burnt-400 dark:border-indigo-400"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      )}
    </button>
  )
}

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
      <section className={`relative min-h-[90vh] flex items-center overflow-hidden transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950'
          : 'bg-parchment-100'
      }`}>
        {/* Light mode: Parchment texture */}
        {!isDark && (
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
        )}

        {/* Dark mode: Subtle grid pattern */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )}

        {/* Container */}
        <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column: Value Proposition + Newsletter */}
            <div className="flex flex-col order-2 lg:order-1">
              {/* Headline */}
              <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                <span className="block">AI Engineering Authority</span>
                <span className={`block ${isDark ? 'text-indigo-400' : 'text-burnt-400'}`}>
                  for Investors & Builders
                </span>
              </h1>

              {/* Subheadline */}
              <p className={`text-lg md:text-xl leading-relaxed mb-6 max-w-xl ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Developer Experience Engineer at WorkOS on the Applied AI team.
                Previously Staff DevRel at Pinecone building production AI systems.
                Former Sr. Engineer at Cloudflare (one of ~100 engineers).
              </p>

              {/* Newsletter Signup */}
              <div className={`mb-8 p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-200/80 border border-parchment-300'
              }`}>
                <p className={`font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-burnt-400'}`}>
                  Join 4,000+ engineers, investors & founders
                </p>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Weekly insights on AI systems, voice-driven workflows, and what actually works in production.
                </p>
                {formSuccess ? (
                  <p className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Welcome aboard! Check your inbox.
                  </p>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`flex-grow ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                          : 'bg-white border-parchment-300 text-charcoal-50 placeholder:text-parchment-400'
                      }`}
                      required
                    />
                    <Button
                      type="submit"
                      className={`font-semibold ${
                        isDark
                          ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                          : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                      }`}
                    >
                      Subscribe
                    </Button>
                  </form>
                )}
              </div>

              {/* CTA Button */}
              <div className="mb-8">
                <Button
                  onClick={() => {
                    track('authority_hero_cta', { action: 'book_consultation' })
                    setIsConsultationOpen(true)
                  }}
                  className={`group font-semibold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                  }`}
                >
                  <span className="mr-2">&#9889;</span>
                  Book a Consultation
                  <span className="block text-sm font-normal opacity-90">
                    $500-650/hr &bull; Due Diligence & Technical Consulting
                  </span>
                </Button>
              </div>

              {/* Company Logos - Larger with names */}
              <div className="mt-2">
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Built production systems at:
                </p>
                <div className="flex flex-wrap items-start gap-6">
                  {companyLogos.map((company) => (
                    <div
                      key={company.name}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`flex items-center justify-center h-12 w-24 px-3 py-2 rounded-lg ${
                        isDark
                          ? 'bg-slate-800/70 border border-slate-700'
                          : 'bg-white shadow-sm border border-parchment-300'
                      }`}>
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={96}
                          height={40}
                          className="h-8 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        isDark ? 'text-slate-400' : 'text-parchment-600'
                      }`}>
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Portrait */}
            <div className="order-1 lg:order-2">
              <HeroPortrait />
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
                DevSecCon 2025 Keynote
              </span>
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                Pioneer Voice-Driven Development
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Watch my DevSecCon 2025 keynote on orchestrating AI agents, voice-native workflows, and hardened CI/CD pipelines to ship secure production code from anywhere.
              </p>
            </div>

            {/* YouTube Video Embed */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className={`rounded-xl overflow-hidden shadow-2xl ${
                isDark ? 'ring-2 ring-indigo-500/30' : 'ring-1 ring-parchment-300'
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
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-indigo-400' : 'text-burnt-400'}`}>
                  Voice-Native Workflows
                </h3>
                <p className="text-sm">
                  Ship production code at 179 WPM while hiking mountain trails. Voice-first development with AI transcription.
                </p>
              </div>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-100 border border-parchment-300'
              }`}>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-indigo-400' : 'text-burnt-400'}`}>
                  Agent-Driven CI/CD
                </h3>
                <p className="text-sm">
                  Orchestrate background AI agents with hardened pipelines. Speed requires safety.
                </p>
              </div>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-parchment-100 border border-parchment-300'
              }`}>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-indigo-400' : 'text-burnt-400'}`}>
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
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
                }`}>
                  4,000+
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Newsletter subscribers
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
                }`}>
                  14 Years
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Shipping production systems
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
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
          ? 'bg-gradient-to-b from-slate-900 to-indigo-950'
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
                Deep AI Knowledge, Practical Delivery
              </h3>
              <p className={`text-lg leading-relaxed mb-6 ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                From embeddings and vector search to RAG pipelines and fine-tuning&mdash;I don&apos;t just understand AI, I build and ship it. My tutorials, talks, and open-source projects help thousands of developers implement AI that actually works.
              </p>
              <Link
                href="/demos"
                className={`inline-flex items-center font-semibold ${
                  isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-burnt-400 hover:text-burnt-500'
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

      {/* Prominent Theme Toggle */}
      <ThemeToggle />

      <ConsultationForm
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  )
}
