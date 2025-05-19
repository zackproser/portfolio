'use client'

import React from 'react'
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react'

const ProsConsComparison = ({ tools }) => {
  // Function to extract pros and cons from tool data
  const extractProsAndCons = (tool) => {
    const pros = []
    const cons = []
    
    // Add market position strengths to pros
    if (tool.market_position?.strengths?.length) {
      pros.push(...tool.market_position.strengths)
    }
    
    // Add unique selling points to pros
    if (tool.market_position?.unique_selling_points?.length) {
      pros.push(...tool.market_position.unique_selling_points)
    }
    
    // Add basic features to pros
    if (tool.features?.basic) {
      pros.push('Basic features included')
    }
    
    // Add limitations to cons
    if (tool.market_position?.limitations?.length) {
      cons.push(...tool.market_position.limitations)
    }
    
    // Add weaknesses to cons
    if (tool.market_position?.weaknesses?.length) {
      cons.push(...tool.market_position.weaknesses)
    }
    
    // If free tier is false, add as con
    if (tool.pricing?.free_tier === false) {
      cons.push('No free tier available')
    }
    
    // If we don't have enough pros/cons, add some defaults based on other data
    if (pros.length < 3) {
      if (tool.pricing?.free_tier) pros.push('Offers a free tier')
      if (tool.open_source?.client) pros.push('Open source client')
      if (tool.open_source?.backend) pros.push('Open source backend')
      if (tool.usage_stats?.number_of_users > 10000) pros.push('Large user community')
    }
    
    if (cons.length < 2) {
      if (!tool.pricing?.free_tier && !cons.includes('No free tier available')) {
        cons.push('No free tier available')
      }
      if (tool.pricing?.highest_tier_price > 50) {
        cons.push('Premium tiers can be expensive')
      }
      if (!tool.open_source?.client && !tool.open_source?.backend) {
        cons.push('Not open source')
      }
    }
    
    // Remove duplicates
    return {
      pros: [...new Set(pros)],
      cons: [...new Set(cons)]
    }
  }
  
  const toolsWithProsAndCons = tools.map(tool => ({
    ...tool,
    ...extractProsAndCons(tool)
  }))

  // Find what tool 1 has that tool 2 doesn't and vice versa
  const tool1UniqueFeatures = toolsWithProsAndCons[0].pros.filter(
    pro => !toolsWithProsAndCons[1].pros.includes(pro)
  )
  
  const tool2UniqueFeatures = toolsWithProsAndCons[1].pros.filter(
    pro => !toolsWithProsAndCons[0].pros.includes(pro)
  )
  
  // Find shared pros
  const sharedPros = toolsWithProsAndCons[0].pros.filter(
    pro => toolsWithProsAndCons[1].pros.includes(pro)
  )

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Strengths & Weaknesses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {toolsWithProsAndCons.map((tool, index) => (
          <div key={tool.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
              <h3 className="text-xl font-bold text-white">{tool.name}</h3>
            </div>
            
            <div className="p-5">
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <ThumbsUp className="text-green-500 mr-2" size={20} />
                  <h4 className="text-lg font-semibold">Pros</h4>
                </div>
                <ul className="space-y-2">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <div>
                        {pro}
                        {(index === 0 && tool1UniqueFeatures.includes(pro)) || 
                         (index === 1 && tool2UniqueFeatures.includes(pro)) ? (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Unique
                          </span>
                        ) : sharedPros.includes(pro) ? (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            Both
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <ThumbsDown className="text-red-500 mr-2" size={20} />
                  <h4 className="text-lg font-semibold">Cons</h4>
                </div>
                <ul className="space-y-2">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✗</div>
                      <div>{con}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Winner section - only show if there's a clear advantage */}
      {(tool1UniqueFeatures.length > tool2UniqueFeatures.length + 1 || 
        tool2UniqueFeatures.length > tool1UniqueFeatures.length + 1) && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-2">
            <ArrowRight className="text-blue-600 mr-2" size={20} />
            <h4 className="text-lg font-semibold">Advantage</h4>
          </div>
          <p>
            {tool1UniqueFeatures.length > tool2UniqueFeatures.length ? (
              <span>
                <strong>{tools[0].name}</strong> has {tool1UniqueFeatures.length - tool2UniqueFeatures.length} more unique strengths 
                than <strong>{tools[1].name}</strong>, giving it a potential advantage for most users.
              </span>
            ) : (
              <span>
                <strong>{tools[1].name}</strong> has {tool2UniqueFeatures.length - tool1UniqueFeatures.length} more unique strengths 
                than <strong>{tools[0].name}</strong>, giving it a potential advantage for most users.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProsConsComparison 