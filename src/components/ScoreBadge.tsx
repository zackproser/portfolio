'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ScoreBadgeProps {
  score: number
  metric: string
  tool: string
  evidence?: {
    inputs: string[]
    updated: string
  }
}

const scoreConfig = {
  0: { color: 'bg-gray-100 text-gray-600', icon: '—', label: 'No data' },
  1: { color: 'bg-red-100 text-red-700', icon: '🔴', label: 'Poor' },
  4: { color: 'bg-orange-100 text-orange-700', icon: '🟡', label: 'Fair' },
  7: { color: 'bg-green-100 text-green-700', icon: '🟢', label: 'Good' },
  10: { color: 'bg-emerald-100 text-emerald-700', icon: '✨', label: 'Excellent' }
}

const getScoreTier = (score: number) => {
  if (score === 0) return 0
  if (score <= 3) return 1
  if (score <= 6) return 4
  if (score <= 9) return 7
  return 10
}

const getMetricDescription = (metric: string, score: number) => {
  const descriptions: Record<string, Record<number, string>> = {
    pricing: {
      10: "Generous free tier and competitive pricing",
      7: "Reasonable pricing with good value",
      4: "Expensive for the features provided",
      1: "Very expensive with limited value"
    },
    documentation: {
      10: "Excellent documentation with examples and tutorials",
      7: "Good documentation with clear examples",
      4: "Basic documentation, could be better",
      1: "Poor documentation, hard to understand"
    },
    easeOfUse: {
      10: "Beginner-friendly with intuitive interface",
      7: "Easy to learn with good UX",
      4: "Steep learning curve",
      1: "Very complex and difficult to use"
    },
    community: {
      10: "Vibrant community with active support",
      7: "Active community with good engagement",
      4: "Small but helpful community",
      1: "Limited community support"
    },
    reliability: {
      10: "Highly reliable with excellent uptime",
      7: "Reliable with good performance",
      4: "Some reliability issues",
      1: "Frequent issues and downtime"
    }
  }
  
  const tiers = Object.keys(descriptions[metric] || {})
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const tier of tiers) {
    if (score >= tier) {
      return descriptions[metric]?.[tier] || "No data available"
    }
  }
  
  return "No data available"
}

export function ScoreBadge({ score, metric, tool, evidence }: ScoreBadgeProps) {
  const tier = getScoreTier(score)
  const config = scoreConfig[tier as keyof typeof scoreConfig]
  const description = getMetricDescription(metric, score)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${config.color} px-3 py-1 rounded-lg flex items-center gap-2 cursor-help`}>
            <span>{config.icon}</span>
            <span className="font-medium">{score}/10</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="p-3">
            <div className="font-semibold mb-2">
              {metric}: {config.label}
            </div>
            <p className="text-sm mb-3">{description}</p>
            {evidence && (
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">Based on:</p>
                <ul className="list-disc list-inside space-y-1">
                  {evidence.inputs.map((input, i) => (
                    <li key={i}>{input}</li>
                  ))}
                </ul>
                <p className="mt-2 text-gray-400">Updated {evidence.updated}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
