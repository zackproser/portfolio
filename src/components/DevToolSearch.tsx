'use client'

import { useState } from 'react'
import { ArticleWithSlug } from '@/lib/shared-types'
import DevToolCard from './DevToolCard'

export default function DevToolSearch({ tools }: { tools: ArticleWithSlug[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderToolDetails = (tool: ArticleWithSlug) => (
    <div>
      <h2>{tool.name}</h2>
      <p>{tool.description}</p>
      {tool.pricing && (
        <div>
          <h3>Pricing</h3>
          <p>Model: {tool.pricing.model}</p>
          {tool.pricing.tiers && (
            <ul>
              {tool.pricing.tiers.map((tier, index) => (
                <li key={index}>{tier.name}: {tier.price}</li>
              ))}
            </ul>
          )}
          {tool.pricing.discounts && <p>Discounts: {tool.pricing.discounts}</p>}
          {tool.pricing.payment_methods && (
            <p>Payment Methods: {tool.pricing.payment_methods.join(', ')}</p>
          )}
        </div>
      )}
      {tool.business_info && (
        <div>
          <h3>Business Information</h3>
          <p>Funding: {tool.business_info.funding}</p>
          <p>Revenue: {tool.business_info.revenue}</p>
          <p>Employees: {tool.business_info.employee_count}</p>
          <p>Founded: {tool.business_info.founding_year}</p>
          <p>Headquarters: {tool.business_info.headquarters}</p>
        </div>
      )}
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
