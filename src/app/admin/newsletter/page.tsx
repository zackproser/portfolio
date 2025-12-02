"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Eye,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react"

interface NewsletterMetadata {
  type: string
  author: string
  date: string
  title: string
  description: string
  image?: string
}

interface NewsletterEpisode {
  slug: string
  metadata: NewsletterMetadata
  content?: string
}

export default function NewsletterAdminPage() {
  const [episodes, setEpisodes] = useState<NewsletterEpisode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  async function fetchEpisodes() {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/admin/newsletter")
      if (!response.ok) {
        throw new Error("Failed to fetch episodes")
      }
      const data = await response.json()
      setEpisodes(data.episodes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Are you sure you want to delete the episode "${slug}"? This cannot be undone.`)) {
      return
    }

    try {
      setDeletingSlug(slug)
      const response = await fetch(`/api/admin/newsletter?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete episode")
      }

      // Remove from local state
      setEpisodes(episodes.filter(ep => ep.slug !== slug))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete episode")
    } finally {
      setDeletingSlug(null)
    }
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Newsletter Episodes
          </h1>
        </div>
        <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600">
          <Link href="/admin/newsletter/new">
            <Plus className="w-4 h-4 mr-2" />
            New Episode
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-slate-600">Loading episodes...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <Button onClick={fetchEpisodes} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      ) : episodes.length === 0 ? (
        <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Newsletter Episodes Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create your first newsletter episode to get started.
          </p>
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600">
            <Link href="/admin/newsletter/new">
              <Plus className="w-4 h-4 mr-2" />
              Create First Episode
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800">
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {episodes.map((episode) => (
              <div
                key={episode.slug}
                className="p-6 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {episode.metadata.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(episode.metadata.date)}
                      </span>
                    </div>
                    {episode.metadata.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                        {episode.metadata.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                      <span>Slug: {episode.slug}</span>
                      {episode.metadata.image && (
                        <>
                          <span>•</span>
                          <span>Has image</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-slate-600 hover:text-slate-800"
                    >
                      <Link href={`/newsletter/${episode.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Link href={`/admin/newsletter/${episode.slug}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(episode.slug)}
                      disabled={deletingSlug === episode.slug}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {deletingSlug === episode.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Tips</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Episodes are stored as MDX files in <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">src/content/newsletter/[date]/</code></li>
          <li>• Use the Link Builder to generate tracked URLs for your campaigns</li>
          <li>• Export HTML to copy directly into EmailOctopus</li>
        </ul>
      </div>
    </div>
  )
}




