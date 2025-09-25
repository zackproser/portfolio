'use client'

import React, { useState } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, DollarSign, Code, Star, ExternalLink, Github, Users, BookOpen, Zap } from 'lucide-react'
import Link from 'next/link'
import { getScalableToolData, compareScalableTools, generateObjectiveRecommendation } from '@/lib/scalable-comparison-data'
import { VisualScoreCard } from '@/components/VisualScoreCard'
import { MobileComparisonView } from '@/components/MobileComparisonView'
import { ProgressiveDisclosure, useProgressiveDisclosure } from '@/components/ProgressiveDisclosure'
import { ComparisonPageSkeleton } from '@/components/comparison-page-skeleton'

const ScalableComparisonLayout = ({ tool1, tool2, comparison }) => {
  const [selectedScenario, setSelectedScenario] = useState('startup')
  const { level, setLevel, expandedSections, toggleSection } = useProgressiveDisclosure()

  if (!comparison) {
    return (
      <SimpleLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Comparison Not Available</h1>
          <p className="text-gray-600 dark:text-gray-300">
            We don&apos;t have comparison data for these tools yet.
          </p>
        </div>
      </SimpleLayout>
    )
  }

  const { tool1: tool1Data, tool2: tool2Data, comparison: comparisonData } = comparison

  // Prepare data for visual components
  const toolsForVisual = [
    {
      id: tool1.id,
      name: tool1.name,
      logoUrl: tool1.logoUrl,
      pricing: tool1Data.pricing,
      technical: tool1Data.technical,
      community: tool1Data.community,
      documentation: tool1Data.documentation,
      scores: {
        pricing: tool1Data.pricing.freeTier ? 8 : 5,
        ease: tool1Data.technical.setupComplexity === 'Low' ? 8 : 5,
        documentation: tool1Data.documentation.quality === 'High' ? 8 : 5,
        community: tool1Data.community.githubStars > 1000 ? 8 : 5,
        reliability: tool1Data.technical.openSource ? 8 : 5
      }
    },
    {
      id: tool2.id,
      name: tool2.name,
      logoUrl: tool2.logoUrl,
      pricing: tool2Data.pricing,
      technical: tool2Data.technical,
      community: tool2Data.community,
      documentation: tool2Data.documentation,
      scores: {
        pricing: tool2Data.pricing.freeTier ? 8 : 5,
        ease: tool2Data.technical.setupComplexity === 'Low' ? 8 : 5,
        documentation: tool2Data.documentation.quality === 'High' ? 8 : 5,
        community: tool2Data.community.githubStars > 1000 ? 8 : 5,
        reliability: tool2Data.technical.openSource ? 8 : 5
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
    <SimpleLayout>
      {/* Mobile View */}
      <MobileComparisonView tools={toolsForVisual} />

      {/* Desktop View */}
      <div className="hidden lg:block">
        {/* Hero Section - Objective Comparison */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {tool1.name} vs {tool2.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Objective comparison based on measurable data: pricing, technical specs, community activity, and documentation.
            </p>
          </div>

          {/* Visual Score Card */}
          <div className="mb-12">
            <VisualScoreCard tools={toolsForVisual} metrics={metrics} />
          </div>

          {/* Quick Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={tool1.logoUrl} alt={tool1.name} className="h-6 w-6" />
                  {tool1.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pricing</span>
                    <Badge variant={tool1Data.pricing.freeTier ? "default" : "secondary"}>
                      {tool1Data.pricing.model}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Setup</span>
                    <Badge variant={tool1Data.technical.setupComplexity === 'Low' ? "default" : "secondary"}>
                      {tool1Data.technical.setupComplexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Open Source</span>
                    <span className="text-sm">{tool1Data.technical.openSource ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GitHub Stars</span>
                    <span className="text-sm">{tool1Data.community.githubStars?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={tool2.logoUrl} alt={tool2.name} className="h-6 w-6" />
                  {tool2.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pricing</span>
                    <Badge variant={tool2Data.pricing.freeTier ? "default" : "secondary"}>
                      {tool2Data.pricing.model}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Setup</span>
                    <Badge variant={tool2Data.technical.setupComplexity === 'Low' ? "default" : "secondary"}>
                      {tool2Data.technical.setupComplexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Open Source</span>
                    <span className="text-sm">{tool2Data.technical.openSource ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GitHub Stars</span>
                    <span className="text-sm">{tool2Data.community.githubStars?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Detailed Comparison Tabs */}
      <Tabs defaultValue="pricing" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          <PricingComparison tool1={tool1Data} tool2={tool2Data} comparison={comparisonData.pricing} />
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <TechnicalComparison tool1={tool1Data} tool2={tool2Data} comparison={comparisonData.technical} />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <CommunityComparison tool1={tool1Data} tool2={tool2Data} comparison={comparisonData.community} />
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <DocumentationComparison tool1={tool1Data} tool2={tool2Data} comparison={comparisonData.documentation} />
        </TabsContent>
      </Tabs>

      {/* Use Case Recommendations */}
      <UseCaseRecommendations tool1={tool1Data} tool2={tool2Data} selectedScenario={selectedScenario} onScenarioSelect={setSelectedScenario} />

        {/* Next Steps */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-xl">Ready to get started?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Try {tool1.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {tool1Data.pricing.freeTier ? 'Free tier available' : 'Paid service'}
                </p>
                <Button asChild className="w-full">
                  <Link href={tool1Data.websiteUrl} target="_blank">
                    Visit {tool1.name}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Try {tool2.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {tool2Data.pricing.freeTier ? 'Free tier available' : 'Paid service'}
                </p>
                <Button asChild className="w-full">
                  <Link href={tool2Data.websiteUrl} target="_blank">
                    Visit {tool2.name}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimpleLayout>
  )
}

// Helper components
const PricingComparison = ({ tool1, tool2, comparison }) => {
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
                <span>Model</span>
                <Badge>{tool1.pricing.model}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Free Tier</span>
                {tool1.pricing.freeTier ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              {tool1.pricing.startingPrice && (
                <div className="flex justify-between">
                  <span>Starting Price</span>
                  <span className="text-sm">{tool1.pricing.startingPrice}</span>
                </div>
              )}
              {tool1.pricing.pricingDetails && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tool1.pricing.pricingDetails}
                </div>
              )}
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
                <span>Model</span>
                <Badge>{tool2.pricing.model}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Free Tier</span>
                {tool2.pricing.freeTier ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              {tool2.pricing.startingPrice && (
                <div className="flex justify-between">
                  <span>Starting Price</span>
                  <span className="text-sm">{tool2.pricing.startingPrice}</span>
                </div>
              )}
              {tool2.pricing.pricingDetails && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tool2.pricing.pricingDetails}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const TechnicalComparison = ({ tool1, tool2, comparison }) => {
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
                <span>{tool1.technical.openSource ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>API Access</span>
                <span>{tool1.technical.apiAccess ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>License</span>
                <span className="text-sm">{tool1.technical.license || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Setup Complexity</span>
                <Badge variant={tool1.technical.setupComplexity === 'Low' ? 'default' : 'secondary'}>
                  {tool1.technical.setupComplexity}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Languages:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tool1.technical.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
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
                <span>{tool2.technical.openSource ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>API Access</span>
                <span>{tool2.technical.apiAccess ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>License</span>
                <span className="text-sm">{tool2.technical.license || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Setup Complexity</span>
                <Badge variant={tool2.technical.setupComplexity === 'Low' ? 'default' : 'secondary'}>
                  {tool2.technical.setupComplexity}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Languages:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tool2.technical.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const CommunityComparison = ({ tool1, tool2, comparison }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Community Activity</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {tool1.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>GitHub Stars</span>
                <span>{tool1.community.githubStars?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Forks</span>
                <span>{tool1.community.githubForks?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Open Issues</span>
                <span>{tool1.community.githubIssues?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Release Frequency</span>
                <Badge variant={tool1.community.releaseFrequency === 'High' ? 'default' : 'secondary'}>
                  {tool1.community.releaseFrequency}
                </Badge>
              </div>
              {tool1.community.lastCommit && (
                <div className="flex justify-between">
                  <span>Last Commit</span>
                  <span className="text-sm">{tool1.community.lastCommit}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {tool2.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>GitHub Stars</span>
                <span>{tool2.community.githubStars?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Forks</span>
                <span>{tool2.community.githubForks?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Open Issues</span>
                <span>{tool2.community.githubIssues?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Release Frequency</span>
                <Badge variant={tool2.community.releaseFrequency === 'High' ? 'default' : 'secondary'}>
                  {tool2.community.releaseFrequency}
                </Badge>
              </div>
              {tool2.community.lastCommit && (
                <div className="flex justify-between">
                  <span>Last Commit</span>
                  <span className="text-sm">{tool2.community.lastCommit}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const DocumentationComparison = ({ tool1, tool2, comparison }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Documentation Quality</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {tool1.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Has Documentation</span>
                {tool1.documentation.hasDocs ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Documentation Pages</span>
                <span>{tool1.documentation.docPages || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Has Tutorials</span>
                {tool1.documentation.hasTutorials ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Has Examples</span>
                {tool1.documentation.hasExamples ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Quality</span>
                <Badge variant={tool1.documentation.quality === 'High' ? 'default' : 'secondary'}>
                  {tool1.documentation.quality}
                </Badge>
              </div>
              {tool1.documentation.lastUpdated && (
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span className="text-sm">{tool1.documentation.lastUpdated}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {tool2.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Has Documentation</span>
                {tool2.documentation.hasDocs ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Documentation Pages</span>
                <span>{tool2.documentation.docPages || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Has Tutorials</span>
                {tool2.documentation.hasTutorials ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Has Examples</span>
                {tool2.documentation.hasExamples ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex justify-between">
                <span>Quality</span>
                <Badge variant={tool2.documentation.quality === 'High' ? 'default' : 'secondary'}>
                  {tool2.documentation.quality}
                </Badge>
              </div>
              {tool2.documentation.lastUpdated && (
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span className="text-sm">{tool2.documentation.lastUpdated}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const UseCaseRecommendations = ({ tool1, tool2, selectedScenario, onScenarioSelect }) => {
  const scenarios = [
    {
      id: 'startup',
      title: 'Startup MVP',
      description: 'Fast development with limited budget',
      criteria: ['Free tier', 'Easy setup', 'Good docs']
    },
    {
      id: 'enterprise',
      title: 'Enterprise Production',
      description: 'Reliable, scalable, well-supported',
      criteria: ['Established company', 'Many integrations', 'High-quality docs']
    },
    {
      id: 'learning',
      title: 'Learning & Experimentation',
      description: 'Understanding AI development',
      criteria: ['Open source', 'Free tier', 'Active community']
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Use Case Recommendations</h2>
      <div className="grid gap-4">
        {scenarios.map((scenario) => {
          const recommendation = generateObjectiveRecommendation(tool1, tool2, scenario.id)
          return (
            <Card 
              key={scenario.id} 
              className={`cursor-pointer transition-all ${
                selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
              onClick={() => onScenarioSelect(scenario.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{scenario.description}</p>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Criteria:</p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.criteria.map((criterion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {criterion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {recommendation && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {recommendation.name} recommended
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Based on objective criteria
                        </span>
                      </div>
                    )}
                  </div>
                  {recommendation && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ScalableComparisonLayout
