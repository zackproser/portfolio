'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  DollarSign, 
  Code, 
  Users, 
  BookOpen,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react'

interface VisualScoreCardProps {
  tools: Array<{
    id: string
    name: string
    logoUrl?: string
    pricing: {
      model: string
      freeTier: boolean
      startingPrice?: string
    }
    technical: {
      openSource: boolean
      setupComplexity: string
      languages: string[]
    }
    community: {
      githubStars?: number
      releaseFrequency: string
    }
    documentation: {
      hasDocs: boolean
      quality: string
    }
  }>
  metrics: Array<{
    id: string
    name: string
    weight: number
  }>
}

const METRICS = [
  { id: 'pricing', name: 'Pricing Value', weight: 0.2, icon: DollarSign },
  { id: 'ease', name: 'Ease of Use', weight: 0.2, icon: Zap },
  { id: 'documentation', name: 'Documentation', weight: 0.2, icon: BookOpen },
  { id: 'community', name: 'Community', weight: 0.2, icon: Users },
  { id: 'reliability', name: 'Reliability', weight: 0.2, icon: Shield }
]

export function VisualScoreCard({ tools, metrics }: VisualScoreCardProps) {
  const calculateScore = (tool: any, metricId: string) => {
    switch (metricId) {
      case 'pricing':
        let score = 0
        if (tool.pricing.freeTier) score += 3
        if (tool.pricing.model === 'Free') score += 2
        if (tool.pricing.startingPrice && tool.pricing.startingPrice.includes('$0')) score += 1
        return Math.min(score, 10)
      
      case 'ease':
        let easeScore = 0
        if (tool.technical.setupComplexity === 'Low') easeScore += 4
        else if (tool.technical.setupComplexity === 'Medium') easeScore += 2
        if (tool.technical.languages.length > 3) easeScore += 2
        if (tool.technical.openSource) easeScore += 2
        return Math.min(easeScore, 10)
      
      case 'documentation':
        let docScore = 0
        if (tool.documentation.hasDocs) docScore += 3
        if (tool.documentation.quality === 'High') docScore += 4
        else if (tool.documentation.quality === 'Medium') docScore += 2
        return Math.min(docScore, 10)
      
      case 'community':
        let commScore = 0
        if (tool.community.githubStars && tool.community.githubStars > 1000) commScore += 3
        if (tool.community.githubStars && tool.community.githubStars > 5000) commScore += 2
        if (tool.community.releaseFrequency === 'High') commScore += 3
        else if (tool.community.releaseFrequency === 'Medium') commScore += 1
        return Math.min(commScore, 10)
      
      case 'reliability':
        let relScore = 0
        if (tool.technical.openSource) relScore += 2
        if (tool.community.githubStars && tool.community.githubStars > 1000) relScore += 3
        if (tool.community.releaseFrequency === 'High') relScore += 3
        if (tool.documentation.quality === 'High') relScore += 2
        return Math.min(relScore, 10)
      
      default:
        return 5
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  const getQuickRecommendation = () => {
    const toolScores = tools.map(tool => {
      const totalScore = METRICS.reduce((sum, metric) => {
        return sum + (calculateScore(tool, metric.id) * metric.weight)
      }, 0)
      return { tool, score: totalScore }
    })

    const bestTool = toolScores.reduce((best, current) => 
      current.score > best.score ? current : best
    )

    return {
      tool: bestTool.tool,
      score: Math.round(bestTool.score),
      reason: getRecommendationReason(bestTool.tool, toolScores)
    }
  }

  const getRecommendationReason = (tool: any, allScores: any[]) => {
    const reasons = []
    
    if (tool.pricing.freeTier) reasons.push('free tier available')
    if (tool.technical.setupComplexity === 'Low') reasons.push('easy setup')
    if (tool.documentation.quality === 'High') reasons.push('excellent documentation')
    if (tool.community.githubStars && tool.community.githubStars > 1000) reasons.push('strong community')
    
    return reasons.slice(0, 2).join(' and ')
  }

  const recommendation = getQuickRecommendation()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <h3 className="font-semibold mb-4 text-lg">At-a-Glance Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numerical Scores */}
        <div className="space-y-4">
          {METRICS.map(metric => {
            const Icon = metric.icon
            return (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    {tools.map(tool => {
                      const score = calculateScore(tool, metric.id)
                      return (
                        <div
                          key={tool.id}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(score)}`}
                          title={`${tool.name}: ${score}/10`}
                        >
                          {score}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map(tool => {
                    const score = calculateScore(tool, metric.id)
                    return (
                      <div key={tool.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="truncate">{tool.name}</span>
                          <span className="font-medium">{score}/10</span>
                        </div>
                        <Progress value={score * 10} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Recommendation */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Quick Recommendation</h4>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{recommendation.score}</span>
              </div>
              <div>
                <h5 className="font-semibold">{recommendation.tool.name}</h5>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Recommended for {recommendation.reason}
                </p>
              </div>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              Based on objective criteria analysis
            </div>
          </div>

          {/* Feature Matrix */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Compare</h4>
            <div className="space-y-2">
              {[
                { label: 'Free Tier', key: 'pricing.freeTier' },
                { label: 'Open Source', key: 'technical.openSource' },
                { label: 'Easy Setup', key: 'technical.setupComplexity', value: 'Low' },
                { label: 'Good Docs', key: 'documentation.quality', value: 'High' }
              ].map(feature => (
                <div key={feature.label} className="flex items-center justify-between text-sm">
                  <span>{feature.label}</span>
                  <div className="flex space-x-2">
                    {tools.map(tool => {
                      const value = feature.key.split('.').reduce((obj: any, key) => obj?.[key], tool)
                      const hasFeature = feature.value ? value === feature.value : value
                      return (
                        <div key={tool.id} className="w-6 h-6 flex items-center justify-center">
                          {hasFeature ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
