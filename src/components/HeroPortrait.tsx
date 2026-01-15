'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import RandomPortrait from '@/components/RandomPortrait'

// Pencil sketch portrait for the hero section (light mode)
const HERO_PORTRAIT_URL = '/images/zack-sketch.webp'
const HERO_PORTRAIT_ANIMATED = '/images/zack-sketch-animated.gif'

export default function HeroPortrait() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Dark mode: Show RandomPortrait
  if (isDark) {
    return (
      <div className="flex justify-center lg:justify-end">
        <div className="relative">
          {/* Soft glow behind */}
          <div className="absolute -inset-6 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-2xl" />

          {/* RandomPortrait container - larger size */}
          <div className="relative rounded-2xl ring-1 ring-indigo-500/40 shadow-2xl overflow-hidden">
            <RandomPortrait width={500} height={500} />
          </div>
        </div>
      </div>
    )
  }

  // Light mode: Show pencil sketch with intense charcoal effect
  return (
    <div className="flex justify-center lg:justify-end">
      {/* Portrait container with sketch-on-parchment frame */}
      <div className="relative">
        {/* Soft, subtle glow behind */}
        <div className="absolute -inset-6 rounded-lg bg-gradient-to-br from-burnt-400/10 to-parchment-400/15 blur-xl" />

        {/* Main portrait - charcoal sketch aesthetic */}
        <div
          className="relative w-80 h-[400px] md:w-[420px] md:h-[520px] lg:w-[480px] lg:h-[580px] overflow-hidden rounded-sm"
          style={{
            border: '1px solid rgba(160, 140, 120, 0.4)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
            background: 'linear-gradient(135deg, rgba(252, 250, 245, 1) 0%, rgba(248, 244, 236, 1) 100%)',
          }}
        >
          <Image
            src={HERO_PORTRAIT_URL}
            alt="Zachary Proser - AI Engineer & Cognitive Interface Researcher"
            fill
            className="object-cover object-top"
            style={{
              filter: 'grayscale(100%) contrast(1.4) brightness(1.05)',
              mixBlendMode: 'multiply',
            }}
            priority
          />
          {/* Charcoal grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              mixBlendMode: 'overlay',
            }}
          />
          {/* Warm paper tint overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 235, 220, 0.15) 0%, rgba(240, 230, 210, 0.2) 100%)',
              mixBlendMode: 'color',
            }}
          />
          {/* Vignette effect for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(180, 160, 140, 0.15) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
