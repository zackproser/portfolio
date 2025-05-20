'use client'

import React from 'react'
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const getToolColor = (index) => {
  const colors = [
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(255, 99, 132, 0.7)',   // Red
    'rgba(75, 192, 192, 0.7)',   // Green
    'rgba(255, 159, 64, 0.7)',   // Orange
    'rgba(153, 102, 255, 0.7)',  // Purple
  ]
  return colors[index % colors.length]
}

const RadarComparison = ({ tools }) => {
  // Define key metrics to compare
  const metrics = [
    { key: 'performance', label: 'Performance', path: 'usage_stats.performance_score' },
    { key: 'features', label: 'Feature Set', path: 'feature_count' },
    { key: 'usability', label: 'Usability', path: 'user_reviews.usability_score' },
    { key: 'support', label: 'Support', path: 'support.response_time_inverse' },
    { key: 'ecosystem', label: 'Ecosystem', path: 'integrations.count' },
    { key: 'pricing', label: 'Value', path: 'pricing.value_score' }
  ]
  
  // Function to extract value from nested object path
  const getValueByPath = (obj, path) => {
    const parts = path.split('.')
    let current = obj
    
    for (const part of parts) {
      if (current === undefined || current === null) return 0
      current = current[part]
    }
    
    return current || 0
  }
  
  // Normalize values to 0-10 scale for radar chart
  const normalizeValue = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 0
    // Ensure value is in range 0-10
    return Math.min(10, Math.max(0, value))
  }
  
  // Calculate derived metrics for features
  const enrichedTools = tools.map(tool => {
    const enriched = { ...tool }
    
    // Create feature count metric based on features object
    if (tool.features && typeof tool.features === 'object') {
      const featureCount = Object.values(tool.features).filter(Boolean).length
      enriched.feature_count = normalizeValue(featureCount * 2) // Scale to 0-10
    } else {
      enriched.feature_count = 0
    }
    
    // Create integrations count
    if (tool.integrations && Array.isArray(tool.integrations)) {
      enriched.integrations = { 
        ...tool.integrations,
        count: normalizeValue(tool.integrations.length)
      }
    } else {
      enriched.integrations = { count: 0 }
    }
    
    // Create support response time inverse (lower is better, so invert)
    if (tool.support && tool.support.response_time) {
      const responseTime = parseFloat(tool.support.response_time)
      // Invert so lower response times get higher scores
      enriched.support = {
        ...tool.support,
        response_time_inverse: responseTime ? normalizeValue(10 - Math.min(responseTime, 10)) : 5
      }
    } else {
      enriched.support = { response_time_inverse: 5 } // Default score
    }
    
    // Create pricing value score
    if (tool.pricing) {
      const hasFree = tool.pricing.free_tier ? 5 : 0
      const pricingValue = tool.pricing.highest_tier_price ? 
        normalizeValue(10 - (Math.min(tool.pricing.highest_tier_price, 200) / 20)) : 5
      
      enriched.pricing = {
        ...tool.pricing,
        value_score: (hasFree + pricingValue) / 2
      }
    } else {
      enriched.pricing = { value_score: 5 }
    }
    
    // Add defaults for user reviews if missing
    if (!tool.user_reviews) {
      enriched.user_reviews = { usability_score: 5 }
    }
    
    // Add default for performance if missing
    if (!tool.usage_stats || !tool.usage_stats.performance_score) {
      enriched.usage_stats = {
        ...tool.usage_stats || {},
        performance_score: 5
      }
    }
    
    return enriched
  })
  
  // Prepare chart data
  const chartData = {
    labels: metrics.map(m => m.label),
    datasets: enrichedTools.map((tool, index) => ({
      label: tool.name,
      data: metrics.map(metric => normalizeValue(getValueByPath(tool, metric.path))),
      backgroundColor: getToolColor(index).replace('0.7', '0.2'),
      borderColor: getToolColor(index),
      borderWidth: 2,
      pointBackgroundColor: getToolColor(index),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: getToolColor(index),
      pointRadius: 4,
      pointHoverRadius: 6
    }))
  }
  
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 2,
          callback: (value) => value.toString()
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return metrics[tooltipItems[0].dataIndex].label
          },
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.raw || 0
            return `${label}: ${value.toFixed(1)}/10`
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.2 // Smooth lines slightly
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-12">
      <h2 className="text-2xl font-bold mb-4">Feature Comparison Radar</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        This radar chart helps visualize how each tool performs across key metrics. 
        Hover over data points for more details.
      </p>
      <div className="h-[480px] w-full max-w-3xl mx-auto">
        <Radar data={chartData} options={chartOptions} />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <div key={metric.key} className="border rounded p-3 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-medium mb-2">{metric.label}</h3>
            <div className="grid grid-cols-2 gap-2">
              {enrichedTools.map((tool, index) => (
                <div key={tool.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getToolColor(index) }}
                  />
                  <span className="text-sm">
                    {tool.name}: {normalizeValue(getValueByPath(tool, metric.path)).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RadarComparison 