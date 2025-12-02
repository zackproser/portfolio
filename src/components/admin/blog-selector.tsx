"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  FileText, 
  Calendar,
  Loader2,
  Check
} from "lucide-react"

interface BlogPost {
  slug: string
  directorySlug: string
  title: string
  description: string
  date: string
  type: string
}

interface BlogSelectorProps {
  selectedSlug: string | null
  onSelect: (slug: string | null) => void
}

export function BlogSelector({ selectedSlug, onSelect }: BlogSelectorProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/newsletter/blogs")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.directorySlug.toLowerCase().includes(query)
    )
  })

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading blog posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Select a blog post to repurpose
      </label>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Post List */}
      <div className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
        {filteredPosts.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {searchQuery ? "No posts match your search" : "No blog posts available"}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {filteredPosts.map((post) => (
              <button
                key={post.directorySlug}
                onClick={() => onSelect(selectedSlug === post.directorySlug ? null : post.directorySlug)}
                className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                  selectedSlug === post.directorySlug
                    ? "bg-purple-50 dark:bg-purple-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedSlug === post.directorySlug
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400"
                }`}>
                  {selectedSlug === post.directorySlug ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium truncate ${
                    selectedSlug === post.directorySlug
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-slate-800 dark:text-slate-200"
                  }`}>
                    {post.title}
                  </h4>
                  {post.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.date)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSlug && (
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300">
          Selected: <strong>{posts.find(p => p.directorySlug === selectedSlug)?.title}</strong>
        </div>
      )}
    </div>
  )
}


