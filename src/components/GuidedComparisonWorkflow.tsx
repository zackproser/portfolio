'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Tool } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft,
  Zap, 
  Code,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Star,
  Database,
  BookOpen,
  ExternalLink
} from 'lucide-react'
import { nameToSlug } from '@/utils/slug-helpers'
import { getComparisonCategory, COMPARISON_CATEGORIES } from '@/lib/comparison-categories'

interface GuidedComparisonWorkflowProps {
  tools: Tool[]
}

const USE_CASES = [
  {
    id: 'code-completion',
    title: 'Code Completion & Assistance',
    description: 'AI-powered code suggestions and autocomplete',
    icon: <Code className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'llm-integration',
    title: 'LLM API Integration',
    description: 'Integrate large language models into your applications',
    icon: <Zap className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'vector-search',
    title: 'Vector Database & Search',
    description: 'Semantic search and vector embeddings',
    icon: <Database className="h-6 w-6" />,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'ai-framework',
    title: 'AI Framework Development',
    description: 'Build and deploy AI applications',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Review',
    description: 'Automated code analysis and improvement',
    icon: <Star className="h-6 w-6" />,
    color: 'from-pink-500 to-pink-600'
  }
]

export function GuidedComparisonWorkflow({ tools }: GuidedComparisonWorkflowProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedUseCase, setSelectedUseCase] = useState('')
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])

  // Get tools filtered by use case
  const filteredTools = useMemo(() => {
    if (!selectedUseCase) return tools.slice(0, 8)
    
    const useCaseCategory = USE_CASES.find(uc => uc.id === selectedUseCase)
    if (!useCaseCategory) return tools.slice(0, 8)
    
    // Map use case to comparison categories
    const categoryMapping: Record<string, string[]> = {
      'code-completion': ['coding-assistants'],
      'llm-integration': ['llm-apis'],
      'vector-search': ['vector-databases'],
      'ai-framework': ['ai-frameworks'],
      'code-quality': ['coding-assistants', 'ai-frameworks']
    }
    
    const relevantCategories = categoryMapping[selectedUseCase] || []
    
    return tools.filter(tool => {
      const compCategory = getComparisonCategory(tool.category)
      return compCategory && relevantCategories.includes(compCategory.id)
    }).slice(0, 8)
  }, [tools, selectedUseCase])

  const handleUseCaseSelect = (useCaseId: string) => {
    setSelectedUseCase(useCaseId)
    setSelectedTools([])
    setStep(2)
  }

  const handleToolSelect = (tool: Tool) => {
    if (selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools(selectedTools.filter(t => t.id !== tool.id))
    } else if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, tool])
    }
  }

  const handleCompare = () => {
    if (selectedTools.length >= 2) {
      const tool1Slug = nameToSlug(selectedTools[0].name)
      const tool2Slug = nameToSlug(selectedTools[1].name)
      router.push(`/comparisons/${tool1Slug}/vs/${tool2Slug}`)
    }
  }

  const getToolIcon = (tool: Tool) => {
    if (tool.openSource) return <Code className="h-4 w-4 text-green-600" />
    if (tool.pricing && tool.pricing.toLowerCase().includes('free')) return <DollarSign className="h-4 w-4 text-blue-600" />
    return <Zap className="h-4 w-4 text-purple-600" />
  }

  const getProgressPercentage = () => {
    switch (step) {
      case 1: return 33
      case 2: return 66
      case 3: return 100
      default: return 0
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 && "What's your primary use case?"}
            {step === 2 && "Select tools to compare (2-3 recommended)"}
            {step === 3 && "Comparison Results"}
          </h2>
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {/* Step 1: Use Case Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USE_CASES.map(useCase => (
            <Card
              key={useCase.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] border-2 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => handleUseCaseSelect(useCase.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${useCase.color} text-white`}>
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{useCase.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{useCase.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Click to explore tools
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Tool Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Choose 2-3 tools to compare. We&apos;ll show you the best options for your use case.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => {
              const isSelected = selectedTools.find(t => t.id === tool.id)
              const canSelect = selectedTools.length < 3 || isSelected
              
              return (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : canSelect
                      ? 'border hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => canSelect && handleToolSelect(tool)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          {getToolIcon(tool)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{tool.name}</h3>
                          {tool.openSource && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Open Source</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                      {!canSelect && !isSelected && (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {getComparisonCategory(tool.category)?.name || tool.category}
                      </Badge>
                      {tool.pricing && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          {tool.pricing.includes('Free') ? '💚 Free' : '💰 Paid'}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Selection Summary */}
          {selectedTools.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                      {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {selectedTools.map(t => t.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleCompare}
                      disabled={selectedTools.length < 2}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Compare Tools
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 3: Comparison Results (Redirect happens in step 2) */}
      {step === 3 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Redirecting to Comparison</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Taking you to the detailed comparison page...
          </p>
        </div>
      )}
    </div>
  )
}
