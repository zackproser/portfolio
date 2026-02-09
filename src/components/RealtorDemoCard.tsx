'use client'

import Link from 'next/link'
import { Home, Mic, Phone, Play, Sparkles } from 'lucide-react'
import { track } from '@vercel/analytics'

interface RealtorDemoCardProps {
  className?: string
  campaign?: string
}

export default function RealtorDemoCard({ className = '', campaign = 'unknown' }: RealtorDemoCardProps) {
  const handleClick = () => {
    track('realtor_demo_card_click', { source: 'blog', campaign })
  }

  return (
    <div className={`my-8 ${className}`}>
      <Link href="/demos/voice-ai-realtors" className="block group" onClick={handleClick}>
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-zinc-800/80 dark:to-zinc-900 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4 md:gap-6">
              {/* Icon */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                  <Home className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    <Sparkles className="w-3 h-3" />
                    Interactive Demo
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                    Real Estate
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Voice AI for Real Estate Agents
                </h3>

                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  See how top-producing agents dictate MLS listings, capture buyer consultations,
                  and save 11+ hours per week. Interactive demo with real scenarios.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-200">
                  <Play className="w-4 h-4" fill="currentColor" />
                  Try the Demo
                  <span className="ml-1 opacity-70">&rarr;</span>
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-amber-200/80 dark:border-zinc-700/50">
              {[
                { icon: Mic, label: 'MLS Dictation' },
                { icon: Phone, label: 'Client Call Capture' },
                { icon: Home, label: 'Showing Notes' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
