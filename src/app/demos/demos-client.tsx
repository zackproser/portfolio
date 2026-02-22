'use client'

import { useState, useEffect, Suspense } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'
import { Content } from '@/types'
import { ArrowRight, Mic, Play, Sparkles } from 'lucide-react'

// Dynamically import the NeuralNetworkPulse with no SSR
const NeuralNetworkPulse = dynamic(
  () => import('@/components/NeuralNetworkPulse').then(mod => mod.NeuralNetworkPulse),
  {
    ssr: false,
    loading: () => (
      <div className="w-[300px] h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading visualization...</div>
      </div>
    )
  }
)

interface DemosClientProps {
  demos: Content[]
  featuredVoiceDemo?: Content
  verticalVoiceDemos?: Content[]
  otherDemos?: Content[]
}

export default function DemosClient({ demos, featuredVoiceDemo, verticalVoiceDemos, otherDemos }: DemosClientProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      {/* Hero Section with Neural Network */}
      <section className={`relative overflow-hidden ${
        isDark ? '' : ''
      }`}>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className={`font-serif text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? '!text-amber-400' : '!text-burnt-400'
              }`}>
                Interactive AI & ML Demos
              </h1>
              <p className={`text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-6 ${
                isDark ? 'text-slate-300' : 'text-parchment-600'
              }`}>
                Learn cutting-edge AI techniques through hands-on interactive experiences.
                See embeddings, tokenization, RAG, and more in action.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="#demos"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? 'bg-amber-500 hover:bg-amber-400 text-white'
                      : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                  }`}
                >
                  <Play size={18} />
                  Explore Demos
                </Link>
                <Link
                  href="/learn"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 border-2 ${
                    isDark
                      ? 'border-slate-600 text-slate-300 hover:border-amber-500/50'
                      : 'border-parchment-300 text-parchment-600 hover:border-burnt-400/50'
                  }`}
                >
                  View Courses
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right: Neural Network Animation */}
            <div className="flex-shrink-0">
              <Suspense fallback={
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-slate-400">Loading visualization...</div>
                </div>
              }>
                <div className="scale-[0.75] origin-center">
                  <NeuralNetworkPulse />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Quick Start */}
      <section className={`py-6 ${
        isDark ? 'bg-amber-900/20 border-y border-amber-700/30' : 'bg-amber-50 border-y border-amber-200'
      }`}>
        <div className="container mx-auto px-4">
          <Link href="/best-ai-tools" className="block group">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-amber-500/30' : 'bg-amber-500/20'
              }`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <div>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                  Want to skip the theory?
                </span>
                <span className={`ml-2 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  See the 4 AI tools I recommend for getting real work done →
                </span>
              </div>
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Voice AI Demo */}
      <div id="demos" />
      {featuredVoiceDemo && (
        <section className={`py-12 ${
          isDark ? 'bg-slate-900/50' : 'bg-parchment-100'
        }`}>
          <div className="container mx-auto px-4">
            <Link
              href={featuredVoiceDemo.slug as Route}
              className="group block mb-8"
            >
              <div className={`rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                  : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
              }`}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
                    {featuredVoiceDemo.image && (
                      <Image
                        src={typeof featuredVoiceDemo.image === 'string' ? featuredVoiceDemo.image : featuredVoiceDemo.image.src}
                        alt={featuredVoiceDemo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'bg-slate-900/60' : 'bg-parchment-900/40'
                    }`}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-amber-500' : 'bg-burnt-400'
                      }`}>
                        <Play size={36} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark ? 'bg-amber-500/90 text-white' : 'bg-burnt-400/90 text-white'
                    }`}>
                      Featured Demo
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className={`font-serif text-2xl md:text-3xl font-bold mb-3 transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-amber-400'
                        : 'text-charcoal-50 group-hover:text-burnt-400'
                    }`}>
                      {featuredVoiceDemo.title}
                    </h3>
                    <p className={`text-base mb-4 ${
                      isDark ? 'text-slate-300' : 'text-parchment-600'
                    }`}>
                      {featuredVoiceDemo.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 text-base font-medium ${
                      isDark ? 'text-amber-400' : 'text-burnt-400'
                    }`}>
                      Try it now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Voice AI for Professionals */}
      {verticalVoiceDemos && verticalVoiceDemos.length > 0 && (
        <section className={`py-12 ${
          isDark ? 'bg-slate-800/30' : 'bg-parchment-50'
        }`}>
          <div className="container mx-auto px-4">
            <h2 className={`font-serif text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-charcoal-50'
            }`}>
              <Mic className={`w-7 h-7 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
              Voice AI for Professionals
            </h2>
            <p className={`text-base mb-8 max-w-2xl ${
              isDark ? 'text-slate-400' : 'text-parchment-500'
            }`}>
              See how voice AI transforms workflows across industries — from legal briefs to real estate listings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {verticalVoiceDemos.map((demo) => (
                <Link
                  key={demo.slug}
                  href={demo.slug as Route}
                  className="group"
                >
                  <div className={`rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isDark
                      ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                  }`}>
                    <div className="relative h-48 overflow-hidden">
                      {demo.image && (
                        <Image
                          src={typeof demo.image === 'string' ? demo.image : demo.image.src}
                          alt={demo.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDark ? 'bg-slate-900/60' : 'bg-parchment-900/40'
                      }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-amber-500' : 'bg-burnt-400'
                        }`}>
                          <Play size={28} className="text-white ml-1" />
                        </div>
                      </div>
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark ? 'bg-amber-500/90 text-white' : 'bg-burnt-400/90 text-white'
                      }`}>
                        Industry Demo
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className={`font-serif text-xl font-bold mb-2 transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-amber-400'
                          : 'text-charcoal-50 group-hover:text-burnt-400'
                      }`}>
                        {demo.title}
                      </h3>
                      <p className={`text-sm flex-grow ${
                        isDark ? 'text-slate-300' : 'text-parchment-600'
                      }`}>
                        {demo.description}
                      </p>
                      <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
                        isDark ? 'text-amber-400' : 'text-burnt-400'
                      }`}>
                        Try it now
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Demos */}
      <section className={`py-12 ${
        isDark ? 'bg-slate-900/50' : 'bg-parchment-100'
      }`}>
        <div className="container mx-auto px-4">
          <h2 className={`font-serif text-2xl md:text-3xl font-bold mb-8 ${
            isDark ? 'text-white' : 'text-charcoal-50'
          }`}>
            AI & ML Demos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(otherDemos || demos).map((demo) => (
              <Link
                key={demo.slug}
                href={demo.slug as Route}
                className="group"
              >
                <div className={`rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                    : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                }`}>
                  <div className="relative h-48 overflow-hidden">
                    {demo.image && (
                      <Image
                        src={typeof demo.image === 'string' ? demo.image : demo.image.src}
                        alt={demo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'bg-slate-900/60' : 'bg-parchment-900/40'
                    }`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-amber-500' : 'bg-burnt-400'
                      }`}>
                        <Play size={28} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark ? 'bg-amber-500/90 text-white' : 'bg-burnt-400/90 text-white'
                    }`}>
                      Interactive Demo
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className={`font-serif text-xl font-bold mb-2 transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-amber-400'
                        : 'text-charcoal-50 group-hover:text-burnt-400'
                    }`}>
                      {demo.title}
                    </h3>
                    <p className={`text-sm flex-grow ${
                      isDark ? 'text-slate-300' : 'text-parchment-600'
                    }`}>
                      {demo.description}
                    </p>
                    <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
                      isDark ? 'text-amber-400' : 'text-burnt-400'
                    }`}>
                      Try it now
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`py-16 ${
        isDark ? '' : 'bg-parchment-200'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`font-serif text-2xl md:text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-charcoal-50'
          }`}>
            Want to Learn More?
          </h2>
          <p className={`text-lg mb-6 max-w-xl mx-auto ${
            isDark ? 'text-slate-300' : 'text-parchment-600'
          }`}>
            Explore my courses for in-depth tutorials on building AI-powered applications.
          </p>
          <Link
            href="/learn"
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              isDark
                ? 'bg-amber-500 hover:bg-amber-400 text-white'
                : 'bg-burnt-400 hover:bg-burnt-500 text-white'
            }`}
          >
            Browse Courses
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
