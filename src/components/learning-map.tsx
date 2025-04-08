"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Database, Brain, BookOpen, Sparkles, Zap, BarChart, Layers, Code, GitBranch, Network, Settings, Scale, Wrench, FileText, Video, ScrollText, Laptop, Lock, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { track } from '@vercel/analytics'
import * as d3 from 'd3'

interface BaseNode {
  id: string
  title: string
  description: string
  position: { x: number; y: number }
  icon: React.ReactNode
  value: number
}

interface Topic extends BaseNode {
  resources: Resource[]
  difficulty: "beginner" | "intermediate" | "advanced"
  dependencies?: string[]
  phase: number
  track: string
  isParent: boolean
}

interface Resource extends BaseNode {
  type: "article" | "video" | "course" | "tool" | "paper" | "project"
  url: string
  parentId: string
  isResource: boolean
}

type Node = Topic | Resource

const isResource = (node: Node): node is Resource => {
  return 'type' in node && 'url' in node
}

const isTopic = (node: Node): node is Topic => {
  return 'resources' in node && 'difficulty' in node
}

// Add a constant for the local storage key
const COMPLETED_TOPICS_KEY = "learning-map-completed-topics"

// Helper function to get icon for resource type
const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case "article":
      return <FileText className="h-5 w-5 text-white" />
    case "video":
      return <Video className="h-5 w-5 text-white" />
    case "tool":
      return <Wrench className="h-5 w-5 text-white" />
    case "course":
      return <Laptop className="h-5 w-5 text-white" />
    case "paper":
      return <ScrollText className="h-5 w-5 text-white" />
    case "project":
      return <BookOpen className="h-5 w-5 text-white" />
    default:
      return <FileText className="h-5 w-5 text-white" />
  }
}

// Convert topics and their resources into nodes
const getAllNodes = (topics: Topic[]): Node[] => {
  const NODE_DENSITY = 0.15  // Reduced density to spread out nodes
  const RESOURCE_SPACING = 0.15  // Increased spacing
  const Y_SCALE = 0.5 // More vertical compression for better spacing
  const Y_OFFSET = 0.2 // Start 20% from top

  return topics.flatMap(topic => {
    // Normalize y position to be more compact
    const normalizedY = topic.position.y * Y_SCALE + Y_OFFSET
    const radius = Math.min(0.3, Math.max(0.15, (topic.resources.length * RESOURCE_SPACING) / (2 * Math.PI)))
    
    return [
      {
        ...topic,
        position: {
          x: topic.position.x * 0.8 + 0.1, // Keep topics more centered horizontally
          y: normalizedY
        },
        isParent: true
      },
      ...topic.resources.map((resource, idx) => {
        const angle = (Math.PI * 2 * idx) / topic.resources.length
        return {
          ...resource,
          id: `${topic.id}-resource-${idx}`,
          parentId: topic.id,
          position: {
            x: topic.position.x * 0.8 + 0.1 + Math.cos(angle) * radius * NODE_DENSITY,
            y: normalizedY + Math.sin(angle) * radius * NODE_DENSITY
          },
          icon: getResourceIcon(resource.type),
          value: 0.4,
          isResource: true
        }
      })
    ]
  })
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string
  position: { x: number; y: number }
  value: number
  isParent?: boolean
  isResource?: boolean
}

export default function LearningMap() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['core', 'data', 'tools', 'specialization']))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
  const [focusedCluster, setFocusedCluster] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number, y: number }>>(new Map())
  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(null)

  // Load completed topics from local storage on initial render
  useEffect(() => {
    const savedCompletedTopics = localStorage.getItem(COMPLETED_TOPICS_KEY)
    if (savedCompletedTopics) {
      try {
        const parsed = JSON.parse(savedCompletedTopics)
        if (Array.isArray(parsed)) {
          setCompletedNodes(parsed)
        }
      } catch (e) {
        console.error("Error loading completed topics from local storage:", e)
      }
    }
  }, [])

  // Save completed topics to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(completedNodes))
  }, [completedNodes])

  const topics: Topic[] = [
    // Phase 0: Introductions
    {
      id: "tokenization-guide",
      title: "How LLMs See Text",
      description: "Interactive exploration of how large language models tokenize input.",
      position: { x: 0.25, y: 0.05 },
      icon: <Database className="h-5 w-5 text-white" />,
      difficulty: "beginner",
      value: 0.4,
      phase: 0,
      track: "core",
      isParent: true,
      resources: [
        {
          id: "tokenization-guide-1",
          title: "Interactive Tokenization Demo",
          type: "tool",
          url: "/demos/tokenize",
          description: "How language models break down text input.",
          parentId: "tokenization-guide",
          position: { x: 0, y: 0 },
          icon: <Wrench className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },
    {
      id: "embedding-intro",
      title: "What Are Embeddings?",
      description: "Learn how embedding models represent meaning numerically.",
      position: { x: 0.75, y: 0.05 },
      icon: <Brain className="h-5 w-5 text-white" />,
      difficulty: "beginner",
      value: 0.4,
      phase: 0,
      track: "core",
      isParent: true,
      resources: [
        {
          id: "embedding-intro-1",
          title: "Interactive Embeddings Demo",
          type: "tool",
          url: "/demos/embeddings",
          description: "See how vectors are generated and compared.",
          parentId: "embedding-intro",
          position: { x: 0, y: 0 },
          icon: <Wrench className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "embedding-intro-2",
          title: "Introduction to Embeddings",
          type: "article",
          url: "/blog/introduction-to-embeddings",
          description: "Core concepts behind vector representations of text.",
          parentId: "embedding-intro",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },

    // Phase 3: Advanced Applications
    {
      id: "rag-systems",
      title: "Retrieval Augmented Generation",
      description: "Learn how to enhance LLMs with external knowledge through retrieval systems.",
      position: { x: 0.25, y: 0.6 },
      icon: <BookOpen className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.75,
      phase: 3,
      track: "data",
      dependencies: ["vector-databases", "prompt-engineering"],
      isParent: true,
      resources: [
        {
          id: "rag-systems-1",
          title: "What is Retrieval Augmented Generation?",
          type: "article",
          url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
          description: "High-level overview from Pinecone.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "rag-systems-2",
          title: "Premium RAG Pipeline Tutorial",
          type: "project",
          url: "/blog/rag-pipeline-tutorial",
          description: "Full-featured tutorial using Vercel AI SDK and Next.js.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <BookOpen className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "rag-systems-3",
          title: "Free LangChain + Pinecone RAG Walkthrough",
          type: "project",
          url: "/blog/langchain-pinecone-chat-with-my-blog",
          description: "Build a simple RAG app using LangChain and Pinecone.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <BookOpen className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "rag-systems-4",
          title: "YouTube: Build a Blog Chatbot with LangChain",
          type: "video",
          url: "https://www.youtube.com/watch?v=Bxj4btI3TzY&t=1s",
          description: "Step-by-step video walkthrough of the free RAG tutorial.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <Video className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "rag-systems-5",
          title: "Live Chat With Your Data (Demo)",
          type: "tool",
          url: "/chat",
          description: "Try the final product from the RAG pipeline tutorial — an interactive chatbot powered by your documents.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <Wrench className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "rag-systems-6",
          title: "Evaluating RAG in Production",
          type: "article",
          url: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/rag-evaluation/",
          description: "Evaluate quality and accuracy of your RAG pipeline in real-world use cases.",
          parentId: "rag-systems",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },
    {
      id: "fine-tuning",
      title: "Fine-tuning LLMs",
      description: "Techniques for adapting pre-trained models to specific tasks and domains.",
      position: { x: 0.75, y: 0.6 },
      icon: <Zap className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.7,
      phase: 3,
      track: "core",
      dependencies: ["prompt-engineering"],
      isParent: true,
      resources: [
        {
          id: "fine-tuning-1",
          title: "OpenAI Fine-tuning Guide",
          type: "article",
          url: "https://platform.openai.com/docs/guides/fine-tuning",
          description: "Step-by-step guide for fine-tuning OpenAI models.",
          parentId: "fine-tuning",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "fine-tuning-2",
          title: "Build a Custom Assistant",
          type: "project",
          url: "https://platform.openai.com/docs/tutorials/fine-tuning",
          description: "Create a fine-tuned assistant using your domain data.",
          parentId: "fine-tuning",
          position: { x: 0, y: 0 },
          icon: <BookOpen className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "fine-tuning-3",
          title: "LoRA & QLoRA: Lightweight Fine-Tuning",
          type: "article",
          url: "/blog/what-is-lora-and-qlora",
          description: "Intro to parameter-efficient fine-tuning techniques for modern LLMs.",
          parentId: "fine-tuning",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },

    // Phase 4: Specializations
    {
      id: "scaling-vector-infra",
      title: "Scaling Vector Infrastructure",
      description: "Learn how to scale RAG systems and vector databases using serverless architecture.",
      position: { x: 0.5, y: 0.75 },  // Moved down to avoid overlap
      icon: <Layers className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.55,
      phase: 4,
      track: "specialization",
      dependencies: ["rag-systems"],
      isParent: true,
      resources: [
        {
          id: "scaling-vector-infra-1",
          title: "Scaling Pinecone with Serverless",
          type: "article",
          url: "https://www.pinecone.io/learn/scaling-pinecone-serverless/",
          description: "Best practices for scaling vector search systems with Pinecone's serverless tech.",
          parentId: "scaling-vector-infra",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },
    {
      id: "secure-rag-fga",
      title: "Secure RAG with Fine-Grained Authorization",
      description: "Learn how to restrict access to RAG application results based on user identity and document permissions.",
      position: { x: 0.25, y: 0.9 },
      icon: <Lock className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.6,
      phase: 4,
      track: "specialization",
      dependencies: ["rag-systems", "fine-tuning"],
      isParent: true,
      resources: [
        {
          id: "secure-rag-fga-1",
          title: "Tutorial: Secure RAG Apps with WorkOS FGA",
          type: "article",
          url: "https://workos.com/blog/how-to-secure-rag-applications-with-fine-grained-authorization-tutorial-with-code",
          description: "Step-by-step guide to applying fine-grained access control to RAG applications.",
          parentId: "secure-rag-fga",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "secure-rag-fga-2",
          title: "Companion Code Repo",
          type: "project",
          url: "https://github.com/zackproser-workos/fga-pinecone-poc",
          description: "Source code and implementation example of secure RAG using WorkOS FGA + Pinecone.",
          parentId: "secure-rag-fga",
          position: { x: 0, y: 0 },
          icon: <BookOpen className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    },
    {
      id: "doc-access-control-fga",
      title: "Document Access Control with FGA & AWS",
      description: "Build access control using S3, Lambda Authorizers, and WorkOS FGA to secure document-based systems.",
      position: { x: 0.75, y: 0.9 },
      icon: <Shield className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.55,
      phase: 4,
      track: "specialization",
      dependencies: ["secure-rag-fga"],
      isParent: true,
      resources: [
        {
          id: "doc-access-control-fga-1",
          title: "Tutorial: Access Control with S3, Lambda, and WorkOS FGA",
          type: "article",
          url: "https://workos.com/blog/how-to-build-document-access-control-with-s3-workos-fga-and-lambda-authorizers",
          description: "Guide to securing access to documents using AWS services and WorkOS FGA.",
          parentId: "doc-access-control-fga",
          position: { x: 0, y: 0 },
          icon: <FileText className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        },
        {
          id: "doc-access-control-fga-2",
          title: "Companion Code Repo",
          type: "project",
          url: "https://github.com/zackproser-workos/aws-lambda-authorizer-fga-cdk",
          description: "Infrastructure-as-code example of secure access enforcement using AWS CDK and FGA.",
          parentId: "doc-access-control-fga",
          position: { x: 0, y: 0 },
          icon: <BookOpen className="h-5 w-5 text-white" />,
          value: 0.3,
          isResource: true
        }
      ]
    }
  ]

  // Convert topics to nodes including resources
  const nodes = getAllNodes(topics)

  // Track node interactions
  const trackNodeInteraction = (node: Node, action: string) => {
    track('learning_map_interaction', {
      node_id: node.id,
      node_type: isResource(node) ? 'resource' : 'topic',
      action,
      node_title: node.title
    })
  }

  const toggleCompleted = (nodeId: string) => {
    trackNodeInteraction(nodes.find(n => n.id === nodeId)!, 'toggle_completion')
    setCompletedNodes((prev) => {
      const newCompleted = prev.includes(nodeId) 
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId]
      return newCompleted
    })
  }

  // Add toggle filter function
  const toggleFilter = (track: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev)
      if (newFilters.has(track)) {
        newFilters.delete(track)
      } else {
        newFilters.add(track)
      }
      return newFilters
    })
  }

  // Filter nodes based on active tracks
  const filteredNodes = nodes.filter(node => {
    if ('isResource' in node) {
      const parentNode = nodes.find(n => !('isResource' in n) && n.id === node.parentId) as Topic
      return parentNode && activeFilters.has(parentNode.track)
    }
    return activeFilters.has(node.track)
  })

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect()
          setDimensions({ width, height })
        }
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Initialize simulation when nodes or dimensions change
  useEffect(() => {
    if (!dimensions.width || !filteredNodes.length) return

    const simNodes: SimulationNode[] = filteredNodes.map(node => ({
      ...node,
      x: node.position.x * dimensions.width,
      y: node.position.y * dimensions.height,
      fx: 'isParent' in node ? node.position.x * dimensions.width : undefined,
      fy: 'isParent' in node ? node.position.y * dimensions.height : undefined,
      position: node.position,
      value: node.value || 0.4,
      isParent: 'isParent' in node,
      isResource: 'isResource' in node
    }))

    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('charge', d3.forceManyBody<SimulationNode>().strength(-30))
      .force('collide', d3.forceCollide<SimulationNode>().radius(d => d.value * 35).strength(0.8))
      .force('x', d3.forceX<SimulationNode>(d => d.position.x * dimensions.width).strength(0.2))
      .force('y', d3.forceY<SimulationNode>(d => d.position.y * dimensions.height).strength(0.2))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.05))
      .force('link', d3.forceLink<SimulationNode, any>()
        .distance(50)
        .strength(0.3)
        .id(d => d.id))

    // Update positions on simulation tick
    simulation.on('tick', () => {
      const newPositions = new Map<string, { x: number, y: number }>()
      simNodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
          newPositions.set(node.id, {
            x: node.x / dimensions.width,
            y: node.y / dimensions.height
          })
        }
      })
      setNodePositions(newPositions)
    })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [dimensions, filteredNodes])

  // Update node rendering to use simulated positions
  const getNodePosition = (node: Node) => {
    const simPosition = nodePositions.get(node.id)
    return simPosition || node.position
  }

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw blueprint grid
    drawBlueprintGrid(ctx, canvas.width, canvas.height)

    // Draw phase lines and labels
    drawPhaseLines(ctx, canvas.width, canvas.height)

    // Draw connections between topics
    filteredNodes.forEach((node) => {
      if (isTopic(node) && node.dependencies) {
        node.dependencies.forEach((depId) => {
          const depNode = filteredNodes.find((n) => n.id === depId)
          if (!depNode) return

          const fromX = depNode.position.x * canvas.width
          const fromY = depNode.position.y * canvas.height
          const toX = node.position.x * canvas.width
          const toY = node.position.y * canvas.height

          // Draw blueprint-style connection
          drawBlueprintConnection(
            ctx,
            fromX,
            fromY,
            toX,
            toY,
            completedNodes.includes(depId) && completedNodes.includes(node.id),
            hoveredNode === node.id ||
              hoveredNode === depId ||
              highlightedNode === node.id ||
              highlightedNode === depId,
          )
        })
      }
    })

    // Draw annotations
    drawBlueprintAnnotations(ctx, canvas.width, canvas.height)
  }, [dimensions, completedNodes, hoveredNode, highlightedNode, filteredNodes])

  const drawBlueprintGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw minimal grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1

    // Draw vertical grid lines
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const drawPhaseLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Only draw subtle grid lines without phase labels
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1
    ctx.setLineDash([10, 5])

    const phasePositions = [0.1, 0.3, 0.5, 0.7, 0.9]
    phasePositions.slice(1).forEach(y => {
      ctx.beginPath()
      ctx.moveTo(0, y * height)
      ctx.lineTo(width, y * height)
      ctx.stroke()
    })

    ctx.setLineDash([])
  }

  const drawBlueprintConnection = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    isCompleted: boolean,
    isHighlighted: boolean,
  ) => {
    // Set line style based on completion and hover state
    if (isHighlighted) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
      ctx.lineWidth = 3
    } else if (isCompleted) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
      ctx.lineWidth = 2
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1.5
    }

    // Create a blueprint-style dashed line
    ctx.setLineDash([5, 3])

    // Draw curved connection using Bézier
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    
    // Calculate control points for a smooth curve
    const dx = toX - fromX
    const dy = toY - fromY
    const controlPoint1X = fromX + dx * 0.5
    const controlPoint1Y = fromY
    const controlPoint2X = toX - dx * 0.5
    const controlPoint2Y = toY
    
    ctx.bezierCurveTo(
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
      toX,
      toY
    )
    ctx.stroke()

    // Reset dash pattern
    ctx.setLineDash([])

    // Add circular endpoint
    const arrowSize = 4
    ctx.beginPath()
    ctx.arc(toX, toY, arrowSize, 0, Math.PI * 2)
    ctx.fillStyle = isCompleted ? "rgba(59, 130, 246, 0.8)" : "rgba(255, 255, 255, 0.3)"
    ctx.fill()
  }

  const drawBlueprintAnnotations = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Only keep the title stamp and remove coordinate markers
    ctx.font = "12px monospace"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "video":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "course":
        return "bg-green-100 text-green-800 border-green-200"
      case "project":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "tool":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "paper":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrackColor = (track: string) => {
    switch (track) {
      case "core":
        return "bg-blue-500/30"
      case "data":
        return "bg-green-500/30"
      case "tools":
        return "bg-amber-500/30"
      case "specialization":
        return "bg-purple-500/30"
      default:
        return "bg-white/20"
    }
  }

  // Add this function to generate more visually appealing resource cards
  const ResourceCard = ({ resource, isSelected, onSelect }: { 
    resource: Resource, 
    isSelected: boolean,
    onSelect: () => void
  }) => {
    const typeColors = {
      article: "from-blue-500/60 to-blue-600/40 border-blue-500/50",
      video: "from-purple-500/60 to-purple-600/40 border-purple-500/50",
      course: "from-green-500/60 to-green-600/40 border-green-500/50",
      project: "from-amber-500/60 to-amber-600/40 border-amber-500/50",
      tool: "from-cyan-500/60 to-cyan-600/40 border-cyan-500/50",
      paper: "from-red-500/60 to-red-600/40 border-red-500/50"
    }

    return (
      <div 
        className={`
          relative group cursor-pointer transition-all duration-300
          ${isSelected ? 'scale-102 ring-2 ring-white/30' : 'hover:scale-101'}
        `}
        onClick={onSelect}
      >
        <div className={`
          p-4 rounded-lg border backdrop-blur-md bg-gradient-to-br
          ${typeColors[resource.type]}
        `}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-white/20 shadow-inner">
              {resource.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-white/90">
                {resource.title}
              </h3>
              <p className="text-sm text-white/80 mt-1 line-clamp-2">
                {resource.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={getTypeColor(resource.type)}>
                  {resource.type}
                </Badge>
                {resource.type === "project" && (
                  <Badge className="bg-gradient-to-r from-amber-500/50 to-orange-500/50 text-white border-amber-500/50">
                    Premium
                  </Badge>
                )}
                <div className="flex-1" />
                <Button 
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  asChild
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Explore →
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to check if a node belongs to a cluster
  const isNodeInCluster = (node: Node, clusterId: string): boolean => {
    if (node.id === clusterId) return true;
    if ('parentId' in node && node.parentId === clusterId) return true;
    return false;
  }

  // Get all nodes in a cluster (parent node and its resources)
  const getClusterNodes = (clusterId: string): Node[] => {
    return filteredNodes.filter(node => isNodeInCluster(node, clusterId));
  }

  // Highlight all nodes in a cluster
  const highlightCluster = (clusterId: string) => {
    setFocusedCluster(clusterId);
    
    // Track the interaction
    const clusterNode = filteredNodes.find(n => n.id === clusterId);
    if (clusterNode) {
      trackNodeInteraction(clusterNode, 'highlight_cluster');
    }
  }

  // Clear cluster highlighting
  const clearClusterHighlight = () => {
    setFocusedCluster(null);
  }

  // Handle featured path click
  const handleFeaturedPathClick = (pathName: string) => {
    // Map path names to topic IDs
    const pathToTopicMap: {[key: string]: string} = {
      'RAG Systems': 'rag-systems',
      'Fine-tuning LLMs': 'fine-tuning',
      'Secure AI Applications': 'secure-rag-fga'
    };
    
    const topicId = pathToTopicMap[pathName];
    if (topicId) {
      // Find the topic node
      const topicNode = filteredNodes.find(node => node.id === topicId);
      if (topicNode) {
        // Select the node and highlight its cluster
        setSelectedNode(topicNode);
        highlightCluster(topicId);
        
        // Track the interaction
        trackNodeInteraction(topicNode, 'select_featured_path');
      }
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/5">
        <div className="bg-blue-900/30 backdrop-blur-md p-6 rounded-lg border border-blue-400/30 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* Add filter controls */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-white/90">Filter by Track</h3>
            <div className="flex flex-wrap gap-2">
              {['core', 'data', 'tools', 'specialization'].map(track => (
                <Button
                  key={track}
                  variant={activeFilters.has(track) ? 'default' : 'secondary'}
                  className={`${
                    activeFilters.has(track) 
                      ? getTrackColor(track)
                      : 'bg-white/10 hover:bg-white/20'
                  } text-white text-sm px-4 py-2`}
                  onClick={() => toggleFilter(track)}
                >
                  {track.charAt(0).toUpperCase() + track.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {selectedNode ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    trackNodeInteraction(selectedNode, 'deselect')
                    setSelectedNode(null)
                    clearClusterHighlight()
                  }}
                >
                  ← Back to Overview
                </Button>
                
                {focusedCluster && (
                  <Button
                    variant="outline"
                    className="ml-auto border-blue-400/30 text-blue-400 hover:bg-blue-500/20"
                    onClick={clearClusterHighlight}
                  >
                    Show All Nodes
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-800/30 rounded-lg p-5 border border-blue-500/30 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg ${getTrackColor('isResource' in selectedNode ? selectedNode.type : selectedNode.track || "")} flex items-center justify-center shadow-lg`}>
                      {'isResource' in selectedNode ? getResourceIcon(selectedNode.type) : selectedNode.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedNode.title}</h2>
                      <div className="flex gap-2 mt-1">
                        {'isResource' in selectedNode ? (
                          <Badge className={`${getTypeColor(selectedNode.type)}`}>{selectedNode.type}</Badge>
                        ) : (
                          <Badge className="bg-blue-500/30 text-white border-blue-500/50">{selectedNode.difficulty}</Badge>
                        )}
                        
                        {completedNodes.includes(selectedNode.id) && (
                          <Badge className="bg-green-500/30 text-white border-green-500/50">Completed</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-white/90 mt-4 leading-relaxed">{selectedNode.description}</p>

                  <Button
                    variant={completedNodes.includes(selectedNode.id) ? "destructive" : "default"}
                    className={`
                      mt-5 w-full
                      ${completedNodes.includes(selectedNode.id)
                        ? "bg-red-500/80 hover:bg-red-600/80" 
                        : "bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-700/80 hover:to-blue-800/80"}
                    `}
                    onClick={() => toggleCompleted(selectedNode.id)}
                  >
                    {completedNodes.includes(selectedNode.id) ? "Mark as Incomplete" : "Mark as Completed"}
                  </Button>
                </div>

                {'isResource' in selectedNode ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-700/80 hover:to-blue-800/80 text-white py-6" 
                    asChild
                    onClick={() => trackNodeInteraction(selectedNode, 'explore_resource')}
                  >
                    <a href={selectedNode.url} target="_blank" rel="noopener noreferrer">
                      Explore Resource →
                    </a>
                  </Button>
                ) : (
                  <div className="space-y-5 mt-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">Learning Resources</h3>
                      <Badge className="bg-blue-500/20 text-white">{selectedNode.resources.length} resources</Badge>
                    </div>
                    <div className="grid gap-4">
                      {selectedNode.resources.map((resource, idx) => (
                        <ResourceCard
                          key={idx}
                          resource={resource}
                          isSelected={hoveredNode === `${selectedNode.id}-resource-${idx}`}
                          onSelect={() => setHighlightedNode(`${selectedNode.id}-resource-${idx}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg p-5 border border-blue-400/30 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">AI Engineering Learning Path</h2>
                <p className="text-white/90 leading-relaxed mb-4">
                  A curated collection of resources to help you master AI engineering, from fundamentals to advanced applications. Explore the map to discover learning materials organized by topic.
                </p>
              
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">Your Progress</h3>
                    <span className="text-white/90 font-medium">
                      {completedNodes.length}/{topics.length} Topics Completed
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full"
                      style={{ width: `${Math.max(5, (completedNodes.length / topics.length) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Topic Overview Section - Shows all topics at once */}
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-white">All Learning Paths</h3>
                <div className="grid gap-4">
                  {topics.map(topic => (
                    <div 
                      key={topic.id}
                      className={`
                        p-4 rounded-lg cursor-pointer transition-all duration-300
                        ${getTrackColor(topic.track)}
                        hover:bg-opacity-80 border border-white/20 hover:border-white/40
                        ${completedNodes.includes(topic.id) ? 'ring-2 ring-green-500/50' : ''}
                      `}
                      onClick={() => {
                        setSelectedNode(topic);
                        highlightCluster(topic.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-white/10 shadow-inner">
                          {topic.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{topic.title}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-blue-500/30 text-white border-blue-500/50">
                              {topic.difficulty}
                            </Badge>
                            <Badge className="bg-white/20 text-white border-white/30">
                              {topic.resources.length} resources
                            </Badge>
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-green-500/30 text-white border-green-500/50">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full md:w-3/5 relative" ref={containerRef}>
        <div className="aspect-square w-full relative bg-[#1e3a8a]/80 rounded-lg border border-white/20 overflow-hidden shadow-2xl">
          {/* Blueprint background with only blue gradient - removed purple gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-blue-950/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          
          {/* Blueprint grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Blueprint title stamp */}
          <div className="absolute top-4 left-4 bg-blue-950/90 border border-white/20 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-white/90 font-mono text-sm font-bold">AI ENGINEERING BLUEPRINT</div>
            <div className="text-white/60 font-mono text-xs mt-1">REV. 2025-A</div>
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Display labels for parent nodes */}
          {filteredNodes.filter(node => 'isParent' in node && node.isParent).map((node) => {
            const position = getNodePosition(node)
            // Abbreviate longer titles for better display
            const displayTitle = node.title.length > 25 ? node.title.substring(0, 22) + '...' : node.title
            
            return (
              <div
                key={`label-${node.id}`}
                className="absolute z-10 transform -translate-x-1/2 pointer-events-none"
                style={{
                  top: `${position.y * 100 + 8}%`,  // Added more spacing from node
                  left: `${position.x * 100}%`,
                  textAlign: 'center',
                  width: '200px',  // Wider for better text display
                }}
              >
                <div className="bg-blue-900/90 backdrop-blur-md px-3 py-2 rounded-md border border-blue-400/30 shadow-lg">
                  <p className="text-white font-semibold text-sm truncate">{displayTitle}</p>
                </div>
              </div>
            )
          })}

          {/* Node hover previews */}
          {filteredNodes.map((node) => (
            hoveredNode === node.id && (
              <div
                key={`preview-${node.id}`}
                className="absolute z-20 transform -translate-x-1/2 transition-opacity duration-200"
                style={{
                  top: `${node.position.y * 100 + 8}%`,
                  left: `${node.position.x * 100}%`,
                }}
              >
                <div className="bg-black/90 backdrop-blur-sm p-4 rounded-lg border border-white/20 w-64 shadow-xl">
                  <h3 className="text-sm font-semibold text-white">{node.title}</h3>
                  <p className="text-xs text-white/70 mt-2">{node.description}</p>
                  {'isResource' in node && (
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className={`${getTypeColor(node.type)}`}>
                        {node.type}
                      </Badge>
                      <Badge className="bg-white/10 text-white/70">
                        Click to explore
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )
          ))}

          {filteredNodes.map((node) => {
            const position = getNodePosition(node)
            const isCompleted = completedNodes.includes(node.id)
            const isHovered = hoveredNode === node.id
            const isHighlighted = hoveredNode === node.id || highlightedNode === node.id
            const isParent = 'isParent' in node && node.isParent
            const isResource = 'isResource' in node
            
            // Determine if node should be visible based on cluster focus
            const isInFocusedCluster = focusedCluster ? isNodeInCluster(node, focusedCluster) : true
            const shouldRenderDimmed = focusedCluster && !isInFocusedCluster
            
            // Skip rendering if node shouldn't be visible due to cluster focus
            if (shouldRenderDimmed && isResource) {
              return null
            }
            
            // Determine size multiplier - make parent nodes much larger
            const sizeMultiplier = isParent ? 2.2 : 0.9  // Increased difference between parent and resource nodes
            
            // Skip rendering very small resource nodes if not highlighted to reduce visual clutter
            if (isResource && !isHighlighted && node.value < 0.3) {
              return null
            }

            return (
              <button
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isHighlighted ? "scale-110 z-20" : shouldRenderDimmed ? "opacity-20" : "hover:scale-105 z-10"
                } ${isParent ? "z-10" : "z-5"}`}
                style={{
                  top: `${position.y * 100}%`,
                  left: `${position.x * 100}%`,
                  filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' : 'none',
                }}
                onClick={() => {
                  trackNodeInteraction(node, 'select')
                  setSelectedNode(node)
                  if (isParent) {
                    highlightCluster(node.id)
                  } else if ('parentId' in node) {
                    highlightCluster(node.parentId)
                  }
                }}
                onMouseEnter={() => {
                  trackNodeInteraction(node, 'hover')
                  setHoveredNode(node.id)
                  setHighlightedNode(node.id)
                }}
                onMouseLeave={() => {
                  setHoveredNode(null)
                  setHighlightedNode(null)
                }}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    'isResource' in node ? 'rounded-lg border-dashed' : 'rounded-full border-solid'
                  } ${
                    isHighlighted ? "ring-2 ring-white/70 ring-offset-2 ring-offset-blue-950" : ""
                  } ${
                    isCompleted
                      ? "bg-blue-500 border-2 border-white/70"
                      : `${'isResource' in node ? getTypeColor(node.type) : getTrackColor(node.track || "")} border-2 ${isParent ? 'border-white/80' : 'border-white/20'} backdrop-blur-sm`
                  } ${
                    isParent ? "shadow-[0_0_15px_rgba(255,255,255,0.2)]" : ""
                  } transition-all duration-300 shadow-lg`}
                  style={{
                    width: `${Math.max(40, (node.value || 0.4) * 100 * sizeMultiplier)}px`,
                    height: `${Math.max(40, (node.value || 0.4) * 100 * sizeMultiplier)}px`,
                    opacity: shouldRenderDimmed ? 0.3 : 1,
                  }}
                >
                  <div className={`${isHighlighted ? 'scale-110' : ''} transition-transform duration-300`}>
                    {/* Larger icons for parent nodes */}
                    <div className={`${isParent ? 'transform scale-200' : 'transform scale-125'}`}>
                      {node.icon}
                    </div>
                  </div>
                  
                  {/* Add glow effect for parent nodes */}
                  {isParent && (
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 to-transparent -z-10 blur-md"></div>
                  )}
                </div>
              </button>
            )
          })}

          {/* Add Featured Learning Path Highlights */}
          <div className="absolute bottom-6 left-6 right-6 bg-blue-900/90 backdrop-blur-md border border-blue-400/30 rounded-lg p-4 shadow-xl">
            <h3 className="text-white font-bold mb-3">Featured Learning Paths</h3>
            <div className="grid grid-cols-3 gap-4">
              {['RAG Systems', 'Fine-tuning LLMs', 'Secure AI Applications'].map((path, idx) => (
                <div 
                  key={idx} 
                  className="bg-blue-800/40 hover:bg-blue-700/50 p-3 rounded-lg cursor-pointer transition-colors border border-blue-500/30"
                  onClick={() => handleFeaturedPathClick(path)}
                >
                  <p className="text-white text-sm font-medium">{path}</p>
                  <p className="text-white/70 text-xs mt-1">Click to explore this path</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}