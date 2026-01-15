'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/button'
import ConsultationForm from '@/components/ConsultationForm'
import { useTheme } from 'next-themes'

// Avatar images from CDN - these show upper torso
const avatarImages = [
  'https://zackproser.b-cdn.net/images/avatars/1.webp',
  'https://zackproser.b-cdn.net/images/avatars/2.webp',
  'https://zackproser.b-cdn.net/images/avatars/3.webp',
  'https://zackproser.b-cdn.net/images/avatars/4.webp',
  'https://zackproser.b-cdn.net/images/avatars/5.webp',
  'https://zackproser.b-cdn.net/images/avatars/6.webp',
]

// Company logos from CDN
const logoCloudflare = 'https://zackproser.b-cdn.net/images/logos/cloudflare.svg'
const logoGruntwork = 'https://zackproser.b-cdn.net/images/logos/terragrunt.svg'
const logoPinecone = 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.webp'
const logoWorkOS = 'https://zackproser.b-cdn.net/images/logos/workos.svg'

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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-charcoal-50 dark:bg-parchment-100 text-parchment-100 dark:text-charcoal-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-burnt-400 dark:border-amber-400"
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

  useEffect(() => {
    setMounted(true)
    // Pick a random avatar on mount
    const randomIndex = Math.floor(Math.random() * avatarImages.length)
    setCurrentImage(avatarImages[randomIndex])
  }, [])

  const cycleImage = () => {
    track('hero_portrait_click')
    const currentIndex = avatarImages.indexOf(currentImage)
    const nextIndex = (currentIndex + 1) % avatarImages.length
    setCurrentImage(avatarImages[nextIndex])
  }

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <>
      {/* Hero Section */}
      <section className={`relative min-h-[85vh] flex items-center overflow-hidden transition-all duration-500 ${
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

            {/* Left Column: Value Proposition */}
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
              <p className={`text-lg md:text-xl leading-relaxed mb-8 max-w-xl ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Developer Experience Engineer on the Applied AI team at WorkOS. I help investors vet AI tools ($500-650/hr due diligence) and teams ship production AI systems.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
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
                  <span className="block text-sm font-normal opacity-90 mt-0.5">
                    $500-650/hr &bull; Investor Due Diligence
                  </span>
                </Button>

                <Link
                  href="/blog"
                  onClick={() => track('authority_hero_cta', { action: 'read_analysis' })}
                  className={`group inline-flex flex-col items-center justify-center px-8 py-4 rounded-lg border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-indigo-400 text-indigo-400 hover:bg-indigo-400/10'
                      : 'border-burnt-400 text-burnt-400 hover:bg-burnt-400/10'
                  }`}
                >
                  <span className="flex items-center text-lg font-semibold">
                    <span className="mr-2">&#128196;</span>
                    Read My Analysis
                  </span>
                  <span className="text-sm font-normal opacity-80 mt-0.5">
                    Latest tools & implementation guides
                  </span>
                </Link>
              </div>

              {/* Company Logos */}
              <div className="w-full">
                <p className={`text-sm uppercase tracking-wider font-medium mb-4 ${
                  isDark ? 'text-slate-400' : 'text-parchment-500'
                }`}>
                  Experience at
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {['Pinecone', 'Cloudflare', 'WorkOS', 'Gruntwork'].map((name) => (
                    <div
                      key={name}
                      className={`px-3 py-2 rounded-full text-sm font-mono ${
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
            </div>

            {/* Right Column: Portrait */}
            <div className="flex flex-col items-center lg:items-end order-1 lg:order-2">
              {/* SVG filter for pencil sketch effect */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <filter id="pencil-sketch" colorInterpolationFilters="sRGB">
                    {/* Desaturate */}
                    <feColorMatrix type="saturate" values="0.1" result="desat" />
                    {/* Increase contrast */}
                    <feComponentTransfer in="desat" result="contrast">
                      <feFuncR type="linear" slope="1.5" intercept="-0.15" />
                      <feFuncG type="linear" slope="1.5" intercept="-0.15" />
                      <feFuncB type="linear" slope="1.5" intercept="-0.15" />
                    </feComponentTransfer>
                    {/* Add slight warmth */}
                    <feColorMatrix
                      type="matrix"
                      values="1.1 0 0 0 0.05
                              0 1.05 0 0 0.02
                              0 0 0.95 0 0
                              0 0 0 1 0"
                      result="warm"
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
                {/* Decorative frame - paper edge effect for light mode */}
                <div className={`absolute -inset-4 rounded-lg ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl'
                    : 'bg-parchment-200 shadow-inner'
                }`} />

                {/* Sketchy border for light mode */}
                {!isDark && (
                  <div className="absolute -inset-2 border-2 border-parchment-400/60 rounded-lg" style={{
                    borderStyle: 'solid',
                    borderImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Crect width=\'4\' height=\'4\' fill=\'%23d1c7b7\'/%3E%3C/svg%3E") 1',
                  }} />
                )}

                {/* Portrait container */}
                <div className={`relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] ${
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
                      filter: isDark
                        ? 'none'
                        : 'url(#pencil-sketch)',
                    }}
                    priority
                  />
                  {/* Paper texture overlay for light mode */}
                  {!isDark && (
                    <>
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-parchment-100/30 to-parchment-300/40 pointer-events-none" />
                    </>
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
                {['Staff Engineer', '14 Years', 'Investor Advisor'].map((tag) => (
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
            isDark ? 'border-slate-600' : 'border-parchment-400'
          }`}>
            <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
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
              14 Years Building What Matters
            </h2>

            <div className={`space-y-6 text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>I build production AI systems daily.</strong> As a Developer Experience Engineer on WorkOS&apos;s Applied AI team, I ship real AI features, open-source my work, and help developers integrate AI into their apps. Previously built developer tools at Cloudflare and vector search infrastructure at Pinecone.
              </p>

              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>Investors trust me to cut through the hype.</strong> I do technical due diligence on AI startups and tools, helping funds make informed decisions based on hands-on engineering experience&mdash;not marketing slides.
              </p>

              <p>
                <strong className={isDark ? 'text-indigo-400' : 'text-burnt-400'}>I teach and mentor engineers.</strong> Through my writing, YouTube videos, and open-source projects, I help developers understand modern AI patterns&mdash;RAG systems, embeddings, vector databases, and agentic workflows.
              </p>
            </div>

            {/* Social proof stats */}
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
                  YouTube views on tool reviews
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
                }`}>
                  $120+
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Monthly affiliate earnings
                </span>
              </div>
              <div className="text-center">
                <span className={`block text-3xl md:text-4xl font-bold font-mono ${
                  isDark ? 'text-indigo-400' : 'text-burnt-400'
                }`}>
                  Growing
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                  Newsletter of business owners
                </span>
              </div>
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
