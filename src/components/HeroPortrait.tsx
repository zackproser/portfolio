'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

// The specific cubist portrait for the hero section
const HERO_PORTRAIT_URL = 'https://zackproser.b-cdn.net/images/avatars/5.webp'

export default function HeroPortrait() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className="flex flex-col items-center lg:items-start">
      {/* SVG filter for hardcore pencil sketch effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="pencil-sketch-portrait" colorInterpolationFilters="sRGB">
            {/* Edge detection for line work */}
            <feConvolveMatrix
              order="3"
              kernelMatrix="-1 -1 -1 -1 9 -1 -1 -1 -1"
              result="edges"
            />
            {/* Desaturate to grayscale */}
            <feColorMatrix type="saturate" values="0" in="edges" result="gray" />
            {/* Add pencil-like grain texture */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="gray" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            {/* Increase contrast for sketch look */}
            <feComponentTransfer in="displaced" result="contrast">
              <feFuncR type="linear" slope="1.8" intercept="-0.2" />
              <feFuncG type="linear" slope="1.8" intercept="-0.2" />
              <feFuncB type="linear" slope="1.8" intercept="-0.2" />
            </feComponentTransfer>
            {/* Tint with warm sepia for pencil on paper */}
            <feColorMatrix
              type="matrix"
              in="contrast"
              values="1.2 0.1 0 0 0.08
                      0.05 1.1 0.05 0 0.06
                      0 0.05 0.95 0 0.03
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Portrait container - LARGER size */}
      <div className="relative">
        {/* Decorative frame / glow */}
        <div className={`absolute -inset-8 rounded-2xl ${
          isDark
            ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-2xl'
            : 'bg-parchment-300/60 shadow-inner blur-md'
        }`} />

        {/* Main portrait - large size, positioned higher */}
        <div className={`relative w-96 h-96 md:w-[440px] md:h-[440px] lg:w-[500px] lg:h-[500px] overflow-hidden shadow-2xl ${
          isDark
            ? 'rounded-2xl ring-2 ring-indigo-500/50'
            : 'rounded-xl ring-2 ring-parchment-400/50'
        }`}>
          <Image
            src={HERO_PORTRAIT_URL}
            alt="Zack Proser - AI Engineering Consultant"
            fill
            className="object-cover"
            style={{
              filter: isDark ? 'none' : 'url(#pencil-sketch-portrait)',
            }}
            priority
            unoptimized
          />
          {/* Paper texture overlay for light mode */}
          {!isDark && (
            <div className="absolute inset-0 bg-gradient-to-br from-parchment-100/20 to-parchment-300/30 pointer-events-none" />
          )}
          {/* Subtle overlay for dark mode */}
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Credential tags below portrait */}
      <div className="flex flex-wrap justify-center lg:justify-end gap-2 mt-10">
        {['Staff Engineer', '14 Years', 'Voice Workflows Expert'].map((tag) => (
          <span
            key={tag}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
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
