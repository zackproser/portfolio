/**
 * Comparison Categories System
 * Defines which tool categories can be meaningfully compared
 */

export interface ComparisonCategory {
  id: string
  name: string
  description: string
  comparableWith: string[] // Categories that can be compared with this one
  seoKeywords: string[]
  useCases: string[]
}

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: 'llm-apis',
    name: 'LLM APIs',
    description: 'Language model APIs for text generation and processing',
    comparableWith: ['llm-apis', 'coding-assistants', 'ai-assistants'],
    seoKeywords: ['llm api', 'language model', 'text generation', 'ai api'],
    useCases: ['text generation', 'chat applications', 'content creation', 'code generation']
  },
  {
    id: 'coding-assistants',
    name: 'AI Coding Assistants',
    description: 'AI-powered tools that help with code completion and generation',
    comparableWith: ['coding-assistants', 'llm-apis', 'ai-assistants'],
    seoKeywords: ['ai coding', 'code completion', 'copilot alternative', 'ai code assistant'],
    useCases: ['code completion', 'code generation', 'refactoring', 'debugging']
  },
  {
    id: 'ai-assistants',
    name: 'AI Assistants',
    description: 'General-purpose AI assistants for various tasks',
    comparableWith: ['ai-assistants', 'llm-apis', 'coding-assistants'],
    seoKeywords: ['ai assistant', 'chatbot', 'ai helper', 'virtual assistant'],
    useCases: ['general assistance', 'task automation', 'information retrieval', 'conversation']
  },
  {
    id: 'vector-databases',
    name: 'Vector Databases',
    description: 'Specialized databases for storing and querying vector embeddings',
    comparableWith: ['vector-databases', 'data-platforms'],
    seoKeywords: ['vector database', 'embeddings', 'similarity search', 'vector search'],
    useCases: ['semantic search', 'recommendation systems', 'RAG applications', 'similarity matching']
  },
  {
    id: 'ai-frameworks',
    name: 'AI Frameworks',
    description: 'Development frameworks for building AI applications',
    comparableWith: ['ai-frameworks', 'data-platforms'],
    seoKeywords: ['ai framework', 'llm framework', 'ai development', 'ai toolkit'],
    useCases: ['ai application development', 'llm integration', 'ai workflows', 'ai orchestration']
  },
  {
    id: 'data-platforms',
    name: 'Data Platforms',
    description: 'Platforms for data processing and AI workflows',
    comparableWith: ['data-platforms', 'vector-databases', 'ai-frameworks'],
    seoKeywords: ['data platform', 'ai platform', 'data processing', 'ai workflow'],
    useCases: ['data processing', 'ai workflows', 'data analysis', 'ai orchestration']
  },
  {
    id: 'ide-tools',
    name: 'IDE Tools',
    description: 'Integrated development environment tools and extensions',
    comparableWith: ['ide-tools'],
    seoKeywords: ['ide', 'code editor', 'development environment', 'code editor comparison'],
    useCases: ['code editing', 'development workflow', 'code navigation', 'debugging']
  },
  {
    id: 'code-quality',
    name: 'Code Quality Tools',
    description: 'Tools for code review, testing, and quality assurance',
    comparableWith: ['code-quality'],
    seoKeywords: ['code review', 'code quality', 'static analysis', 'code testing'],
    useCases: ['code review', 'quality assurance', 'bug detection', 'code standards']
  },
  {
    id: 'design-tools',
    name: 'Design-to-Code Tools',
    description: 'Tools that convert designs to code',
    comparableWith: ['design-tools'],
    seoKeywords: ['design to code', 'ui generation', 'code generation', 'design automation'],
    useCases: ['ui development', 'design implementation', 'rapid prototyping', 'frontend development']
  }
]

/**
 * Maps old category names to new comparison categories
 */
export const CATEGORY_MAPPING: Record<string, string> = {
  'llm': 'llm-apis',
  'coding-assistant': 'coding-assistants', 
  'ai-assistant': 'ai-assistants',
  'vector-db': 'vector-databases',
  'framework': 'ai-frameworks',
  'ide': 'ide-tools',
  'code-integrity': 'code-quality',
  'code-review': 'code-quality',
  'design-to-code': 'design-tools',
  'data-platform': 'data-platforms',
  'agent': 'ai-frameworks',
  'evaluation': 'ai-frameworks',
  'debugging': 'code-quality',
  'automation': 'ai-assistants'
}

/**
 * Check if two tools can be meaningfully compared
 */
export function canCompareTools(tool1Category: string, tool2Category: string): boolean {
  const category1 = CATEGORY_MAPPING[tool1Category] || tool1Category
  const category2 = CATEGORY_MAPPING[tool2Category] || tool2Category
  
  const comparisonCategory = COMPARISON_CATEGORIES.find(cat => cat.id === category1)
  
  if (!comparisonCategory) {
    return false
  }
  
  return comparisonCategory.comparableWith.includes(category2)
}

/**
 * Get comparison category for a tool
 */
export function getComparisonCategory(toolCategory: string): ComparisonCategory | null {
  const mappedCategory = CATEGORY_MAPPING[toolCategory] || toolCategory
  return COMPARISON_CATEGORIES.find(cat => cat.id === mappedCategory) || null
}

/**
 * Get SEO-optimized comparison title
 */
export function getComparisonTitle(tool1Name: string, tool2Name: string, category1: string, category2: string): string {
  const compCategory1 = getComparisonCategory(category1)
  const compCategory2 = getComparisonCategory(category2)
  
  if (compCategory1 && compCategory2 && compCategory1.id === compCategory2.id) {
    // Same category - use category-specific title
    return `${tool1Name} vs ${tool2Name}: Best ${compCategory1.name}`
  } else {
    // Different but comparable categories
    return `${tool1Name} vs ${tool2Name}: AI Tools Comparison`
  }
}

/**
 * Get SEO-optimized comparison description
 */
export function getComparisonDescription(tool1Name: string, tool2Name: string, category1: string, category2: string): string {
  const compCategory1 = getComparisonCategory(category1)
  const compCategory2 = getComparisonCategory(category2)
  
  if (compCategory1 && compCategory2) {
    const useCases = [...new Set([...compCategory1.useCases, ...compCategory2.useCases])].slice(0, 3)
    return `Compare ${tool1Name} and ${tool2Name} for ${useCases.join(', ')}. Find the best AI tool for your needs with detailed feature comparisons, pricing, and use cases.`
  }
  
  return `Compare ${tool1Name} and ${tool2Name} - features, pricing, pros and cons. Find the best tool for your development needs.`
}

/**
 * Get all valid comparison pairs from a list of tools
 */
export function getValidComparisons(tools: Array<{id: string, name: string, category: string}>): Array<{tool1: any, tool2: any}> {
  const validComparisons = []
  
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const tool1 = tools[i]
      const tool2 = tools[j]
      
      if (canCompareTools(tool1.category, tool2.category)) {
        validComparisons.push({ tool1, tool2 })
      }
    }
  }
  
  return validComparisons
}
