'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, Phone, ArrowRight } from 'lucide-react'
import { track } from '@vercel/analytics'
import { getAffiliateLink } from '@/lib/affiliate'

// ─── Affiliate link helper ─────────────────────────────────────────────────
export function getLink(
  product: 'wisprflow' | 'granola',
  placement: string,
  campaign: string
) {
  return getAffiliateLink({
    product,
    campaign,
    medium: 'demo',
    placement: placement as any
  })
}

// ─── Analytics tracking ─────────────────────────────────────────────────────
export function trackClick(
  product: 'wisprflow' | 'granola',
  context: string,
  campaign: string
) {
  track('affiliate_click', { product, context, campaign })
}

// ─── Affiliate CTA Button ───────────────────────────────────────────────────
export function AffiliateButton({
  product,
  context,
  campaign,
  size = 'default'
}: {
  product: 'wisprflow' | 'granola'
  context: string
  campaign: string
  size?: 'default' | 'large'
}) {
  const config = {
    wisprflow: {
      name: 'WisprFlow',
      icon: Mic,
      gradient: 'from-purple-600 to-indigo-600',
      hover: 'hover:from-purple-500 hover:to-indigo-500'
    },
    granola: {
      name: 'Granola',
      icon: Phone,
      gradient: 'from-teal-600 to-cyan-600',
      hover: 'hover:from-teal-500 hover:to-cyan-500'
    }
  }
  const c = config[product]
  const Icon = c.icon
  const link = getLink(product, context, campaign)

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(product, context, campaign)}
      className={`
        inline-flex items-center gap-2 rounded-xl font-semibold text-white
        bg-gradient-to-r ${c.gradient} ${c.hover}
        shadow-md hover:shadow-lg transition-all
        ${size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm'}
      `}
    >
      <Icon className={size === 'large' ? 'h-5 w-5' : 'h-4 w-4'} />
      Try {c.name} Free
      <ArrowRight className={size === 'large' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
    </a>
  )
}

// ─── Section observer hook ──────────────────────────────────────────────────
export function useInView(threshold = 0.3): [React.RefCallback<HTMLElement>, boolean] {
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!node) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold }
    )
    observerRef.current.observe(node)
  }, [threshold])

  return [ref, visible]
}

// ─── Typewriter effect ──────────────────────────────────────────────────────
export function Typewriter({ text, active, speed = 30 }: { text: string; active: boolean; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!active) {
      setDisplayed(text)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [active, text, speed])

  return <>{displayed}{active && <span className="animate-pulse">|</span>}</>
}
