'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Tool } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  Star,
  Code,
  DollarSign
} from 'lucide-react'
import { nameToSlug } from '@/utils/slug-helpers'

interface DynamicComparisonSearchProps {
  tools: Tool[]
}

export function DynamicComparisonSearch({ tools }: DynamicComparisonSearchProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTool1, setSelectedTool1] = useState<Tool | null>(null)
  const [selectedTool2, setSelectedTool2] = useState<Tool | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tools.map(tool => tool.category)))
    return uniqueCategories.sort()
  }, [tools])

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
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [tools, searchTerm, selectedCategory])

  // Popular comparisons based on common categories
  const popularComparisons = useMemo(() => {
    const comparisons: Array<{ tool1: Tool; tool2: Tool; category: string }> = []
    const categoryGroups = tools.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = []
      acc[tool.category].push(tool)
      return acc
    }, {} as Record<string, Tool[]>)

    // Generate popular comparisons from each category
    Object.values(categoryGroups).forEach(categoryTools => {
      if (categoryTools.length >= 2) {
        // Take first two tools from each category as "popular"
        comparisons.push({
          tool1: categoryTools[0],
          tool2: categoryTools[1],
          category: categoryTools[0].category
        })
      }
    })

    return comparisons.slice(0, 6) // Limit to 6 popular comparisons
  }, [tools])

  const handleToolSelect = (tool: Tool, position: 1 | 2) => {
    if (position === 1) {
      setSelectedTool1(tool)
      // Clear tool2 if it's the same as tool1
      if (selectedTool2?.id === tool.id) {
        setSelectedTool2(null)
      }
    } else {
      setSelectedTool2(tool)
      // Clear tool1 if it's the same as tool2
      if (selectedTool1?.id === tool.id) {
        setSelectedTool1(null)
      }
    }
  }

  const handleCompare = () => {
    if (selectedTool1 && selectedTool2) {
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

  return (
    <div className="space-y-8">
      {/* Tool Selection Interface */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Search className="h-6 w-6" />
            </div>
            Compare Any Two Tools
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-normal">Live</span>
            </div>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Select any two developer tools to see a detailed side-by-side comparison with real-time data
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
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolSelect(tool, 1)}
                    className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                      selectedTool1?.id === tool.id
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-400 dark:border-blue-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${selectedTool2?.id === tool.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            {tool.category}
                          </Badge>
                          {tool.pricing && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                              {tool.pricing.includes('Free') ? '💚 Free' : '💰 Paid'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool 2 Selection */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Tool 2</span>
                {selectedTool2 ? selectedTool2.name : 'Select second tool'}
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolSelect(tool, 2)}
                    className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                      selectedTool2?.id === tool.id
                        ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-2 border-green-400 dark:border-green-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${selectedTool1?.id === tool.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            {tool.category}
                          </Badge>
                          {tool.pricing && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                              {tool.pricing.includes('Free') ? '💚 Free' : '💰 Paid'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleCompare}
              disabled={!selectedTool1 || !selectedTool2}
              size="lg"
              className={`px-12 py-4 text-lg font-bold transition-all duration-300 transform ${
                selectedTool1 && selectedTool2
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedTool1 && selectedTool2 ? (
                <>
                  <span className="mr-3">⚡</span>
                  <ArrowRight className="h-5 w-5 mr-3" />
                  Compare {selectedTool1.name} vs {selectedTool2.name}
                  <span className="ml-3">🚀</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Select two tools to compare
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Comparisons */}
      <Card className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 border-2 border-orange-200 dark:border-orange-800 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Star className="h-6 w-6" />
            </div>
            Popular Comparisons
            <div className="ml-auto flex items-center gap-1">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-normal">Trending</span>
            </div>
          </CardTitle>
          <CardDescription className="text-orange-100">
            Quick access to the most requested tool comparisons by developers
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

      {/* Statistics */}
      <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Platform Statistics
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Real-time data from our comprehensive database</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{tools.length}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center justify-center gap-1">
                  <Code className="h-3 w-3" />
                  Total Tools
                </div>
              </div>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{categories.length}</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center justify-center gap-1">
                  <span>📂</span>
                  Categories
                </div>
              </div>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {Math.floor((tools.length * (tools.length - 1)) / 2)}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium flex items-center justify-center gap-1">
                  <span>⚡</span>
                  Comparisons
                </div>
              </div>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {tools.filter(tool => tool.openSource).length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 font-medium flex items-center justify-center gap-1">
                  <span>🔓</span>
                  Open Source
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 