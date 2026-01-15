'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConsultationForm from '@/components/ConsultationForm'
import portraitImage from '@/images/portrait.webp'

// Company logos from CDN
const logoCloudflare = 'https://zackproser.b-cdn.net/images/logos/cloudflare.svg'
const logoGruntwork = 'https://zackproser.b-cdn.net/images/logos/terragrunt.svg'
const logoPinecone = 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.webp'
const logoWorkOS = 'https://zackproser.b-cdn.net/images/logos/workos.svg'

interface AuthorityHeroProps {
  onNewsletterSubmit?: (email: string) => Promise<void>
}

export default function AuthorityHero({ onNewsletterSubmit }: AuthorityHeroProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onNewsletterSubmit) {
      await onNewsletterSubmit(email)
    }
    setFormSuccess(true)
    setEmail('')
  }

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-parchment-100 dark:bg-charcoal-400 transition-colors duration-500">
        {/* Subtle parchment texture overlay */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Container */}
        <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column: Portrait & Credentials */}
            <div className="flex flex-col items-center lg:items-start order-2 lg:order-1">
              {/* Portrait with pencil-drawn effect */}
              <div className="relative mb-8">
                {/* Decorative frame corners */}
                <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-parchment-400 dark:border-charcoal-50/30" />
                <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-parchment-400 dark:border-charcoal-50/30" />

                {/* Portrait image with pencil effect */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={portraitImage}
                    alt="Zachary Proser - AI Engineering Consultant"
                    fill
                    className="object-cover object-top
                      filter sepia-[0.15] contrast-[0.95] brightness-[1.05]
                      dark:sepia-0 dark:contrast-[1.1] dark:brightness-[1.1]
                      transition-all duration-500"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
                    }}
                    priority
                  />
                  {/* Parchment overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-parchment-100/10 to-parchment-300/20 dark:from-transparent dark:to-charcoal-400/30 pointer-events-none" />
                </div>
              </div>

              {/* Company Logos */}
              <div className="w-full max-w-md">
                <p className="text-sm text-parchment-500 dark:text-charcoal-50/60 uppercase tracking-wider font-medium mb-4 text-center lg:text-left">
                  Experience at
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                  {[
                    { src: logoPinecone, alt: 'Pinecone', name: 'Pinecone' },
                    { src: logoCloudflare, alt: 'Cloudflare', name: 'Cloudflare' },
                    { src: logoWorkOS, alt: 'WorkOS', name: 'WorkOS' },
                    { src: logoGruntwork, alt: 'Gruntwork', name: 'Gruntwork' },
                  ].map((logo) => (
                    <div
                      key={logo.name}
                      className="px-3 py-2 bg-parchment-200 dark:bg-charcoal-300 rounded-full border border-parchment-300 dark:border-charcoal-100/20 text-sm text-charcoal-50 dark:text-parchment-100 font-mono"
                    >
                      {logo.name}
                    </div>
                  ))}
                </div>

                {/* Credential tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                  <span className="px-3 py-1.5 bg-burnt-400/10 dark:bg-amber-400/10 text-burnt-500 dark:text-amber-400 rounded-full text-sm font-medium border border-burnt-400/20 dark:border-amber-400/20">
                    Staff Engineer
                  </span>
                  <span className="px-3 py-1.5 bg-burnt-400/10 dark:bg-amber-400/10 text-burnt-500 dark:text-amber-400 rounded-full text-sm font-medium border border-burnt-400/20 dark:border-amber-400/20">
                    14 Years Experience
                  </span>
                  <span className="px-3 py-1.5 bg-burnt-400/10 dark:bg-amber-400/10 text-burnt-500 dark:text-amber-400 rounded-full text-sm font-medium border border-burnt-400/20 dark:border-amber-400/20">
                    Investor Consultant
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Value Proposition */}
            <div className="flex flex-col order-1 lg:order-2">
              {/* Headline */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-50 dark:text-parchment-100 leading-tight mb-6">
                <span className="block">AI Engineering Authority</span>
                <span className="block text-burnt-400 dark:text-amber-400">for Investors & Builders</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-parchment-600 dark:text-parchment-400 leading-relaxed mb-8 max-w-xl">
                I help investors vet AI tools and startups ($500-650/hr due diligence),
                and teams ship production AI systems. Currently Staff AI Engineer
                at a high-growth startup.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  onClick={() => {
                    track('authority_hero_cta', { action: 'book_consultation' })
                    setIsConsultationOpen(true)
                  }}
                  className="group bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-charcoal-500 font-semibold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
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
                  className="group inline-flex flex-col items-center justify-center px-8 py-4 rounded-lg border-2 border-burnt-400 dark:border-amber-400 text-burnt-400 dark:text-amber-400 hover:bg-burnt-400/10 dark:hover:bg-amber-400/10 transition-all duration-300 hover:-translate-y-0.5"
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

              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-parchment-300 dark:border-charcoal-100/20">
                <div className="text-center sm:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-burnt-400 dark:text-amber-400 font-mono">
                    4,000+
                  </span>
                  <span className="text-sm text-parchment-500 dark:text-parchment-400">
                    YouTube views on Wispr Flow review
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-burnt-400 dark:text-amber-400 font-mono">
                    $120+
                  </span>
                  <span className="text-sm text-parchment-500 dark:text-parchment-400">
                    Last month from affiliate articles
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-burnt-400 dark:text-amber-400 font-mono">
                    Growing
                  </span>
                  <span className="text-sm text-parchment-500 dark:text-parchment-400">
                    Newsletter with business owners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="w-10 h-10 rounded-full border-2 border-parchment-400 dark:border-charcoal-50/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-parchment-500 dark:text-parchment-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
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
