'use client'

import { useState } from 'react'
import debounce from 'lodash.debounce'
import { ContentCard } from './ContentCard'
import { type ArticleWithSlug } from '@/types'
import { track } from '@vercel/analytics'

export default function ArticleSearch({ articles }: { articles: ArticleWithSlug[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    debouncedTrack(query)
  }

  const debouncedTrack = debounce((query: string) => {
    track('blog-search', { term: query })
  }, 1200)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value)
  }

  const filteredArticles = articles.filter((article: ArticleWithSlug) => {
    const titleMatch = article.title ? String(article.title).toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const descriptionMatch = article.description ? String(article.description).toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return titleMatch || descriptionMatch;
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={handleInputChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded-md"
      />
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {filteredArticles.map((article: ArticleWithSlug, index) => (
            <ContentCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}
