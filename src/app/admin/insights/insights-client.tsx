'use client'

import { useState } from 'react'
import { TrendingUp, Search, Lightbulb, BarChart3, CheckCircle } from 'lucide-react'
import { markContentCreatedAction } from './actions'

interface QueryInsight {
  id: string
  normalizedQuery: string
  totalCount: number
  uniqueSessions: number
  category: string | null
  intent: string | null
  contentCreated: boolean
}

interface TrendingQuery {
  query: string
  count: number
  growthRate: number
  isNew: boolean
}

interface CategoryCount {
  category: string | null
  count: number
}

interface ContentSuggestion {
  query: string
  count: number
  category: string | null
  intent: string | null
  suggestion: string
}

interface InsightsClientProps {
  topQueries: QueryInsight[]
  trending: TrendingQuery[]
  categories: CategoryCount[]
  suggestions: ContentSuggestion[]
  vectorDbQueries: QueryInsight[]
  devToolsQueries: QueryInsight[]
}

export function InsightsClient({
  topQueries,
  trending,
  categories,
  suggestions,
  vectorDbQueries,
  devToolsQueries,
}: InsightsClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'categories'>('overview')
  const [markingContent, setMarkingContent] = useState<string | null>(null)

  const handleMarkContentCreated = async (query: string) => {
    setMarkingContent(query)
    try {
      await markContentCreatedAction(query)
      window.location.reload()
    } catch (error) {
      console.error('Failed to mark content:', error)
    } finally {
      setMarkingContent(null)
    }
  }

  const totalSearches = topQueries.reduce((sum, q) => sum + q.totalCount, 0)
  const uniqueQueries = topQueries.length
  const withContent = topQueries.filter(q => q.contentCreated).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Search className="w-4 h-4" />
            <span className="text-sm">Total Searches</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalSearches}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Unique Queries</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {uniqueQueries}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Trending</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {trending.length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Content Coverage</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {uniqueQueries > 0 ? Math.round((withContent / uniqueQueries) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'suggestions', label: 'Content Suggestions', icon: Lightbulb },
            { id: 'categories', label: 'Categories', icon: Search },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Queries */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Top Queries (30 days)</h3>
            </div>
            <div className="p-4">
              {topQueries.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No search queries recorded yet. Queries will appear here as users search.
                </p>
              ) : (
                <div className="space-y-2">
                  {topQueries.slice(0, 10).map((q, i) => (
                    <div key={q.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 w-6">{i + 1}.</span>
                        <span className="text-slate-900 dark:text-white">{q.normalizedQuery}</span>
                        {q.contentCreated && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {q.category && (
                          <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                            {q.category}
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                          {q.totalCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Trending This Week
              </h3>
            </div>
            <div className="p-4">
              {trending.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No trending queries yet. Need more historical data.
                </p>
              ) : (
                <div className="space-y-2">
                  {trending.map((q, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-900 dark:text-white">{q.query}</span>
                        {q.isNew && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-mono text-sm">
                        +{Math.round(q.growthRate * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Content Suggestions
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              High-volume queries without existing content
            </p>
          </div>
          <div className="p-4">
            {suggestions.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No content suggestions yet. Need more search data.
              </p>
            ) : (
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">
                          &ldquo;{s.query}&rdquo;
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {s.suggestion}
                        </p>
                        <div className="flex gap-2">
                          {s.category && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                              {s.category}
                            </span>
                          )}
                          {s.intent && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                              {s.intent}
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded">
                            {s.count} searches
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMarkContentCreated(s.query)}
                        disabled={markingContent === s.query}
                        className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                      >
                        {markingContent === s.query ? 'Marking...' : 'Mark Created'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Category Distribution</h3>
          </div>
          <div className="p-4">
            {categories.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No categorized queries yet.
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((c, i) => {
                  const maxCount = categories[0]?.count || 1
                  const percentage = (c.count / maxCount) * 100
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-300">
                          {c.category || 'Uncategorized'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {c.count}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
