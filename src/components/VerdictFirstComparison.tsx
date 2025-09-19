'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, CheckCircle, XCircle, DollarSign, Code, Star, Users, BookOpen } from 'lucide-react'
import { VerdictBanner } from '@/components/VerdictBanner'
import { PersonaCard } from '@/components/PersonaCard'
import { RadarChart } from '@/components/RadarChart'
import { ScoreBadge } from '@/components/ScoreBadge'
import { generateVerdict } from '@/lib/verdict-generator'
import { getScoreInfo } from '@/lib/score-display'
import { calculateAllScores } from '@/lib/scoring-engine'

interface ToolData {
  id: string
  name: string
  category: string
  description?: string
  pricing?: string
  openSource?: boolean
  apiAccess?: boolean
  easeOfUse?: string
  reliability?: string
  documentation?: string
  community?: string
  features?: string[]
  websiteUrl?: string
  logoUrl?: string
}

interface VerdictFirstComparisonProps {
  tool1: ToolData
  tool2: ToolData
}

export function VerdictFirstComparison({ tool1, tool2 }: VerdictFirstComparisonProps) {
  const [selectedTab, setSelectedTab] = useState('key-differences')

  // Generate verdict
  const verdict = useMemo(() => {
    return generateVerdict(tool1, tool2)
  }, [tool1, tool2])

  // Calculate real scores using the scoring engine
  const tool1WithDefaults = {
    ...tool1,
    description: tool1.description || '',
    pricing: tool1.pricing || '',
    openSource: tool1.openSource || false,
    apiAccess: tool1.apiAccess || false,
    easeOfUse: tool1.easeOfUse || 'Medium',
    reliability: tool1.reliability || 'Medium',
    documentation: tool1.documentation || '',
    community: tool1.community || '',
    features: tool1.features || [],
    websiteUrl: tool1.websiteUrl || '',
    logoUrl: tool1.logoUrl || ''
  }
  
  const tool2WithDefaults = {
    ...tool2,
    description: tool2.description || '',
    pricing: tool2.pricing || '',
    openSource: tool2.openSource || false,
    apiAccess: tool2.apiAccess || false,
    easeOfUse: tool2.easeOfUse || 'Medium',
    reliability: tool2.reliability || 'Medium',
    documentation: tool2.documentation || '',
    community: tool2.community || '',
    features: tool2.features || [],
    websiteUrl: tool2.websiteUrl || '',
    logoUrl: tool2.logoUrl || ''
  }
  
  const tool1Scores = calculateAllScores(tool1WithDefaults)
  const tool2Scores = calculateAllScores(tool2WithDefaults)
  
  // Prepare tools for visual components with real scores
  const toolsForVisual = [
    {
      id: tool1.id,
      name: tool1.name,
      scores: {
        pricing: tool1Scores.pricing,
        ease: tool1Scores.easeOfUse,
        documentation: tool1Scores.documentation,
        community: tool1Scores.community,
        reliability: tool1Scores.reliability
      }
    },
    {
      id: tool2.id,
      name: tool2.name,
      scores: {
        pricing: tool2Scores.pricing,
        ease: tool2Scores.easeOfUse,
        documentation: tool2Scores.documentation,
        community: tool2Scores.community,
        reliability: tool2Scores.reliability
      }
    }
  ]

  const metrics = [
    { id: 'pricing', name: 'Pricing Value', weight: 0.2 },
    { id: 'ease', name: 'Ease of Use', weight: 0.2 },
    { id: 'documentation', name: 'Documentation', weight: 0.2 },
    { id: 'community', name: 'Community', weight: 0.2 },
    { id: 'reliability', name: 'Reliability', weight: 0.2 }
  ]

  return (
    <div className="container mx-auto py-8">
        {/* VERDICT BANNER - The most important change */}
        <VerdictBanner 
          winner={verdict.winner}
          headline={verdict.headline}
          confidence={verdict.confidence}
          keyReasons={verdict.reasons}
        />

        {/* PERSONA RECOMMENDATIONS - Move these up from bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <PersonaCard 
            persona="Startup MVP"
            recommended={verdict.recommendations.startup}
            reason={verdict.recommendations.startupReason}
            confidence={verdict.recommendations.startupConfidence}
          />
          <PersonaCard 
            persona="Enterprise Production"
            recommended={verdict.recommendations.enterprise}
            reason={verdict.recommendations.enterpriseReason}
            confidence={verdict.recommendations.enterpriseConfidence}
          />
          <PersonaCard 
            persona="Learning & Experimentation"
            recommended={verdict.recommendations.learning}
            reason={verdict.recommendations.learningReason}
            confidence={verdict.recommendations.learningConfidence}
          />
        </div>

        {/* VISUAL COMPARISON - Add radar chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-8">
          <h3 className="font-semibold mb-4">At-a-Glance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadarChart tools={toolsForVisual} metrics={metrics} />
            <div className="space-y-4">
              <h4 className="font-medium">Quick Scores</h4>
              {toolsForVisual.map((tool, index) => (
                <div key={tool.id} className="space-y-2">
                  <h5 className="font-medium text-sm">{tool.name}</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(tool.scores).map(([metric, score]) => (
                      <ScoreBadge
                        key={metric}
                        score={score}
                        metric={metric}
                        tool={tool.name}
                        evidence={{
                          inputs: [`Based on ${metric} analysis`],
                          updated: 'Recently'
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILED COMPARISON - Progressive disclosure */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="key-differences">Key Differences</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="full-details">Full Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="key-differences" className="mt-6">
            <KeyDifferencesTable tool1={tool1} tool2={tool2} />
          </TabsContent>
          
          <TabsContent value="pricing" className="mt-6">
            <PricingComparison tool1={tool1} tool2={tool2} />
          </TabsContent>
          
          <TabsContent value="technical" className="mt-6">
            <TechnicalComparison tool1={tool1} tool2={tool2} />
          </TabsContent>
          
          <TabsContent value="full-details" className="mt-6">
            <FullComparison tool1={tool1} tool2={tool2} />
          </TabsContent>
        </Tabs>

        {/* FOOTER CTAs - Aligned with recommendations */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Button 
            size="lg"
            variant={verdict.winner === tool1.name ? "default" : "outline"}
            onClick={() => window.open(tool1.websiteUrl)}
            className="flex-1"
          >
            {verdict.winner === tool1.name && "✓ Recommended: "}
            Visit {tool1.name}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg"
            variant={verdict.winner === tool2.name ? "default" : "outline"}
            onClick={() => window.open(tool2.websiteUrl)}
            className="flex-1"
          >
            {verdict.winner === tool2.name && "✓ Recommended: "}
            Visit {tool2.name}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
  )
}

// Helper components
const KeyDifferencesTable = ({ tool1, tool2 }: { tool1: ToolData, tool2: ToolData }) => {
  const differences = [
    {
      metric: 'Pricing',
      tool1Value: tool1.pricing || 'Not specified',
      tool2Value: tool2.pricing || 'Not specified',
      tool1Better: tool1.pricing?.toLowerCase().includes('free') && !tool2.pricing?.toLowerCase().includes('free')
    },
    {
      metric: 'Open Source',
      tool1Value: tool1.openSource ? 'Yes' : 'No',
      tool2Value: tool2.openSource ? 'Yes' : 'No',
      tool1Better: tool1.openSource && !tool2.openSource
    },
    {
      metric: 'Ease of Use',
      tool1Value: tool1.easeOfUse || 'Not specified',
      tool2Value: tool2.easeOfUse || 'Not specified',
      tool1Better: tool1.easeOfUse === 'Easy' && tool2.easeOfUse !== 'Easy'
    },
    {
      metric: 'Documentation',
      tool1Value: tool1.documentation || 'Not specified',
      tool2Value: tool2.documentation || 'Not specified',
      tool1Better: tool1.documentation === 'High' && tool2.documentation !== 'High'
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Key Differences</h2>
      <div className="space-y-3">
        {differences.map((diff, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">{diff.metric}</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-center ${diff.tool1Better ? 'text-green-600' : ''}`}>
                <p className="text-sm font-medium">{tool1.name}</p>
                <p className="text-sm">{diff.tool1Value}</p>
                {diff.tool1Better && <CheckCircle className="h-4 w-4 mx-auto mt-1 text-green-600" />}
              </div>
              <div className="text-gray-400">vs</div>
              <div className={`text-center ${!diff.tool1Better && diff.tool2Value !== diff.tool1Value ? 'text-green-600' : ''}`}>
                <p className="text-sm font-medium">{tool2.name}</p>
                <p className="text-sm">{diff.tool2Value}</p>
                {!diff.tool1Better && diff.tool2Value !== diff.tool1Value && <CheckCircle className="h-4 w-4 mx-auto mt-1 text-green-600" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PricingComparison = ({ tool1, tool2 }: { tool1: ToolData, tool2: ToolData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Pricing Comparison</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {tool1.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Pricing Model</span>
                <Badge>{tool1.pricing || 'Not specified'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Free Tier</span>
                {tool1.pricing?.toLowerCase().includes('free') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {tool2.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Pricing Model</span>
                <Badge>{tool2.pricing || 'Not specified'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Free Tier</span>
                {tool2.pricing?.toLowerCase().includes('free') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const TechnicalComparison = ({ tool1, tool2 }: { tool1: ToolData, tool2: ToolData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {tool1.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Open Source</span>
                <span>{tool1.openSource ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Ease of Use</span>
                <Badge variant={tool1.easeOfUse === 'Easy' ? 'default' : 'secondary'}>
                  {tool1.easeOfUse || 'Not specified'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Reliability</span>
                <Badge variant={tool1.reliability === 'High' ? 'default' : 'secondary'}>
                  {tool1.reliability || 'Not specified'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {tool2.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Open Source</span>
                <span>{tool2.openSource ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Ease of Use</span>
                <Badge variant={tool2.easeOfUse === 'Easy' ? 'default' : 'secondary'}>
                  {tool2.easeOfUse || 'Not specified'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Reliability</span>
                <Badge variant={tool2.reliability === 'High' ? 'default' : 'secondary'}>
                  {tool2.reliability || 'Not specified'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const FullComparison = ({ tool1, tool2 }: { tool1: ToolData, tool2: ToolData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Full Comparison</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{tool1.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tool1.description || 'No description available'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {tool1.features?.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  )) || <span className="text-sm text-gray-500">No features listed</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tool2.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tool2.description || 'No description available'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {tool2.features?.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  )) || <span className="text-sm text-gray-500">No features listed</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
