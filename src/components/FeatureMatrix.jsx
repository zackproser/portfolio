'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { sentenceCase } from '@/utils/sentencesCase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ComparisonTable from './ComparisonTable'

// Add CSS to fix the dropdown transparency
const dropdownStyles = `
  .dropdown-menu {
    background-color: white;
    opacity: 1 !important;
    backdrop-filter: none !important;
  }
  
  .dark .dropdown-menu {
    background-color: rgb(31, 41, 55);
    opacity: 1 !important;
    backdrop-filter: none !important;
  }
`

const featureCategories = [
  'pricing',
  'features',
  'integrations',
  'performance',
  'user_experience',
  'support',
]

const FeatureMatrix = ({ tools }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(featureCategories)
  const [sortByDifference, setSortByDifference] = useState(false)

  const toggleCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  const toggleAllCategories = () => {
    if (expandedCategories.length === featureCategories.length) {
      setExpandedCategories([])
    } else {
      setExpandedCategories([...featureCategories])
    }
  }

  // Extract all potential feature keys from both tools
  const getAllFeatureKeys = (toolData) => {
    const keys = {}
    
    // Skip metadata properties
    const skipProps = ['name', 'icon', 'category', 'description', 'website']
    
    for (const tool of toolData) {
      Object.keys(tool)
        .filter(key => !skipProps.includes(key))
        .forEach(category => {
          if (!keys[category]) {
            keys[category] = new Set()
          }
          
          if (typeof tool[category] === 'object' && tool[category] !== null) {
            Object.keys(tool[category]).forEach(feature => {
              keys[category].add(feature)
            })
          } else {
            keys[category].add('value')
          }
        })
    }
    
    return Object.entries(keys).reduce((acc, [category, features]) => {
      acc[category] = Array.from(features)
      return acc
    }, {})
  }

  const allFeatures = getAllFeatureKeys(tools)

  const compareValues = (val1, val2) => {
    // Both undefined or null
    if ((val1 === undefined || val1 === null) && (val2 === undefined || val2 === null)) {
      return 'neutral'
    }
    
    // One has value, other doesn't
    if ((val1 && !val2) || (!val1 && val2)) {
      return val1 ? 'tool1-better' : 'tool2-better'
    }
    
    // Both are booleans
    if (typeof val1 === 'boolean' && typeof val2 === 'boolean') {
      if (val1 === val2) return 'neutral'
      return val1 ? 'tool1-better' : 'tool2-better'
    }
    
    // Arrays - compare length
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length === val2.length) return 'neutral'
      return val1.length > val2.length ? 'tool1-better' : 'tool2-better'
    }
    
    return 'neutral'
  }

  const filterFeatures = (categoryKeys, searchTerm) => {
    if (!searchTerm) return categoryKeys
    
    return categoryKeys.filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Prepare sections for ComparisonTable
  const prepareSections = () => {
    const sections = [];
    
    Object.entries(allFeatures)
      .filter(([category]) => expandedCategories.includes(category))
      .forEach(([category, features]) => {
        const filteredFeatures = filterFeatures(features, searchTerm);
        
        if (filteredFeatures.length > 0) {
          // Convert features to the format expected by ComparisonTable
          const tableFeatures = filteredFeatures.map(feature => {
            const value1 = tools[0]?.[category]?.[feature];
            const value2 = tools[1]?.[category]?.[feature];
            const comparison = compareValues(value1, value2);
            
            // Determine feature type for proper rendering
            let type = 'default';
            if (typeof value1 === 'boolean' || typeof value2 === 'boolean') {
              type = 'boolean';
            } else if (Array.isArray(value1) || Array.isArray(value2)) {
              type = 'languages';
            }
            
            return {
              id: `${category}-${feature}`,
              name: sentenceCase(feature),
              value1,
              value2,
              type,
              comparison
            };
          });
          
          if (sortByDifference) {
            tableFeatures.sort((a, b) => {
              const diffOrder = { 'tool1-better': -1, 'tool2-better': 1, 'neutral': 0 };
              return diffOrder[a.comparison] - diffOrder[b.comparison];
            });
          }
          
          sections.push({
            id: category,
            title: sentenceCase(category),
            features: tableFeatures
          });
        }
      });
      
    return sections;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <style jsx global>{dropdownStyles}</style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Feature Matrix</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search features..."
              className="pl-8 dropdown-menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAllCategories}
            className="whitespace-nowrap"
          >
            {expandedCategories.length === featureCategories.length ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Expand All
              </>
            )}
          </Button>
          <Button
            variant={sortByDifference ? "default" : "outline"}
            size="sm"
            onClick={() => setSortByDifference(!sortByDifference)}
            className="whitespace-nowrap"
          >
            Show Differences First
          </Button>
        </div>
      </div>
      
      <div>
        {featureCategories.map(category => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-lg font-semibold">{sentenceCase(category)}</h3>
              {expandedCategories.includes(category) ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        ))}
      </div>
      
      {/* Use ComparisonTable for rendering features */}
      <ComparisonTable 
        sections={prepareSections()} 
        tool1={tools[0]} 
        tool2={tools[1]} 
      />
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Legend:</p>
        <div className="flex items-center mt-2">
          <CheckCircle className="text-green-500 mr-2" size={16} />
          <span>Feature available</span>
        </div>
        <div className="flex items-center mt-1">
          <XCircle className="text-red-500 mr-2" size={16} />
          <span>Feature not available</span>
        </div>
        <div className="flex items-center mt-1">
          <HelpCircle className="text-gray-400 mr-2" size={16} />
          <span>Information not available</span>
        </div>
      </div>
    </div>
  )
}

export default FeatureMatrix 