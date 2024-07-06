'use client'

import { useState } from 'react'
import { Tool } from '@/types/Tool'
import DevToolCard from './DevToolCard'

export default function DevToolSearch({ tools }: { tools: Tool[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTools = tools.filter(tool =>
    tool.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <DevToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}