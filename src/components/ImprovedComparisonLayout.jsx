'use client'

import React, { useState } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, DollarSign, Users, Code, Zap, AlertTriangle, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { getEnhancedToolData, compareTools } from '@/lib/comparison-data-enhancer'

const ImprovedComparisonLayout = ({ tool1, tool2 }) => {
  const [selectedScenario, setSelectedScenario] = useState(null)

  // Get enhanced comparison data
  const comparison = compareTools(tool1.id, tool2.id)
  
  if (!comparison) {
    return (
      <SimpleLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Comparison Not Available</h1>
          <p className="text-gray-600 dark:text-gray-300">
            We don&apos;t have detailed comparison data for these tools yet.
          </p>
        </div>
      </SimpleLayout>
    )
  }

  const { tool1: tool1Data, tool2: tool2Data, comparison: comparisonData } = comparison
  const winner = comparisonData.winner

  return (
    <SimpleLayout>
      {/* Hero Section - Quick Decision */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {tool1.name} vs {tool2.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Which AI development tool should you choose? Here&apos;s the honest comparison based on real usage.
          </p>
        </div>

        {/* Winner Recommendation */}
        <Card className="mb-8 border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl">Our Recommendation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Choose {winner.name} if you need:
                </h3>
                <ul className="space-y-2 mb-4">
                  {winner.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={winner.websiteUrl} target="_blank">
                      Get Started with {winner.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/devtools/detail/${winner.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <span className="text-sm text-gray-600">Setup Time</span>
                  <span className="text-sm">{tool1Data.setup.timeToValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Best For</span>
                  <span className="text-sm">{tool1Data.bestFor[0]}</span>
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
                  <span className="text-sm text-gray-600">Setup Time</span>
                  <span className="text-sm">{tool2Data.setup.timeToValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Best For</span>
                  <span className="text-sm">{tool2Data.bestFor[0]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Comparison Tabs */}
      <Tabs defaultValue="scenarios" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Use Cases</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="honest">Honest Take</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="mt-6">
          <UseCaseScenarios 
            tool1={tool1Data} 
            tool2={tool2Data} 
            selectedScenario={selectedScenario}
            onScenarioSelect={setSelectedScenario}
          />
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <PricingComparison tool1={tool1Data} tool2={tool2Data} />
        </TabsContent>

        <TabsContent value="setup" className="mt-6">
          <SetupComparison tool1={tool1Data} tool2={tool2Data} />
        </TabsContent>

        <TabsContent value="honest" className="mt-6">
          <HonestAssessment tool1={tool1Data} tool2={tool2Data} />
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-xl">Ready to get started?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Start with {winner.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {winner.recommendation}
              </p>
              <Button asChild className="w-full">
                <Link href={winner.websiteUrl} target="_blank">
                  Get Started Now
                </Link>
              </Button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Need help deciding?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Check out our detailed guides and tutorials for both tools.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/devtools">
                  Browse All Tools
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SimpleLayout>
  )
}

// Helper components
const UseCaseScenarios = ({ tool1, tool2, selectedScenario, onScenarioSelect }) => {
  const scenarios = [
    {
      id: 'startup',
      title: 'Building a Startup MVP',
      description: 'You need to ship fast with limited resources',
      winner: tool1,
      reasoning: 'Based on setup complexity and time to value'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Production System',
      description: 'You need reliability, security, and support',
      winner: tool2,
      reasoning: 'Based on enterprise features and support'
    },
    {
      id: 'learning',
      title: 'Learning AI Development',
      description: 'You want to understand how AI tools work',
      winner: tool1.pricing.freeTier ? tool1 : tool2,
      reasoning: 'Based on free tier availability and learning resources'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">When to use each tool</h2>
      <div className="grid gap-4">
        {scenarios.map((scenario) => (
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
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {scenario.winner.name} wins
                    </Badge>
                    <span className="text-sm text-gray-600">{scenario.reasoning}</span>
                  </div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const PricingComparison = ({ tool1, tool2 }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Real Pricing Comparison</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {tool1.name} Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Model</span>
                <Badge>{tool1.pricing.model}</Badge>
              </div>
              {tool1.pricing.freeTier && (
                <div className="flex justify-between">
                  <span>Free Tier</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
              {tool1.pricing.startingPrice && (
                <div className="flex justify-between">
                  <span>Starting Price</span>
                  <span>{tool1.pricing.startingPrice}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {tool2.name} Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Model</span>
                <Badge>{tool2.pricing.model}</Badge>
              </div>
              {tool2.pricing.freeTier && (
                <div className="flex justify-between">
                  <span>Free Tier</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
              {tool2.pricing.startingPrice && (
                <div className="flex justify-between">
                  <span>Starting Price</span>
                  <span>{tool2.pricing.startingPrice}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const SetupComparison = ({ tool1, tool2 }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Setup Complexity</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {tool1.name} Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Complexity</span>
                <Badge variant={tool1.setup.complexity === 'Easy' ? 'default' : 'secondary'}>
                  {tool1.setup.complexity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Time to Value</span>
                <span>{tool1.setup.timeToValue}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Requirements:</span>
                <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {tool1.setup.requirements.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {tool2.name} Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Complexity</span>
                <Badge variant={tool2.setup.complexity === 'Easy' ? 'default' : 'secondary'}>
                  {tool2.setup.complexity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Time to Value</span>
                <span>{tool2.setup.timeToValue}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Requirements:</span>
                <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {tool2.setup.requirements.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const HonestAssessment = ({ tool1, tool2 }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Honest Assessment</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {tool1.name} - The Good & Bad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">What it does well:</h4>
                <ul className="space-y-1">
                  {tool1.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">What it struggles with:</h4>
                <ul className="space-y-1">
                  {tool1.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Avoid when:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{tool1.avoidWhen}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {tool2.name} - The Good & Bad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">What it does well:</h4>
                <ul className="space-y-1">
                  {tool2.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">What it struggles with:</h4>
                <ul className="space-y-1">
                  {tool2.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Avoid when:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{tool2.avoidWhen}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default ImprovedComparisonLayout
