'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Calendar, Flame, ArrowRight } from 'lucide-react'
import { track } from '@vercel/analytics'
import { getAffiliateLink, type AffiliateProduct, type AffiliateMedium, type AffiliatePlacement } from '@/lib/affiliate'

interface StickyAffiliateCTAProps {
  product?: 'wisprflow' | 'granola' | 'both'
  campaign?: string  // Page slug for UTM tracking (e.g., 'ai-tools-for-lawyers')
  medium?: AffiliateMedium
  showAfterScroll?: number // pixels to scroll before showing
  className?: string
}

const PRODUCT_DATA = {
  wisprflow: {
    name: 'WisprFlow',
    tagline: 'Speak at 179 WPM',
    icon: Mic,
    gradient: 'from-purple-600 to-indigo-600',
    hoverGradient: 'hover:from-purple-500 hover:to-indigo-500'
  },
  granola: {
    name: 'Granola',
    tagline: 'AI meeting notes',
    icon: Calendar,
    gradient: 'from-teal-600 to-cyan-600',
    hoverGradient: 'hover:from-teal-500 hover:to-cyan-500'
  },
  firecrawl: {
    name: 'Firecrawl',
    tagline: 'Web scraping API for AI',
    icon: Flame,
    gradient: 'from-orange-500 to-red-600',
    hoverGradient: 'hover:from-orange-400 hover:to-red-500'
  }
}

export default function StickyAffiliateCTA({
  product = 'both',
  campaign = 'unknown',
  medium = 'blog',
  showAfterScroll = 800,
  className = ''
}: StickyAffiliateCTAProps) {
  const isGranolaCampaign = /granola|meeting-notes?|record-meetings|meeting-transcription|meeting-assistant/i.test(campaign)
  const resolvedProduct = product === 'both' && isGranolaCampaign ? 'granola' : product
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const hasTrackedImpression = useRef(false)

  const getLink = (p: AffiliateProduct) => getAffiliateLink({
    product: p,
    campaign,
    medium,
    placement: 'sticky-cta'
  })

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(`stickyCtaDismissed:${resolvedProduct}`)
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > showAfterScroll)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [resolvedProduct, showAfterScroll])

  useEffect(() => {
    if (!isVisible || isDismissed || hasTrackedImpression.current) return
    hasTrackedImpression.current = true
    track('sticky_cta_impression', {
      product: resolvedProduct,
      products: resolvedProduct === 'both' ? 'wisprflow,granola' : resolvedProduct,
      campaign,
    })
  }, [campaign, isDismissed, isVisible, resolvedProduct])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem(`stickyCtaDismissed:${resolvedProduct}`, 'true')
    track('sticky_cta_dismissed', { product: resolvedProduct, campaign })
  }

  const handleClick = (clickedProduct: 'wisprflow' | 'granola') => {
    track('sticky_cta_click', { product: clickedProduct, campaign })
  }

  if (isDismissed) return null

  const products = resolvedProduct === 'both'
    ? ['wisprflow', 'granola'] as const
    : [resolvedProduct] as const

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
        >
          <div className="mx-auto max-w-4xl px-4 pb-4">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-2xl">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500" />
              
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Left: CTA Text */}
                  <div className="hidden flex-shrink-0 sm:block">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {resolvedProduct === 'granola' ? 'Granola — 3 months free' : 'Ready to go voice-first?'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                      {resolvedProduct === 'granola' ? 'Free plan available' : 'The tools I use every day'}
                    </p>
                  </div>

                  {/* Middle: Product buttons */}
                  <div className="flex flex-1 flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
                    {products.map((p) => {
                      const data = PRODUCT_DATA[p]
                      const Icon = data.icon
                      return (
                        <a
                          key={p}
                          href={getLink(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleClick(p)}
                          className={`
                            group flex items-center justify-center gap-2 rounded-xl px-2.5 sm:px-4 py-2.5
                            bg-gradient-to-r ${data.gradient} ${data.hoverGradient}
                            text-white text-sm font-semibold shadow-md
                            hover:shadow-lg transition-all duration-200
                            !text-white
                          `}
                        >
                          <Icon className="h-4 w-4 !text-white" />
                          <span className="!text-white">
                            {p === 'granola' ? 'Granola — 3 months free' : 'WisprFlow — try free'}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform !text-white" />
                        </a>
                      )
                    })}
                  </div>

                  {/* Right: Dismiss button */}
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simplified version for inline use in blog posts
interface InlineAffiliateCTAProps {
  product: 'wisprflow' | 'granola' | 'firecrawl'
  campaign?: string  // Page slug for UTM tracking
  medium?: AffiliateMedium
}

export function InlineAffiliateCTA({
  product,
  campaign = 'unknown',
  medium = 'blog'
}: InlineAffiliateCTAProps) {
  const data = PRODUCT_DATA[product]
  const Icon = data.icon

  const link = getAffiliateLink({
    product,
    campaign,
    medium,
    placement: 'inline-cta'
  })

  const handleClick = () => {
    track('inline_cta_click', { product, campaign })
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 rounded-lg px-4 py-2
        bg-gradient-to-r ${data.gradient} ${data.hoverGradient}
        text-white text-sm font-semibold shadow-md
        hover:shadow-lg transition-all duration-200
        no-underline
        !text-white
      `}
    >
      <Icon className="h-4 w-4 !text-white" />
      <span className="!text-white">
        {product === 'granola' ? 'Get 3 Months Free' : `Try ${data.name} Free`}
      </span>
      <ArrowRight className="h-3.5 w-3.5 !text-white" />
    </a>
  )
}

// Simple text link for inline use in MDX content
interface AffiliateLinkProps {
  product: 'wisprflow' | 'granola' | 'firecrawl'
  campaign?: string
  medium?: AffiliateMedium
  placement?: AffiliatePlacement
  children: React.ReactNode
}

export function AffiliateLink({
  product,
  campaign = 'unknown',
  medium = 'blog',
  placement = 'text-link',
  children
}: AffiliateLinkProps) {
  const link = getAffiliateLink({
    product,
    campaign,
    medium,
    placement
  })

  const handleClick = () => {
    track('affiliate_text_link_click', { product, campaign, placement })
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
