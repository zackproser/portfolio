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

// Avatar images from CDN
const avatarImages = [
  'https://zackproser.b-cdn.net/images/avatars/1.webp',
  'https://zackproser.b-cdn.net/images/avatars/2.webp',
  'https://zackproser.b-cdn.net/images/avatars/3.webp',
  'https://zackproser.b-cdn.net/images/avatars/4.webp',
  'https://zackproser.b-cdn.net/images/avatars/5.webp',
  'https://zackproser.b-cdn.net/images/avatars/6.webp',
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
  const [currentImage, setCurrentImage] = useState(avatarImages[0])
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    const randomIndex = Math.floor(Math.random() * avatarImages.length)
    setCurrentImage(avatarImages[randomIndex])
  }, [])

  const cycleImage = () => {
    track('hero_portrait_click')
    const currentIndex = avatarImages.indexOf(currentImage)
    const nextIndex = (currentIndex + 1) % avatarImages.length
    setCurrentImage(avatarImages[nextIndex])
  }

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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={() => {
                    track('authority_hero_cta', { action: 'book_consultation' })
                    setIsConsultationOpen(true)
                  }}
                  className={`group font-semibold text-lg px-6 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                  }`}
                >
                  <span className="mr-2">&#9889;</span>
                  Book a Consultation
                  <span className="block text-sm font-normal opacity-90">
                    $500-650/hr &bull; Due Diligence
                  </span>
                </Button>

                <Link
                  href="/blog"
                  onClick={() => track('authority_hero_cta', { action: 'read_analysis' })}
                  className={`group inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-indigo-400 text-indigo-400 hover:bg-indigo-400/10'
                      : 'border-burnt-400 text-burnt-400 hover:bg-burnt-400/10'
                  }`}
                >
                  <span className="flex items-center text-lg font-semibold">
                    Read My Analysis
                  </span>
                  <span className="text-sm font-normal opacity-80">
                    Tools & implementation guides
                  </span>
                </Link>
              </div>

              {/* Company Logos */}
              <div className="flex flex-wrap items-center gap-3">
                {['WorkOS', 'Pinecone', 'Cloudflare', 'Gruntwork'].map((name) => (
                  <div
                    key={name}
                    className={`px-3 py-1.5 rounded-full text-sm font-mono ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-slate-300'
                        : 'bg-parchment-200 border border-parchment-300 text-charcoal-50'
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Portrait */}
            <div className="flex flex-col items-center lg:items-end order-1 lg:order-2">
              {/* SVG filter for pencil sketch effect */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <filter id="pencil-sketch" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0.15" result="desat" />
                    <feComponentTransfer in="desat" result="contrast">
                      <feFuncR type="linear" slope="1.4" intercept="-0.1" />
                      <feFuncG type="linear" slope="1.4" intercept="-0.1" />
                      <feFuncB type="linear" slope="1.4" intercept="-0.1" />
                    </feComponentTransfer>
                    <feColorMatrix
                      type="matrix"
                      values="1.1 0 0 0 0.05
                              0 1.05 0 0 0.02
                              0 0 0.95 0 0
                              0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>

              {/* Portrait with pencil-drawn effect */}
              <div
                className="relative cursor-pointer group"
                onClick={cycleImage}
                title="Click to see another portrait"
              >
                {/* Decorative frame */}
                <div className={`absolute -inset-4 rounded-lg ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl'
                    : 'bg-parchment-200 shadow-inner'
                }`} />

                {/* Portrait container */}
                <div className={`relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] ${
                  isDark
                    ? 'rounded-2xl ring-2 ring-indigo-500/50'
                    : 'rounded-lg ring-1 ring-parchment-400'
                }`}>
                  <Image
                    src={currentImage}
                    alt="Zachary Proser - AI Engineering Consultant"
                    fill
                    className="object-cover transition-all duration-500"
                    style={{
                      filter: isDark ? 'none' : 'url(#pencil-sketch)',
                    }}
                    priority
                  />
                  {/* Paper texture overlay for light mode */}
                  {!isDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-parchment-100/30 to-parchment-300/40 pointer-events-none" />
                  )}
                  {/* Cool overlay for dark mode */}
                  {isDark && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Click hint */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-parchment-200 text-parchment-600'
                }`}>
                  Click for another
                </div>
              </div>

              {/* Credential tags below portrait */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-2 mt-6">
                {['Staff Engineer', '14 Years', 'Voice Workflows Expert'].map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      isDark
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-burnt-400/10 text-burnt-500 border border-burnt-400/20'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className={`py-16 md:py-20 transition-colors duration-500 ${
        isDark
          ? 'bg-slate-900'
          : 'bg-parchment-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-8 text-center ${
              isDark ? 'text-white' : 'text-charcoal-50'
            }`}>
              14 Years Shipping Production Systems
            </h2>

            <div className={`space-y-6 text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>I build AI systems at the frontier.</strong> As a Developer Experience Engineer at WorkOS on the Applied AI team, I ship production AI features and help developers integrate AI into their apps. Previously, I was Staff DevRel at Pinecone where I built real RAG systems, open-sourced my work, and explained vector search to thousands through talks and videos.
              </p>

              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>I&apos;ve scaled with the best.</strong> At Cloudflare, I was one of ~100 engineers building developer tools for millions of users. At Gruntwork, I led teams shipping infrastructure-as-code to Fortune 500s. I&apos;ve seen what works and what breaks at scale.
              </p>

              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>I pioneer voice-driven development.</strong> My DevSecCon keynote on &quot;Untethered Software Development&quot; shows how I orchestrate voice, AI agents, and hardened CI/CD to ship production code from anywhere. Investors and teams trust me to cut through the AI hype with hands-on expertise.
              </p>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 mt-12 pt-8 border-t ${
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
                  Staff
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  DevRel at Pinecone
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
                }`}>
                  ~100
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Engineer at early Cloudflare
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
