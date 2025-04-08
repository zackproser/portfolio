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
  const nodes: Node[] = []
  
  topics.forEach(topic => {
    // Add the topic as a node
    nodes.push({
      ...topic,
      isParent: true
    })
    
    // Add each resource as a node with reference to parent
    topic.resources.forEach((resource, idx) => {
      const angle = (2 * Math.PI * idx) / topic.resources.length
      const radius = 0.15 // Distance from parent node
      
      nodes.push({
        ...resource,
        id: `${topic.id}-resource-${idx}`,
        parentId: topic.id,
        position: {
          x: topic.position.x + (Math.cos(angle) * radius),
          y: topic.position.y + (Math.sin(angle) * radius)
        },
        icon: getResourceIcon(resource.type),
        value: 0.3,
        isResource: true
      })
    })
  })
  
  return nodes
}

export default function LearningMap() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)

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
      position: { x: 0.2, y: 0.05 },
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
      position: { x: 0.5, y: 0.05 },
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
      position: { x: 0.35, y: 0.6 },
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
      position: { x: 0.65, y: 0.6 },
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
      position: { x: 0.5, y: 0.7 },
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
      position: { x: 0.35, y: 0.85 },
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
      position: { x: 0.65, y: 0.85 },
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
    nodes.forEach((node) => {
      if (isTopic(node) && node.dependencies) {
        node.dependencies.forEach((depId) => {
          const depNode = nodes.find((n) => n.id === depId)
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
  }, [dimensions, completedNodes, hoveredNode, highlightedNode, nodes])

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

    // Draw the main connection line
    ctx.beginPath()

    // Calculate control points for a more structured path
    // For a more blueprint-like appearance, we'll use right angles
    const midY = (fromY + toY) / 2

    ctx.moveTo(fromX, fromY)

    // If nodes are in different phases (horizontal sections), use right angles
    if (Math.abs(fromY - toY) > 50) {
      ctx.lineTo(fromX, midY)
      ctx.lineTo(toX, midY)
    } else {
      // Otherwise, use a simple curve
      ctx.lineTo(toX, toY)
    }

    ctx.lineTo(toX, toY)
    ctx.stroke()

    // Reset dash pattern
    ctx.setLineDash([])

    // Add direction arrow
    const arrowSize = 8
    const angle = Math.atan2(toY - midY, toX - fromX)

    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = isCompleted ? "rgba(59, 130, 246, 0.8)" : "rgba(255, 255, 255, 0.3)"
    ctx.fill()
  }

  const drawBlueprintAnnotations = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Only keep the title stamp and remove coordinate markers
    ctx.font = "12px monospace"
    
    // Add blueprint-like title stamp
    ctx.fillStyle = "rgba(30, 58, 138, 0.8)"
    const stampWidth = 200
    const stampHeight = 40
    ctx.fillRect(10, 10, stampWidth, stampHeight)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.strokeRect(10, 10, stampWidth, stampHeight)
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "14px monospace"
    ctx.fillText("AI ENGINEERING BLUEPRINT", 20, 30)
    ctx.font = "10px monospace"
    ctx.fillText("REV. 2025-A", 20, 42)
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

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {selectedNode ? (
            <div>
              <Button 
                variant="ghost" 
                className="mb-4 text-white/70 hover:text-white"
                onClick={() => {
                  trackNodeInteraction(selectedNode, 'deselect')
                  setSelectedNode(null)
                }}
              >
                ← Back to Overview
              </Button>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getTrackColor('isResource' in selectedNode ? selectedNode.type : selectedNode.track || "")} flex items-center justify-center`}>
                    {'isResource' in selectedNode ? getResourceIcon(selectedNode.type) : selectedNode.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedNode.title}</h2>
                    {'isResource' in selectedNode ? (
                      <Badge className={`${getTypeColor(selectedNode.type)}`}>{selectedNode.type}</Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-white border-0">{selectedNode.difficulty}</Badge>
                    )}
                  </div>
                </div>

                <p className="text-white/80">{selectedNode.description}</p>

                {'isResource' in selectedNode ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" 
                    asChild
                    onClick={() => trackNodeInteraction(selectedNode, 'explore_resource')}
                  >
                    <a href={selectedNode.url} target="_blank" rel="noopener noreferrer">
                      Explore Resource
                    </a>
                  </Button>
                ) : (
                  <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-white">Learning Resources</h3>
                    <div className="grid gap-3">
                      {selectedNode.resources.map((resource, idx) => (
                        <Card key={idx} className="bg-white/10 border-white/10">
                          <CardHeader className="py-3">
                            <CardTitle className="text-md flex items-center gap-2 text-white">
                              {resource.title}
                              <Badge className={`${getTypeColor(resource.type)}`}>{resource.type}</Badge>
                              {resource.type === "tool" && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Interactive</Badge>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <CardDescription className="text-white/70">
                              {resource.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                              asChild
                              onClick={() => trackNodeInteraction(resource, 'explore_resource')}
                            >
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                Explore Resource
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant={completedNodes.includes(selectedNode.id) ? "destructive" : "default"}
                  className={
                    completedNodes.includes(selectedNode.id)
                      ? "bg-red-500 hover:bg-red-600 w-full mt-4" 
                      : "bg-blue-600 hover:bg-blue-700 w-full mt-4"
                  }
                  onClick={() => toggleCompleted(selectedNode.id)}
                >
                  {completedNodes.includes(selectedNode.id) ? "Mark as Incomplete" : "Mark as Completed"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">Learning Path</h2>
              <p className="text-white/80 mb-6">
                Follow this structured path to master AI concepts from fundamentals to advanced applications.
              </p>

              <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">Your Progress</h3>
                  <span className="text-white/80">
                    {completedNodes.length}/{nodes.length} Completed
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(completedNodes.length / nodes.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/3 relative" ref={containerRef}>
        <div className="aspect-square w-full relative bg-[#1e3a8a]/50 rounded-lg border border-white/10 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-blueprint opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {nodes.map((node) => {
            const isCompleted = completedNodes.includes(node.id)
            const isHovered = hoveredNode === node.id
            const isHighlighted = hoveredNode === node.id || highlightedNode === node.id
            const isResource = 'type' in node && 'url' in node

            return (
              <button
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isHighlighted ? "scale-125 z-10" : ""
                }`}
                style={{
                  top: `${node.position.y * 100}%`,
                  left: `${node.position.x * 100}%`,
                }}
                onClick={() => {
                  trackNodeInteraction(node, 'select')
                  setSelectedNode(node)
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
                  className={`relative flex items-center justify-center rounded-full ${
                    isHighlighted ? "ring-2 ring-white shadow-glow" : ""
                  } ${
                    isCompleted
                      ? "bg-blue-500 border-2 border-white/50"
                      : `${isResource ? getTypeColor(node.type) : getTrackColor(node.track || "")} border border-white/30`
                  }`}
                  style={{
                    width: `${Math.max(30, (node.value || 0.3) * 60)}px`,
                    height: `${Math.max(30, (node.value || 0.3) * 60)}px`,
                  }}
                >
                  {node.icon}

                  {isHovered && (
                    <>
                      <div className="absolute -top-8 left-1/2 w-px h-8 border-l border-dashed border-white/40"></div>
                      <div className="absolute -bottom-8 left-1/2 w-px h-8 border-l border-dashed border-white/40"></div>
                      <div className="absolute top-1/2 -left-8 w-8 h-px border-t border-dashed border-white/40"></div>
                      <div className="absolute top-1/2 -right-8 w-8 h-px border-t border-dashed border-white/40"></div>

                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-white text-xs whitespace-nowrap border border-white/20">
                        {node.title}
                      </div>
                    </>
                  )}
                </div>
              </button>
            )
          })}

          {/* Blueprint legend - Simplified */}
          <div className="absolute bottom-4 right-4 bg-[#1e3a8a]/80 backdrop-blur-sm p-3 rounded border border-white/20 text-xs text-white/70 shadow-lg">
            <div className="font-bold text-white mb-2">LEGEND</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500/30"></div>
                <span>Core Track</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                <span>Data Track</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                <span>Tools Track</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-500/30"></div>
                <span>Specialization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}