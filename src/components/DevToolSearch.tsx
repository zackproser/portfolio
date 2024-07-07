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

  const renderToolDetails = (tool) => (
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
      {/* Add more sections for other new properties */}
    </div>
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
          <DevToolCard key={tool.slug} tool={tool} renderToolDetails={renderToolDetails} />
        ))}
      </div>
    </div>
  )
}