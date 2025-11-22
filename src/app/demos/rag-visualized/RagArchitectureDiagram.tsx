'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Server, Database, Cpu, ArrowRight, Zap, Layers } from 'lucide-react'

interface RagArchitectureDiagramProps {
  currentStepIndex: number
  stepTitle?: string
  // Data for showing actual content in animations
  query?: string
  queryEmbedding?: number[] | null
  retrievalResults?: Array<{ chunk: { id: string; text: string; docTitle: string }; score: number }>
  composedPrompt?: string
  generatedAnswer?: string
}

interface Component {
  id: string
  label: string
  icon: typeof Globe
  x: number
  y: number
  color: string
  description: string
}

interface DataFlow {
  from: string
  to: string
  label: string
  color: string
  animated: boolean
  direction: 'forward' | 'backward' | 'bidirectional'
}

// Full system layout - components positioned in corners for maximum breathing room
const COMPONENTS: Component[] = [
  {
    id: 'user',
    label: 'User Browser',
    icon: Globe,
    x: 20,
    y: 15,
    color: 'blue',
    description: 'Client-side interface'
  },
  {
    id: 'server',
    label: 'App Server',
    icon: Server,
    x: 20,
    y: 100,
    color: 'emerald',
    description: 'Next.js application'
  },
  {
    id: 'embedding',
    label: 'Embedding Model',
    icon: Layers,
    x: 210,
    y: 15,
    color: 'cyan',
    description: 'text-embedding-3-small'
  },
  {
    id: 'llm',
    label: 'LLM API',
    icon: Cpu,
    x: 210,
    y: 70,
    color: 'purple',
    description: 'OpenAI API'
  },
  {
    id: 'vectorDb',
    label: 'Vector DB',
    icon: Database,
    x: 210,
    y: 100,
    color: 'amber',
    description: 'Pinecone'
  }
]

const STEP_FLOWS: Record<number, DataFlow[]> = {
  0: [
    {
      from: 'user',
      to: 'server',
      label: 'Query text',
      color: 'blue',
      animated: true,
      direction: 'forward'
    }
  ],
  1: [
    {
      from: 'server',
      to: 'embedding',
      label: 'Embed request',
      color: 'emerald',
      animated: true,
      direction: 'forward'
    },
    {
      from: 'embedding',
      to: 'server',
      label: 'Embedding vector',
      color: 'emerald',
      animated: true,
      direction: 'backward'
    }
  ],
  2: [
    {
      from: 'server',
      to: 'vectorDb',
      label: 'Query vector',
      color: 'purple',
      animated: true,
      direction: 'forward'
    },
    {
      from: 'vectorDb',
      to: 'server',
      label: 'Similarity scores',
      color: 'purple',
      animated: true,
      direction: 'backward'
    }
  ],
  3: [
    {
      from: 'vectorDb',
      to: 'server',
      label: 'Top chunks',
      color: 'amber',
      animated: true,
      direction: 'backward'
    }
  ],
  4: [
    {
      from: 'server',
      to: 'server',
      label: 'Compose prompt',
      color: 'indigo',
      animated: true,
      direction: 'forward'
    }
  ],
  5: [
    {
      from: 'server',
      to: 'llm',
      label: 'Grounded prompt',
      color: 'indigo',
      animated: true,
      direction: 'forward'
    },
    {
      from: 'llm',
      to: 'server',
      label: 'Generated answer',
      color: 'green',
      animated: true,
      direction: 'backward'
    },
    {
      from: 'server',
      to: 'user',
      label: 'Response + citations',
      color: 'green',
      animated: true,
      direction: 'forward'
    }
  ]
}

function getPath(from: Component, to: Component): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  
  // Self-loop for same component (internal processing) - LARGER for step-specific view
  if (from.id === to.id) {
    return `M ${from.x} ${from.y - 15} A 8 8 0 1 1 ${from.x} ${from.y + 15} A 8 8 0 1 1 ${from.x} ${from.y - 15}`
  }
  
  // Calculate control points for smooth bezier curves
  // For paths going to/from the server (hub), use more pronounced curves
  const isServerInvolved = from.id === 'server' || to.id === 'server'
  const isEmbeddingInvolved = from.id === 'embedding' || to.id === 'embedding'
  
  if (isServerInvolved || isEmbeddingInvolved) {
    // Server-centric paths: create smooth curves
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2
    
    // Control point offset - larger for more pronounced curves
    const controlOffset = Math.abs(dx) * 0.3 + Math.abs(dy) * 0.3
    
    // Determine curve direction based on flow
    let cp1x, cp1y, cp2x, cp2y
    
    if (from.id === 'server' || from.id === 'embedding') {
      // From server or embedding: curve outward then to destination
      cp1x = from.x + (dx > 0 ? controlOffset : -controlOffset) * 0.5
      cp1y = from.y + (dy > 0 ? controlOffset : -controlOffset) * 0.5
      cp2x = to.x - (dx > 0 ? controlOffset : -controlOffset) * 0.3
      cp2y = to.y - (dy > 0 ? controlOffset : -controlOffset) * 0.3
    } else if (to.id === 'server' || to.id === 'embedding') {
      // To server or embedding: curve from source then into destination
      cp1x = from.x + (dx > 0 ? controlOffset : -controlOffset) * 0.3
      cp1y = from.y + (dy > 0 ? controlOffset : -controlOffset) * 0.3
      cp2x = to.x - (dx > 0 ? controlOffset : -controlOffset) * 0.5
      cp2y = to.y - (dy > 0 ? controlOffset : -controlOffset) * 0.5
    } else {
      // Between other components: gentle curve
      cp1x = midX + (dy !== 0 ? controlOffset * 0.5 : 0)
      cp1y = midY + (dx !== 0 ? controlOffset * 0.5 : 0)
      cp2x = midX - (dy !== 0 ? controlOffset * 0.5 : 0)
      cp2y = midY - (dx !== 0 ? controlOffset * 0.5 : 0)
    }
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
  } else {
    // Direct paths between non-server components: simple curve
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2
    const controlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.2
    
    const cp1x = midX + (dy !== 0 ? controlOffset : 0)
    const cp1y = midY + (dx !== 0 ? controlOffset : 0)
    const cp2x = midX - (dy !== 0 ? controlOffset : 0)
    const cp2y = midY - (dx !== 0 ? controlOffset : 0)
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
  }
}

function getColorClass(color: string): string {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    green: 'text-green-600 dark:text-green-400',
    cyan: 'text-cyan-600 dark:text-cyan-400'
  }
  return colors[color] || 'text-zinc-600 dark:text-zinc-400'
}

function getStrokeColor(color: string): string {
  const colors: Record<string, string> = {
    blue: '#3b82f6',
    emerald: '#10b981',
    purple: '#a855f7',
    amber: '#f59e0b',
    indigo: '#6366f1',
    green: '#22c55e',
    cyan: '#06b6d4'
  }
  return colors[color] || '#71717a'
}

// Robust positioning utility with boundary detection and collision avoidance
interface BoxPosition {
  x: number
  y: number
  placement: 'above' | 'below' | 'left' | 'right'
}

interface PositionBoxParams {
  componentX: number
  componentY: number
  boxWidth: number
  boxHeight: number
  viewBoxWidth: number
  viewBoxHeight: number
  componentRadius?: number
  minPadding?: number
  otherComponents?: Array<{ x: number; y: number; radius?: number }>
}

function calculateSafeBoxPosition(params: PositionBoxParams): BoxPosition {
  const {
    componentX,
    componentY,
    boxWidth,
    boxHeight,
    viewBoxWidth,
    viewBoxHeight,
    componentRadius = 10,
    minPadding = 5,
    otherComponents = []
  } = params

  const halfWidth = boxWidth / 2
  const halfHeight = boxHeight / 2
  // Spacing to ensure clearance from icon (extends 8px) and label (extends to y+19)
  // Need enough space so boxes don't obscure the component
  const safeSpacing = 25 // Increased from 20 to match main positioning logic

  // Try positions in order of preference: left, right, above, below
  // Left/right first to allow side-by-side positioning for input/output pairs
  const candidates: Array<{ x: number; y: number; placement: 'above' | 'below' | 'left' | 'right' }> = [
    // Left - ensure it's to the left of icon with clearance
    {
      x: componentX - 8 - safeSpacing - boxWidth,
      y: componentY - halfHeight,
      placement: 'left'
    },
    // Right - ensure it's to the right of icon with clearance
    {
      x: componentX + 8 + safeSpacing,
      y: componentY - halfHeight,
      placement: 'right'
    },
    // Above - ensure it's above the icon with clearance
    {
      x: componentX - halfWidth,
      y: componentY - safeSpacing - boxHeight,
      placement: 'above'
    },
    // Below - ensure it's below the label (componentY + 19) with clearance
    {
      x: componentX - halfWidth,
      y: componentY + 19 + safeSpacing,
      placement: 'below'
    }
  ]

  // Find the first position that fits within bounds and doesn't collide
  for (const candidate of candidates) {
    // Check viewBox boundaries
    const fitsHorizontally = candidate.x >= 0 && candidate.x + boxWidth <= viewBoxWidth
    const fitsVertically = candidate.y >= 0 && candidate.y + boxHeight <= viewBoxHeight

    if (!fitsHorizontally || !fitsVertically) {
      // Adjust to fit within bounds while keeping anchor point
      if (!fitsHorizontally) {
        if (candidate.x < 0) {
          candidate.x = minPadding
        } else if (candidate.x + boxWidth > viewBoxWidth) {
          candidate.x = viewBoxWidth - boxWidth - minPadding
        }
      }
      if (!fitsVertically) {
        if (candidate.y < 0) {
          candidate.y = minPadding
        } else if (candidate.y + boxHeight > viewBoxHeight) {
          candidate.y = viewBoxHeight - boxHeight - minPadding
        }
      }
    }

    // Check collision with other components (including icon and label areas)
    const collides = otherComponents.some(comp => {
      const compRadius = comp.radius || 10
      const compCenterX = comp.x
      const compCenterY = comp.y
      
      // Box bounds
      const boxLeft = candidate.x
      const boxRight = candidate.x + boxWidth
      const boxTop = candidate.y
      const boxBottom = candidate.y + boxHeight
      
      // Component icon area (icon is 16x16, centered at component position)
      const iconLeft = compCenterX - 8
      const iconRight = compCenterX + 8
      const iconTop = compCenterY - 8
      const iconBottom = compCenterY + 8
      
      // Component label area (label rect is 36x5, positioned at y + 14)
      const labelLeft = compCenterX - 18
      const labelRight = compCenterX + 18
      const labelTop = compCenterY + 14
      const labelBottom = compCenterY + 19
      
      // Component circle bounds (with extra padding for glow effects)
      const compLeft = compCenterX - compRadius - 5
      const compRight = compCenterX + compRadius + 5
      const compTop = compCenterY - compRadius - 5
      const compBottom = compCenterY + compRadius + 5
      
      // Check for overlap with icon, label, or component circle
      // Padding to ensure visual clearance (reduced from 8 to allow more flexibility)
      const padding = 5
      const overlapsIcon = !(boxRight + padding < iconLeft || boxLeft - padding > iconRight || 
                            boxBottom + padding < iconTop || boxTop - padding > iconBottom)
      const overlapsLabel = !(boxRight + padding < labelLeft || boxLeft - padding > labelRight || 
                              boxBottom + padding < labelTop || boxTop - padding > labelBottom)
      const overlapsComponent = !(boxRight + padding < compLeft || boxLeft - padding > compRight || 
                                  boxBottom + padding < compTop || boxTop - padding > compBottom)
      
      return overlapsIcon || overlapsLabel || overlapsComponent
    })

    if (!collides && candidate.x >= 0 && candidate.y >= 0 && 
        candidate.x + boxWidth <= viewBoxWidth && candidate.y + boxHeight <= viewBoxHeight) {
      return candidate
    }
  }

  // Fallback: position at top-left corner with padding
  return {
    x: Math.max(minPadding, Math.min(componentX - halfWidth, viewBoxWidth - boxWidth - minPadding)),
    y: Math.max(minPadding, Math.min(componentY - safeSpacing - boxHeight - 8, viewBoxHeight - boxHeight - minPadding)),
    placement: 'above'
  }
}

// Get data snippet for display in animated packets - simplified for architectural view
function getDataSnippet(
  flow: DataFlow,
  stepIndex: number,
  props: RagArchitectureDiagramProps
): string {
  return flow.label
}

export default function RagArchitectureDiagram(props: RagArchitectureDiagramProps) {
  const { currentStepIndex, stepTitle } = props
  const [animatingFlows, setAnimatingFlows] = useState<Set<string>>(new Set())
  const svgRef = useRef<SVGSVGElement>(null)

  const activeFlows = STEP_FLOWS[currentStepIndex] || []
  const activeComponents = new Set<string>()
  activeFlows.forEach(flow => {
    activeComponents.add(flow.from)
    activeComponents.add(flow.to)
  })

  useEffect(() => {
    // Reset animations when step changes
    setAnimatingFlows(new Set())
    
    // Trigger animations for active flows
    const timer = setTimeout(() => {
      const flows = STEP_FLOWS[currentStepIndex] || []
      flows.forEach(flow => {
        setAnimatingFlows(prev => new Set(prev).add(`${flow.from}-${flow.to}`))
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [currentStepIndex])

  return (
    <div className="flex w-full flex-col">
      <div className="relative w-full rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-700 dark:bg-zinc-900/50">
        <svg
          ref={svgRef}
          viewBox="0 0 230 120"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ height: '500px', maxHeight: '600px' }}
        >
          <defs>
            {/* Gradients for components */}
            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="serverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="llmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="vectorDbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="embeddingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>

            {/* Arrow markers - LARGER for step-specific view */}
            <marker
              id="arrowhead-forward"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
            </marker>
            <marker
              id="arrowhead-backward"
              markerWidth="10"
              markerHeight="10"
              refX="2"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 10 0 L 0 5 L 10 10" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
            </marker>

            {/* Animated gradient for data flow */}
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3">
                <animate
                  attributeName="stop-opacity"
                  values="0.3;1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="currentColor" stopOpacity="1">
                <animate
                  attributeName="stop-opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.3">
                <animate
                  attributeName="stop-opacity"
                  values="0.3;1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Step Title on Canvas - Visible on all screens */}
          {stepTitle && (
            <text
              x="115"
              y="8"
              textAnchor="middle"
              fontSize="5"
              fontWeight="bold"
              fill="#374151"
              className="dark:fill-zinc-300"
              opacity="0.8"
            >
              {stepTitle}
            </text>
          )}

          {/* Draw ALL data flow paths - dim inactive, highlight active */}
          {COMPONENTS.flatMap(fromComp => 
            COMPONENTS.map(toComp => {
              // Find if this is an active flow for current step
              const activeFlow = activeFlows.find(f => f.from === fromComp.id && f.to === toComp.id)
              const isActive = !!activeFlow
              
              // Only draw if there's a flow defined (active or historical)
              const hasHistoricalFlow = STEP_FLOWS[0].some(f => f.from === fromComp.id && f.to === toComp.id) ||
                                       STEP_FLOWS[1].some(f => f.from === fromComp.id && f.to === toComp.id) ||
                                       STEP_FLOWS[2].some(f => f.from === fromComp.id && f.to === toComp.id) ||
                                       STEP_FLOWS[3].some(f => f.from === fromComp.id && f.to === toComp.id) ||
                                       STEP_FLOWS[4].some(f => f.from === fromComp.id && f.to === toComp.id) ||
                                       STEP_FLOWS[5].some(f => f.from === fromComp.id && f.to === toComp.id)
              
              if (!isActive && !hasHistoricalFlow) {
                return null
              }
              
              const flow = activeFlow || { from: fromComp.id, to: toComp.id, label: '', color: 'zinc', animated: false, direction: 'forward' as const }
              return { flow, fromComp, toComp, isActive }
            })
          ).filter((item): item is { flow: DataFlow; fromComp: Component; toComp: Component; isActive: boolean } => item !== null).map(({ flow, fromComp, toComp, isActive }, index) => {

            const pathId = `${flow.from}-${flow.to}-${index}`
            const path = getPath(fromComp, toComp)
            const isAnimating = isActive && animatingFlows.has(`${flow.from}-${flow.to}`)
            const strokeColor = getStrokeColor(flow.color)
            const midX = (fromComp.x + toComp.x) / 2
            const midY = (fromComp.y + toComp.y) / 2

            return (
              <g key={pathId}>
                {/* Path background - dimmed for inactive flows */}
                <path
                  d={path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.5"
                  strokeOpacity={isActive ? "0.2" : "0.05"}
                  strokeDasharray="2 3"
                />
                {/* Animated path with moving dot - only for active flows */}
                {isAnimating && (
                  <>
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeOpacity="0.9"
                      strokeLinecap="round"
                      markerEnd={flow.direction === 'forward' ? 'url(#arrowhead-forward)' : flow.direction === 'backward' ? 'url(#arrowhead-backward)' : undefined}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                    {/* Glow effect for active path - THICKER */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="4"
                      strokeOpacity="0.3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                    {/* Animated data packet moving along path */}
                    {fromComp.id !== toComp.id && (
                      <g>
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={path}
                        >
                          <g>
                            {/* Data packet background - MUCH LARGER for step-specific view */}
                            <rect
                              x="-35"
                              y="-6"
                              width="70"
                              height="12"
                              rx="6"
                              fill="white"
                              fillOpacity="0.98"
                              stroke={strokeColor}
                              strokeWidth="0.7"
                              className="dark:fill-zinc-900"
                            >
                              <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </rect>
                            {/* Data content - LARGER font showing actual input/output values */}
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fontSize="2.8"
                              fill={strokeColor}
                              fillOpacity="1"
                              fontWeight="700"
                            >
                              {getDataSnippet(flow, currentStepIndex, props)}
                              <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </text>
                            {/* Trailing dots - LARGER */}
                            <circle
                              cx="-20"
                              cy="0"
                              r="1"
                              fill={strokeColor}
                              fillOpacity="0.8"
                            >
                              <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                dur="2s"
                                repeatCount="indefinite"
                                begin="0.1s"
                              />
                            </circle>
                            <circle
                              cx="20"
                              cy="0"
                              r="1"
                              fill={strokeColor}
                              fillOpacity="0.8"
                            >
                              <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                dur="2s"
                                repeatCount="indefinite"
                                begin="0.2s"
                              />
                            </circle>
                          </g>
                        </animateMotion>
                      </g>
                    )}
                    {/* Pulse effect for self-loops - LARGER */}
                    {fromComp.id === toComp.id && (
                      <motion.circle
                        cx={fromComp.x}
                        cy={fromComp.y - 15}
                        r="2"
                        fill={strokeColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />
                    )}
                  </>
                )}
                {/* Label - more elegant */}
                {isAnimating && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {fromComp.id === toComp.id ? (
                      // Self-loop label (internal processing) - LARGER
                      <>
                        <rect
                          x={fromComp.x - 18}
                          y={fromComp.y - 22}
                          width="36"
                          height="6"
                          rx="3"
                          fill="white"
                          fillOpacity="0.98"
                          stroke={strokeColor}
                          strokeWidth="0.4"
                          strokeOpacity="0.5"
                          className="dark:fill-zinc-900"
                        />
                        <text
                          x={fromComp.x}
                          y={fromComp.y - 17}
                          textAnchor="middle"
                          fontSize="3"
                          fill={strokeColor}
                          fillOpacity="1"
                          fontWeight="700"
                          className="dark:fill-opacity-100"
                        >
                          {flow.label}
                        </text>
                      </>
                    ) : (
                      // Regular label - LARGER
                      <>
                        <rect
                          x={midX - 18}
                          y={midY - 5}
                          width="36"
                          height="6"
                          rx="3"
                          fill="white"
                          fillOpacity="0.98"
                          stroke={strokeColor}
                          strokeWidth="0.4"
                          strokeOpacity="0.5"
                          className="dark:fill-zinc-900"
                        />
                        <text
                          x={midX}
                          y={midY - 1}
                          textAnchor="middle"
                          fontSize="3"
                          fill={strokeColor}
                          fillOpacity="1"
                          fontWeight="700"
                          className="dark:fill-opacity-100"
                        >
                          {flow.label}
                        </text>
                      </>
                    )}
                  </motion.g>
                )}
              </g>
            )
          })}

          {/* Draw ALL components - dim inactive, highlight active */}
          {COMPONENTS.map((component) => {
            const Icon = component.icon
            const isActive = activeComponents.has(component.id)
            const colorClass = getColorClass(component.color)
            const gradientId = `${component.id}Gradient`
            const strokeColor = getStrokeColor(component.color)
            const opacity = isActive ? 1 : 0.3 // Dim inactive components

            return (
              <g key={component.id} opacity={opacity}>
                {/* Outer glow for active components */}
                {isActive && (
                  <motion.circle
                    cx={component.x}
                    cy={component.y}
                    r="14"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    initial={{ r: 14, opacity: 0.5 }}
                    animate={{ r: 22, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                )}

                {/* Component background circle with shadow */}
                <motion.circle
                  cx={component.x}
                  cy={component.y + 0.5}
                  r="10"
                  fill="rgba(0,0,0,0.1)"
                  opacity={isActive ? 0.3 : 0.1}
                />
                <motion.circle
                  cx={component.x}
                  cy={component.y}
                  r="10"
                  fill={`url(#${gradientId})`}
                  stroke={isActive ? strokeColor : '#d1d5db'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.5
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                
                {/* Pulse effect for active components */}
                {isActive && (
                  <motion.circle
                    cx={component.x}
                    cy={component.y}
                    r="10"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.2"
                    initial={{ r: 10, opacity: 0.6 }}
                    animate={{ r: 18, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                )}

                {/* Icon */}
                <foreignObject
                  x={component.x - 8}
                  y={component.y - 8}
                  width="16"
                  height="16"
                >
                  <div className={`flex h-full w-full items-center justify-center ${colorClass}`}>
                    <Icon className={`h-6 w-6 ${isActive ? 'drop-shadow-md' : ''}`} strokeWidth={isActive ? 3 : 2.5} />
                  </div>
                </foreignObject>

                {/* Component label with background */}
                <g>
                  <rect
                    x={component.x - 18}
                    y={component.y + 14}
                    width="36"
                    height="5"
                    rx="2.5"
                    fill="white"
                    fillOpacity={isActive ? 0.98 : 0.7}
                    stroke={isActive ? strokeColor : '#d1d5db'}
                    strokeWidth="0.5"
                    className="dark:fill-zinc-900 dark:stroke-zinc-700"
                  />
                  <text
                    x={component.x}
                    y={component.y + 17}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill={isActive ? '#1f2937' : '#6b7280'}
                    fontWeight={isActive ? 'bold' : '700'}
                    className="dark:fill-zinc-200"
                  >
                    {component.label}
                  </text>
                </g>
              </g>
            )
          })}

          {/* Input/Output Containers on Canvas - Restored and Styled Minimally */}
          {(() => {
            // Define data content for each component based on step
            const getComponentData = (compId: string) => {
              const data: { label: string; value: string; type: 'input' | 'output' }[] = []
              
              if (compId === 'user') {
                if (currentStepIndex === 0 && props.query) {
                  data.push({ label: 'Query', value: `"${props.query}"`, type: 'output' })
                }
                if (currentStepIndex === 5 && props.generatedAnswer) {
                  data.push({ label: 'Answer', value: props.generatedAnswer.slice(0, 60) + '...', type: 'input' })
                }
              }
              
              if (compId === 'server') {
                if (currentStepIndex === 0 && props.query) {
                  data.push({ label: 'Input', value: `"${props.query}"`, type: 'input' })
                }
                if (currentStepIndex === 1) {
                  data.push({ label: 'To Embed', value: `"${props.query}"`, type: 'output' })
                  if (props.queryEmbedding) {
                    data.push({ label: 'Vector', value: `[${props.queryEmbedding.slice(0,3).join(',')},...]`, type: 'input' })
                  }
                }
                if (currentStepIndex === 2) {
                   data.push({ label: 'Query Vec', value: 'Float32[1536]', type: 'output' })
                }
                if (currentStepIndex === 3 && props.retrievalResults) {
                   data.push({ label: 'Context', value: `${props.retrievalResults.length} chunks`, type: 'input' })
                }
                if (currentStepIndex === 4) {
                   data.push({ label: 'Prompt', value: 'System + Context + Query', type: 'output' })
                }
                if (currentStepIndex === 5) {
                   if (props.generatedAnswer) {
                     data.push({ label: 'Response', value: props.generatedAnswer.slice(0, 40) + '...', type: 'output' })
                   }
                }
              }

              if (compId === 'embedding' && currentStepIndex === 1) {
                 data.push({ label: 'Input', value: `"${props.query}"`, type: 'input' })
                 if (props.queryEmbedding) {
                   data.push({ label: 'Output', value: `[${props.queryEmbedding.slice(0,3).join(',')},...]`, type: 'output' })
                 }
              }

              if (compId === 'vectorDb') {
                if (currentStepIndex === 2) {
                  data.push({ label: 'Search', value: 'Cosine Similarity', type: 'input' })
                }
                if (currentStepIndex === 3 && props.retrievalResults) {
                  data.push({ label: 'Result', value: `Top ${props.retrievalResults.length} matches`, type: 'output' })
                }
              }

              if (compId === 'llm' && currentStepIndex === 5) {
                 data.push({ label: 'Context', value: 'Grounded Prompt', type: 'input' })
                 if (props.generatedAnswer) {
                   data.push({ label: 'Gen', value: 'Streamed tokens...', type: 'output' })
                 }
              }

              return data
            }

            return COMPONENTS.flatMap(comp => {
              const boxData = getComponentData(comp.id)
              if (boxData.length === 0) return []

              // Calculate positions for multiple boxes
              return boxData.map((data, idx) => {
                const isInput = data.type === 'input'
                const boxHeight = 24
                const boxWidth = 70
                
                // Naive positioning - optimize with calculateSafeBoxPosition in a real scenario
                // For now, inputs on left/top, outputs on right/bottom relative to component
                let pos = { x: comp.x, y: comp.y }
                
                // Offset logic to avoid overlap
                if (comp.id === 'server') {
                   pos = isInput ? { x: comp.x - 60, y: comp.y } : { x: comp.x + 60, y: comp.y }
                } else if (comp.id === 'user') {
                   pos = { x: comp.x + 50, y: comp.y }
                } else if (comp.id === 'embedding') {
                   pos = isInput ? { x: comp.x - 50, y: comp.y } : { x: comp.x, y: comp.y + 40 }
                } else if (comp.id === 'vectorDb') {
                   pos = isInput ? { x: comp.x - 50, y: comp.y } : { x: comp.x, y: comp.y - 40 }
                } else if (comp.id === 'llm') {
                   pos = isInput ? { x: comp.x - 50, y: comp.y } : { x: comp.x, y: comp.y + 40 }
                }

                const safePos = calculateSafeBoxPosition({
                  componentX: comp.x,
                  componentY: comp.y,
                  boxWidth,
                  boxHeight,
                  viewBoxWidth: 230,
                  viewBoxHeight: 120,
                  otherComponents: COMPONENTS.filter(c => c.id !== comp.id).map(c => ({ x: c.x, y: c.y }))
                })

                return (
                  <motion.g
                    key={`${comp.id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <rect
                      x={safePos.x}
                      y={safePos.y}
                      width={boxWidth}
                      height={boxHeight}
                      rx="4"
                      fill="white"
                      fillOpacity="0.9"
                      stroke={data.type === 'input' ? '#3b82f6' : '#10b981'}
                      strokeWidth="0.5"
                      className="dark:fill-zinc-900/90"
                    />
                    <text
                      x={safePos.x + 4}
                      y={safePos.y + 8}
                      fontSize="4"
                      fontWeight="bold"
                      fill={data.type === 'input' ? '#1d4ed8' : '#047857'}
                      className={data.type === 'input' ? 'dark:fill-blue-400' : 'dark:fill-emerald-400'}
                    >
                      {data.label}
                    </text>
                    <text
                      x={safePos.x + 4}
                      y={safePos.y + 16}
                      fontSize="3.5"
                      fill="#52525b"
                      className="dark:fill-zinc-400"
                    >
                      {data.value.length > 25 ? data.value.slice(0,24) + '...' : data.value}
                    </text>
                  </motion.g>
                )
              })
            })
          })()}
          
        </svg>
      </div>

    </div>
  )
}

