"use client"

import { useState, useEffect } from "react"
import { Database, Brain, BookOpen, Sparkles, Zap, BarChart, Layers, Code, GitBranch, Network, Settings, Scale, Wrench, FileText, Video, ScrollText, Laptop, Lock, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { track } from '@vercel/analytics'

// Reuse the same interfaces from the original implementation
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

// Color utility functions from the original implementation
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

// Define the resource types
type ResourceType = "article" | "video" | "course" | "tool" | "paper" | "project";

// Resource type config for detail view
const typeConfigs: Record<ResourceType, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  project: { 
    label: "Projects", 
    color: "bg-amber-600 text-white",
    icon: <BookOpen className="h-5 w-5 text-white" /> 
  },
  course: { 
    label: "Courses", 
    color: "bg-green-600 text-white",
    icon: <Laptop className="h-5 w-5 text-white" />
  },
  article: { 
    label: "Articles", 
    color: "bg-blue-600 text-white",
    icon: <FileText className="h-5 w-5 text-white" />
  },
  video: { 
    label: "Videos", 
    color: "bg-purple-600 text-white",
    icon: <Video className="h-5 w-5 text-white" />
  },
  tool: { 
    label: "Tools", 
    color: "bg-cyan-600 text-white",
    icon: <Wrench className="h-5 w-5 text-white" />
  },
  paper: { 
    label: "Papers", 
    color: "bg-red-600 text-white",
    icon: <ScrollText className="h-5 w-5 text-white" />
  }
};

export default function LearningGrid() {
  // State management (simplified from the original implementation)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['core', 'data', 'tools', 'specialization']))

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

  // Reuse the topics data from the original implementation
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

  // Track node interactions
  const trackNodeInteraction = (node: Node, action: string) => {
    track('learning_map_interaction', {
      node_id: node.id,
      node_type: isResource(node) ? 'resource' : 'topic',
      action,
      node_title: node.title
    })
  }

  const toggleCompleted = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dialog when toggling completion
    trackNodeInteraction(topics.find(n => n.id === nodeId)!, 'toggle_completion')
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

  // Filter topics based on active tracks
  const filteredTopics = topics.filter(topic => activeFilters.has(topic.track))

  // Group topics by phase
  const topicsByPhase = filteredTopics.reduce((acc, topic) => {
    if (!acc[topic.phase]) {
      acc[topic.phase] = [];
    }
    acc[topic.phase].push(topic);
    return acc;
  }, {} as Record<number, Topic[]>);

  const phaseNames: Record<number, string> = {
    0: "Foundations",
    3: "Advanced Applications",
    4: "Specializations"
  };

  // Handle opening a topic
  const handleOpenTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    trackNodeInteraction(topic, 'open_topic');
  }

  // Handle clicking a resource
  const handleResourceClick = (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing the dialog
    trackNodeInteraction(resource, 'click_resource');
    // We don't navigate here as the a tag will handle it
  }

  return (
    <>
      {/* Main Grid of Topics */}
      <div className="space-y-6">
        {Object.entries(topicsByPhase).map(([phase, topics]) => (
          <div key={phase} className="space-y-3">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => (
                <Dialog key={topic.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`
                        p-4 rounded-xl cursor-pointer transition-all duration-300
                        bg-gradient-to-br ${getTrackColor(topic.track).replace('bg-blue-500/30', 'from-blue-600/40 to-blue-800/40').replace('bg-green-500/30', 'from-green-600/40 to-green-800/40').replace('bg-amber-500/30', 'from-amber-600/40 to-amber-800/40').replace('bg-purple-500/30', 'from-purple-600/40 to-purple-800/40')}
                        hover:from-blue-600/50 hover:to-blue-800/50 border-2 border-white/20 hover:border-white/30
                        ${completedNodes.includes(topic.id) ? 'ring-2 ring-green-500/60 shadow-lg shadow-green-500/10' : 'shadow-md hover:shadow-xl'}
                        transform hover:scale-[1.02]
                        w-full mx-auto h-full
                      `}
                      onClick={() => handleOpenTopic(topic)}
                    >
                      <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-white/10 shadow-inner backdrop-blur-sm border border-white/20">
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{topic.title}</h4>
                          <p className="text-white/90 text-sm mt-2 leading-relaxed line-clamp-3">{topic.description}</p>
                          <div className="mt-3">
                            <span className="text-white/80 text-xs">{topic.resources.length} resources</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-950 to-[#0f1b40] border border-indigo-400/30 text-white max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl">
                    <DialogHeader className="mb-6 px-2">
                      <div className="flex items-center gap-5">
                        <div className={`p-5 rounded-xl ${getTrackColor(topic.track)} backdrop-blur-sm border border-white/30 shadow-lg`}>
                          {topic.icon}
                        </div>
                        <div>
                          <DialogTitle className="text-3xl font-bold text-white mb-2 tracking-tight">{topic.title}</DialogTitle>
                          <div className="flex gap-2 mt-1">
                            <span className="text-white/70 text-sm">{topic.resources.length} premium resources</span>
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-emerald-500/70 text-white border-emerald-500/50 font-medium px-3 py-1">Completed</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogDescription className="text-white mt-5 text-lg font-medium leading-relaxed">
                        {topic.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-2">
                      {topic.resources.map(resource => (
                        <a 
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                          onClick={(e) => handleResourceClick(resource, e)}
                        >
                          <div className="relative overflow-hidden rounded-xl transform transition-all duration-300 group-hover:scale-[1.02] shadow-lg group-hover:shadow-xl">
                            {/* Gradient background with subtle animation */}
                            <div className="absolute inset-0 bg-gradient-to-br 
                              from-blue-800/80 to-indigo-900/90 group-hover:from-blue-700/80 group-hover:to-indigo-800/90 
                              transition-all duration-500"></div>
                            
                            {/* Animated glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"></div>
                            
                            {/* Subtle grid pattern */}
                            <div className="absolute inset-0 opacity-10 bg-grid-white/5"></div>
                            
                            {/* Content container */}
                            <div className="relative p-6 z-10">
                              <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-lg ${
                                  resource.type === "project" ? "bg-gradient-to-br from-amber-500/70 to-orange-600/70" :
                                  resource.type === "course" ? "bg-gradient-to-br from-emerald-500/70 to-teal-600/70" :
                                  resource.type === "article" ? "bg-gradient-to-br from-blue-500/70 to-indigo-600/70" :
                                  resource.type === "video" ? "bg-gradient-to-br from-purple-500/70 to-fuchsia-600/70" :
                                  resource.type === "tool" ? "bg-gradient-to-br from-cyan-500/70 to-sky-600/70" :
                                  "bg-gradient-to-br from-red-500/70 to-rose-600/70"
                                } border border-white/20 shadow-md`}>
                                  {getResourceIcon(resource.type)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">{resource.title}</h4>
                                  <div className="mt-1">
                                    <Badge className={`${
                                      resource.type === "project" ? "bg-amber-500/20 text-amber-200 border-amber-500/30" :
                                      resource.type === "course" ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30" :
                                      resource.type === "article" ? "bg-blue-500/20 text-blue-200 border-blue-500/30" :
                                      resource.type === "video" ? "bg-purple-500/20 text-purple-200 border-purple-500/30" :
                                      resource.type === "tool" ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/30" :
                                      "bg-red-500/20 text-red-200 border-red-500/30"
                                    } px-2.5 py-0.5 text-xs rounded-md font-medium`}>
                                      {resource.type}
                                    </Badge>
                                    
                                    {resource.type === "project" && (
                                      <Badge className="ml-2 bg-gradient-to-r from-amber-400/40 to-orange-500/40 text-amber-100 border-amber-500/30 px-2.5 py-0.5 text-xs rounded-md font-medium">
                                        Premium
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-white/90 text-base font-medium mb-5 line-clamp-3 leading-relaxed">{resource.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-blue-300 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                                  <span>Explore Resource</span>
                                  <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </div>
                                
                                {/* Subtle shine effect */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center mt-8 pt-5 px-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-white font-medium px-8">
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
} 