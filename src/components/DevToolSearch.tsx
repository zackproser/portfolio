'use client'

import { useState } from 'react'
import { ArticleWithSlug } from '@/lib/shared-types'
import { BlogPostCard } from './BlogPostCard'

interface Tool {
  title: string
  description: string
  slug: string
  date: string
  author: {
    name: string
    role: string
  }
  type: string
}

export function DevToolSearch({ tools }: { tools: ArticleWithSlug[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter((tool) => {
    const searchContent = tool.title.toLowerCase()
    return searchContent.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-900/10 px-3 py-2 placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <BlogPostCard key={tool.slug} article={tool} />
        ))}
      </div>
    </div>
  )
}
