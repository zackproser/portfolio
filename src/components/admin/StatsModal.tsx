'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, ExternalLink, TrendingUp, Users, MousePointer, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Stats {
  newsletter: {
    id: string
    title: string
    slug: string
    status: string
    sentAt: string | null
    publishedAt: string | null
    broadcastId: string | null
  }
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
  }
  rates: {
    delivery: number
    open: number
    click: number
    bounce: number
  }
  publishedUrl: string
}

interface StatsModalProps {
  newsletterId: string
  onClose: () => void
}

export function StatsModal({ newsletterId, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/newsletter/${newsletterId}/stats`)
      if (!response.ok) throw new Error('Failed to load stats')
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [newsletterId])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 w-full sm:max-w-3xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Newsletter Analytics
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">
                Failed to load stats: {error}
              </p>
            </div>
          ) : stats ? (
            <>
              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stats.newsletter.title}
                </h3>
                {stats.newsletter.sentAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sent {new Date(stats.newsletter.sentAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                )}
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Sent"
                  value={stats.stats.sent.toLocaleString()}
                  color="blue"
                />
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Delivered"
                  value={stats.stats.delivered.toLocaleString()}
                  subValue={`${stats.rates.delivery}%`}
                  color="green"
                />
                <StatCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Opened"
                  value={stats.stats.opened.toLocaleString()}
                  subValue={`${stats.rates.open}%`}
                  color="purple"
                />
                <StatCard
                  icon={<MousePointer className="w-5 h-5" />}
                  label="Clicked"
                  value={stats.stats.clicked.toLocaleString()}
                  subValue={`${stats.rates.click}%`}
                  color="indigo"
                />
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Performance Metrics
                </h4>

                <MetricBar
                  label="Delivery Rate"
                  percentage={stats.rates.delivery}
                  color="green"
                  description={`${stats.stats.delivered} of ${stats.stats.sent} emails delivered`}
                />

                <MetricBar
                  label="Open Rate"
                  percentage={stats.rates.open}
                  color="purple"
                  description={`${stats.stats.opened} of ${stats.stats.delivered} emails opened`}
                  benchmark={25}
                  benchmarkLabel="Industry avg: 25%"
                />

                <MetricBar
                  label="Click Rate"
                  percentage={stats.rates.click}
                  color="indigo"
                  description={`${stats.stats.clicked} of ${stats.stats.opened} emails clicked`}
                  benchmark={15}
                  benchmarkLabel="Industry avg: 15%"
                />

                {stats.stats.bounced > 0 && (
                  <MetricBar
                    label="Bounce Rate"
                    percentage={stats.rates.bounce}
                    color="red"
                    description={`${stats.stats.bounced} emails bounced`}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => window.open(stats.publishedUrl, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Published Newsletter
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </div>
      {subValue && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
          {subValue}
        </div>
      )}
    </div>
  )
}

function MetricBar({
  label,
  percentage,
  color,
  description,
  benchmark,
  benchmarkLabel
}: {
  label: string
  percentage: number
  color: string
  description: string
  benchmark?: number
  benchmarkLabel?: string
}) {
  const colorClasses = {
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500'
  }

  const isAboveBenchmark = benchmark ? percentage >= benchmark : null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {label}
          </span>
          {isAboveBenchmark !== null && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isAboveBenchmark
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
            }`}>
              {isAboveBenchmark ? '✓ Above avg' : '↓ Below avg'}
            </span>
          )}
        </div>
        <span className="font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {benchmark && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500"
            style={{ left: `${benchmark}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
        {benchmarkLabel && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {benchmarkLabel}
          </p>
        )}
      </div>
    </div>
  )
}
