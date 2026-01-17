import {
  getTopQueries,
  getTrendingQueries,
  getCategoryDistribution,
  getContentSuggestions,
} from '@/lib/query-tracking-service'
import { InsightsClient } from './insights-client'

export const dynamic = 'force-dynamic'

export default async function InsightsPage() {
  const [topQueries, trending, categories, suggestions] = await Promise.all([
    getTopQueries({ limit: 20, days: 30 }),
    getTrendingQueries(10),
    getCategoryDistribution(undefined, 30),
    getContentSuggestions(10),
  ])

  // Get source-specific data (source values must match tracking code)
  const [vectorDbQueries, devToolsQueries] = await Promise.all([
    getTopQueries({ source: 'vectordatabases', limit: 10, days: 30 }),
    getTopQueries({ source: 'devtools', limit: 10, days: 30 }),
  ])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Search Insights
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Understand what users are searching for to create better content
        </p>
      </div>

      <InsightsClient
        topQueries={topQueries}
        trending={trending}
        categories={categories}
        suggestions={suggestions}
        vectorDbQueries={vectorDbQueries}
        devToolsQueries={devToolsQueries}
      />
    </div>
  )
}
