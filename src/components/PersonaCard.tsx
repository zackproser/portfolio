'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Star, Users, Building, BookOpen } from 'lucide-react'

interface PersonaCardProps {
  persona: string
  recommended: string
  reason: string
  confidence?: 'slight' | 'moderate' | 'strong'
}

const getPersonaIcon = (persona: string) => {
  switch (persona.toLowerCase()) {
    case 'startup mvp':
      return <Star className="h-5 w-5 text-yellow-500" />
    case 'enterprise production':
      return <Building className="h-5 w-5 text-blue-500" />
    case 'learning & experimentation':
      return <BookOpen className="h-5 w-5 text-green-500" />
    default:
      return <Users className="h-5 w-5 text-gray-500" />
  }
}

const getPersonaColor = (persona: string) => {
  switch (persona.toLowerCase()) {
    case 'startup mvp':
      return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
    case 'enterprise production':
      return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
    case 'learning & experimentation':
      return 'border-green-200 bg-green-50 dark:bg-green-900/20'
    default:
      return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
  }
}

const getConfidenceBadge = (confidence?: 'slight' | 'moderate' | 'strong') => {
  if (!confidence) return null
  
  switch (confidence) {
    case 'strong':
      return <Badge variant="default" className="bg-green-100 text-green-800">Strong Match</Badge>
    case 'moderate':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Good Fit</Badge>
    case 'slight':
      return <Badge variant="outline" className="bg-gray-100 text-gray-600">Slight Edge</Badge>
    default:
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Good Fit</Badge>
  }
}

export function PersonaCard({ persona, recommended, reason, confidence }: PersonaCardProps) {
  // Always show a recommendation - never "No clear winner"
  const isRecommended = recommended && recommended !== 'Neither' && recommended !== 'No clear winner'
  
  return (
    <Card className={`${getPersonaColor(persona)} transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          {getPersonaIcon(persona)}
          {persona}
          <CheckCircle className="h-5 w-5 text-green-600" />
        </CardTitle>
        {getConfidenceBadge(confidence)}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Recommended Tool:
            </p>
            <p className="font-semibold text-lg">
              {recommended}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Why:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {reason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
