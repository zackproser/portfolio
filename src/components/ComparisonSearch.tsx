'use client'

import React, { useState } from 'react'
import { ArticleWithSlug } from '@/lib/shared-types'
import { BlogPostCard } from '@/components/BlogPostCard'

export default function ComparisonSearch({ comparisons }: { comparisons: ArticleWithSlug[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComparisons = comparisons.filter(comparison =>
    comparison.title ? String(comparison.title).toLowerCase().includes(searchTerm.toLowerCase()) : false
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Search comparisons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline mb-6"
      />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {filteredComparisons.map((comparison, index) => (
          <BlogPostCard key={index} article={{...comparison, type: 'comparison'}} />
        ))}
      </div>
    </div>
  )
}