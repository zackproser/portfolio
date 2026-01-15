'use client'

import { useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import ConsultationForm from '@/components/ConsultationForm'
import type { Route } from 'next'

interface EngagementCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  ctaText: string
  ctaAction: 'consultation' | 'link'
  ctaHref?: Route
  onConsultationClick?: () => void
}

function EngagementCard({
  title,
  subtitle,
  description,
  icon,
  ctaText,
  ctaAction,
  ctaHref,
  onConsultationClick,
}: EngagementCardProps) {
  const handleClick = () => {
    track('engagement_grid_click', { card: title, action: ctaAction })
    if (ctaAction === 'consultation' && onConsultationClick) {
      onConsultationClick()
    }
  }

  const cardContent = (
    <div className="group h-full p-8 bg-parchment-50 dark:bg-slate-800 rounded-xl border-2 border-parchment-300 dark:border-slate-700 hover:border-burnt-400/50 dark:hover:border-indigo-400/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      {/* Icon */}
      <div className="w-14 h-14 mb-6 rounded-lg bg-burnt-400/10 dark:bg-indigo-400/10 flex items-center justify-center text-3xl">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-bold text-charcoal-50 dark:text-white mb-2">
        {title}
      </h3>

      {/* Subtitle / Pricing */}
      <p className="text-burnt-400 dark:text-indigo-400 font-semibold text-sm mb-4">
        {subtitle}
      </p>

      {/* Description */}
      <p className="text-parchment-600 dark:text-slate-300 leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-auto">
        <span className="inline-flex items-center text-burnt-400 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform duration-200">
          {ctaText}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  )

  if (ctaAction === 'link' && ctaHref) {
    return (
      <Link href={ctaHref} onClick={handleClick} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  return (
    <div onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      {cardContent}
    </div>
  )
}

export default function EngagementGrid() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const engagements = [
    {
      title: 'For Investors & Funds',
      subtitle: '$500-650/hr | Due Diligence Calls',
      description: 'I provide technical diligence on AI tools, stacks, and startups. Cut through the hype with hands-on analysis from a practicing engineer.',
      icon: '&#128200;', // chart
      ctaText: 'Schedule a Call',
      ctaAction: 'consultation' as const,
    },
    {
      title: 'For Engineering Teams',
      subtitle: 'Fractional AI Leadership | Project Pricing',
      description: 'Architect and implement production RAG, fine-tuning, and scaling strategies. Interim staff AI engineer for your startup.',
      icon: '&#9881;', // gear
      ctaText: 'Discuss a Project',
      ctaAction: 'consultation' as const,
    },
    {
      title: 'For Builders & Business Owners',
      subtitle: 'Tools Analysis & Guides',
      description: 'Unbiased, hands-on reviews and tutorials (like my Wispr Flow review with 4k+ views). Learn what works to ship faster.',
      icon: '&#128218;', // book
      ctaText: 'Browse Articles',
      ctaAction: 'link' as const,
      ctaHref: '/blog' as Route,
    },
  ]

  return (
    <>
      <section className="py-16 md:py-24 bg-parchment-200 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-50 dark:text-white mb-4">
              How I Engage
            </h2>
            <p className="text-lg text-parchment-600 dark:text-slate-300 max-w-2xl mx-auto">
              Whether you&apos;re vetting AI investments, building production systems, or trying to understand the landscape&mdash;I can help.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {engagements.map((engagement) => (
              <EngagementCard
                key={engagement.title}
                {...engagement}
                onConsultationClick={() => setIsConsultationOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      <ConsultationForm
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </>
  )
}
