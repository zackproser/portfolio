'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RadarChartProps {
  tools: Array<{
    id: string
    name: string
    scores: Record<string, number>
  }>
  metrics: Array<{
    id: string
    name: string
    weight: number
  }>
}

interface RadarPoint {
  x: number
  y: number
}

const calculateRadarPoint = (angle: number, radius: number, centerX: number, centerY: number): RadarPoint => {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

const getScoreColor = (score: number) => {
  if (score >= 8) return '#10b981' // green-500
  if (score >= 6) return '#f59e0b' // amber-500
  if (score >= 4) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

export function RadarChart({ tools, metrics }: RadarChartProps) {
  const centerX = 150
  const centerY = 150
  const maxRadius = 120
  const numLevels = 5
  
  // Amplify differences for visual clarity
  const amplifyDifference = (scoreA: number, scoreB: number) => {
    const diff = scoreA - scoreB;
    const amplificationFactor = 1.5; // Make differences more visible
    const amplifiedDiff = diff * amplificationFactor;
    
    // Ensure scores stay within 0-10 range
    const newScoreA = Math.min(10, Math.max(0, 5 + amplifiedDiff));
    const newScoreB = Math.min(10, Math.max(0, 5 - amplifiedDiff));
    
    return { scoreA: newScoreA, scoreB: newScoreB };
  };
  
  // Generate grid circles
  const gridCircles = Array.from({ length: numLevels }, (_, i) => {
    const radius = (maxRadius / numLevels) * (i + 1)
    return (
      <circle
        key={i}
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    )
  })
  
  // Generate grid lines
  const gridLines = metrics.map((_, index) => {
    const angle = (2 * Math.PI * index) / metrics.length - Math.PI / 2
    const endPoint = calculateRadarPoint(angle, maxRadius, centerX, centerY)
    return (
      <line
        key={index}
        x1={centerX}
        y1={centerY}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    )
  })
  
  // Generate metric labels
  const metricLabels = metrics.map((metric, index) => {
    const angle = (2 * Math.PI * index) / metrics.length - Math.PI / 2
    const labelRadius = maxRadius + 20
    const labelPoint = calculateRadarPoint(angle, labelRadius, centerX, centerY)
    
    return (
      <text
        key={index}
        x={labelPoint.x}
        y={labelPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium fill-gray-600"
      >
        {metric.name}
      </text>
    )
  })
  
  // Generate tool polygons with amplified differences
  const toolPolygons = tools.map((tool, toolIndex) => {
    const points = metrics.map((metric, metricIndex) => {
      const angle = (2 * Math.PI * metricIndex) / metrics.length - Math.PI / 2
      const originalScore = tool.scores[metric.id] || 0
      
      // Amplify differences if we have two tools
      let score = originalScore;
      if (tools.length === 2) {
        const otherTool = tools[toolIndex === 0 ? 1 : 0];
        const otherScore = otherTool.scores[metric.id] || 0;
        const { scoreA, scoreB } = amplifyDifference(originalScore, otherScore);
        score = toolIndex === 0 ? scoreA : scoreB;
      }
      
      const radius = (score / 10) * maxRadius
      const point = calculateRadarPoint(angle, radius, centerX, centerY)
      return `${point.x},${point.y}`
    }).join(' ')
    
    const color = getScoreColor(tool.scores[metrics[0]?.id] || 0)
    
    return (
      <g key={toolIndex}>
        <polygon
          points={points}
          fill={`${color}20`}
          stroke={color}
          strokeWidth="2"
          fillOpacity="0.3"
        />
        {/* Tool name label */}
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className="text-xs font-medium"
          fill={color}
        >
          {tool.name}
        </text>
      </g>
    )
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">At-a-Glance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {gridCircles}
            {gridLines}
            {metricLabels}
            {toolPolygons}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {tools.map((tool, index) => {
            const color = getScoreColor(tool.scores[metrics[0]?.id] || 0)
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span>{tool.name}</span>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Higher scores indicate better performance in each category.</p>
        </div>
      </CardContent>
    </Card>
  )
}