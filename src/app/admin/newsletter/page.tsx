'use client'

import { useState, useEffect } from 'react'
import { Plus, Send, BarChart3, Eye, Trash2, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateNewsletterModal } from '@/components/admin/CreateNewsletterModal'
import { NewsletterCard } from '@/components/admin/NewsletterCard'
import { PreviewModal } from '@/components/admin/PreviewModal'
import { StatsModal } from '@/components/admin/StatsModal'

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
  updatedAt: string
}

export default function NewsletterAdminPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [statsId, setStatsId] = useState<string | null>(null)

  useEffect(() => {
    loadNewsletters()
  }, [])

  const loadNewsletters = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/newsletter/list')

      if (response.status === 401) {
        setError('You must be logged in to access the newsletter admin.')
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to load newsletters: ${response.statusText}`)
      }

      const data = await response.json()
      setNewsletters(data.newsletters || [])
    } catch (err: any) {
      console.error('Error loading newsletters:', err)
      setError(err.message || 'Failed to load newsletters')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCreating(true)
  }

  const handleCreated = () => {
    setCreating(false)
    loadNewsletters()
  }

  const handlePreview = (id: string) => {
    setPreviewId(id)
  }

  const handleStats = (id: string) => {
    setStatsId(id)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
      loadNewsletters()
    } catch (error) {
      console.error('Error deleting newsletter:', error)
      alert('Failed to delete newsletter')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Sticky on mobile */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Newsletters
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {newsletters.length} total
              </p>
            </div>

            {/* Desktop create button */}
            <Button
              onClick={handleCreate}
              className="hidden sm:flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Newsletter
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6">
        {error ? (
          <div className="max-w-2xl mx-auto">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                    Access Denied
                  </h3>
                  <p className="text-red-800 dark:text-red-300 mb-4">
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.href = '/api/auth/signin'}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No newsletters yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first newsletter to get started
            </p>
            <Button onClick={handleCreate} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Newsletter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                onUpdate={loadNewsletters}
                onPreview={handlePreview}
                onStats={handleStats}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile only) */}
      <button
        onClick={handleCreate}
        className="sm:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl active:scale-95 transition-all z-30"
        aria-label="Create newsletter"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modals */}
      {creating && (
        <CreateNewsletterModal
          onClose={() => setCreating(false)}
          onCreated={handleCreated}
        />
      )}

      {previewId && (
        <PreviewModal
          newsletterId={previewId}
          onClose={() => setPreviewId(null)}
        />
      )}

      {statsId && (
        <StatsModal
          newsletterId={statsId}
          onClose={() => setStatsId(null)}
        />
      )}
    </div>
  )
}
