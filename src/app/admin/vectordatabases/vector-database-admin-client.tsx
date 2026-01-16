'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import type { DatabaseWithMetrics, FieldMetric } from '@/lib/vector-database-service'
import { verifyDatabaseFieldAction } from './actions'

interface DataSource {
  id: string;
  name: string;
  type: string;
  url: string | null;
}

interface VectorDatabaseAdminClientProps {
  databases: DatabaseWithMetrics[]
  dataSources: DataSource[]
}

export function VectorDatabaseAdminClient({ databases, dataSources }: VectorDatabaseAdminClientProps) {
  const [expandedDb, setExpandedDb] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<string | null>(null)

  const handleVerify = async (databaseId: string, fieldName: string, sourceId: string) => {
    setVerifying(`${databaseId}-${fieldName}`)
    try {
      await verifyDatabaseFieldAction(databaseId, fieldName, sourceId, 'admin')
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Failed to verify field:', error)
      alert('Failed to verify field. Please try again.')
    } finally {
      setVerifying(null)
    }
  }

  const getMetricForField = (metrics: FieldMetric[], fieldName: string): FieldMetric | undefined => {
    return metrics.find(m => m.fieldName === fieldName)
  }

  // Fields we track for verification
  const trackedFields = [
    { name: 'name', label: 'Name', category: 'Basic Info' },
    { name: 'description', label: 'Description', category: 'Basic Info' },
    { name: 'companyName', label: 'Company Name', category: 'Company' },
    { name: 'companyFounded', label: 'Founded Year', category: 'Company' },
    { name: 'companyFunding', label: 'Funding', category: 'Company' },
    { name: 'companyEmployees', label: 'Employees', category: 'Company' },
    { name: 'queryLatencyMs', label: 'Query Latency', category: 'Performance' },
    { name: 'indexingSpeed', label: 'Indexing Speed', category: 'Performance' },
    { name: 'memoryUsageMb', label: 'Memory Usage', category: 'Performance' },
    { name: 'scalabilityScore', label: 'Scalability Score', category: 'Performance' },
    { name: 'accuracyScore', label: 'Accuracy Score', category: 'Performance' },
  ]

  return (
    <div className="space-y-4">
      {databases.map(db => {
        const isExpanded = expandedDb === db._meta.id
        const verifiedCount = db._meta.metrics.filter(m => !m.isEstimate).length
        const totalCount = db._meta.metrics.length
        const percentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0

        return (
          <div
            key={db._meta.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedDb(isExpanded ? null : db._meta.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {db.name}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ({db._meta.slug || db.id})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {verifiedCount}/{totalCount}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                <div className="pt-4 space-y-4">
                  {/* Group fields by category */}
                  {['Basic Info', 'Company', 'Performance'].map(category => {
                    const categoryFields = trackedFields.filter(f => f.category === category)
                    return (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryFields.map(field => {
                            const metric = getMetricForField(db._meta.metrics, field.name)
                            const isVerified = metric && !metric.isEstimate
                            const verifyKey = `${db._meta.id}-${field.name}`

                            return (
                              <div
                                key={field.name}
                                className={`flex items-center justify-between p-2 rounded ${
                                  isVerified
                                    ? 'bg-green-50 dark:bg-green-900/20'
                                    : 'bg-amber-50 dark:bg-amber-900/20'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isVerified ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                  )}
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {field.label}
                                  </span>
                                </div>
                                {!isVerified && (
                                  <select
                                    className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleVerify(db._meta.id, field.name, e.target.value)
                                      }
                                    }}
                                    disabled={verifying === verifyKey}
                                    defaultValue=""
                                  >
                                    <option value="">
                                      {verifying === verifyKey ? 'Verifying...' : 'Mark as verified...'}
                                    </option>
                                    {dataSources.filter(s => s.type !== 'estimate').map(source => (
                                      <option key={source.id} value={source.id}>
                                        {source.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                {isVerified && metric?.source && (
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    via {metric.source.name}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}

                  {/* Quick Links */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-4">
                      <a
                        href={`/vectordatabases/detail/${db._meta.slug || db.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        View Public Page <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
