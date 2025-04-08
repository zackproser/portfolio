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

// Define a type for the hierarchy data structure
interface ResourceHierarchyNode {
  name: string;
  value?: number;
  resourceType?: string;
  resource?: Resource;
  children?: ResourceHierarchyNode[];
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string
  position: { x: number; y: number }
  value: number
  isParent?: boolean
  isResource?: boolean
  parentId?: string
  type?: string
}

// Convert topics and their resources into nodes
const getAllNodes = (topics: Topic[]): Node[] => {
  const NODE_DENSITY = 0.2  // Increased for better spread
  const RESOURCE_SPACING = 0.2  // Increased spacing between resource nodes
  const Y_SCALE = 0.65 // Less vertical compression for better spacing 
  const Y_OFFSET = 0.15 // Start a bit higher from the top
  const HORIZONTAL_PADDING = 0.15 // Padding from edges

  return topics.flatMap(topic => {
    // Normalize y position for better vertical distribution
    const normalizedY = topic.position.y * Y_SCALE + Y_OFFSET
    const radius = Math.min(0.35, Math.max(0.2, (topic.resources.length * RESOURCE_SPACING) / (2 * Math.PI)))
    
    return [
      {
        ...topic,
        position: {
          x: topic.position.x * (1 - 2 * HORIZONTAL_PADDING) + HORIZONTAL_PADDING, // Keep topics within padded area
          y: normalizedY
        },
        isParent: true
      },
      ...topic.resources.map((resource, idx) => {
        // Calculate angle for even distribution in a circle, with offset to avoid exact horizontal/vertical alignment
        const angle = (Math.PI * 2 * idx) / topic.resources.length + (Math.PI / topic.resources.length)
        return {
          ...resource,
          id: `${topic.id}-resource-${idx}`,
          parentId: topic.id,
          position: {
            x: topic.position.x * (1 - 2 * HORIZONTAL_PADDING) + HORIZONTAL_PADDING + Math.cos(angle) * radius * NODE_DENSITY,
            y: normalizedY + Math.sin(angle) * radius * NODE_DENSITY
          },
          icon: getResourceIcon(resource.type),
          value: 0.45, // Slightly larger resource nodes for better visibility
          isResource: true
        }
      })
    ]
  })
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
  const [zoomedNode, setZoomedNode] = useState<string | null>(null)
  const [zoomTransition, setZoomTransition] = useState(false)
  const zoomRef = useRef<HTMLDivElement>(null)
  const [activeResourceCard, setActiveResourceCard] = useState<string | null>(null)

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
      // Only remove if we have more than one filter
      if (newFilters.has(track)) {
        if (newFilters.size > 1) {
          newFilters.delete(track)
        }
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

    // Resource type sizing weights for simulation
    const typeWeights: {[key: string]: number} = {
      'project': 3,
      'course': 2.5,
      'article': 2,
      'video': 2,
      'tool': 1.5,
      'paper': 1.5
    };

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
      .force('charge', d3.forceManyBody<SimulationNode>().strength(d => 
        zoomedNode ? -120 : -50 // Stronger repulsion in detail view
      ))
      .force('collide', d3.forceCollide<SimulationNode>().radius(d => {
        if (zoomedNode && 'isResource' in d && 'type' in d) {
          // Larger radius in detail view based on type
          const type = (d as any).type;
          return (typeWeights[type] || 2) * 15;
        }
        return d.value * 40;
      }).strength(zoomedNode ? 1.2 : 0.9)) // Stronger collision force in detail view
      .force('x', d3.forceX<SimulationNode>(d => {
        if (zoomedNode && 'parentId' in d && d.parentId === zoomedNode) {
          const pos = nodePositions.get(d.id);
          return pos ? pos.x * dimensions.width : dimensions.width / 2;
        }
        return d.position.x * dimensions.width;
      }).strength(d => zoomedNode ? 0.8 : 0.3))
      .force('y', d3.forceY<SimulationNode>(d => {
        if (zoomedNode && 'parentId' in d && d.parentId === zoomedNode) {
          const pos = nodePositions.get(d.id);
          return pos ? pos.y * dimensions.height : dimensions.height / 2;
        }
        return d.position.y * dimensions.height;
      }).strength(d => zoomedNode ? 0.8 : 0.3))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.05))
      .force('link', d3.forceLink<SimulationNode, any>()
        .distance(60) // Increased link distance
        .strength(0.3)
        .id(d => d.id))

    // Update positions on simulation tick
    simulation.on('tick', () => {
      const newPositions = new Map<string, { x: number, y: number }>()
      simNodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
          // Constrain nodes to stay within viewport with padding
          const padding = 0.05; // 5% padding
          const x = Math.max(padding * dimensions.width, Math.min((1 - padding) * dimensions.width, node.x));
          const y = Math.max(padding * dimensions.height, Math.min((1 - padding) * dimensions.height, node.y));
          
          newPositions.set(node.id, {
            x: x / dimensions.width,
            y: y / dimensions.height
          })
        }
      })
      setNodePositions(newPositions)
    })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [dimensions, filteredNodes, zoomedNode]) // Add zoomedNode as dependency

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

    // Draw connections differently based on zoom state
    if (zoomedNode) {
      // In detail view we don't draw connections since there's no central node
      // Removed connection drawing in detail view
    } else {
      // In normal view, don't draw connections between major topics
      // The connection code is removed, only resource connections will be drawn when zoomed
    }

    // Draw annotations
    drawBlueprintAnnotations(ctx, canvas.width, canvas.height)
  }, [dimensions, completedNodes, hoveredNode, highlightedNode, filteredNodes, zoomedNode])

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
    isResourceConnection: boolean = false
  ) => {
    // Skip drawing connections between major topics when not in zoomed view
    if (!isResourceConnection && !zoomedNode) {
      return;
    }

    // Set line style based on completion and hover state
    if (isHighlighted) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"
      ctx.lineWidth = 3.5
    } else if (isCompleted) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.9)"
      ctx.lineWidth = 2.5
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)" 
      ctx.lineWidth = 2
    }

    // Create a blueprint-style dashed line
    ctx.setLineDash([6, 3])

    // For resource connections in detail view, use a more decorative style
    if (isResourceConnection && zoomedNode) {
      ctx.setLineDash([8, 4]); // Larger dash pattern
      
      // Draw a glowing effect for the connection
      if (isHighlighted) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 5;
      }
    }

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

    // Reset shadow effects
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Reset dash pattern
    ctx.setLineDash([])

    // Add circular endpoint with glow for better visibility
    const arrowSize = 5
    
    // Add glow effect for better visibility
    if (isHighlighted || isCompleted) {
      ctx.beginPath()
      ctx.arc(toX, toY, arrowSize + 2, 0, Math.PI * 2)
      ctx.fillStyle = isCompleted ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.4)"
      ctx.fill()
    }
    
    ctx.beginPath()
    ctx.arc(toX, toY, arrowSize, 0, Math.PI * 2)
    ctx.fillStyle = isCompleted ? "rgba(59, 130, 246, 0.9)" : "rgba(255, 255, 255, 0.7)"
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

  // Add the ResourceNode component here, after the helper functions
  const ResourceNode = ({ 
    resource, 
    position, 
    isHovered, 
    isHighlighted, 
    isCompleted, 
    onClick, 
    onMouseEnter, 
    onMouseLeave 
  }: { 
    resource: Resource;
    position: { x: number; y: number };
    isHovered: boolean;
    isHighlighted: boolean;
    isCompleted: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => {
    // Simplify the configuration to reduce variation in size
    const typeConfig: {[key: string]: { iconScale: number, zIndex: number }} = {
      'project': { iconScale: 1.1, zIndex: 40 },
      'course': { iconScale: 1.1, zIndex: 35 },
      'article': { iconScale: 1.0, zIndex: 30 },
      'video': { iconScale: 1.0, zIndex: 25 },
      'tool': { iconScale: 1.0, zIndex: 20 },
      'paper': { iconScale: 1.0, zIndex: 15 }
    };
    
    const config = typeConfig[resource.type] || { iconScale: 1.0, zIndex: 10 };
    
    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
          isHighlighted ? "scale-105 z-50" : "hover:scale-102"
        }`}
        style={{
          top: `${position.y * 100}%`,
          left: `${position.x * 100}%`,
          zIndex: isHighlighted ? 50 : config.zIndex,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex flex-col items-center">
          {/* Resource title - only show on hover */}
          {isHovered && (
            <div className="w-[120px] mb-2 text-center">
              <div className="bg-blue-900/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium shadow-md border border-blue-400/30 truncate">
                {resource.title}
              </div>
            </div>
          )}
          
          {/* Main resource button - fixed size */}
          <button
            onClick={onClick}
            className={`
              w-16 h-16 rounded-lg flex items-center justify-center
              ${isHighlighted ? "ring-2 ring-white/80 ring-offset-2 ring-offset-blue-950" : ""}
              ${isCompleted
                ? "bg-blue-500 border-2 border-white/80"
                : `${getTypeColor(resource.type)} border-2 border-white/40 backdrop-blur-sm`
              }
              shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]
              transition-all duration-200
            `}
          >
            <div className={`transform scale-[${config.iconScale * 1.5}]`}>
              {resource.icon}
            </div>
            
            {/* Resource glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-radial from-white/20 to-transparent -z-10 blur-md"></div>
          </button>
          
          {/* Type badge - always show */}
          <div className="mt-1">
            <Badge className={`${getTypeColor(resource.type)} px-2 py-0.5 text-xs font-medium shadow-md`}>
              {resource.type}
            </Badge>
          </div>
          
          {/* View button - only show on hover */}
          {isHovered && (
            <div className="mt-1">
              <Button 
                size="sm"
                className="bg-blue-600/90 hover:bg-blue-700/90 text-white text-xs py-0 h-6 shadow-md"
                asChild
              >
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

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

  // Replace getDetailViewPositions with this simpler version
  const getDetailViewPositions = (
    parentNode: Topic, 
    resources: Resource[]
  ): Map<string, { x: number, y: number }> => {
    const positions = new Map<string, { x: number, y: number }>();
    
    // Hide parent node completely off-screen
    positions.set(parentNode.id, { x: -100, y: -100 });
    
    if (resources.length === 0) return positions;
    
    // Group resources by type
    const typeGroups: Record<string, Resource[]> = {};
    const typeOrder = ['project', 'course', 'article', 'video', 'tool', 'paper'];
    
    // Initialize empty groups
    typeOrder.forEach(type => {
      typeGroups[type] = [];
    });
    
    // Group resources by type
    resources.forEach(resource => {
      if (resource.type in typeGroups) {
        typeGroups[resource.type].push(resource);
      }
    });
    
    // Filter to only types that have resources
    const usedTypes = typeOrder.filter(type => typeGroups[type].length > 0);
    
    // Use simple grid layout - 2 columns
    let currentRow = 0;
    let currentCol = 0;
    
    // For each type that has resources
    usedTypes.forEach(type => {
      const resourcesOfType = typeGroups[type];
      
      // Position for the type header
      const headerX = 0.25 + (currentCol * 0.5); // 0.25 for first column, 0.75 for second
      const headerY = 0.15 + (currentRow * 0.35); // Each row is 35% of height
      
      // Add the header position
      positions.set(`header-${type}`, { x: headerX, y: headerY });
      
      // For each resource in this type
      const resourcesPerRow = 3; // 3 resources per row maximum
      resourcesOfType.forEach((resource, index) => {
        const resourceRow = Math.floor(index / resourcesPerRow);
        const resourceCol = index % resourcesPerRow;
        
        // Calculate position
        const resourceX = (currentCol * 0.5) + 0.1 + (resourceCol * 0.15); // Horizontal position
        const resourceY = headerY + 0.08 + (resourceRow * 0.10); // Vertical position
        
        // Set position for this resource
        positions.set(resource.id, { x: resourceX, y: resourceY });
      });
      
      // Move to next position in grid
      currentCol++;
      if (currentCol >= 2) { // After 2 columns, move to next row
        currentCol = 0;
        currentRow++;
      }
    });
    
    return positions;
  };

  // Simpler header component
  const TypeHeader = ({ type, position }: { type: string, position: { x: number, y: number } }) => {
    const typeLabels: Record<string, string> = {
      project: "Projects",
      course: "Courses",
      article: "Articles",
      video: "Videos",
      tool: "Tools",
      paper: "Papers"
    };
    
    const typeColors: Record<string, string> = {
      project: "bg-amber-600 text-white",
      course: "bg-green-600 text-white",
      article: "bg-blue-600 text-white",
      video: "bg-purple-600 text-white",
      tool: "bg-cyan-600 text-white",
      paper: "bg-red-600 text-white"
    };
    
    return (
      <div
        className="absolute transform -translate-x-1/2 z-30"
        style={{
          top: `${position.y * 100}%`,
          left: `${position.x * 100}%`
        }}
      >
        <div className={`
          px-4 py-2 rounded-md ${typeColors[type] || "bg-gray-600"} 
          font-semibold text-sm shadow-md border border-white/20
        `}>
          {typeLabels[type] || type}
        </div>
      </div>
    );
  };

  // Update the highlighted cluster function
  const highlightCluster = (clusterId: string) => {
    setFocusedCluster(clusterId);
    setZoomedNode(clusterId);
    setZoomTransition(true);
    
    // Apply the detail view positioning
    const topicNode = topics.find(topic => topic.id === clusterId);
    if (topicNode) {
      const detailPositions = getDetailViewPositions(topicNode, topicNode.resources);
      setNodePositions(detailPositions);
    }
    
    // Track the interaction
    const clusterNode = filteredNodes.find(n => n.id === clusterId);
    if (clusterNode) {
      trackNodeInteraction(clusterNode, 'highlight_cluster');
    }
    
    // Slight delay to ensure transition effect is visible
    setTimeout(() => {
      setZoomTransition(false);
    }, 500);
  };

  // Clear cluster highlighting and zoom
  const clearClusterHighlight = () => {
    setFocusedCluster(null);
    setZoomedNode(null);
    setZoomTransition(true);
    
    // Slight delay to ensure transition effect is visible
    setTimeout(() => {
      setZoomTransition(false);
    }, 500);
  };

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
  };

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
                    trackNodeInteraction(selectedNode, 'deselect');
                    setSelectedNode(null);
                    clearClusterHighlight();
                  }}
                >
                  ← Back to Overview
                </Button>
                
                {zoomedNode && (
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
                    
                    {/* Don't show resource cards in sidebar when zoomed/detail view is active */}
                    {!zoomedNode && (
                      <div className="grid gap-4">
                        {selectedNode.resources.map((resource, idx) => (
                          <ResourceCard
                            key={idx}
                            resource={resource}
                            isSelected={hoveredNode === `${selectedNode.id}-resource-${idx}`}
                            onSelect={() => {
                              trackNodeInteraction(resource, 'select');
                              highlightCluster(selectedNode.id);
                              setHighlightedNode(`${selectedNode.id}-resource-${idx}`);
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* When in zoomed view, show a message instead of duplicating cards */}
                    {zoomedNode && (
                      <div className="bg-blue-800/40 border border-blue-500/30 rounded-lg p-4 text-center text-white/80">
                        Resources are displayed in the detailed view →
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
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
        {/* Featured Learning Paths - above the map */}
        {!zoomedNode && !selectedNode && (
          <div className="mb-4 bg-blue-800 backdrop-blur-md border-2 border-blue-400 rounded-lg p-5 shadow-lg">
            <h3 className="text-white font-bold text-lg mb-2">Featured Learning Paths</h3>
            <p className="text-white/90 text-sm mb-3 font-medium">Select a path to explore specific areas of AI engineering</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['RAG Systems', 'Fine-tuning LLMs', 'Secure AI Applications'].map((path, idx) => (
                <div 
                  key={idx} 
                  className="bg-blue-700 hover:bg-blue-600 p-3 rounded-lg cursor-pointer transition-all duration-300 border border-blue-400 shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => handleFeaturedPathClick(path)}
                >
                  <p className="text-white text-sm font-bold">{path}</p>
                  <p className="text-white/90 text-xs mt-1 font-medium">View on map</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div ref={zoomRef} className={`aspect-square w-full relative bg-[#1e3a8a]/80 rounded-lg border border-white/20 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out ${zoomTransition ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
          {/* Blueprint background */}
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
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-800 to-blue-900 border-2 border-blue-400/70 p-5 rounded-xl shadow-xl backdrop-blur-md">
            <div className="text-white font-mono text-lg font-bold flex items-center">
              <span className="text-blue-300 mr-2">⚡</span>
              {zoomedNode ? 
                (topics.find(topic => topic.id === zoomedNode)?.title?.toUpperCase() || "AI ENGINEERING BLUEPRINT") + " RESOURCES" : 
                "AI ENGINEERING BLUEPRINT"
              }
            </div>
            <div className="text-blue-300 font-mono text-sm mt-1 font-medium flex items-center">
              <span className="bg-blue-400/20 px-2 py-0.5 rounded border border-blue-400/30 mr-2">DRAFT</span>
              REV. 2025-A
            </div>
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Render section headers in detail view */}
          {zoomedNode && nodePositions && Array.from(nodePositions.entries())
            .filter(([key]) => key.startsWith('header-'))
            .map(([key, position]) => {
              const type = key.replace('header-', '');
              return <TypeHeader key={key} type={type} position={position} />;
            })
          }

          {/* Render nodes */}
          {filteredNodes.map((node) => {
            // Skip rendering nodes that aren't in focus when zoomed
            if (zoomedNode) {
              const isZoomedNode = node.id === zoomedNode;
              const isZoomedNodeResource = 'isResource' in node && 'parentId' in node && node.parentId === zoomedNode;
              
              // Hide the parent node in detail view
              if (isZoomedNode) {
                return null;
              }
              
              // Only show resources belonging to the zoomed parent
              if (!isZoomedNodeResource) {
                return null;
              }
              
              // For resources in zoomed view, use the ResourceNode component
              const position = getNodePosition(node);
              const resource = node as Resource;
              const isCompleted = completedNodes.includes(resource.id);
              const isHovered = hoveredNode === resource.id;
              const isHighlighted = hoveredNode === resource.id || highlightedNode === resource.id;
              
              return (
                <ResourceNode
                  key={resource.id}
                  resource={resource}
                  position={position}
                  isHovered={isHovered}
                  isHighlighted={isHighlighted}
                  isCompleted={isCompleted}
                  onClick={() => {
                    trackNodeInteraction(resource, 'select');
                    window.open(resource.url, '_blank');
                  }}
                  onMouseEnter={() => {
                    trackNodeInteraction(resource, 'hover');
                    setHoveredNode(resource.id);
                    setHighlightedNode(resource.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredNode(null);
                    setHighlightedNode(null);
                  }}
                />
              );
            }
            
            // For overview mode, use the original node rendering
            const position = getNodePosition(node);
            const isCompleted = completedNodes.includes(node.id);
            const isHovered = hoveredNode === node.id;
            const isHighlighted = hoveredNode === node.id || highlightedNode === node.id;
            const isParent = 'isParent' in node && node.isParent;
            const isNodeResource = 'isResource' in node;
            
            // Simple size multiplier for overview
            const sizeMultiplier = isParent ? 2.3 : 1.0;
            
            return (
              <button
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isHighlighted ? "scale-110 z-50" : "hover:scale-105"
                }`}
                style={{
                  top: `${position.y * 100}%`,
                  left: `${position.x * 100}%`,
                  filter: isHighlighted ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none',
                  zIndex: isHighlighted ? 50 : (isParent ? 20 : 10),
                }}
                onClick={() => {
                  trackNodeInteraction(node, 'select');
                  
                  if (isNodeResource) {
                    // In normal view, select the resource and zoom to its parent
                    setSelectedNode(node);
                    if ('parentId' in node) {
                      highlightCluster(node.parentId);
                    }
                  } else if (isParent) {
                    // When clicking a parent node, show detail view
                    setSelectedNode(node);
                    highlightCluster(node.id);
                  }
                }}
                onMouseEnter={() => {
                  trackNodeInteraction(node, 'hover');
                  setHoveredNode(node.id);
                  setHighlightedNode(node.id);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setHighlightedNode(null);
                }}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    isNodeResource ? 'rounded-lg border-dashed' : 'rounded-full border-solid'
                  } ${
                    isHighlighted ? "ring-2 ring-white/80 ring-offset-2 ring-offset-blue-950" : ""
                  } ${
                    isCompleted
                      ? "bg-blue-500 border-2 border-white/80"
                      : `${isNodeResource ? getTypeColor((node as Resource).type) : getTrackColor((node as Topic).track || "")} border-2 ${isParent ? 'border-white/90' : 'border-white/40'} backdrop-blur-sm`
                  } ${
                    isParent ? "shadow-[0_0_20px_rgba(255,255,255,0.25)]" : ""
                  } transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]`}
                  style={{
                    width: `${Math.max(42, (node.value || 0.4) * 100 * sizeMultiplier)}px`,
                    height: `${Math.max(42, (node.value || 0.4) * 100 * sizeMultiplier)}px`,
                  }}
                >
                  <div className={`${isHighlighted ? 'scale-110' : ''} transition-transform duration-300`}>
                    {/* Larger icons for better visibility */}
                    <div className={`${isParent ? 'transform scale-[2.2]' : 'transform scale-[1.3]'}`}>
                      {node.icon}
                    </div>
                  </div>
                  
                  {/* Enhanced glow effect for parent nodes */}
                  {isParent && (
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/15 to-transparent -z-10 blur-md"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}

// Create a resource card component for the sidebar view
const ResourceCard = ({ resource, isSelected, onSelect }: { 
  resource: Resource, 
  isSelected: boolean,
  onSelect: () => void
}) => {
  const typeColors = {
    article: "from-blue-600/80 to-blue-700/70 border-blue-400/70",
    video: "from-purple-600/80 to-purple-700/70 border-purple-400/70",
    course: "from-green-600/80 to-green-700/70 border-green-400/70",
    project: "from-amber-600/80 to-amber-700/70 border-amber-400/70",
    tool: "from-cyan-600/80 to-cyan-700/70 border-cyan-400/70",
    paper: "from-red-600/80 to-red-700/70 border-red-400/70"
  }

  const typeCardColors = {
    article: "bg-blue-200 text-blue-800 border-blue-300 font-medium",
    video: "bg-purple-200 text-purple-800 border-purple-300 font-medium",
    course: "bg-green-200 text-green-800 border-green-300 font-medium",
    project: "bg-amber-200 text-amber-800 border-amber-300 font-medium",
    tool: "bg-cyan-200 text-cyan-800 border-cyan-300 font-medium",
    paper: "bg-red-200 text-red-800 border-red-300 font-medium"
  }

  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-300
        ${isSelected ? 'scale-[1.03] ring-2 ring-white/60 shadow-xl' : 'hover:scale-[1.02] shadow-md hover:shadow-lg'}
      `}
      onClick={onSelect}
    >
      <div className={`
        p-6 rounded-xl border-2 backdrop-blur-sm bg-gradient-to-br
        ${typeColors[resource.type]}
      `}>
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-lg bg-white/40 shadow-inner border border-white/60">
            {resource.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg group-hover:text-white/90">
              {resource.title}
            </h3>
            <p className="text-sm text-white mt-2 line-clamp-2 font-medium">
              {resource.description}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Badge className={typeCardColors[resource.type]}>
                {resource.type}
              </Badge>
              {resource.type === "project" && (
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-500 font-medium">
                  Premium
                </Badge>
              )}
              <div className="flex-1" />
              <Button 
                size="sm"
                className="bg-white/40 hover:bg-white/50 text-white font-medium shadow-sm"
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
};