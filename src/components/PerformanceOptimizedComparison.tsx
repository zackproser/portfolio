'use client'

import React, { memo, useMemo, useCallback, Suspense, lazy } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ComparisonPageSkeleton, LoadingSpinner } from '@/components/ComparisonLoadingStates'

// Lazy load heavy components
const VisualScoreCard = lazy(() => import('@/components/VisualScoreCard').then(module => ({ default: module.VisualScoreCard })))
const MobileComparisonView = lazy(() => import('@/components/MobileComparisonView').then(module => ({ default: module.MobileComparisonView })))
const RadarChart = lazy(() => import('@/components/RadarChart').then(module => ({ default: module.RadarChart })))

interface PerformanceOptimizedComparisonProps {
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
    scores: Record<string, number>
  }>
  metrics: Array<{
    id: string
    name: string
    weight: number
  }>
}

// Memoized tool card component
const ToolCard = memo(({ tool }: { tool: any }) => {
  const getScoreColor = useCallback((score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }, [])

  const calculateScore = useCallback((tool: any) => {
    let score = 0
    let factors = 0

    if (tool.pricing.freeTier) score += 2
    factors += 2

    if (tool.technical.openSource) score += 2
    if (tool.technical.setupComplexity === 'Low') score += 2
    factors += 4

    if (tool.community.githubStars && tool.community.githubStars > 1000) score += 1
    if (tool.community.releaseFrequency === 'High') score += 3
    factors += 4

    if (tool.documentation.hasDocs) score += 1
    if (tool.documentation.quality === 'High') score += 1
    factors += 2

    return Math.round((score / factors) * 10)
  }, [])

  const score = calculateScore(tool)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {tool.logoUrl && (
            <img 
              src={tool.logoUrl} 
              alt={tool.name} 
              className="h-8 w-8 rounded-lg"
              loading="lazy"
            />
          )}
          <CardTitle className="text-lg">{tool.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall Score</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreColor(score)}`}>
              <span className="text-white font-bold">{score}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Free Tier:</span>
              <span className={tool.pricing.freeTier ? 'text-green-600' : 'text-red-600'}>
                {tool.pricing.freeTier ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Open Source:</span>
              <span className={tool.technical.openSource ? 'text-green-600' : 'text-red-600'}>
                {tool.technical.openSource ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {tool.pricing.model}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {tool.technical.setupComplexity} Setup
            </Badge>
            {tool.community.githubStars && (
              <Badge variant="outline" className="text-xs">
                {tool.community.githubStars.toLocaleString()} stars
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ToolCard.displayName = 'ToolCard'

// Memoized comparison table
const ComparisonTable = memo(({ tools, metrics }: { tools: any[], metrics: any[] }) => {
  const tableData = useMemo(() => {
    return metrics.map(metric => ({
      metric: metric.name,
      tool1Score: tools[0]?.scores[metric.id] || 0,
      tool2Score: tools[1]?.scores[metric.id] || 0,
      winner: tools[0]?.scores[metric.id] > tools[1]?.scores[metric.id] ? tools[0].name : tools[1].name
    }))
  }, [tools, metrics])

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Metric</th>
            <th className="text-center p-3">{tools[0]?.name}</th>
            <th className="text-center p-3">{tools[1]?.name}</th>
            <th className="text-center p-3">Winner</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-3 font-medium">{row.metric}</td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  <span className="font-bold text-lg">{row.tool1Score}</span>
                  <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(row.tool1Score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  <span className="font-bold text-lg">{row.tool2Score}</span>
                  <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(row.tool2Score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <Badge variant={row.winner === tools[0]?.name ? 'default' : 'secondary'}>
                  {row.winner}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

ComparisonTable.displayName = 'ComparisonTable'

// Main performance-optimized comparison component
export function PerformanceOptimizedComparison({ tools, metrics }: PerformanceOptimizedComparisonProps) {
  // Memoize expensive calculations
  const processedTools = useMemo(() => {
    return tools.map(tool => ({
      ...tool,
      // Pre-calculate scores for better performance
      overallScore: Object.values(tool.scores).reduce((sum, score) => sum + score, 0) / Object.keys(tool.scores).length
    }))
  }, [tools])

  const sortedTools = useMemo(() => {
    return [...processedTools].sort((a, b) => b.overallScore - a.overallScore)
  }, [processedTools])

  const handleToolClick = useCallback((toolId: string) => {
    // Handle tool selection with debouncing
    console.log('Tool selected:', toolId)
  }, [])

  return (
    <div className="space-y-8">
      {/* Mobile View with Lazy Loading */}
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        {/* <MobileComparisonView tools={processedTools} /> */}
      </Suspense>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-8">
        {/* Visual Score Card with Lazy Loading */}
        <Suspense fallback={<ComparisonPageSkeleton />}>
          <VisualScoreCard tools={processedTools} metrics={metrics} />
        </Suspense>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* {sortedTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool}
              onClick={() => handleToolClick(tool.id)}
            />
          ))} */}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <ComparisonTable tools={processedTools} metrics={metrics} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Radar Chart with Lazy Loading */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <RadarChart 
                tools={processedTools.map(tool => ({
                  id: tool.id,
                  name: tool.name,
                  scores: tool.scores
                }))} 
                metrics={metrics}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0
  })

  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      setMetrics(prev => ({
        ...prev,
        renderTime: endTime - startTime
      }))
    }
  }, [])

  return metrics
}

// Debounced search hook for better performance
export function useDebouncedSearch(searchTerm: string, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = React.useState(searchTerm)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, delay])

  return debouncedValue
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(items: any[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleItems = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight), items.length)
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }))
  }, [items, scrollTop, itemHeight, containerHeight])

  return {
    visibleItems,
    setScrollTop,
    totalHeight: items.length * itemHeight
  }
}
