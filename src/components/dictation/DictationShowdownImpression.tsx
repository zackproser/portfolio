'use client'

import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import type { CompetitorArchetype } from '@/lib/dictation-cluster'

interface DictationShowdownImpressionProps {
  campaign: string
  archetype: CompetitorArchetype
}

export function DictationShowdownImpression({
  campaign,
  archetype,
}: DictationShowdownImpressionProps) {
  const impressionTracked = useRef(false)

  useEffect(() => {
    if (impressionTracked.current) return
    impressionTracked.current = true
    track('dictation_showdown_impression', { campaign, archetype })
  }, [campaign, archetype])

  return null
}
