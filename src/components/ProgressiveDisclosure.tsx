'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronUp, 
  Info,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react'

interface ProgressiveDisclosureProps {
  title: string
  summary: string
  details: {
    basic: Array<{
      label: string
      value: string | boolean
      importance: 'high' | 'medium' | 'low'
    }>
    advanced: Array<{
      label: string
      value: string | boolean
      description?: string
    }>
    expert: Array<{
      label: string
      value: string | boolean
      technicalDetails?: string
      impact?: string
    }>
  }
  level: 'basic' | 'advanced' | 'expert'
  onLevelChange: (level: 'basic' | 'advanced' | 'expert') => void
}

export function ProgressiveDisclosure({ 
  title, 
  summary, 
  details, 
  level, 
  onLevelChange 
}: ProgressiveDisclosureProps) {
  const [expanded, setExpanded] = useState(false)

  const getCurrentDetails = () => {
    switch (level) {
      case 'basic': return details.basic
      case 'advanced': return [...details.basic, ...details.advanced]
      case 'expert': return [...details.basic, ...details.advanced, ...details.expert]
      default: return details.basic
    }
  }

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'basic': return 'Essential information for quick decisions'
      case 'advanced': return 'Detailed specs for informed choices'
      case 'expert': return 'Technical details for deep analysis'
      default: return ''
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basic': return <Star className="h-4 w-4" />
      case 'advanced': return <Info className="h-4 w-4" />
      case 'expert': return <Lightbulb className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Level Selector */}
          <div className="flex space-x-2 mb-4">
            {(['basic', 'advanced', 'expert'] as const).map((lvl) => (
              <Button
                key={lvl}
                variant={level === lvl ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLevelChange(lvl)}
                className="flex items-center space-x-1"
              >
                {getLevelIcon(lvl)}
                <span className="capitalize">{lvl}</span>
              </Button>
            ))}
          </div>

          {/* Level Description */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {getLevelDescription(level)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {getCurrentDetails().map((detail, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{detail.label}</span>
                    {'importance' in detail && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImportanceColor(detail.importance)}`}
                      >
                        {detail.importance}
                      </Badge>
                    )}
                  </div>
                  
                  {/* {detail.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                      {detail.description}
                    </p>
                  )} */}
                  
                  {'technicalDetails' in detail && detail.technicalDetails && level === 'expert' && (
                    <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">
                      {detail.technicalDetails}
                    </p>
                  )}
                  
                  {'impact' in detail && detail.impact && level === 'expert' && (
                    <p className="text-xs text-green-600 dark:text-green-300">
                      Impact: {detail.impact}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {typeof detail.value === 'boolean' ? (
                    detail.value ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )
                  ) : (
                    <span className="text-sm font-medium">{detail.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progressive Disclosure Hint */}
          {level !== 'expert' && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  Need more details? Switch to {level === 'basic' ? 'Advanced' : 'Expert'} level for deeper insights.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

// Hook for managing progressive disclosure state
export function useProgressiveDisclosure() {
  const [level, setLevel] = useState<'basic' | 'advanced' | 'expert'>('basic')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const setLevelAndExpand = (newLevel: 'basic' | 'advanced' | 'expert', sectionId?: string) => {
    setLevel(newLevel)
    if (sectionId) {
      setExpandedSections(new Set([sectionId]))
    }
  }

  return {
    level,
    setLevel,
    expandedSections,
    toggleSection,
    setLevelAndExpand
  }
}
