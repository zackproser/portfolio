'use client'

import { useState } from 'react'
import { BlogPostCard } from '@/components/BlogPostCard'
import { type ArticleWithSlug } from '@/lib/shared-types'

export default function ArticleSearch({ articles }: { articles: ArticleWithSlug[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter((article: ArticleWithSlug) => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded-md"
      />
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {filteredArticles.map((article: ArticleWithSlug) => (
            <BlogPostCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}

