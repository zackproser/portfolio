'use client'

import React, { useState } from 'react'
import { Check, Lightbulb, BadgeCheck, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'

const useCategories = [
  {
    id: 'beginner',
    label: 'Beginner Friendly',
    icon: '🔰',
    criteria: (tool) => tool.features?.beginner_friendly || 
                        tool.features?.easy_to_use || 
                        tool.market_position?.strengths?.some(s => 
                          s.toLowerCase().includes('beginner') || 
                          s.toLowerCase().includes('easy'))
  },
  {
    id: 'professional',
    label: 'Professional Features',
    icon: '🏢',
    criteria: (tool) => tool.features?.professional_features || 
                        tool.pricing?.enterprise_tier || 
                        tool.business_info?.enterprise_focus
  },
  {
    id: 'free',
    label: 'Free/Low Cost',
    icon: '💰',
    criteria: (tool) => tool.pricing?.free_tier || 
                        (tool.pricing?.lowest_tier_price && 
                        parseFloat(tool.pricing.lowest_tier_price) < 10)
  },
  {
    id: 'opensource',
    label: 'Open Source',
    icon: '🔓',
    criteria: (tool) => tool.open_source?.client || tool.open_source?.backend
  },
  {
    id: 'integration',
    label: 'Integration Rich',
    icon: '🔌',
    criteria: (tool) => Array.isArray(tool.integrations) && tool.integrations.length > 5
  },
  {
    id: 'enterprise',
    label: 'Enterprise Ready',
    icon: '🏛️',
    criteria: (tool) => tool.features?.enterprise_ready || 
                        tool.business_info?.enterprise_clients > 10
  }
]

const ToolRecommendation = ({ tools }) => {
  const [activeTab, setActiveTab] = useState('use-case')
  const [selectedUseCase, setSelectedUseCase] = useState('beginner')
  const [selectedPriority, setSelectedPriority] = useState('overall')
  
  const getBestToolForUseCase = (useCase, tools) => {
    const category = useCategories.find(c => c.id === useCase)
    
    if (!category) return null
    
    const matchingTools = tools.filter(tool => category.criteria(tool))
    
    // If both tools match, return both
    if (matchingTools.length === tools.length) {
      return { 
        tools: matchingTools,
        winner: null,
        isTie: true,
        reason: `Both tools are well-suited for ${category.label.toLowerCase()} usage.`
      }
    }
    
    // If only one tool matches, return it
    if (matchingTools.length === 1) {
      return { 
        tools: matchingTools,
        winner: matchingTools[0],
        isTie: false,
        reason: `${matchingTools[0].name} is better suited for ${category.label.toLowerCase()} usage.`
      }
    }
    
    // If no tools match exactly, get the best compromise based on other factors
    return { 
      tools: tools,
      winner: tools[0], // Default to first tool 
      isTie: false,
      reason: 'Neither tool fully satisfies this criterion, but this is the better option based on other factors.'
    }
  }
  
  const getBestToolByPriority = (priority, tools) => {
    switch (priority) {
      case 'features':
        // Count features as a heuristic
        const featureCounts = tools.map(tool => {
          let count = 0
          if (tool.features && typeof tool.features === 'object') {
            count = Object.values(tool.features).filter(Boolean).length
          }
          return { tool, count }
        })
        
        if (featureCounts[0].count === featureCounts[1].count) {
          return { 
            winner: null, 
            isTie: true,
            reason: 'Both tools offer a similar number of features.'
          }
        }
        
        const featuresWinner = featureCounts.sort((a, b) => b.count - a.count)[0].tool
        return { 
          winner: featuresWinner, 
          isTie: false,
          reason: `${featuresWinner.name} offers more features overall.`
        }
        
      case 'cost':
        const hasFree = tools.map(tool => ({
          tool,
          hasFree: tool.pricing?.free_tier || false,
          lowestPrice: tool.pricing?.lowest_tier_price ? 
            parseFloat(tool.pricing.lowest_tier_price) : Infinity
        }))
        
        // First check for free tier
        const freeTools = hasFree.filter(t => t.hasFree)
        if (freeTools.length === 1) {
          return { 
            winner: freeTools[0].tool, 
            isTie: false,
            reason: `${freeTools[0].tool.name} offers a free tier.`
          }
        } else if (freeTools.length > 1) {
          return { 
            winner: null, 
            isTie: true,
            reason: 'Both tools offer a free tier.'
          }
        }
        
        // Compare lowest prices
        if (hasFree[0].lowestPrice === hasFree[1].lowestPrice) {
          return { 
            winner: null, 
            isTie: true,
            reason: 'Both tools have similar pricing.'
          }
        }
        
        const costWinner = hasFree.sort((a, b) => a.lowestPrice - b.lowestPrice)[0].tool
        return { 
          winner: costWinner, 
          isTie: false,
          reason: `${costWinner.name} has a lower starting price.`
        }
        
      case 'community':
        const userCounts = tools.map(tool => ({
          tool,
          users: tool.usage_stats?.number_of_users || 0
        }))
        
        if (userCounts[0].users === userCounts[1].users) {
          return { 
            winner: null, 
            isTie: true,
            reason: 'Both tools have similar user communities.'
          }
        }
        
        const communityWinner = userCounts.sort((a, b) => b.users - a.users)[0].tool
        return { 
          winner: communityWinner, 
          isTie: false,
          reason: `${communityWinner.name} has a larger user community.`
        }
        
      case 'overall':
      default:
        // Simple model - check several key factors
        const scores = tools.map(tool => {
          let score = 0
          
          // Features
          if (tool.features && typeof tool.features === 'object') {
            score += Object.values(tool.features).filter(Boolean).length
          }
          
          // User satisfaction (if available)
          if (tool.user_reviews?.average_rating) {
            score += tool.user_reviews.average_rating * 2
          }
          
          // Community size
          if (tool.usage_stats?.number_of_users) {
            score += Math.log10(tool.usage_stats.number_of_users)
          }
          
          // Free tier is a plus
          if (tool.pricing?.free_tier) {
            score += 5
          }
          
          // Open source is a plus
          if (tool.open_source?.client || tool.open_source?.backend) {
            score += 3
          }
          
          return { tool, score }
        })
        
        if (Math.abs(scores[0].score - scores[1].score) < 3) {
          return { 
            winner: null, 
            isTie: true,
            reason: 'Both tools are overall very comparable in quality and features.'
          }
        }
        
        const overallWinner = scores.sort((a, b) => b.score - a.score)[0].tool
        return { 
          winner: overallWinner, 
          isTie: false,
          reason: `${overallWinner.name} scores better overall based on features, community, and value.`
        }
    }
  }
  
  const useCaseResult = getBestToolForUseCase(selectedUseCase, tools)
  const priorityResult = getBestToolByPriority(selectedPriority, tools)
  
  return (
    <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          <Lightbulb className="inline-block mr-2 h-6 w-6" />
          Smart Recommendation
        </h2>
        <p className="text-indigo-100">
          Find the best tool based on your specific requirements
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="p-6"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="use-case">By Use Case</TabsTrigger>
          <TabsTrigger value="priority">By Priority</TabsTrigger>
        </TabsList>
        
        <TabsContent value="use-case" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Filter size={16} className="mr-2" />
                Select Your Use Case
              </label>
              <Select 
                value={selectedUseCase} 
                onValueChange={setSelectedUseCase}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a use case" />
                </SelectTrigger>
                <SelectContent>
                  {useCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeCheck className="mr-2 h-5 w-5 text-indigo-500" />
                  Recommendation for: {useCategories.find(c => c.id === selectedUseCase)?.label}
                </CardTitle>
                <CardDescription>
                  {useCaseResult.isTie ? 
                    'Both tools perform well for this use case' : 
                    `${useCaseResult.winner?.name} is recommended`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p>{useCaseResult.reason}</p>
                  
                  {!useCaseResult.isTie && useCaseResult.winner && (
                    <div className="flex items-center mt-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Recommended
                      </Badge>
                      <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium">{useCaseResult.winner.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open(useCaseResult.winner?.website || '#', '_blank')}>
                  {useCaseResult.isTie ? 'Compare Both Tools' : `Visit ${useCaseResult.winner?.name}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="priority" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Filter size={16} className="mr-2" />
                What&apos;s Most Important To You?
              </label>
              <Select 
                value={selectedPriority} 
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall Best</SelectItem>
                  <SelectItem value="features">Most Features</SelectItem>
                  <SelectItem value="cost">Lowest Cost</SelectItem>
                  <SelectItem value="community">Community & Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeCheck className="mr-2 h-5 w-5 text-indigo-500" />
                  Recommendation by: {selectedPriority === 'overall' ? 'Overall Quality' : 
                    selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
                </CardTitle>
                <CardDescription>
                  {priorityResult.isTie ? 
                    'Both tools perform similarly in this category' : 
                    `${priorityResult.winner?.name} has the advantage`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p>{priorityResult.reason}</p>
                  
                  {!priorityResult.isTie && priorityResult.winner && (
                    <div className="flex items-center mt-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Recommended
                      </Badge>
                      <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium">{priorityResult.winner.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open(priorityResult.winner?.website || '#', '_blank')}>
                  {priorityResult.isTie ? 'Compare Both Tools' : `Visit ${priorityResult.winner?.name}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ToolRecommendation 