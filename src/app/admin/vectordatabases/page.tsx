import { getVectorDatabasesWithMetrics, getDataQualitySummaryFromDb, getDataSources } from '@/lib/vector-database-service'
import { VectorDatabaseAdminClient } from './vector-database-admin-client'

// Force dynamic rendering - admin pages shouldn't be statically generated
export const dynamic = 'force-dynamic'

export default async function VectorDatabaseAdminPage() {
  const [databases, qualitySummary, dataSources] = await Promise.all([
    getVectorDatabasesWithMetrics(),
    getDataQualitySummaryFromDb(),
    getDataSources(),
  ])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Vector Database Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage vector database entries and verify data quality
        </p>
      </div>

      {/* Data Quality Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Databases</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {qualitySummary.totalDatabases}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Metrics</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {qualitySummary.totalMetrics}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Verified</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {qualitySummary.verifiedMetrics} ({qualitySummary.verifiedPercentage}%)
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Beta Banner Status</div>
          <div className={`text-2xl font-bold ${
            qualitySummary.canRemoveBetaBanner
              ? 'text-green-600 dark:text-green-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}>
            {qualitySummary.canRemoveBetaBanner ? 'Can Remove' : 'Still Showing'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600 dark:text-slate-400">Verification Progress</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {qualitySummary.verifiedPercentage}% / 80% to remove banner
          </span>
        </div>
        <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              qualitySummary.verifiedPercentage >= 80
                ? 'bg-green-500'
                : qualitySummary.verifiedPercentage >= 50
                ? 'bg-blue-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${qualitySummary.verifiedPercentage}%` }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
            style={{ left: '80%' }}
          />
        </div>
      </div>

      {/* Database List */}
      <VectorDatabaseAdminClient
        databases={databases}
        dataSources={dataSources}
      />
    </div>
  )
}
