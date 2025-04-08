"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Database, Brain, BookOpen, Sparkles, Zap, BarChart, Layers, Code, GitBranch } from "lucide-react"
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

interface Topic {
  id: string
  title: string
  description: string
  position: { x: number; y: number }
  icon: React.ReactNode
  resources: Resource[]
  difficulty: "beginner" | "intermediate" | "advanced"
  dependencies?: string[]
  value: number
  phase: number
  track?: string
}

interface Resource {
  title: string
  type: "article" | "video" | "course" | "tool" | "paper" | "project"
  url: string
  description: string
}

export default function LearningMap() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)
  const [highlightedTopic, setHighlightedTopic] = useState<string | null>(null)

  const topics: Topic[] = [
    // Phase 1: Fundamentals
    {
      id: "embeddings-basics",
      title: "Embeddings Basics",
      description:
        "Learn the fundamentals of vector embeddings and how they represent semantic meaning in a mathematical space.",
      position: { x: 0.2, y: 0.2 },
      icon: <Database className="h-5 w-5 text-white" />,
      difficulty: "beginner",
      value: 0.7,
      phase: 1,
      track: "core",
      resources: [
        {
          title: "Interactive Tokenization Demo",
          type: "tool",
          url: "/demos/tokenize",
          description: "See how text is tokenized for LLMs - the foundation of embeddings",
        },
        {
          title: "Chat with My Blog Tutorial",
          type: "project",
          url: "/blog/langchain-pinecone-chat-with-my-blog",
          description: "Create your first embedding-based search application",
        },
      ],
    },
    {
      id: "llm-fundamentals",
      title: "LLM Fundamentals",
      description: "Understand how Large Language Models work, their architecture, and capabilities.",
      position: { x: 0.5, y: 0.2 },
      icon: <Brain className="h-5 w-5 text-white" />,
      difficulty: "beginner",
      value: 0.8,
      phase: 1,
      track: "core",
      resources: [
        {
          title: "Interactive Tokenization Demo",
          type: "tool",
          url: "/demos/tokenize",
          description: "Hands-on exploration of how LLMs process text input",
        },
        {
          title: "Build a RAG Pipeline",
          type: "project",
          url: "/blog/rag-pipeline-tutorial",
          description: "Create your first LLM-powered application",
        },
      ],
    },

    // Phase 2: Intermediate
    {
      id: "vector-databases",
      title: "Vector Databases",
      description: "Explore specialized databases for storing and querying vector embeddings efficiently.",
      position: { x: 0.2, y: 0.4 },
      icon: <Database className="h-5 w-5 text-white" />,
      difficulty: "intermediate",
      value: 0.6,
      phase: 2,
      track: "data",
      dependencies: ["embeddings-basics"],
      resources: [
        {
          title: "Vector DB Comparison",
          type: "article",
          url: "/comparisons/vector-databases",
          description: "Comparing different vector database options",
        },
        {
          title: "Build with Pinecone",
          type: "project",
          url: "/blog/langchain-pinecone-chat-with-my-blog",
          description: "Create a production-ready vector search application",
        },
        {
          title: "CI/CD with Cloud Vector Databases",
          type: "article",
          url: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/ci-cd/",
          description: "Learn best practices for integrating vector DBs into CI/CD.",
        },
      ],
    },
    {
      id: "prompt-engineering",
      title: "Prompt Engineering",
      description: "Master the art of crafting effective prompts to get the best results from LLMs.",
      position: { x: 0.5, y: 0.4 },
      icon: <Sparkles className="h-5 w-5 text-white" />,
      difficulty: "intermediate",
      value: 0.65,
      phase: 2,
      track: "core",
      dependencies: ["llm-fundamentals"],
      resources: [
        {
          title: "Interactive Tokenization Demo",
          type: "tool",
          url: "/demos/tokenize",
          description: "Understand how your prompts are processed by the model",
        },
        {
          title: "Build a RAG Pipeline",
          type: "project",
          url: "/blog/rag-pipeline-tutorial",
          description: "Create prompt templates for consistent outputs",
        },
      ],
    },
    {
      id: "langchain",
      title: "LangChain",
      description: "Build applications with LLMs through composable components and tools.",
      position: { x: 0.8, y: 0.4 },
      icon: <Code className="h-5 w-5 text-white" />,
      difficulty: "intermediate",
      value: 0.75,
      phase: 2,
      track: "tools",
      dependencies: ["llm-fundamentals"],
      resources: [
        {
          title: "LangChain Quickstart",
          type: "article",
          url: "https://python.langchain.com/docs/get_started/quickstart",
          description: "Get started with LangChain framework",
        },
        {
          title: "Build a Document Q&A System",
          type: "project",
          url: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/",
          description: "Create a system that answers questions about your documents",
        },
      ],
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
      resources: [
        {
          title: "What is Retrieval Augmented Generation (RAG)?",
          type: "article",
          url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
          description: "Introduction to RAG from Pinecone.",
        },
        {
          title: "Building RAG Systems",
          type: "article",
          url: "/blog/rag-pipeline-tutorial",
          description: "Comprehensive guide to RAG architecture",
        },
        {
          title: "Interactive Tokenization Demo",
          type: "tool",
          url: "/demos/tokenize",
          description: "Optimize token usage in your RAG system prompts",
        },
      ],
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
      resources: [
        {
          title: "Fine-tuning Guide",
          type: "article",
          url: "https://platform.openai.com/docs/guides/fine-tuning",
          description: "OpenAI's guide to fine-tuning models",
        },
        {
          title: "Build a Custom Assistant",
          type: "project",
          url: "https://platform.openai.com/docs/tutorials/fine-tuning",
          description: "Create a specialized assistant for your domain",
        },
      ],
    },

    // Phase 4: Specializations
    {
      id: "multimodal-models",
      title: "Multimodal AI",
      description: "Explore models that can process and generate multiple types of data like text, images, and audio.",
      position: { x: 0.5, y: 0.8 },
      icon: <Layers className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.45,
      phase: 4,
      track: "specialization",
      dependencies: ["fine-tuning"],
      resources: [
        {
          title: "Multimodal Learning",
          type: "paper",
          url: "https://arxiv.org/abs/2206.06488",
          description: "Research on multimodal foundation models",
        },
        {
          title: "Build a Vision+Language App",
          type: "project",
          url: "https://platform.openai.com/docs/guides/vision",
          description: "Create an application that processes images and text",
        },
      ],
    },
    {
      id: "evaluation-metrics",
      title: "LLM Evaluation",
      description: "Learn how to evaluate and benchmark LLM performance across different tasks and domains.",
      position: { x: 0.2, y: 0.8 },
      icon: <BarChart className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.5,
      phase: 4,
      track: "specialization",
      dependencies: ["rag-systems"],
      resources: [
        {
          title: "LLM Evaluation Guide",
          type: "article",
          url: "https://huggingface.co/blog/evaluating-mmlu-leaderboard",
          description: "Comprehensive guide to LLM evaluation metrics",
        },
        {
          title: "Build an Evaluation Pipeline",
          type: "project",
          url: "https://crfm.stanford.edu/helm/latest/",
          description: "Create a system to benchmark your LLM applications",
        },
        {
          title: "RAG Evaluation Guide",
          type: "article",
          url: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/rag-evaluation/",
          description: "Learn how to evaluate your RAG pipelines effectively.",
        },
      ],
    },
    {
      id: "agents",
      title: "AI Agents",
      description: "Build autonomous AI systems that can plan and execute complex tasks.",
      position: { x: 0.8, y: 0.8 },
      icon: <GitBranch className="h-5 w-5 text-white" />,
      difficulty: "advanced",
      value: 0.6,
      phase: 4,
      track: "specialization",
      dependencies: ["langchain", "fine-tuning"],
      resources: [
        {
          title: "AI Agents Architecture",
          type: "article",
          url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
          description: "Deep dive into AI agent architectures",
        },
        {
          title: "Build an Autonomous Agent",
          type: "project",
          url: "https://python.langchain.com/docs/modules/agents/",
          description: "Create an agent that can solve complex tasks",
        },
      ],
    },
  ]

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
    topics.forEach((topic) => {
      if (topic.dependencies) {
        topic.dependencies.forEach((depId) => {
          const depTopic = topics.find((t) => t.id === depId)
          if (!depTopic) return

          const fromX = depTopic.position.x * canvas.width
          const fromY = depTopic.position.y * canvas.height
          const toX = topic.position.x * canvas.width
          const toY = topic.position.y * canvas.height

          // Draw blueprint-style connection
          drawBlueprintConnection(
            ctx,
            fromX,
            fromY,
            toX,
            toY,
            completedTopics.includes(depId) && completedTopics.includes(topic.id),
            hoveredTopic === topic.id ||
              hoveredTopic === depId ||
              highlightedTopic === topic.id ||
              highlightedTopic === depId,
          )
        })
      }
    })

    // Draw annotations
    drawBlueprintAnnotations(ctx, canvas.width, canvas.height)
  }, [dimensions, completedTopics, hoveredTopic, highlightedTopic, topics])

  const drawBlueprintGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw grid
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

    // Draw main coordinate axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 2

    // Vertical center line
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()

    // Horizontal center line
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }

  const drawPhaseLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const phasePositions = [0.1, 0.3, 0.5, 0.7, 0.9]
    const phaseLabels = [
      "PHASE 1: FUNDAMENTALS",
      "PHASE 2: INTERMEDIATE",
      "PHASE 3: ADVANCED",
      "PHASE 4: SPECIALIZATIONS",
    ]

    // Draw horizontal phase separator lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 5])

    phasePositions.slice(1).forEach((y, i) => {
      ctx.beginPath()
      ctx.moveTo(0, y * height)
      ctx.lineTo(width, y * height)
      ctx.stroke()

      // Add phase label with improved rendering
      if (i < phaseLabels.length) {
        // Clear a small background area for the text to improve readability
        const textWidth = ctx.measureText(phaseLabels[i]).width
        ctx.fillStyle = "rgba(30, 58, 138, 0.9)" // More opaque background
        ctx.fillRect(15, (y - 0.1) * height + 5, textWidth + 20, 28) // Larger background

        // Add a light border for better visibility
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        ctx.lineWidth = 1
        ctx.strokeRect(15, (y - 0.1) * height + 5, textWidth + 20, 28)

        // Draw text with crisp rendering
        ctx.font = "bold 14px monospace"
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)" // More visible text
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(phaseLabels[i], 25, (y - 0.1) * height + 18) // Adjust text position
      }
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
    isHovered: boolean,
  ) => {
    // Set line style based on completion and hover state
    if (isHovered) {
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
    // Add some blueprint-style annotations
    ctx.font = "12px monospace"
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)" // More visible annotation text

    // Add coordinate markers
    for (let x = 100; x < width; x += 100) {
      // Create a small background for the coordinates
      ctx.fillStyle = "rgba(30, 58, 138, 0.8)"
      const coordText = `${x}px`
      const textWidth = ctx.measureText(coordText).width
      ctx.fillRect(x + 2, 5, textWidth + 6, 16)
      
      // Draw the coordinate text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillText(coordText, x + 5, 15)

      // Small tick marks
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 8)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)" // More visible tick marks
      ctx.lineWidth = 1
      ctx.stroke()
    }

    for (let y = 100; y < height; y += 100) {
      // Create a small background for the coordinates
      ctx.fillStyle = "rgba(30, 58, 138, 0.8)"
      const coordText = `${y}px`
      const textWidth = ctx.measureText(coordText).width
      ctx.fillRect(2, y - 15, textWidth + 6, 16)
      
      // Draw the coordinate text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillText(coordText, 5, y - 5)

      // Small tick marks
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(8, y)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)" // More visible tick marks
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Add blueprint title and scale
    // Title at bottom left
    ctx.font = "10px monospace"
    ctx.fillStyle = "rgba(30, 58, 138, 0.9)"
    ctx.fillRect(5, height - 20, 230, 16)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.strokeRect(5, height - 20, 230, 16)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillText("AI ENGINEERING BLUEPRINT v1.0", 10, height - 10)
    
    // Scale at bottom right
    ctx.fillStyle = "rgba(30, 58, 138, 0.9)"
    ctx.fillRect(width - 105, height - 20, 100, 16)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.strokeRect(width - 105, height - 20, 100, 16)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillText("SCALE: 1:100", width - 100, height - 10)
  }

  const toggleCompleted = (topicId: string) => {
    setCompletedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const isTopicAccessible = (topic: Topic) => {
    if (!topic.dependencies) return true
    return topic.dependencies.every((dep) => completedTopics.includes(dep))
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

  // Group topics by phase
  const topicsByPhase = topics.reduce(
    (acc, topic) => {
      if (!acc[topic.phase]) {
        acc[topic.phase] = []
      }
      acc[topic.phase].push(topic)
      return acc
    },
    {} as Record<number, Topic[]>,
  )

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold text-white mb-4">Learning Path</h2>
          <p className="text-white/80 mb-6">
            Follow this structured path to master AI concepts from fundamentals to advanced applications.
          </p>

          <div className="space-y-6">
            {Object.entries(topicsByPhase).map(([phase, phaseTopics]) => (
              <div key={phase} className="space-y-3">
                <h3 className="text-white/90 font-bold border-b border-white/20 pb-2">
                  Phase {phase}:{" "}
                  {phase === "1"
                    ? "Fundamentals"
                    : phase === "2"
                      ? "Intermediate"
                      : phase === "3"
                        ? "Advanced"
                        : "Specializations"}
                </h3>
                <div className="space-y-3">
                  {phaseTopics.map((topic) => {
                    const isCompleted = completedTopics.includes(topic.id)
                    const isAccessible = isTopicAccessible(topic)
                    const isHighlighted = hoveredTopic === topic.id || highlightedTopic === topic.id

                    return (
                      <div
                        key={topic.id}
                        className={`p-4 rounded-lg transition-all border ${
                          isHighlighted ? "border-white/50 shadow-glow" : "border-white/10"
                        } ${
                          isCompleted
                            ? "bg-white/20"
                            : isAccessible
                              ? "bg-white/10 hover:bg-white/15"
                              : "bg-white/5 opacity-50"
                        }`}
                        onMouseEnter={() => {
                          setHoveredTopic(topic.id)
                          setHighlightedTopic(topic.id)
                        }}
                        onMouseLeave={() => {
                          setHoveredTopic(null)
                          setHighlightedTopic(null)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${getTrackColor(topic.track || "")} flex items-center justify-center`}
                            >
                              {topic.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{topic.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-500/20 text-white border-0 text-xs">{topic.difficulty}</Badge>
                                {isCompleted && (
                                  <Badge className="bg-green-500/20 text-white border-0 text-xs">Completed</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                                disabled={!isAccessible}
                              >
                                Explore
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1e3a8a] border-white/10 text-white">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl text-white">
                                  <div
                                    className={`w-8 h-8 rounded-full ${getTrackColor(topic.track || "")} flex items-center justify-center`}
                                  >
                                    {topic.icon}
                                  </div>
                                  <span>{topic.title}</span>
                                  <Badge className="ml-2 bg-blue-500/20 border-0">{topic.difficulty}</Badge>
                                </DialogTitle>
                                <DialogDescription className="text-white/70 mt-2">
                                  {topic.description}
                                  {!isAccessible && topic.dependencies && (
                                    <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-yellow-200">
                                      ⚠️ This topic is locked. Complete the prerequisites below to unlock it.
                                    </div>
                                  )}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <h3 className="text-lg font-semibold text-white">Learning Resources</h3>
                                <div className="grid gap-3">
                                  {topic.resources.map((resource, idx) => (
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
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            Explore Resource
                                          </a>
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between">
                                <Button
                                  variant={isCompleted ? "destructive" : "default"}
                                  className={
                                    isCompleted ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                                  }
                                  onClick={() => toggleCompleted(topic.id)}
                                >
                                  {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                </Button>

                                {topic.dependencies && topic.dependencies.length > 0 && (
                                  <div className="text-sm text-white/60 flex items-center">
                                    <span className="mr-2">Prerequisites:</span>
                                    <div className="flex gap-1">
                                      {topic.dependencies.map((dep) => {
                                        const depTopic = topics.find((t) => t.id === dep)
                                        if (!depTopic) return null
                                        return (
                                          <Badge
                                            key={dep}
                                            variant="outline"
                                            className={`${
                                              completedTopics.includes(dep)
                                                ? "bg-green-500/20 text-white border-green-500/30"
                                                : "bg-white/10 text-white/70 border-white/20"
                                            }`}
                                          >
                                            {depTopic.title.split(" ")[0]}
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white">Your Progress</h3>
              <span className="text-white/80">
                {completedTopics.length}/{topics.length} Topics
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(completedTopics.length / topics.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 relative" ref={containerRef}>
        <div className="aspect-square w-full relative bg-[#1e3a8a]/50 rounded-lg border border-white/10 overflow-hidden shadow-xl">
          {/* Blueprint pattern overlay */}
          <div className="absolute inset-0 bg-blueprint opacity-30"></div>
          
          {/* Add blueprint paper texture appearance */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Topic nodes */}
          {topics.map((topic) => {
            const isCompleted = completedTopics.includes(topic.id)
            const isAccessible = isTopicAccessible(topic)
            const isHovered = hoveredTopic === topic.id
            const isHighlighted = hoveredTopic === topic.id || highlightedTopic === topic.id

            return (
              <Dialog key={topic.id}>
                <DialogTrigger asChild>
                  <button
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isHighlighted ? "scale-125 z-10" : ""
                    }`}
                    style={{
                      top: `${topic.position.y * 100}%`,
                      left: `${topic.position.x * 100}%`,
                    }}
                    onMouseEnter={() => {
                      setHoveredTopic(topic.id)
                      setHighlightedTopic(topic.id)
                    }}
                    onMouseLeave={() => {
                      setHoveredTopic(null)
                      setHighlightedTopic(null)
                    }}
                  >
                    <div
                      className={`relative flex items-center justify-center rounded-full ${
                        isHighlighted ? "ring-2 ring-white shadow-glow" : ""
                      } ${
                        isCompleted
                          ? "bg-blue-500 border-2 border-white/50"
                          : isAccessible
                            ? `${getTrackColor(topic.track || "")} border border-white/30`
                            : "bg-white/20 border border-white/10"
                      }`}
                      style={{
                        width: `${Math.max(40, topic.value * 60)}px`,
                        height: `${Math.max(40, topic.value * 60)}px`,
                      }}
                    >
                      {topic.icon}

                      {/* Blueprint-style measurement lines */}
                      {isHovered && (
                        <>
                          <div className="absolute -top-8 left-1/2 w-px h-8 border-l border-dashed border-white/40"></div>
                          <div className="absolute -bottom-8 left-1/2 w-px h-8 border-l border-dashed border-white/40"></div>
                          <div className="absolute top-1/2 -left-8 w-8 h-px border-t border-dashed border-white/40"></div>
                          <div className="absolute top-1/2 -right-8 w-8 h-px border-t border-dashed border-white/40"></div>
                        </>
                      )}

                      {isHovered && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-white text-xs whitespace-nowrap border border-white/20">
                          {topic.title}
                        </div>
                      )}

                      {topic.value && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs border border-white/20">
                          {topic.value.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1e3a8a] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-white">
                      <div
                        className={`w-8 h-8 rounded-full ${getTrackColor(topic.track || "")} flex items-center justify-center`}
                      >
                        {topic.icon}
                      </div>
                      <span>{topic.title}</span>
                      <Badge className="ml-2 bg-blue-500/20 border-0">{topic.difficulty}</Badge>
                    </DialogTitle>
                    <DialogDescription className="text-white/70 mt-2">
                      {topic.description}
                      {!isAccessible && topic.dependencies && (
                        <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-yellow-200">
                          ⚠️ This topic is locked. Complete the prerequisites below to unlock it.
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <h3 className="text-lg font-semibold text-white">Learning Resources</h3>
                    <div className="grid gap-3">
                      {topic.resources.map((resource, idx) => (
                        <Card key={idx} className="bg-white/10 border-white/10">
                          <CardHeader className="py-3">
                            <CardTitle className="text-md flex items-center gap-2 text-white">
                              {resource.title}
                              <Badge className={`ml-auto ${getTypeColor(resource.type)}`}>
                                {resource.type}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-white/70">
                              {resource.description}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="pt-0 pb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                              asChild
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

                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => toggleCompleted(topic.id)}
                    >
                      {completedTopics.includes(topic.id) ? "Mark as Incomplete" : "Mark as Completed"}
                    </Button>
                  </div>

                  {topic.dependencies && topic.dependencies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-sm font-medium text-white/70">Prerequisites:</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {topic.dependencies.map((depId) => {
                          const depTopic = topics.find((t) => t.id === depId)
                          if (!depTopic) return null
                          return (
                            <Badge 
                              key={depId} 
                              className={`
                                ${completedTopics.includes(depId) ? "bg-green-500/20" : "bg-white/10"}
                                text-white border-0
                              `}
                            >
                              {depTopic.title}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )
          })}

          {/* Blueprint legend - Ensuring this and subsequent code is not deleted */}
          <div className="absolute bottom-4 right-4 bg-[#1e3a8a]/80 backdrop-blur-sm p-3 rounded border border-white/20 text-xs text-white/70 shadow-lg">
            <div className="font-bold text-white mb-2">BLUEPRINT LEGEND</div>
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
              <div className="flex items-center gap-1">
                <div className="w-6 h-px border-t border-dashed border-white/40"></div>
                <span>Dependency</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-px border-t border-blue-500/80"></div>
                <span>Completed Path</span>
              </div>
            </div>
          </div>
          
          {/* Add blueprint-like title stamp */}
          <div className="absolute top-4 left-4 bg-[#1e3a8a]/80 backdrop-blur-sm px-4 py-2 rounded border border-white/20 text-sm text-white/90 shadow-lg transform rotate-[-1deg]">
            <div className="font-mono uppercase tracking-wider">AI Engineering Blueprint</div>
            <div className="text-xs text-white/60 font-mono">REV. 2025-A</div>
          </div>
        </div>
      </div>
    </div>
  )
}