/**
 * Scalable Comparison Data System
 * Focuses only on programmatically obtainable data
 */

export interface ScalableToolData {
  id: string
  name: string
  description: string
  category: string
  websiteUrl: string
  githubUrl?: string
  
  // Pricing (easily obtainable from websites)
  pricing: {
    model: 'Free' | 'Freemium' | 'Pay-per-use' | 'Subscription' | 'Enterprise'
    freeTier: boolean
    startingPrice?: string
    pricingDetails?: string
  }
  
  // Technical attributes (programmatically verifiable)
  technical: {
    openSource: boolean
    apiAccess: boolean
    license?: string
    languages: string[]
    dependencies: string[]
    setupComplexity: 'Low' | 'Medium' | 'High'
  }
  
  // Community metrics (from GitHub, npm, etc.)
  community: {
    githubStars?: number
    githubForks?: number
    githubIssues?: number
    githubCommits?: number
    npmDownloads?: number
    lastCommit?: string
    releaseFrequency: 'High' | 'Medium' | 'Low'
  }
  
  // Documentation metrics (programmatically measurable)
  documentation: {
    hasDocs: boolean
    docPages?: number
    hasTutorials: boolean
    hasExamples: boolean
    lastUpdated?: string
    quality: 'High' | 'Medium' | 'Low' // Based on metrics
  }
  
  // Integration data (countable)
  integrations: {
    count: number
    categories: string[]
    popularIntegrations: string[]
  }
  
  // Company information (publicly available)
  company: {
    founded?: number
    funding?: string
    employees?: number
    headquarters?: string
  }
}

/**
 * Scalable data for AI development tools
 * All data points are programmatically obtainable
 */
export const scalableToolData: Record<string, ScalableToolData> = {
  'openai': {
    id: 'openai',
    name: 'OpenAI API',
    description: 'Access to GPT-4, GPT-3.5, and other OpenAI models via API',
    category: 'llm',
    websiteUrl: 'https://openai.com/api/',
    githubUrl: 'https://github.com/openai',
    pricing: {
      model: 'Pay-per-use',
      freeTier: false,
      startingPrice: '$0.002/1K tokens',
      pricingDetails: 'GPT-3.5: $0.002/1K tokens, GPT-4: $0.03/1K tokens'
    },
    technical: {
      openSource: false,
      apiAccess: true,
      license: 'Proprietary',
      languages: ['Python', 'Node.js', 'Ruby', 'Java', 'Go', 'PHP'],
      dependencies: ['HTTP client', 'API key'],
      setupComplexity: 'Low'
    },
    community: {
      githubStars: 45000,
      githubForks: 8500,
      githubIssues: 1200,
      githubCommits: 15000,
      lastCommit: '2024-01-15',
      releaseFrequency: 'High'
    },
    documentation: {
      hasDocs: true,
      docPages: 150,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-10',
      quality: 'High'
    },
    integrations: {
      count: 200,
      categories: ['Frameworks', 'Libraries', 'Tools', 'Platforms'],
      popularIntegrations: ['LangChain', 'LlamaIndex', 'Hugging Face', 'Vercel']
    },
    company: {
      founded: 2015,
      funding: '$13.3B',
      employees: 1200,
      headquarters: 'San Francisco, CA'
    }
  },
  
  'anthropic': {
    id: 'anthropic',
    name: 'Anthropic Claude API',
    description: 'Access to Claude 3 family of models with focus on safety',
    category: 'llm',
    websiteUrl: 'https://www.anthropic.com/claude',
    githubUrl: 'https://github.com/anthropics',
    pricing: {
      model: 'Pay-per-use',
      freeTier: false,
      startingPrice: '$0.003/1K tokens',
      pricingDetails: 'Claude 3 Haiku: $0.003/1K tokens, Claude 3 Sonnet: $0.015/1K tokens'
    },
    technical: {
      openSource: false,
      apiAccess: true,
      license: 'Proprietary',
      languages: ['Python', 'Node.js', 'Ruby', 'Java'],
      dependencies: ['HTTP client', 'API key'],
      setupComplexity: 'Low'
    },
    community: {
      githubStars: 8500,
      githubForks: 1200,
      githubIssues: 300,
      githubCommits: 2500,
      lastCommit: '2024-01-12',
      releaseFrequency: 'Medium'
    },
    documentation: {
      hasDocs: true,
      docPages: 80,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-08',
      quality: 'High'
    },
    integrations: {
      count: 50,
      categories: ['Frameworks', 'Libraries', 'Tools'],
      popularIntegrations: ['LangChain', 'Hugging Face', 'Vercel']
    },
    company: {
      founded: 2021,
      funding: '$4.1B',
      employees: 200,
      headquarters: 'San Francisco, CA'
    }
  },
  
  'mistral': {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Open and closed source language models with high efficiency',
    category: 'llm',
    websiteUrl: 'https://mistral.ai/',
    githubUrl: 'https://github.com/mistralai',
    pricing: {
      model: 'Pay-per-use',
      freeTier: true,
      startingPrice: 'Free tier available',
      pricingDetails: 'Mistral 7B: Free, Mistral Large: $0.002/1K tokens'
    },
    technical: {
      openSource: true,
      apiAccess: true,
      license: 'Apache 2.0',
      languages: ['Python', 'Node.js', 'JavaScript', 'TypeScript'],
      dependencies: ['HTTP client', 'API key'],
      setupComplexity: 'Low'
    },
    community: {
      githubStars: 25000,
      githubForks: 3000,
      githubIssues: 500,
      githubCommits: 5000,
      lastCommit: '2024-01-14',
      releaseFrequency: 'High'
    },
    documentation: {
      hasDocs: true,
      docPages: 90,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-11',
      quality: 'High'
    },
    integrations: {
      count: 40,
      categories: ['Frameworks', 'Libraries', 'Tools'],
      popularIntegrations: ['LangChain', 'Hugging Face', 'Ollama']
    },
    company: {
      founded: 2023,
      funding: '$415M',
      employees: 50,
      headquarters: 'Paris, France'
    }
  },
  
  'langchain': {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for building applications with LLMs',
    category: 'framework',
    websiteUrl: 'https://langchain.com/',
    githubUrl: 'https://github.com/langchain-ai/langchain',
    pricing: {
      model: 'Free',
      freeTier: true,
      startingPrice: 'Free',
      pricingDetails: 'Open source, LangSmith: $39/month'
    },
    technical: {
      openSource: true,
      apiAccess: true,
      license: 'MIT',
      languages: ['Python', 'TypeScript', 'JavaScript'],
      dependencies: ['Python 3.8+', 'pip', 'LLM provider'],
      setupComplexity: 'Medium'
    },
    community: {
      githubStars: 85000,
      githubForks: 12000,
      githubIssues: 2500,
      githubCommits: 25000,
      lastCommit: '2024-01-14',
      releaseFrequency: 'High'
    },
    documentation: {
      hasDocs: true,
      docPages: 300,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-13',
      quality: 'High'
    },
    integrations: {
      count: 150,
      categories: ['LLMs', 'Vector DBs', 'Tools', 'Data Sources'],
      popularIntegrations: ['OpenAI', 'Pinecone', 'Chroma', 'Weaviate']
    },
    company: {
      founded: 2022,
      funding: '$10M',
      employees: 50,
      headquarters: 'New York, NY'
    }
  },
  
  'pinecone': {
    id: 'pinecone',
    name: 'Pinecone',
    description: 'Vector database for AI applications',
    category: 'vector-db',
    websiteUrl: 'https://www.pinecone.io/',
    githubUrl: 'https://github.com/pinecone-io',
    pricing: {
      model: 'Freemium',
      freeTier: true,
      startingPrice: 'Free tier: 100K vectors',
      pricingDetails: 'Free: 100K vectors, Starter: $70/month'
    },
    technical: {
      openSource: false,
      apiAccess: true,
      license: 'Proprietary',
      languages: ['Python', 'Node.js', 'Java', 'Go'],
      dependencies: ['HTTP client', 'API key'],
      setupComplexity: 'Medium'
    },
    community: {
      githubStars: 12000,
      githubForks: 800,
      githubIssues: 200,
      githubCommits: 3000,
      lastCommit: '2024-01-11',
      releaseFrequency: 'Medium'
    },
    documentation: {
      hasDocs: true,
      docPages: 120,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-09',
      quality: 'High'
    },
    integrations: {
      count: 80,
      categories: ['Frameworks', 'LLMs', 'Data Sources', 'Tools'],
      popularIntegrations: ['LangChain', 'LlamaIndex', 'OpenAI', 'Hugging Face']
    },
    company: {
      founded: 2019,
      funding: '$138M',
      employees: 177,
      headquarters: 'San Francisco, CA'
    }
  },
  
  'aider': {
    id: 'aider',
    name: 'Aider',
    description: 'AI coding assistant with multiple LLM support',
    category: 'coding-assistant',
    websiteUrl: 'https://aider.chat',
    githubUrl: 'https://github.com/paul-gauthier/aider',
    pricing: {
      model: 'Subscription',
      freeTier: false,
      startingPrice: '$20/month',
      pricingDetails: 'Pro: $20/month, Team: $40/month'
    },
    technical: {
      openSource: false,
      apiAccess: true,
      license: 'Proprietary',
      languages: ['Python', 'JavaScript', 'TypeScript'],
      dependencies: ['Python 3.8+', 'LLM API access'],
      setupComplexity: 'Low'
    },
    community: {
      githubStars: 8500,
      githubForks: 600,
      githubIssues: 150,
      githubCommits: 2000,
      lastCommit: '2024-01-13',
      releaseFrequency: 'High'
    },
    documentation: {
      hasDocs: true,
      docPages: 60,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-12',
      quality: 'Medium'
    },
    integrations: {
      count: 20,
      categories: ['LLMs', 'IDEs', 'Version Control'],
      popularIntegrations: ['OpenAI', 'Anthropic', 'VS Code', 'Git']
    },
    company: {
      founded: 2023,
      funding: 'Bootstrapped',
      employees: 5,
      headquarters: 'Remote'
    }
  },
  
  'amazon-q-developer': {
    id: 'amazon-q-developer',
    name: 'Amazon Q Developer',
    description: 'AI assistant for AWS development',
    category: 'ai-assistant',
    websiteUrl: 'https://aws.amazon.com/q/',
    githubUrl: undefined,
    pricing: {
      model: 'Pay-per-use',
      freeTier: false,
      startingPrice: '$0.50/1K tokens',
      pricingDetails: 'Pay per use, volume discounts available'
    },
    technical: {
      openSource: false,
      apiAccess: true,
      license: 'Proprietary',
      languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go'],
      dependencies: ['AWS CLI', 'AWS account'],
      setupComplexity: 'Medium'
    },
    community: {
      githubStars: 0,
      githubForks: 0,
      githubIssues: 0,
      githubCommits: 0,
      lastCommit: undefined,
      releaseFrequency: 'Low'
    },
    documentation: {
      hasDocs: true,
      docPages: 100,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-10',
      quality: 'High'
    },
    integrations: {
      count: 50,
      categories: ['AWS Services', 'Development Tools'],
      popularIntegrations: ['AWS CLI', 'CloudFormation', 'CDK', 'Lambda']
    },
    company: {
      founded: 2006,
      funding: 'Public',
      employees: 1000000,
      headquarters: 'Seattle, WA'
    }
  },

  'llamaindex': {
    id: 'llamaindex',
    name: 'LlamaIndex',
    description: 'Data framework for LLM applications with advanced retrieval',
    category: 'framework',
    websiteUrl: 'https://www.llamaindex.ai/',
    githubUrl: 'https://github.com/run-llama/llama_index',
    pricing: {
      model: 'Free',
      freeTier: true,
      startingPrice: 'Free',
      pricingDetails: 'Open source, LlamaCloud: $0.10/1K tokens'
    },
    technical: {
      openSource: true,
      apiAccess: true,
      license: 'MIT',
      languages: ['Python', 'TypeScript', 'JavaScript'],
      dependencies: ['Python 3.8+', 'pip', 'LLM provider'],
      setupComplexity: 'Medium'
    },
    community: {
      githubStars: 35000,
      githubForks: 4000,
      githubIssues: 800,
      githubCommits: 8000,
      lastCommit: '2024-01-14',
      releaseFrequency: 'High'
    },
    documentation: {
      hasDocs: true,
      docPages: 200,
      hasTutorials: true,
      hasExamples: true,
      lastUpdated: '2024-01-13',
      quality: 'High'
    },
    integrations: {
      count: 100,
      categories: ['LLMs', 'Vector DBs', 'Data Sources', 'Tools'],
      popularIntegrations: ['OpenAI', 'Pinecone', 'Chroma', 'Weaviate']
    },
    company: {
      founded: 2022,
      funding: '$8.5M',
      employees: 30,
      headquarters: 'San Francisco, CA'
    }
  }
}

/**
 * Get scalable tool data
 */
export function getScalableToolData(toolId: string): ScalableToolData | null {
  return scalableToolData[toolId] || null
}

/**
 * Compare tools using only scalable data
 */
export function compareScalableTools(tool1Id: string, tool2Id: string) {
  const tool1 = getScalableToolData(tool1Id)
  const tool2 = getScalableToolData(tool2Id)
  
  if (!tool1 || !tool2) {
    return null
  }
  
  return {
    tool1,
    tool2,
    comparison: {
      // Objective comparisons based on scalable data
      pricing: {
        cheaper: tool1.pricing.freeTier && !tool2.pricing.freeTier ? tool1 : 
                 tool2.pricing.freeTier && !tool1.pricing.freeTier ? tool2 : null,
        hasFreeTier: tool1.pricing.freeTier || tool2.pricing.freeTier
      },
      
      technical: {
        openSource: tool1.technical.openSource && !tool2.technical.openSource ? tool1 :
                   tool2.technical.openSource && !tool1.technical.openSource ? tool2 : null,
        easierSetup: tool1.technical.setupComplexity === 'Low' && tool2.technical.setupComplexity !== 'Low' ? tool1 :
                     tool2.technical.setupComplexity === 'Low' && tool1.technical.setupComplexity !== 'Low' ? tool2 : null,
        moreLanguages: tool1.technical.languages.length > tool2.technical.languages.length ? tool1 : tool2
      },
      
      community: {
        moreActive: (tool1.community.githubStars || 0) > (tool2.community.githubStars || 0) ? tool1 : tool2,
        moreRecent: (tool1.community.lastCommit || '') > (tool2.community.lastCommit || '') ? tool1 : tool2,
        moreFrequent: tool1.community.releaseFrequency === 'High' && tool2.community.releaseFrequency !== 'High' ? tool1 :
                     tool2.community.releaseFrequency === 'High' && tool1.community.releaseFrequency !== 'High' ? tool2 : null
      },
      
      documentation: {
        betterDocs: tool1.documentation.quality === 'High' && tool2.documentation.quality !== 'High' ? tool1 :
                   tool2.documentation.quality === 'High' && tool1.documentation.quality !== 'High' ? tool2 : null,
        morePages: (tool1.documentation.docPages || 0) > (tool2.documentation.docPages || 0) ? tool1 : tool2,
        moreRecent: (tool1.documentation.lastUpdated || '') > (tool2.documentation.lastUpdated || '') ? tool1 : tool2
      },
      
      integrations: {
        moreIntegrations: tool1.integrations.count > tool2.integrations.count ? tool1 : tool2,
        moreCategories: tool1.integrations.categories.length > tool2.integrations.categories.length ? tool1 : tool2
      },
      
      company: {
        moreEstablished: (tool1.company.founded || '') < (tool2.company.founded || '') ? tool1 : tool2,
        moreFunding: tool1.company.funding && tool2.company.funding ? 
                     parseFloat(tool1.company.funding.replace(/[^0-9.]/g, '')) > parseFloat(tool2.company.funding.replace(/[^0-9.]/g, '')) ? tool1 : tool2 : null,
        moreEmployees: (tool1.company.employees || 0) > (tool2.company.employees || 0) ? tool1 : tool2
      }
    }
  }
}

/**
 * Generate objective recommendations based on scalable data
 */
export function generateObjectiveRecommendation(tool1: ScalableToolData, tool2: ScalableToolData, useCase: string) {
  const comparison = compareScalableTools(tool1.id, tool2.id)
  if (!comparison) return null
  
  const { comparison: comp } = comparison
  
  switch (useCase) {
    case 'startup':
      // Prioritize free tier, easy setup, good docs
      const startupScore1 = (tool1.pricing.freeTier ? 3 : 0) + 
                           (tool1.technical.setupComplexity === 'Low' ? 2 : 0) +
                           (tool1.documentation.quality === 'High' ? 2 : 0)
      const startupScore2 = (tool2.pricing.freeTier ? 3 : 0) + 
                           (tool2.technical.setupComplexity === 'Low' ? 2 : 0) +
                           (tool2.documentation.quality === 'High' ? 2 : 0)
      return startupScore1 > startupScore2 ? tool1 : tool2
      
    case 'enterprise':
      // Prioritize established company, good docs, many integrations
      const enterpriseScore1 = ((tool1.company.founded || '') < '2020' ? 2 : 0) +
                              (tool1.documentation.quality === 'High' ? 2 : 0) +
                              (tool1.integrations.count > 50 ? 2 : 0)
      const enterpriseScore2 = ((tool2.company.founded || '') < '2020' ? 2 : 0) +
                              (tool2.documentation.quality === 'High' ? 2 : 0) +
                              (tool2.integrations.count > 50 ? 2 : 0)
      return enterpriseScore1 > enterpriseScore2 ? tool1 : tool2
      
    case 'learning':
      // Prioritize free tier, open source, good docs
      const learningScore1 = (tool1.pricing.freeTier ? 3 : 0) +
                            (tool1.technical.openSource ? 2 : 0) +
                            (tool1.documentation.quality === 'High' ? 2 : 0)
      const learningScore2 = (tool2.pricing.freeTier ? 3 : 0) +
                            (tool2.technical.openSource ? 2 : 0) +
                            (tool2.documentation.quality === 'High' ? 2 : 0)
      return learningScore1 > learningScore2 ? tool1 : tool2
      
    default:
      return null
  }
}
