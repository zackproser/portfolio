'use client'

import { useState } from 'react'
import { Send, Eye, BarChart3, Trash2, Sparkles, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface Newsletter {
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  bulletPoints: string[]
  contentMdx: string | null
  sentAt: string | null
  publishedAt: string | null
  emailsSent: number
  emailsOpened: number
  emailsClicked: number
  createdAt: string
}

interface NewsletterCardProps {
  newsletter: Newsletter
  onUpdate: () => void
  onPreview: (id: string) => void
  onStats: (id: string) => void
  onDelete: (id: string, title: string) => void
}

export function NewsletterCard({
  newsletter,
  onUpdate,
  onPreview,
  onStats,
  onDelete
}: NewsletterCardProps) {
  const [expanding, setExpanding] = useState(false)
  const [sending, setSending] = useState(false)

  const handleExpand = async () => {
    setExpanding(true)
    try {
      const response = await fetch(`/api/admin/newsletter/${newsletter.id}/expand`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to expand')
      onUpdate()
    } catch (error) {
      console.error('Error expanding:', error)
      alert('Failed to expand newsletter')
    } finally {
      setExpanding(false)
    }
  }

  const handleSend = async () => {
    if (!newsletter.contentMdx) {
      alert('Please expand the newsletter first')
      return
    }

    const subscriberCount = 2700 // TODO: Get from API
    if (!confirm(`Send "${newsletter.title}" to ${subscriberCount} subscribers?\n\nThis will publish to your website and send emails.`)) {
      return
    }

    setSending(true)
    try {
      const response = await fetch(`/api/admin/newsletter/${newsletter.id}/send`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to send')
      const data = await response.json()
      alert(`✅ Newsletter sent successfully!\n\nPublished at: ${data.publishedUrl}`)
      onUpdate()
    } catch (error: any) {
      console.error('Error sending:', error)
      alert(`Failed to send newsletter: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = () => {
    switch (newsletter.status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Draft
          </span>
        )
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Sent
          </span>
        )
      default:
        return null
    }
  }

  const openRate = newsletter.emailsSent > 0
    ? Math.round((newsletter.emailsOpened / newsletter.emailsSent) * 100)
    : 0

  const clickRate = newsletter.emailsOpened > 0
    ? Math.round((newsletter.emailsClicked / newsletter.emailsOpened) * 100)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              {newsletter.sentAt && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(newsletter.sentAt), { addSuffix: true })}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 break-words">
              {newsletter.title}
            </h3>
            {newsletter.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {newsletter.description}
              </p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(newsletter.id, newsletter.title)}
            className="ml-2 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bullet points preview (for drafts) */}
        {newsletter.status === 'draft' && newsletter.bulletPoints.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Points:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {newsletter.bulletPoints.slice(0, 3).map((point, i) => (
                <li key={i} className="line-clamp-1">• {point}</li>
              ))}
              {newsletter.bulletPoints.length > 3 && (
                <li className="text-xs text-gray-500">
                  +{newsletter.bulletPoints.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Stats (if sent) */}
        {newsletter.status === 'sent' && newsletter.emailsSent > 0 && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {newsletter.emailsSent.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                {newsletter.emailsOpened.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Opened</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                {newsletter.emailsClicked.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Clicked</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                {openRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {newsletter.status === 'draft' && !newsletter.contentMdx && (
            <Button
              onClick={handleExpand}
              disabled={expanding}
              className="flex-1 sm:flex-initial"
              size="sm"
            >
              {expanding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Expanding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Expand with AI
                </>
              )}
            </Button>
          )}

          {newsletter.contentMdx && newsletter.status === 'draft' && (
            <>
              <Button
                onClick={() => onPreview(newsletter.id)}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending}
                size="sm"
                className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </>
                )}
              </Button>
            </>
          )}

          {newsletter.status === 'sent' && (
            <>
              <Button
                onClick={() => onStats(newsletter.id)}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Stats
              </Button>
              <Button
                onClick={() => window.open(`/newsletter/${newsletter.slug}`, '_blank')}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
