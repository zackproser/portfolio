'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StarIcon, EyeIcon } from '@heroicons/react/24/outline'

interface GitHubRepo {
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

interface GitHubRepoCardProps {
  repo: string // Format: "owner/repo"
  className?: string
  fallbackTitle?: string
  fallbackDescription?: string
}

export default function GitHubRepoCard({ 
  repo, 
  className = '', 
  fallbackTitle,
  fallbackDescription 
}: GitHubRepoCardProps) {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRepoData() {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`)
        if (!response.ok) {
          throw new Error('Failed to fetch repository data')
        }
        const data = await response.json()
        setRepoData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchRepoData()
  }, [repo])

  if (loading) {
    return (
      <div className={`animate-pulse border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  // Create fallback data when API fails
  const [owner, repoName] = repo.split('/')
  const fallbackData = {
    name: fallbackTitle || repoName || 'Repository',
    description: fallbackDescription || 'GitHub repository with workshop materials and code examples.',
    html_url: `https://github.com/${repo}`,
    owner: { login: owner || 'github-user' },
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['workshop', 'typescript', 'ai', 'mastra']
  }

  // Use fallback data when API fails
  const displayData = repoData || fallbackData
  const isUsingFallback = !repoData && !loading

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      'C++': '#f34b7d',
      C: '#555555',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
    }
    return colors[language] || '#6b7280'
  }

  return (
    <a 
      href={displayData.html_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group block transition-all duration-300 hover:scale-[1.02] ${className}`}
    >
      <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6">
          {/* Header with GitHub logo and owner */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
                         <div className="flex-1 min-w-0">
               <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{displayData.owner.login}</span>
                 <span className="text-gray-400 dark:text-gray-500">/</span>
               </div>
             </div>
           </div>

           {/* Repository Name */}
           <div className="mb-3">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
               {displayData.name}
             </h3>
           </div>

           {/* Description */}
           <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
             {displayData.description}
           </p>

           {/* Topics */}
           {displayData.topics && displayData.topics.length > 0 && (
             <div className="flex flex-wrap gap-2 mb-4">
               {displayData.topics.slice(0, 4).map((topic) => (
                 <span
                   key={topic}
                   className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800"
                 >
                   {topic}
                 </span>
               ))}
               {displayData.topics.length > 4 && (
                 <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                   +{displayData.topics.length - 4}
                 </span>
               )}
             </div>
           )}

           {/* Stats Row */}
           <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
             <div className="flex items-center space-x-4">
               {displayData.language && (
                 <div className="flex items-center space-x-1.5">
                   <div 
                     className="w-3 h-3 rounded-full ring-1 ring-gray-200 dark:ring-gray-600"
                     style={{ backgroundColor: getLanguageColor(displayData.language) }}
                   />
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayData.language}</span>
                 </div>
               )}
             </div>
             
             <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
               <div className="flex items-center space-x-1 hover:text-yellow-600 transition-colors">
                 <StarIcon className="w-4 h-4" />
                 <span className="font-medium">{displayData.stargazers_count.toLocaleString()}</span>
               </div>
               
               <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                   <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                 </svg>
                 <span className="font-medium">{displayData.forks_count.toLocaleString()}</span>
               </div>
             </div>
           </div>

          {/* Call to Action Hint */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-center py-2 px-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Click to view repository →
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
} 