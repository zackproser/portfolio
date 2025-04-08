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
      {/* Filter controls */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {['core', 'data', 'tools', 'specialization'].map(track => (
            <Button
              key={track}
              variant={activeFilters.has(track) ? 'default' : 'secondary'}
              className={`${
                activeFilters.has(track) 
                  ? `bg-gradient-to-r ${
                      track === 'core' ? 'from-blue-600/70 to-blue-700/70 hover:from-blue-600/80 hover:to-blue-700/80 border border-blue-500/50' : 
                      track === 'data' ? 'from-green-600/70 to-green-700/70 hover:from-green-600/80 hover:to-green-700/80 border border-green-500/50' :
                      track === 'tools' ? 'from-amber-600/70 to-amber-700/70 hover:from-amber-600/80 hover:to-amber-700/80 border border-amber-500/50' :
                      'from-purple-600/70 to-purple-700/70 hover:from-purple-600/80 hover:to-purple-700/80 border border-purple-500/50'
                    } text-white shadow-md` 
                  : 'bg-white/10 hover:bg-white/15 border border-white/30 text-white/80 hover:text-white'
              } text-sm px-5 py-2.5 rounded-xl font-medium transition-all duration-300`}
              onClick={() => toggleFilter(track)}
            >
              {track.charAt(0).toUpperCase() + track.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Grid of Topics */}
      <div className="space-y-16">
        {Object.entries(topicsByPhase).map(([phase, topics]) => (
          <div key={phase} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-900/60 backdrop-blur-sm px-8 py-3 rounded-xl border border-blue-400/30 shadow-lg">
                <h3 className="text-2xl font-bold text-white">
                  {phaseNames[Number(phase)]}
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => (
                <Dialog key={topic.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`
                        p-5 rounded-xl cursor-pointer transition-all duration-300
                        bg-gradient-to-br ${getTrackColor(topic.track).replace('bg-blue-500/30', 'from-blue-600/40 to-blue-800/40').replace('bg-green-500/30', 'from-green-600/40 to-green-800/40').replace('bg-amber-500/30', 'from-amber-600/40 to-amber-800/40').replace('bg-purple-500/30', 'from-purple-600/40 to-purple-800/40')}
                        hover:from-blue-600/50 hover:to-blue-800/50 border-2 border-white/20 hover:border-white/30
                        ${completedNodes.includes(topic.id) ? 'ring-2 ring-green-500/60 shadow-lg shadow-green-500/10' : 'shadow-md hover:shadow-xl'}
                        transform hover:scale-[1.02]
                      `}
                      onClick={() => handleOpenTopic(topic)}
                    >
                      <div className="flex gap-5">
                        <div className="p-4 rounded-xl bg-white/10 shadow-inner backdrop-blur-sm border border-white/20">
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-xl">{topic.title}</h4>
                          <p className="text-white/90 text-sm mt-2 line-clamp-2 leading-relaxed">{topic.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Badge className="bg-blue-500/40 text-white border-blue-400/50 px-3 py-1 font-medium">
                              {topic.difficulty}
                            </Badge>
                            <Badge className="bg-white/20 text-white border-white/40 px-3 py-1 font-medium">
                              {topic.resources.length} resources
                            </Badge>
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-gradient-to-r from-green-500/50 to-green-600/50 text-white border-green-400/50 px-3 py-1 font-medium">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-white/90 hover:text-white hover:bg-white/10 font-medium"
                            onClick={(e) => toggleCompleted(topic.id, e)}
                          >
                            {completedNodes.includes(topic.id) 
                              ? "Mark as Incomplete" 
                              : "Mark as Completed"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border-2 border-blue-400/70 text-white max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl">
                    <DialogHeader className="mb-8 px-2">
                      <div className="flex items-center gap-5">
                        <div className={`p-5 rounded-xl ${getTrackColor(topic.track)} shadow-lg border border-white/40 backdrop-blur-sm`}>
                          {topic.icon}
                        </div>
                        <div>
                          <DialogTitle className="text-3xl font-bold text-white mb-1">{topic.title}</DialogTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className="bg-blue-500/70 text-white border-blue-500/50 font-medium px-3 py-1">{topic.difficulty}</Badge>
                            <Badge className="bg-white/30 text-white border-white/30 font-medium px-3 py-1">{topic.resources.length} resources</Badge>
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-green-500/70 text-white border-green-500/50 font-medium px-3 py-1">Completed</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogDescription className="text-white mt-6 text-base font-medium leading-relaxed">
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
                          <div className="p-5 rounded-xl border-2 border-white/20 group-hover:border-white/40 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/15 group-hover:to-white/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`p-3 rounded-lg ${getTypeColor(resource.type).replace('text-blue-800', 'text-white').replace('text-purple-800', 'text-white').replace('text-green-800', 'text-white').replace('text-amber-800', 'text-white').replace('text-cyan-800', 'text-white').replace('text-red-800', 'text-white')} border border-white/30 shadow-md`}>
                                {getResourceIcon(resource.type)}
                              </div>
                              <h4 className="font-bold text-lg group-hover:text-blue-300 transition-colors">{resource.title}</h4>
                            </div>
                            <p className="text-white/90 text-sm font-medium mb-4">{resource.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge className={`${getTypeColor(resource.type)} px-3 py-1 text-sm`}>
                                {resource.type}
                              </Badge>
                              <div className="text-blue-400 text-sm font-medium group-hover:text-blue-300">
                                View Resource →
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10 px-2">
                      <Button
                        variant={completedNodes.includes(topic.id) ? "destructive" : "default"}
                        className={`
                          ${completedNodes.includes(topic.id)
                            ? "bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-700 hover:to-red-800 border border-red-400/30" 
                            : "bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700 hover:to-blue-800 border border-blue-400/30"}
                          text-white font-medium px-6 py-2 shadow-md
                        `}
                        onClick={(e) => toggleCompleted(topic.id, e)}
                      >
                        {completedNodes.includes(topic.id) ? "Mark as Incomplete" : "Mark as Completed"}
                      </Button>
                      
                      <DialogClose asChild>
                        <Button variant="outline" className="border-white/30 hover:bg-white/10 text-white font-medium">
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