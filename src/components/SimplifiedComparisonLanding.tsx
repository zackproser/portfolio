'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Tool } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  Star,
  Code,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Database,
  ChevronRight,
  Sparkles,
  Filter,
  Lightbulb
} from 'lucide-react'
import { nameToSlug } from '@/utils/slug-helpers'
import { getValidComparisons, getComparisonCategory, COMPARISON_CATEGORIES } from '@/lib/comparison-categories'
import { GuidedComparisonFlow } from '@/components/GuidedComparisonFlow'

interface SimplifiedComparisonLandingProps {
  tools: Tool[]
}

export function SimplifiedComparisonLanding({ tools }: SimplifiedComparisonLandingProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [showGuidedFlow, setShowGuidedFlow] = useState(false)

  // Get valid comparisons
  const validComparisons = useMemo(() => {
    return getValidComparisons(tools)
  }, [tools])

  // Get comparison categories
  const comparisonCategories = useMemo(() => {
    const categoryMap = new Map()
    
    tools.forEach(tool => {
      const compCategory = getComparisonCategory(tool.category)
      if (compCategory) {
        if (!categoryMap.has(compCategory.id)) {
          categoryMap.set(compCategory.id, {
            ...compCategory,
            tools: []
          })
        }
        categoryMap.get(compCategory.id).tools.push(tool)
      }
    })
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [tools])

  // Get popular comparisons (only 6 for cleaner look)
  const popularComparisons = useMemo(() => {
    const categoryGroups = new Map()
    
    validComparisons.forEach(({ tool1, tool2 }) => {
      const category1 = getComparisonCategory(tool1.category)
      const category2 = getComparisonCategory(tool2.category)
      const categoryKey = category1?.id || category2?.id || 'other'
      
      if (!categoryGroups.has(categoryKey)) {
        categoryGroups.set(categoryKey, [])
      }
      categoryGroups.get(categoryKey).push({ tool1, tool2 })
    })
    
    const popular = []
    for (const [categoryKey, comparisons] of categoryGroups) {
      const category = comparisonCategories.find(c => c.id === categoryKey)
      if (category && comparisons.length > 0) {
        popular.push({
          ...comparisons[0],
          category: category.name,
          categoryId: categoryKey
        })
      }
    }
    
    return popular.slice(0, 6)
  }, [validComparisons, comparisonCategories])

  // Handle search with debouncing
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleDirectComparison = (searchTerm: string) => {
    // Simple search for two tools
    const words = searchTerm.toLowerCase().split(/\s+(?:vs|versus|compared?)\s+/)
    if (words.length === 2) {
      const tool1Name = words[0].trim()
      const tool2Name = words[1].trim()
      
      // Find tools by name
      const tool1 = tools.find(t => t.name.toLowerCase().includes(tool1Name))
      const tool2 = tools.find(t => t.name.toLowerCase().includes(tool2Name))
      
      if (tool1 && tool2) {
        const tool1Slug = nameToSlug(tool1.name)
        const tool2Slug = nameToSlug(tool2.name)
        router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
      }
    }
  }

  const handlePopularComparison = (tool1: Tool, tool2: Tool) => {
    const tool1Slug = nameToSlug(tool1.name)
    const tool2Slug = nameToSlug(tool2.name)
    router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/comparisons?category=${categoryId}`)
  }

  const getToolIcon = (tool: Tool) => {
    if (tool.openSource) return <Code className="h-4 w-4 text-green-600" />
    if (tool.pricing && tool.pricing.toLowerCase().includes('free')) return <DollarSign className="h-4 w-4 text-blue-600" />
    return <Zap className="h-4 w-4 text-purple-600" />
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'llm-apis': return <Zap className="h-5 w-5" />
      case 'coding-assistants': return <Code className="h-5 w-5" />
      case 'vector-databases': return <Database className="h-5 w-5" />
      case 'ai-frameworks': return <BookOpen className="h-5 w-5" />
      default: return <Star className="h-5 w-5" />
    }
  }

  // Show guided workflow if toggled
  if (showGuidedFlow) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Guided Tool Comparison</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowGuidedFlow(false)}
          >
            ← Back to Browse
          </Button>
        </div>
        <GuidedComparisonFlow 
          tools={tools} 
          onComplete={(selectedTools) => {
            if (selectedTools.length >= 2) {
              const tool1Slug = nameToSlug(selectedTools[0].name)
              const tool2Slug = nameToSlug(selectedTools[1].name)
              router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clear purpose and action */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find the Perfect AI Development Tool
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Objective, data-driven comparisons to help you decide
        </p>
        
        {/* Search bar for direct comparisons */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Compare two tools (e.g., 'GitHub Copilot vs Cursor')"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDirectComparison(searchTerm)
                }
              }}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        {/* Two clear CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => setShowGuidedFlow(true)}
          >
            🎯 Find Tools by Use Case
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-4 text-lg font-semibold border-2"
            onClick={() => {
              const element = document.getElementById('categories')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            📊 Browse All Categories
          </Button>
        </div>
      </section>

      {/* Most Popular - Only 6 cards */}
      <section className="py-12 container mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Most Popular Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularComparisons.map((comparison, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => handlePopularComparison(comparison.tool1, comparison.tool2)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                      {getToolIcon(comparison.tool1)}
                    </div>
                    <span className="font-semibold text-sm">{comparison.tool1.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">⚡</span>
                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{comparison.tool2.name}</span>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50">
                      {getToolIcon(comparison.tool2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    🔥 {comparison.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <span className="text-xs font-medium">Compare now</span>
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse by Use Case - Simplified cards, no stats */}
      <section id="categories" className="py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Browse by Use Case</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparisonCategories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white dark:bg-gray-800 border-2 hover:border-blue-300 dark:hover:border-blue-600"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-purple-800/70 transition-all duration-200">
                      {getCategoryIcon(category.id)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{category.tools.length} tools</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {category.useCases.slice(0, 2).map((useCase: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                    Explore {category.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
