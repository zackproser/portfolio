'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Link as LinkIcon, ExternalLink, Globe, Check } from 'lucide-react'
import Link from 'next/link'
import YoutubeEmbed from './YoutubeEmbed'

const ComparisonTable = ({ sections, tool1, tool2 }) => {
  const renderValue = (value, type) => {
    if (!value) return <span className="text-gray-400">—</span>

    switch (type) {
      case 'link':
        return (
          <Link 
            href={value} 
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors rounded-md border border-blue-200 px-3 py-1.5 text-sm font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon size={14} />
            {formatLink(value)}
            <ExternalLink size={12} className="ml-1 opacity-70" />
          </Link>
        )

      case 'video':
        return <YoutubeEmbed urls={value} />

      case 'languages':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-2">
              {value.map((lang, i) => (
                <Badge key={i} variant="outline" className="px-2 py-1">
                  {typeof lang === 'object' ? JSON.stringify(lang) : lang}
                </Badge>
              ))}
            </div>
          )
        }
        return <Badge variant="outline" className="px-2 py-1">{value}</Badge>

      case 'localization':
        return (
          <Badge variant="outline" className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
            <Globe className="mr-1 inline-block" size={14} />
            {value}
          </Badge>
        )

      case 'count':
        return (
          <span className="text-lg font-semibold">{value || 0}</span>
        )

      default:
        if (typeof value === 'boolean') {
          return value ? <Check className="text-green-600" size={20} /> : <span className="text-gray-400">—</span>
        }
        
        // Handle complex objects like pricing
        if (typeof value === 'object' && value !== null) {
          // Special handling for pricing objects
          if (value.model && value.tiers) {
            return (
              <div className="space-y-2">
                <div><span className="font-medium">Model:</span> {value.model}</div>
                <div className="space-y-1">
                  {value.tiers.map((tier, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{tier.name}:</span> {tier.price}
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          
          // For other objects, stringify for now
          return (
            <div className="text-sm overflow-hidden text-ellipsis">
              {Object.entries(value).map(([key, val]) => (
                <div key={key} className="mb-1">
                  <span className="font-medium">{formatLabel(key)}:</span>{' '}
                  {typeof val !== 'object' ? 
                    val?.toString() : 
                    (Array.isArray(val) ? val.join(', ') : JSON.stringify(val))}
                </div>
              ))}
            </div>
          )
        }
        
        return value?.toString() || ''
    }
  }

  const formatLink = (url) => {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      
      // Format case study links
      if (path.includes('case-studies')) {
        return path.split('/').pop()
      }
      
      // Format blog links
      if (urlObj.hostname.includes('blog')) {
        return 'Blog'
      }
      
      return urlObj.hostname.replace('www.', '')
    } catch (e) {
      return url
    }
  }
  
  const formatLabel = (text) => {
    return text
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              {section.icon && <section.icon className="mr-2" size={20} />}
              {section.title}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                    {tool1?.name || 'Platform 1'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                    {tool2?.name || 'Platform 2'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {section.features.map((feature) => (
                  <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium">
                      {feature.name}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {renderValue(feature.value1, feature.type)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {renderValue(feature.value2, feature.type)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ComparisonTable 