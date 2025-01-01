'use client'

import { useState } from 'react'
import { BaseArticleWithSlug } from '@/lib/shared-types'
import { BlogPostCard } from './BlogPostCard'

interface Tool {
  name: string
  description: string
  slug?: string
  author?: string
  date?: string
}

export default function DevToolSearch({ tools }: { tools: Tool[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Cast tools to BaseArticleWithSlug
  const castedTools: BaseArticleWithSlug[] = tools.map(tool => ({
    slug: tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-'),
    title: tool.name,
    description: tool.description,
    author: tool.author || 'Zachary Proser',
    date: tool.date || new Date().toISOString().split('T')[0],
    type: 'tool'
  }))

  const filteredTools = castedTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <BlogPostCard key={tool.slug} article={tool} />
        ))}
      </div>
    </div>
  )
}
