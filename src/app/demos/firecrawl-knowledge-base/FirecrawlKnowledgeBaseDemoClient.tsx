'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Search,
  Brain,
  Database,
  FileText,
  Play,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  Folder,
  Link as LinkIcon,
  BookOpen,
  Filter,
  Users,
  Building,
  Zap,
  Target,
  TreePine
} from 'lucide-react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { getAffiliateLink } from '@/lib/affiliate'
import Newsletter from '@/components/Newsletter'

// ─── Types ─────────────────────────────────────────────────────────────────────
type DemoStep = 'input' | 'crawling' | 'extracting' | 'categorizing' | 'building' | 'complete'

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  importance: 'high' | 'medium' | 'low'
  type: 'concept' | 'process' | 'reference' | 'example'
  url: string
}

interface Category {
  id: string
  name: string
  description: string
  count: number
  color: string
}

// ─── Sample Data ─────────────────────────────────────────────────────────────
const sampleWebsites = [
  { 
    name: 'TechCorp Documentation',
    url: 'https://docs.techcorp.com',
    description: 'Complete API documentation and guides'
  },
  { 
    name: 'Medical Research Center',
    url: 'https://research.medcenter.edu',
    description: 'Research papers and clinical guidelines'
  },
  { 
    name: 'Legal Firm Resources',
    url: 'https://lawfirm.com/resources',
    description: 'Legal precedents and practice guides'
  }
]

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: 'API Authentication Methods',
    content: 'OAuth 2.0, JWT tokens, and API key authentication provide different levels of security for web services. OAuth 2.0 is recommended for user-facing applications...',
    category: 'Security',
    tags: ['OAuth', 'JWT', 'Authentication', 'Security'],
    importance: 'high',
    type: 'concept',
    url: '/docs/auth'
  },
  {
    id: '2',
    title: 'Rate Limiting Implementation',
    content: 'Implement rate limiting using token bucket or sliding window algorithms. Configure limits per endpoint and user to prevent API abuse...',
    category: 'Implementation',
    tags: ['Rate Limiting', 'Performance', 'API Design'],
    importance: 'high',
    type: 'process',
    url: '/docs/rate-limiting'
  },
  {
    id: '3',
    title: 'Error Handling Best Practices',
    content: 'Consistent error response formats improve developer experience. Use HTTP status codes appropriately and provide descriptive error messages...',
    category: 'Best Practices',
    tags: ['Error Handling', 'API Design', 'Developer Experience'],
    importance: 'medium',
    type: 'reference',
    url: '/docs/errors'
  },
  {
    id: '4',
    title: 'Webhook Configuration Example',
    content: 'Configure webhooks for real-time notifications. Set up endpoint URLs, authentication, and retry policies for reliable event delivery...',
    category: 'Integration',
    tags: ['Webhooks', 'Real-time', 'Integration'],
    importance: 'medium',
    type: 'example',
    url: '/docs/webhooks'
  },
  {
    id: '5',
    title: 'API Versioning Strategy',
    content: 'Semantic versioning and backward compatibility ensure smooth API evolution. Use URL versioning or header-based versioning consistently...',
    category: 'Planning',
    tags: ['Versioning', 'API Design', 'Planning'],
    importance: 'low',
    type: 'concept',
    url: '/docs/versioning'
  }
]

const mockCategories: Category[] = [
  { id: '1', name: 'Security', description: 'Authentication, authorization, and security best practices', count: 8, color: 'bg-red-100 text-red-800' },
  { id: '2', name: 'Implementation', description: 'Code examples and implementation guides', count: 12, color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Best Practices', description: 'Industry standards and recommended approaches', count: 6, color: 'bg-green-100 text-green-800' },
  { id: '4', name: 'Integration', description: 'Third-party integrations and API connections', count: 9, color: 'bg-purple-100 text-purple-800' },
  { id: '5', name: 'Planning', description: 'Architecture and strategic planning guidance', count: 4, color: 'bg-orange-100 text-orange-800' }
]

export default function FirecrawlKnowledgeBaseDemoClient() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('input')
  const [inputUrl, setInputUrl] = useState('')
  const [selectedSample, setSelectedSample] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const startDemo = useCallback(async (url?: string) => {
    const targetUrl = url || inputUrl
    if (!targetUrl.trim()) return

    setIsRunning(true)
    setProgress(0)
    setCurrentStep('crawling')
    track('Knowledge Base Demo Started', { url: targetUrl })

    // Simulate the knowledge base building pipeline
    const steps = [
      { step: 'crawling', duration: 3000, progress: 20 },
      { step: 'extracting', duration: 2500, progress: 40 },
      { step: 'categorizing', duration: 2000, progress: 70 },
      { step: 'building', duration: 1500, progress: 90 }
    ]

    let currentProgress = 0
    for (const { step, duration, progress: stepProgress } of steps) {
      setCurrentStep(step as DemoStep)
      
      // Smooth progress animation
      const progressStep = (stepProgress - currentProgress) / (duration / 100)
      
      for (let i = 0; i < duration / 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(prev => Math.min(stepProgress, prev + progressStep))
      }
      
      currentProgress = stepProgress
    }

    // Complete the demo
    setCurrentStep('complete')
    setProgress(100)
    setKnowledgeItems(mockKnowledgeItems)
    setCategories(mockCategories)
    setIsRunning(false)
  }, [inputUrl])

  const resetDemo = () => {
    setCurrentStep('input')
    setInputUrl('')
    setSelectedSample(null)
    setIsRunning(false)
    setProgress(0)
    setKnowledgeItems([])
    setCategories([])
    setSearchQuery('')
    setSelectedCategory(null)
  }

  const getStepIcon = (step: DemoStep) => {
    switch (step) {
      case 'input': return <Globe className="w-5 h-5" />
      case 'crawling': return <Search className="w-5 h-5" />
      case 'extracting': return <FileText className="w-5 h-5" />
      case 'categorizing': return <Tag className="w-5 h-5" />
      case 'building': return <Database className="w-5 h-5" />
      case 'complete': return <CheckCircle2 className="w-5 h-5 text-green-600" />
    }
  }

  const getStepDescription = (step: DemoStep) => {
    switch (step) {
      case 'input': return 'Enter website URL to analyze'
      case 'crawling': return 'Crawling pages and collecting content'
      case 'extracting': return 'Extracting key information and concepts'
      case 'categorizing': return 'Organizing content by topic and importance'
      case 'building': return 'Building searchable knowledge base'
      case 'complete': return 'Knowledge base ready for exploration'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Brain className="w-4 h-4" />
      case 'process': return <Zap className="w-4 h-4" />
      case 'reference': return <BookOpen className="w-4 h-4" />
      case 'example': return <Target className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Build a <span className="text-blue-600">Knowledge Base</span> from Any Website
        </h1>
        <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
          Transform scattered website content into a structured, searchable knowledge base. 
          See how Firecrawl crawls, extracts, categorizes, and organizes information automatically.
        </p>
        <div className="flex justify-center">
          <a
            href={getAffiliateLink({
              product: 'firecrawl',
              campaign: 'firecrawl-knowledge-base-demo',
              medium: 'demo',
              placement: 'hero-card'
            })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Sparkles className="w-4 h-4" />
            Try Firecrawl Free
          </a>
        </div>
      </div>

      {/* Demo Interface */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Knowledge Base Pipeline</h2>
            <button
              onClick={resetDemo}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-4">
            {(['input', 'crawling', 'extracting', 'categorizing', 'building', 'complete'] as DemoStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-blue-100 text-blue-700 scale-105' 
                    : index <= (['input', 'crawling', 'extracting', 'categorizing', 'building', 'complete'] as DemoStep[]).indexOf(currentStep)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {getStepIcon(step)}
                  <span className="text-sm font-medium hidden sm:block">
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                {index < 5 && (
                  <ArrowRight className="w-4 h-4 text-zinc-400 mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-zinc-600 mt-2">{getStepDescription(currentStep)}</p>
        </div>

        {/* Demo Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Website URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://docs.example.com"
                      className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && startDemo()}
                    />
                    <button
                      onClick={() => startDemo()}
                      disabled={!inputUrl.trim() || isRunning}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Build Knowledge Base
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-zinc-600 mb-3">Or try a sample website:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sampleWebsites.map((site, index) => (
                      <button
                        key={index}
                        onClick={() => startDemo(site.url)}
                        className="text-left p-4 border border-zinc-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <h4 className="font-medium text-zinc-900 mb-1">{site.name}</h4>
                        <p className="text-sm text-zinc-600 mb-2">{site.description}</p>
                        <p className="text-xs text-blue-600 font-mono">{site.url}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(currentStep === 'crawling' || currentStep === 'extracting' || currentStep === 'categorizing' || currentStep === 'building') && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {getStepIcon(currentStep)}
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  {currentStep === 'crawling' && 'Crawling Website Content'}
                  {currentStep === 'extracting' && 'Extracting Key Information'}
                  {currentStep === 'categorizing' && 'Categorizing Content'}
                  {currentStep === 'building' && 'Building Knowledge Base'}
                </h3>
                <p className="text-zinc-600 max-w-md mx-auto">
                  {currentStep === 'crawling' && 'Discovering pages, following links, and collecting raw content from the website structure.'}
                  {currentStep === 'extracting' && 'Using AI to identify concepts, processes, examples, and key information from the content.'}
                  {currentStep === 'categorizing' && 'Organizing extracted information by topic, importance, and content type.'}
                  {currentStep === 'building' && 'Creating searchable indexes and relationship mappings for easy knowledge discovery.'}
                </p>
              </motion.div>
            )}

            {currentStep === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search knowledge base..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                    
                    <div className="flex border border-zinc-300 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
                      >
                        <Folder className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm border-l border-zinc-300 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCategory === category.name
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className={`inline-flex px-2 py-1 rounded text-xs font-medium mb-2 ${category.color}`}>
                        {category.name}
                      </div>
                      <p className="text-sm text-zinc-600 mb-1">{category.description}</p>
                      <p className="text-xs text-zinc-500">{category.count} items</p>
                    </button>
                  ))}
                </div>

                {/* Knowledge Items */}
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredItems.map(item => (
                    <div key={item.id} className="border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm text-zinc-500 capitalize">{item.type}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getImportanceColor(item.importance)}`}>
                          {item.importance}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-zinc-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-zinc-600 mb-3 line-clamp-3">{item.content}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          categories.find(c => c.name === item.category)?.color
                        }`}>
                          {item.category}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          View Source
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No Results Found</h3>
                    <p className="text-zinc-600">Try adjusting your search query or category filter.</p>
                  </div>
                )}

                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Knowledge Base Complete!</h3>
                  <p className="text-green-700 mb-4">
                    Extracted {knowledgeItems.length} knowledge items across {categories.length} categories. 
                    Ready for search, filtering, and knowledge discovery.
                  </p>
                  <a
                    href={getAffiliateLink({
                      product: 'firecrawl',
                      campaign: 'firecrawl-knowledge-base-demo',
                      medium: 'demo',
                      placement: 'inline-cta'
                    })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Build Your Own Knowledge Base
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-zinc-900 mb-2">AI-Powered Extraction</h3>
          <p className="text-sm text-zinc-600">
            Automatically identifies concepts, processes, and key information from unstructured website content.
          </p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
            <Tag className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-zinc-900 mb-2">Smart Categorization</h3>
          <p className="text-sm text-zinc-600">
            Organizes content by topic, importance, and type for easy navigation and knowledge discovery.
          </p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
            <Search className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-zinc-900 mb-2">Instant Search</h3>
          <p className="text-sm text-zinc-600">
            Full-text search across all content with filtering by category, type, and importance level.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter
        title="Knowledge Management Insights"
        body="Web scraping, knowledge extraction, and AI-powered content organization. Weekly, no spam."
        successMessage="Subscribed! Knowledge management content incoming."
        onSubscribe={() => track('firecrawl_knowledge_base_demo_newsletter_subscribe')}
        position="firecrawl-knowledge-base-demo-footer"
      />
    </div>
  )
}