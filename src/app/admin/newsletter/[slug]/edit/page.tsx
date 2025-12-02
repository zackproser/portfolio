"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle, ExternalLink, FileCode, Eye } from "lucide-react"
import { NewsletterEditor } from "@/components/admin/newsletter-editor"
import { NewsletterPreview } from "@/components/admin/newsletter-preview"

interface NewsletterMetadata {
  title: string
  description: string
  date: string
  author: string
  image?: string
}

interface NewsletterEpisode {
  slug: string
  metadata: NewsletterMetadata
  content?: string
}

interface EditNewsletterPageProps {
  params: Promise<{ slug: string }>
}

export default function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [episode, setEpisode] = useState<NewsletterEpisode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExport, setShowExport] = useState(false)

  useEffect(() => {
    async function fetchEpisode() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/newsletter")
        if (!response.ok) {
          throw new Error("Failed to fetch episodes")
        }
        const data = await response.json()
        const found = data.episodes?.find(
          (ep: NewsletterEpisode) => ep.slug === resolvedParams.slug
        )
        if (!found) {
          throw new Error("Episode not found")
        }
        setEpisode(found)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisode()
  }, [resolvedParams.slug])

  async function handleSave(data: {
    slug: string
    metadata: NewsletterMetadata
    content: string
  }) {
    const response = await fetch("/api/admin/newsletter", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: resolvedParams.slug,
        metadata: data.metadata,
        content: data.content,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to save episode")
    }

    // Update local state
    setEpisode({
      slug: resolvedParams.slug,
      metadata: data.metadata,
      content: data.content,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-slate-600">Loading episode...</span>
        </div>
      </div>
    )
  }

  if (error || !episode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900">
            <Link href="/admin/newsletter">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 dark:text-red-400">{error || "Episode not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900">
            <Link href="/admin/newsletter">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Edit Episode
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowExport(!showExport)}
          >
            {showExport ? (
              <>
                <FileCode className="w-4 h-4 mr-2" />
                Hide Export
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview & Export
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/newsletter/${resolvedParams.slug}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Link>
          </Button>
        </div>
      </div>

      {showExport && (
        <div className="mb-6">
          <NewsletterPreview slug={resolvedParams.slug} />
        </div>
      )}

      <NewsletterEditor
        initialMetadata={episode.metadata}
        initialContent={episode.content}
        slug={episode.slug}
        onSave={handleSave}
      />
    </div>
  )
}

