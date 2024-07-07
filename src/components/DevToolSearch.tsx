'use client'

import { useState } from 'react'
import { ArticleWithSlug } from '@/lib/shared-types'
import DevToolCard from './DevToolCard'

export default function DevToolSearch({ tools }: { tools: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Cast tools to ArticleWithSlug
  const castedTools: ArticleWithSlug[] = tools.map(tool => ({
    slug: tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-'),
    title: tool.name,
    description: tool.description, 
    author: tool.author || 'Unknown', 
    date: tool.date || new Date().toISOString(), 
  }))

  const filteredTools = castedTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const renderToolDetails = (tool: ArticleWithSlug) => (
    <div>
      <h2 className="text-xl font-bold">{tool.title}</h2>
      <p className="mt-2 text-gray-600">{tool.description}</p>
      <div className="">

      </div>
    </div>
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded-md"
      />
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <DevToolCard key={tool.slug} tool={tool} renderToolDetails={renderToolDetails} />
          ))}
        </div>
      </div>
    </div>
  )
}
