'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

// Pencil sketch portrait for the hero section (hosted on Bunny CDN)
const HERO_PORTRAIT_URL = 'https://zackproser.b-cdn.net/images/zack-sketch.webp'

export default function HeroPortrait() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="relative">
        {/* Glow effect behind portrait */}
        <div
          className={`absolute -inset-8 rounded-xl blur-2xl transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-indigo-500/15'
              : 'bg-gradient-to-br from-burnt-400/10 to-parchment-400/15'
          }`}
        />

        {/* Main portrait container */}
        <div
          className={`relative w-80 h-[400px] md:w-[420px] md:h-[520px] lg:w-[480px] lg:h-[580px] overflow-hidden transition-all duration-500 ${
            isDark ? 'rounded-lg' : 'rounded-sm'
          }`}
          style={{
            border: isDark
              ? '1px solid rgba(245, 158, 11, 0.4)'
              : '1px solid rgba(160, 140, 120, 0.4)',
            boxShadow: isDark
              ? '0 0 60px rgba(245, 158, 11, 0.15), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 30px rgba(245, 158, 11, 0.05)'
              : '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
            background: isDark
              ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
              : 'linear-gradient(135deg, rgba(252, 250, 245, 1) 0%, rgba(248, 244, 236, 1) 100%)',
          }}
        >
          <Image
            src={HERO_PORTRAIT_URL}
            alt="Zachary Proser - AI Engineer & Cognitive Interface Researcher"
            fill
            className="object-cover object-top transition-all duration-500"
            style={{
              filter: isDark
                ? 'grayscale(100%) contrast(1.1) brightness(0.9)'
                : 'grayscale(100%) contrast(1.4) brightness(1.05)',
              mixBlendMode: isDark ? 'lighten' : 'multiply',
              opacity: isDark ? 0.7 : 1,
            }}
            priority
          />

          {/* Dark mode: Amber/gold tint overlay for warmth */}
          {isDark && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 146, 60, 0.1) 50%, rgba(99, 102, 241, 0.08) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          )}

          {/* Grain texture overlay - subtle in both modes */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              mixBlendMode: 'overlay',
              opacity: isDark ? 0.1 : 0.2,
            }}
          />

          {/* Light mode: Warm paper tint */}
          {!isDark && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 235, 220, 0.15) 0%, rgba(240, 230, 210, 0.2) 100%)',
                mixBlendMode: 'color',
              }}
            />
          )}

          {/* Vignette effect - stronger in dark mode */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-500"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at center, transparent 40%, rgba(15, 23, 42, 0.6) 100%)'
                : 'radial-gradient(ellipse at center, transparent 50%, rgba(180, 160, 140, 0.15) 100%)',
            }}
          />

          {/* Dark mode: Bottom gradient fade for depth */}
          {isDark && (
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
              }}
            />
          )}
        </div>

        {/* Dark mode: Subtle amber accent line at bottom */}
        {isDark && (
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.5) 50%, transparent 100%)',
            }}
          />
        )}
      </div>
    </div>
  )
}
