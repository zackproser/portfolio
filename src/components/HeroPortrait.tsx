'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

// The specific cubist portrait for the hero section
// Change this number to use a different avatar (1-16 available)
const HERO_PORTRAIT_URL = 'https://zackproser.b-cdn.net/images/avatars/5.webp'

export default function HeroPortrait() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className="flex flex-col items-center lg:items-end">
      {/* Portrait container - larger size */}
      <div className="relative">
        {/* Decorative frame / glow */}
        <div className={`absolute -inset-6 rounded-2xl ${
          isDark
            ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-2xl'
            : 'bg-parchment-300/50 shadow-inner blur-sm'
        }`} />

        {/* Main portrait */}
        <div className={`relative w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] overflow-hidden shadow-2xl ${
          isDark
            ? 'rounded-2xl ring-2 ring-indigo-500/50'
            : 'rounded-xl ring-1 ring-parchment-400'
        }`}>
          <Image
            src={HERO_PORTRAIT_URL}
            alt="Zack Proser - AI Engineering Consultant"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Subtle overlay for dark mode */}
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Credential tags below portrait */}
      <div className="flex flex-wrap justify-center lg:justify-end gap-2 mt-8">
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
  )
}
