'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

// Pencil sketch portrait for the hero section
const HERO_PORTRAIT_URL = '/images/zack-sketch.webp'

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
        {/* Soft glow behind - different colors per theme */}
        <div
          className={`absolute -inset-6 rounded-lg blur-xl ${
            isDark
              ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'
              : 'bg-gradient-to-br from-burnt-400/10 to-parchment-400/15'
          }`}
        />

        {/* Main portrait container */}
        <div
          className="relative w-80 h-[400px] md:w-[420px] md:h-[520px] lg:w-[480px] lg:h-[580px] overflow-hidden rounded-sm"
          style={{
            border: isDark
              ? '1px solid rgba(99, 102, 241, 0.3)'
              : '1px solid rgba(160, 140, 120, 0.4)',
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(99, 102, 241, 0.1)'
              : '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
            background: isDark
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)'
              : 'linear-gradient(135deg, rgba(252, 250, 245, 1) 0%, rgba(248, 244, 236, 1) 100%)',
          }}
        >
          <Image
            src={HERO_PORTRAIT_URL}
            alt="Zachary Proser - AI Engineer & Cognitive Interface Researcher"
            fill
            className="object-cover object-top"
            style={{
              filter: isDark
                ? 'grayscale(100%) contrast(1.2) brightness(1.3) invert(1)'
                : 'grayscale(100%) contrast(1.4) brightness(1.05)',
              mixBlendMode: isDark ? 'screen' : 'multiply',
              opacity: isDark ? 0.85 : 1,
            }}
            priority
          />

          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              mixBlendMode: 'overlay',
              opacity: isDark ? 0.15 : 0.2,
            }}
          />

          {/* Color tint overlay - warm for light, cool for dark */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(245, 235, 220, 0.15) 0%, rgba(240, 230, 210, 0.2) 100%)',
              mixBlendMode: 'color',
            }}
          />

          {/* Vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at center, transparent 50%, rgba(15, 23, 42, 0.4) 100%)'
                : 'radial-gradient(ellipse at center, transparent 50%, rgba(180, 160, 140, 0.15) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
