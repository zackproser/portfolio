'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tool } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  Star,
  Code,
  DollarSign,
  Filter,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  BookOpen,
  Database,
  Clock,
  Target,
  Lightbulb,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { nameToSlug } from '@/utils/slug-helpers'
import { getValidComparisons, getComparisonCategory, COMPARISON_CATEGORIES } from '@/lib/comparison-categories'

interface GoogleOptimizedComparisonSearchProps {
  tools: Tool[]
}

export function GoogleOptimizedComparisonSearch({ tools }: GoogleOptimizedComparisonSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTool1, setSelectedTool1] = useState<Tool | null>(null)
  const [selectedTool2, setSelectedTool2] = useState<Tool | null>(null)
  const [activeTab, setActiveTab] = useState('browse')

  // Handle URL parameters for direct comparisons
  useEffect(() => {
    const tool1Param = searchParams.get('tool1')
    const tool2Param = searchParams.get('tool2')
    
    if (tool1Param && tool2Param) {
      const tool1 = tools.find(t => nameToSlug(t.name) === tool1Param)
      const tool2 = tools.find(t => nameToSlug(t.name) === tool2Param)
      
      if (tool1 && tool2 && canCompareTools(tool1, tool2)) {
        setSelectedTool1(tool1)
        setSelectedTool2(tool2)
        setActiveTab('compare')
      }
    }
  }, [searchParams, tools])

  // Get valid comparisons
  const validComparisons = useMemo(() => {
    return getValidComparisons(tools)
  }, [tools])

  // Get comparison categories (not tool categories)
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

  // Get popular comparisons (actual valid comparisons)
  const popularComparisons = useMemo(() => {
    // Group by comparison category and pick the most relevant comparisons
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
    
    // Pick top comparisons from each category
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

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let filtered = tools

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.features?.some(feature => feature.toLowerCase().includes(term))
      )
    }

    if (selectedCategory !== 'all') {
      const compCategory = comparisonCategories.find(c => c.id === selectedCategory)
      if (compCategory) {
        filtered = filtered.filter(tool => {
          const toolCompCategory = getComparisonCategory(tool.category)
          return toolCompCategory?.id === compCategory.id
        })
      }
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [tools, searchTerm, selectedCategory, comparisonCategories])

  // Check if two tools can be compared
  const canCompare = useMemo(() => {
    if (!selectedTool1 || !selectedTool2) return false
    if (selectedTool1.id === selectedTool2.id) return false
    
    const category1 = getComparisonCategory(selectedTool1.category)
    const category2 = getComparisonCategory(selectedTool2.category)
    
    if (!category1 || !category2) return false
    
    return category1.comparableWith.includes(category2.id)
  }, [selectedTool1, selectedTool2])

  const canCompareTools = (tool1: Tool, tool2: Tool) => {
    if (tool1.id === tool2.id) return false
    
    const category1 = getComparisonCategory(tool1.category)
    const category2 = getComparisonCategory(tool2.category)
    
    if (!category1 || !category2) return false
    
    return category1.comparableWith.includes(category2.id)
  }

  const handleToolSelect = (tool: Tool, position: 1 | 2) => {
    if (position === 1) {
      setSelectedTool1(tool)
      // Clear tool2 if it's the same tool or can't be compared
      if (selectedTool2 && (selectedTool2.id === tool.id || !canCompareTools(tool, selectedTool2))) {
        setSelectedTool2(null)
      }
    } else {
      setSelectedTool2(tool)
      // Clear tool1 if it's the same tool or can't be compared
      if (selectedTool1 && (selectedTool1.id === tool.id || !canCompareTools(selectedTool1, tool))) {
        setSelectedTool1(null)
      }
    }
  }

  const handleCompare = () => {
    if (selectedTool1 && selectedTool2 && canCompare) {
      const tool1Slug = nameToSlug(selectedTool1.name)
      const tool2Slug = nameToSlug(selectedTool2.name)
      router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
    }
  }

  const handlePopularComparison = (tool1: Tool, tool2: Tool) => {
    const tool1Slug = nameToSlug(tool1.name)
    const tool2Slug = nameToSlug(tool2.name)
    router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
  }

  const getToolIcon = (tool: Tool) => {
    if (tool.openSource) return <Code className="h-4 w-4 text-green-600" />
    if (tool.pricing && tool.pricing.toLowerCase().includes('free')) return <DollarSign className="h-4 w-4 text-blue-600" />
    return <Zap className="h-4 w-4 text-purple-600" />
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'llm-apis': return <Zap className="h-4 w-4" />
      case 'coding-assistants': return <Code className="h-4 w-4" />
      case 'vector-databases': return <Database className="h-4 w-4" />
      case 'ai-frameworks': return <BookOpen className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section - Optimized for Google Users */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target className="h-8 w-8" />
            </div>
            Find the Perfect AI Tool for Your Project
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-normal">Live Data</span>
            </div>
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Compare AI coding assistants, LLM APIs, vector databases, and frameworks side by side. 
            Get objective data to make the right choice for your development needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{tools.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{validComparisons.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Valid Comparisons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{comparisonCategories.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
            </div>
          </div>
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for specific tools (e.g., 'GitHub Copilot', 'OpenAI', 'Pinecone')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Interface with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Browse by Category
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Compare Tools
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular Comparisons
          </TabsTrigger>
        </TabsList>

        {/* Browse by Category Tab */}
        <TabsContent value="browse" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 border-2 border-green-200 dark:border-green-800 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Filter className="h-6 w-6" />
                </div>
                Browse AI Tool Categories
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-normal">Smart Filtering</span>
                </div>
              </CardTitle>
              <CardDescription className="text-green-100">
                Click on any category to see tools and start comparing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparisonCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`group cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border ${
                      selectedCategory === category.id 
                        ? 'border-green-400 dark:border-green-500 shadow-lg' 
                        : 'hover:border-green-300 dark:hover:border-green-600'
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setActiveTab('compare')
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50">
                          {getCategoryIcon(category.id)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{category.tools.length} tools</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.useCases.slice(0, 2).map((useCase: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                        <ChevronRight className="h-3 w-3 mr-1" />
                        Click to explore
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compare Tools Tab */}
        <TabsContent value="compare" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
                Compare AI Tools
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-normal">Smart Matching</span>
                </div>
              </CardTitle>
              <CardDescription className="text-purple-100">
                Select two tools to see a detailed comparison. Only meaningful comparisons are allowed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tools by name, description, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {comparisonCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tool Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tool 1 Selection */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Tool 1</span>
                    {selectedTool1 ? selectedTool1.name : 'Select first tool'}
                    {selectedTool1 && (
                      <Badge variant="outline" className="text-xs">
                        {getComparisonCategory(selectedTool1.category)?.name || selectedTool1.category}
                      </Badge>
                    )}
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {filteredTools.map(tool => {
                      const canSelect = !selectedTool2 || (selectedTool2.id !== tool.id && canCompareTools(tool, selectedTool2))
                      return (
                        <div
                          key={tool.id}
                          onClick={() => canSelect ? handleToolSelect(tool, 1) : null}
                          className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                            selectedTool1?.id === tool.id
                              ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-400 dark:border-blue-500 shadow-lg'
                              : canSelect
                              ? 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-all duration-200">
                                  {getToolIcon(tool)}
                                </div>
                                <div>
                                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                    {tool.name}
                                  </span>
                                  {tool.openSource && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Open Source</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{tool.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                                >
                                  {getComparisonCategory(tool.category)?.name || tool.category}
                                </Badge>
                                {tool.pricing && (
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    {tool.pricing.includes('Free') ? '💚 Free' : '💰 Paid'}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!canSelect && selectedTool2 && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tool 2 Selection */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Tool 2</span>
                    {selectedTool2 ? selectedTool2.name : 'Select second tool'}
                    {selectedTool2 && (
                      <Badge variant="outline" className="text-xs">
                        {getComparisonCategory(selectedTool2.category)?.name || selectedTool2.category}
                      </Badge>
                    )}
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {filteredTools.map(tool => {
                      const canSelect = !selectedTool1 || (selectedTool1.id !== tool.id && canCompareTools(selectedTool1, tool))
                      return (
                        <div
                          key={tool.id}
                          onClick={() => canSelect ? handleToolSelect(tool, 2) : null}
                          className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                            selectedTool2?.id === tool.id
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-2 border-green-400 dark:border-green-500 shadow-lg'
                              : canSelect
                              ? 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-green-100 group-hover:to-emerald-100 dark:group-hover:from-green-800/50 dark:group-hover:to-emerald-800/50 transition-all duration-200">
                                  {getToolIcon(tool)}
                                </div>
                                <div>
                                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                                    {tool.name}
                                  </span>
                                  {tool.openSource && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Open Source</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{tool.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                                >
                                  {getComparisonCategory(tool.category)?.name || tool.category}
                                </Badge>
                                {tool.pricing && (
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    {tool.pricing.includes('Free') ? '💚 Free' : '💰 Paid'}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!canSelect && selectedTool1 && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Comparison Status */}
              {selectedTool1 && selectedTool2 && (
                <div className={`p-4 rounded-lg border ${
                  canCompare 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-3">
                    {canCompare ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          ✓ These tools can be meaningfully compared
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          ✗ These tools cannot be meaningfully compared
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Compare Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleCompare}
                  disabled={!selectedTool1 || !selectedTool2 || !canCompare}
                  size="lg"
                  className={`px-12 py-4 text-lg font-bold transition-all duration-300 transform ${
                    selectedTool1 && selectedTool2 && canCompare
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedTool1 && selectedTool2 && canCompare ? (
                    <>
                      <span className="mr-3">⚡</span>
                      <ArrowRight className="h-5 w-5 mr-3" />
                      Compare {selectedTool1.name} vs {selectedTool2.name}
                      <span className="ml-3">🚀</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Select two compatible tools to compare
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Popular Comparisons Tab */}
        <TabsContent value="popular" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 border-2 border-orange-200 dark:border-orange-800 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                Popular Comparisons
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-normal">Trending</span>
                </div>
              </CardTitle>
              <CardDescription className="text-orange-100">
                Quick access to the most requested meaningful tool comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularComparisons.map((comparison, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-purple-300 dark:hover:border-purple-600"
                    onClick={() => handlePopularComparison(comparison.tool1, comparison.tool2)}
                  >
                    <CardContent className="p-5 relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-purple-800/70 transition-all duration-200">
                              {getToolIcon(comparison.tool1)}
                            </div>
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                              {comparison.tool1.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-lg animate-pulse">⚡</span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                              {comparison.tool2.name}
                            </span>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 group-hover:from-green-200 group-hover:to-emerald-200 dark:group-hover:from-green-800/70 dark:group-hover:to-emerald-800/70 transition-all duration-200">
                              {getToolIcon(comparison.tool2)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                          >
                            🔥 {comparison.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                            <span className="text-xs font-medium">Compare now</span>
                            <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lightbulb className="h-6 w-6" />
            </div>
            How to Use This Tool
            <div className="ml-auto flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-normal">Quick Start</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Browse Categories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Start by exploring tool categories to understand what&apos;s available
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Select Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose two tools you want to compare - we&apos;ll only show compatible options
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                View detailed comparisons with objective data to make your decision
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
