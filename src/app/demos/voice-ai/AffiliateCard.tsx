'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mic, Calendar, Sparkles } from 'lucide-react'
import { track } from '@vercel/analytics'
import { getAffiliateLink, type AffiliateMedium, type AffiliatePlacement } from '@/lib/affiliate'

interface AffiliateCardProps {
  product: 'wisprflow' | 'granola'
  variant?: 'default' | 'compact' | 'hero'
  context?: string // Where in the demo this appears
  campaign?: string // Page slug for UTM tracking
  medium?: AffiliateMedium
}

const PRODUCT_DATA = {
  wisprflow: {
    name: 'WisprFlow',
    tagline: 'Voice-to-text that actually works',
    description: 'Speak at 170+ WPM into any app. AI cleans up filler words, formats for context, and drops polished text wherever your cursor is.',
    icon: Mic,
    benefits: [
      '4x faster than typing',
      'Works in any app',
      'AI-powered formatting'
    ],
    cta: 'Try WisprFlow Free'
  },
  granola: {
    name: 'Granola',
    tagline: 'AI meeting notes without the bot',
    description: 'Be fully present in meetings while Granola captures everything. No awkward bot joining your calls—just comprehensive notes and action items.',
    icon: Calendar,
    benefits: [
      'No meeting bot needed',
      'Auto-extracts action items',
      'Works on Mac, Windows, iOS'
    ],
    cta: 'Try Granola Free'
  }
}

// Static class mappings to ensure Tailwind JIT includes them
const PRODUCT_STYLES = {
  wisprflow: {
    gradient: 'from-purple-500 to-indigo-600',
    cardBg: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900',
    cardBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
    defaultBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    sparkle: 'text-purple-500',
    bullet: 'bg-purple-500',
    orbBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
  granola: {
    gradient: 'from-teal-500 to-cyan-600',
    cardBg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-900',
    cardBorder: 'hover:border-teal-300 dark:hover:border-teal-600',
    defaultBorder: 'hover:border-teal-300 dark:hover:border-teal-700',
    sparkle: 'text-teal-500',
    bullet: 'bg-teal-500',
    orbBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
  }
}

export default function AffiliateCard({
  product,
  variant = 'default',
  context = 'demo',
  campaign = 'voice-ai-demo',
  medium = 'demo'
}: AffiliateCardProps) {
  const data = PRODUCT_DATA[product]
  const styles = PRODUCT_STYLES[product]
  const Icon = data.icon

  // Map variant to placement for UTM tracking
  const placementMap: Record<string, AffiliatePlacement> = {
    default: 'compact-card',
    compact: 'compact-card',
    hero: 'hero-card'
  }

  const link = getAffiliateLink({
    product,
    campaign,
    medium,
    placement: placementMap[variant] || 'compact-card'
  })

  const handleClick = () => {
    track('affiliate_click', {
      product,
      context,
      variant,
      campaign
    })
  }

  if (variant === 'compact') {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`
          group flex items-center gap-3 rounded-xl border border-zinc-200 
          bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md
          dark:border-zinc-700 dark:bg-zinc-800/80
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`
          flex h-10 w-10 items-center justify-center rounded-lg
          bg-gradient-to-br ${styles.gradient}
        `}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {data.name}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {data.tagline}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
      </motion.a>
    )
  }

  if (variant === 'hero') {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className={`
          relative overflow-hidden rounded-2xl border-2 border-transparent
          ${styles.cardBg} ${styles.cardBorder}
          p-6 shadow-lg transition-all hover:shadow-xl
        `}>
          {/* Decorative gradient orb */}
          <div className={`
            absolute -right-10 -top-10 h-40 w-40 rounded-full
            ${styles.orbBg} opacity-20 blur-3xl
          `} />
          
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className={`
                flex h-14 w-14 items-center justify-center rounded-xl
                bg-gradient-to-br ${styles.gradient} shadow-lg
              `}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <Sparkles className={`h-5 w-5 ${styles.sparkle}`} />
            </div>
            
            <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {data.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {data.tagline}
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {data.description}
            </p>
            
            <ul className="mt-4 space-y-2">
              {data.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className={`h-1.5 w-1.5 rounded-full ${styles.bullet}`} />
                  {benefit}
                </li>
              ))}
            </ul>
            
            <div className={`
              mt-6 inline-flex items-center gap-2 rounded-lg
              bg-gradient-to-r ${styles.gradient} px-5 py-2.5
              text-sm font-semibold text-white shadow-md
              transition-all hover:shadow-lg
            `}>
              {data.cta}
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.a>
    )
  }

  // Default variant
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block group"
      whileHover={{ y: -2 }}
    >
      <div className={`
        relative overflow-hidden rounded-xl border border-zinc-200
        bg-white p-5 shadow-sm transition-all hover:shadow-md
        dark:border-zinc-700 dark:bg-zinc-800/80
        ${styles.defaultBorder}
      `}>
        <div className="flex items-start gap-4">
          <div className={`
            flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
            bg-gradient-to-br ${styles.gradient} shadow-md
          `}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                {data.name}
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                Recommended
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {data.tagline}
            </p>
            
            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              {data.benefits.slice(0, 2).map((benefit, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className={`h-1 w-1 rounded-full ${styles.bullet}`} />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          
          <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.a>
  )
}

// Export a dual-card component for showing both products
interface AffiliateDualCardProps {
  context?: string
  campaign?: string
  medium?: AffiliateMedium
}

export function AffiliateDualCard({
  context = 'demo',
  campaign = 'voice-ai-demo',
  medium = 'demo'
}: AffiliateDualCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AffiliateCard product="wisprflow" variant="hero" context={context} campaign={campaign} medium={medium} />
      <AffiliateCard product="granola" variant="hero" context={context} campaign={campaign} medium={medium} />
    </div>
  )
}


