'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAllTools, getPopularComparisons } from '@/actions/tool-actions'
import { slugifyToolName } from '@/utils/comparison-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Search, TrendingUp } from 'lucide-react'

export default function ComparisonsPage() {
  const router = useRouter()
  const [tools, setTools] = useState([])
  const [popularComparisons, setPopularComparisons] = useState([])
  const [selectedTool1, setSelectedTool1] = useState('')
  const [selectedTool2, setSelectedTool2] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      
      try {
        const fetchedTools = await getAllTools()
        setTools(fetchedTools)
        
        // Only run this if there are 2+ tools
        if (fetchedTools.length >= 2) {
          const fetchedComparisons = await getPopularComparisons(10)
          setPopularComparisons(fetchedComparisons)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleCompare = () => {
    if (selectedTool1 && selectedTool2 && selectedTool1 !== selectedTool2) {
      const tool1Slug = slugifyToolName(selectedTool1)
      const tool2Slug = slugifyToolName(selectedTool2)
      router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
    }
  }
  
  const filteredTools = searchQuery 
    ? tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools
    
  // Group tools by category
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {})
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Developer Tools Comparison
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
            Compare features, pricing, and capabilities of popular AI-assisted development tools 
            to find the best fit for your workflow.
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Compare Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                onValueChange={setSelectedTool1}
                value={selectedTool1}
              >
                <SelectTrigger className="w-full dropdown-menu">
                  <SelectValue placeholder="Select first tool" />
                </SelectTrigger>
                <SelectContent>
                  {tools.map(tool => (
                    <SelectItem key={`tool1-${tool.id}`} value={tool.name}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                onValueChange={setSelectedTool2}
                value={selectedTool2}
              >
                <SelectTrigger className="w-full dropdown-menu">
                  <SelectValue placeholder="Select second tool" />
                </SelectTrigger>
                <SelectContent>
                  {tools.map(tool => (
                    <SelectItem key={`tool2-${tool.id}`} value={tool.name}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleCompare}
                disabled={!selectedTool1 || !selectedTool2 || selectedTool1 === selectedTool2}
                className="w-full md:w-auto"
              >
                Compare Tools
              </Button>
            </div>
          </div>
        </div>
        
        {/* Popular Comparisons */}
        {popularComparisons.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold">Popular Comparisons</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularComparisons.map(([tool1, tool2], index) => (
                <Link 
                  key={`popular-${index}`}
                  href={`/comparisons/${slugifyToolName(tool1.name)}/vs/${slugifyToolName(tool2.name)}`}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{tool1.name} vs {tool2.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-500">
                      Compare these popular {tool1.category} tools
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center text-blue-600 text-sm">
                        View comparison <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {/* All Tools */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 sm:mb-0">All Available Tools</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search tools..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map(tool => (
                  <Card key={tool.id} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tool.pricing && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                            {tool.pricing}
                          </span>
                        )}
                        {tool.openSource && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                            Open Source
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex flex-col gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedTool1(tool.name)
                            // Scroll to top
                            window.scrollTo({top: 0, behavior: 'smooth'})
                          }}
                        >
                          Compare with this tool
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}