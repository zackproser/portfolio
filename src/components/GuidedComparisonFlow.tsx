'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Check, Target, Code, Building, BookOpen } from 'lucide-react'
import { Tool } from '@prisma/client'

interface GuidedComparisonFlowProps {
  tools: Tool[]
  onComplete: (selectedTools: Tool[]) => void
}

interface UseCase {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  criteria: string[]
}

const USE_CASES: UseCase[] = [
  {
    id: 'startup-mvp',
    title: 'Startup MVP',
    description: 'Fast development with limited budget',
    icon: <Target className="h-6 w-6" />,
    criteria: ['Free tier', 'Easy setup', 'Good docs', 'Quick to learn']
  },
  {
    id: 'enterprise-production',
    title: 'Enterprise Production',
    description: 'Reliable, scalable, well-supported',
    icon: <Building className="h-6 w-6" />,
    criteria: ['Established company', 'Many integrations', 'High-quality docs', 'Support available']
  },
  {
    id: 'learning-experimentation',
    title: 'Learning & Experimentation',
    description: 'Understanding AI development',
    icon: <BookOpen className="h-6 w-6" />,
    criteria: ['Open source', 'Free tier', 'Active community', 'Good tutorials']
  },
  {
    id: 'rapid-prototyping',
    title: 'Rapid Prototyping',
    description: 'Quick iteration and testing',
    icon: <Code className="h-6 w-6" />,
    criteria: ['Fast setup', 'Good examples', 'Flexible', 'Easy to modify']
  }
]

export function GuidedComparisonFlow({ tools, onComplete }: GuidedComparisonFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])

  const getToolsForUseCase = (useCaseId: string): Tool[] => {
    // Filter tools based on use case criteria
    return tools.filter(tool => {
      switch (useCaseId) {
        case 'startup-mvp':
          return tool.pricing?.toLowerCase().includes('free') || 
                 tool.openSource;
                  // tool.easeOfUse === 'Easy' // Commented out - using manifests now
        case 'enterprise-production':
          return tool.category === 'llm' || 
                 tool.category === 'coding-assistant';
                 // tool.reliability === 'High' // Commented out - using manifests now
        case 'learning-experimentation':
          return tool.openSource || 
                 tool.pricing?.toLowerCase().includes('free') ||
                 tool.category === 'framework'
        case 'rapid-prototyping':
          return tool.category === 'coding-assistant';
          // tool.easeOfUse === 'Easy' || 
          // tool.setupTime === 'Quick' || // Commented out - using manifests now
        default:
          return true
      }
    }).slice(0, 6) // Limit to 6 tools for better UX
  }

  const toggleTool = (tool: Tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t.id !== tool.id))
    } else if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, tool])
    }
  }

  const handleComplete = () => {
    if (selectedTools.length >= 2) {
      onComplete(selectedTools)
    }
  }

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">What&apos;s your primary use case?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the scenario that best describes your development needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USE_CASES.map(useCase => (
            <Card
              key={useCase.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => {
                setSelectedUseCase(useCase.id)
                setStep(2)
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    {useCase.icon}
                  </div>
                  {useCase.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {useCase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {useCase.criteria.map((criterion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (step === 2) {
    const relevantTools = getToolsForUseCase(selectedUseCase!)
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Select 2-3 tools to compare</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Based on your use case: {USE_CASES.find(uc => uc.id === selectedUseCase)?.title}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {relevantTools.map(tool => (
            <Card
              key={tool.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedTools.includes(tool) 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : selectedTools.length >= 3 && !selectedTools.includes(tool)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-md hover:border-blue-300'
              }`}
              onClick={() => !selectedTools.includes(tool) && selectedTools.length < 3 && toggleTool(tool)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{tool.name}</span>
                  {selectedTools.includes(tool) && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {tool.category}
                  </Badge>
                  {tool.openSource && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Open Source
                    </Badge>
                  )}
                  {tool.pricing?.toLowerCase().includes('free') && (
                    <Badge variant="outline" className="text-xs text-blue-600">
                      Free Tier
                    </Badge>
                  )}
                </div>
                {selectedTools.length >= 3 && !selectedTools.includes(tool) && (
                  <p className="text-xs text-gray-500">
                    Maximum 3 tools selected
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button 
            size="lg"
            disabled={selectedTools.length < 2}
            onClick={handleComplete}
            className="px-8"
          >
            Compare {selectedTools.length} tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {selectedTools.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Selected:</strong> {selectedTools.map(t => t.name).join(', ')}
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}
