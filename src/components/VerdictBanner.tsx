'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Star, Zap, DollarSign, BookOpen, Users } from 'lucide-react'

interface VerdictBannerProps {
  winner: string
  headline?: string
  confidence?: 'slight' | 'moderate' | 'strong'
  keyReasons: Array<{
    metric: string
    text: string
    icon: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
}

const getReasonIcon = (metric: string, sentiment: string) => {
  const iconMap: Record<string, string> = {
    pricing: '💰',
    ease: '⚡',
    documentation: '📚',
    community: '👥',
    reliability: '🛡️',
    performance: '🚀',
    features: '✨'
  }
  
  return iconMap[metric] || (sentiment === 'positive' ? '✅' : sentiment === 'negative' ? '❌' : '⚖️')
}

const getBadgeVariant = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'default'
    case 'negative':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function VerdictBanner({ winner, headline, confidence = 'moderate', keyReasons }: VerdictBannerProps) {
  const defaultHeadline = `For most developers, ${winner} is the better choice`
  
  const getConfidenceIcon = () => {
    switch (confidence) {
      case 'strong': return '⭐';
      case 'moderate': return '💡';
      case 'slight': return '⚖️';
      default: return '💡';
    }
  };

  const getConfidenceMessage = () => {
    switch (confidence) {
      case 'strong': return 'Significant advantages across multiple areas';
      case 'moderate': return 'Clear advantages in key areas';
      case 'slight': return 'The tools are similar, but small advantages add up';
      default: return 'Clear advantages in key areas';
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{getConfidenceIcon()}</span>
          <div>
            <h1 className="text-3xl font-bold">
              {headline || defaultHeadline}
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              {getConfidenceMessage()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {keyReasons.map((reason, index) => (
            <Badge 
              key={index} 
              variant={getBadgeVariant(reason.sentiment)}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <span className="mr-2">{getReasonIcon(reason.metric, reason.sentiment)}</span>
              {reason.text}
            </Badge>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/10 rounded-lg">
          <p className="text-sm opacity-90">
            💡 <strong>Quick Tip:</strong> This verdict is based on objective data including pricing, 
            ease of use, documentation quality, and community support. Scroll down to see detailed 
            comparisons and use case recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}
