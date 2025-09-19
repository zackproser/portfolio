'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, ChevronLeft, ChevronRight, Star, CheckCircle, XCircle } from 'lucide-react'
import { VerdictBanner } from '@/components/VerdictBanner'
import { PersonaCard } from '@/components/PersonaCard'
import { ScoreBadge } from '@/components/ScoreBadge'
import { generateVerdict } from '@/lib/verdict-generator'

interface ToolData {
  id: string
  name: string
  category: string
  description?: string
  pricing?: string
  openSource?: boolean
  easeOfUse?: string
  reliability?: string
  documentation?: string
  community?: string
  features?: string[]
  websiteUrl?: string
  logoUrl?: string
  scores?: Record<string, number>
}

interface MobileComparisonViewProps {
  tools: ToolData[]
  verdict?: {
    winner: string
    headline?: string
    reasons: Array<{
      metric: string
      text: string
      icon: string
      sentiment: 'positive' | 'negative' | 'neutral'
    }>
    recommendations: {
      startup: string
      startupReason: string
      enterprise: string
      enterpriseReason: string
      learning: string
      learningReason: string
    }
  }
}

export function MobileComparisonView({ tools, verdict }: MobileComparisonViewProps) {
  const [currentToolIndex, setCurrentToolIndex] = useState(0)
  const [showPersonas, setShowPersonas] = useState(false)

  // Generate verdict if not provided
  const generatedVerdict = verdict || (tools.length >= 2 ? generateVerdict(tools[0], tools[1]) : null)

  if (!generatedVerdict) {
    return (
      <div className="lg:hidden p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold mb-2">Comparison Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We need at least 2 tools to generate a comparison.
          </p>
        </div>
      </div>
    )
  }

  const currentTool = tools[currentToolIndex]

  return (
    <div className="lg:hidden">
      {/* Sticky verdict header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b z-10 p-4">
        <VerdictBanner 
          winner={generatedVerdict.winner}
          headline={generatedVerdict.headline}
          keyReasons={generatedVerdict.reasons}
        />
      </div>

      {/* Tool navigation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Compare Tools</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentToolIndex(Math.max(0, currentToolIndex - 1))}
              disabled={currentToolIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentToolIndex(Math.min(tools.length - 1, currentToolIndex + 1))}
              disabled={currentToolIndex === tools.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {tools.map((tool, index) => (
            <Button
              key={tool.id}
              variant={index === currentToolIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentToolIndex(index)}
              className="whitespace-nowrap"
            >
              {tool.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Current tool details */}
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {currentTool.logoUrl && (
                <img src={currentTool.logoUrl} alt={currentTool.name} className="h-6 w-6" />
              )}
              {currentTool.name}
              {generatedVerdict.winner === currentTool.name && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <Star className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentTool.description || 'No description available'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTool.features?.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  )) || <span className="text-sm text-gray-500">No features listed</span>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Scores</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTool.scores && Object.entries(currentTool.scores).map(([metric, score]) => (
                    <ScoreBadge
                      key={metric}
                      score={score}
                      metric={metric}
                      tool={currentTool.name}
                      evidence={{
                        inputs: [`Based on ${metric} analysis`],
                        updated: 'Recently'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Pricing:</span>
                  <p className="font-medium">{currentTool.pricing || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Open Source:</span>
                  <p className="font-medium">{currentTool.openSource ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ease of Use:</span>
                  <p className="font-medium">{currentTool.easeOfUse || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Reliability:</span>
                  <p className="font-medium">{currentTool.reliability || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Persona recommendations toggle */}
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={() => setShowPersonas(!showPersonas)}
        >
          {showPersonas ? 'Hide' : 'Show'} Use Case Recommendations
        </Button>

        {/* Persona recommendations */}
        {showPersonas && (
          <div className="space-y-4 mb-6">
            <PersonaCard 
              persona="Startup MVP"
              recommended={generatedVerdict.recommendations.startup}
              reason={generatedVerdict.recommendations.startupReason}
            />
            <PersonaCard 
              persona="Enterprise Production"
              recommended={generatedVerdict.recommendations.enterprise}
              reason={generatedVerdict.recommendations.enterpriseReason}
            />
            <PersonaCard 
              persona="Learning & Experimentation"
              recommended={generatedVerdict.recommendations.learning}
              reason={generatedVerdict.recommendations.learningReason}
            />
          </div>
        )}

        {/* Quick comparison with other tools */}
        {tools.length > 1 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Quick Comparison</h4>
            <div className="space-y-3">
              {tools.filter(tool => tool.id !== currentTool.id).map(tool => (
                <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-sm text-gray-500">{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.scores && (
                      <div className="flex gap-1">
                        {Object.entries(tool.scores).slice(0, 2).map(([metric, score]) => (
                          <ScoreBadge
                            key={metric}
                            score={score}
                            metric={metric}
                            tool={tool.name}
                          />
                        ))}
                      </div>
                    )}
                    <Button size="sm" variant="outline">
                      Compare
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t p-4">
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => window.open(currentTool.websiteUrl)}
        >
          {generatedVerdict.winner === currentTool.name && "✓ Recommended: "}
          Get Started with {currentTool.name}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}