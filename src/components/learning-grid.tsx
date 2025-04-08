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
import ConsultationForm from "./ConsultationForm"

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

const ResourceCard = ({ resource, isSelected, onSelect }: { 
  resource: Resource; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  const typeColors: Record<ResourceType, string> = {
    project: "from-amber-600/80 to-amber-800/80 border-amber-500/40",
    course: "from-green-600/80 to-green-800/80 border-green-500/40",
    article: "from-blue-600/80 to-blue-800/80 border-blue-500/40",
    video: "from-purple-600/80 to-purple-800/80 border-purple-500/40",
    tool: "from-cyan-600/80 to-cyan-800/80 border-cyan-500/40",
    paper: "from-red-600/80 to-red-800/80 border-red-500/40"
  };

  const typeCardColors: Record<ResourceType, string> = {
    project: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-700/50",
    course: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border-green-200 dark:border-green-700/50",
    article: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700/50",
    video: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-700/50",
    tool: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200 border-cyan-200 dark:border-cyan-700/50",
    paper: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-700/50"
  };

  // Get icon for the resource type
  const iconMap = {
    'article': '📝',
    'video': '🎥',
    'project': '⚙️',
    'course': '📚',
    'tool': '🧩',
    'paper': '📄'
  }
  
  const icon = iconMap[resource.type] || '📄'
  
  // Determine if resource is premium (projects are considered premium)
  const isPremium = resource.type === "project";
  const includesCode = resource.type === "project" || resource.type === "course";
  
  // Handle resource click to track and navigate
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent dialog close
    track('learning_map_interaction', {
      node_id: resource.id,
      node_type: 'resource',
      action: 'click_resource',
      node_title: resource.title
    })
    
    // The link inside will handle navigation
  }

  return (
    <a 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block"
    >
      <div 
        className={`
          relative group cursor-pointer transition-all duration-300
          ${isSelected ? 'scale-[1.03] ring-2 ring-white/60 shadow-xl' : 'hover:scale-[1.02] shadow-md hover:shadow-lg'}
          ${isPremium ? 'shadow-gold' : ''}
        `}
      >
        <div className={`
          p-6 rounded-xl border-2 backdrop-blur-sm bg-gradient-to-br
          ${typeColors[resource.type]}
        `}>
          {/* Premium badge */}
          {isPremium && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-x-1 rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-white shadow-md backdrop-blur-sm border border-amber-400/50 z-10">
              <span className="mr-0.5">💎</span> Premium
            </span>
          )}

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-lg bg-white/40 shadow-inner border border-white/60">
              {/* Use icon from mapping instead of component */}
              <span className="text-xl">{icon}</span>
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
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-500 font-medium">
                    Premium
                  </Badge>
                )}
                {includesCode && (
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border-teal-200 dark:border-teal-700/50">
                    <span className="mr-1">💻</span> Includes Code
                  </Badge>
                )}
                <div className="flex-1" />
                <div className="text-white font-medium text-sm py-1 px-2 bg-white/20 rounded-md inline-flex items-center hover:bg-white/30 transition-colors">
                  {isPremium ? "Master This Skill →" : "Explore →"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
};

export default function LearningGrid() {
  // State management (simplified from the original implementation)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['core', 'data', 'tools', 'specialization']))
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  
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
      icon: <Brain className="h-5 w-5 text-white" />,
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
          description: "Try it yourself: See how LLMs break down your text in real-time with this interactive tool.",
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
                        p-5 rounded-xl cursor-pointer transition-all duration-300
                        bg-gradient-to-br ${getTrackColor(topic.track).replace('bg-blue-500/30', 'from-blue-600/40 to-blue-800/40').replace('bg-green-500/30', 'from-green-600/40 to-green-800/40').replace('bg-amber-500/30', 'from-amber-600/40 to-amber-800/40').replace('bg-purple-500/30', 'from-purple-600/40 to-purple-800/40')}
                        hover:from-blue-600/50 hover:to-blue-800/50 border-2 border-white/20 hover:border-white/30
                        ${completedNodes.includes(topic.id) ? 'ring-2 ring-green-500/60 shadow-lg shadow-green-500/10' : 'shadow-md hover:shadow-xl'}
                        transform hover:scale-[1.02]
                        w-full mx-auto h-full relative
                      `}
                      onClick={() => handleOpenTopic(topic)}
                    >
                      <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-white/10 shadow-inner backdrop-blur-sm border border-white/20">
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-lg">{topic.title}</h4>
                            {completedNodes.includes(topic.id) && (
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          
                          <p className="text-white/90 text-sm mt-2 leading-relaxed line-clamp-2 mb-3">{topic.description}</p>
                          
                          {/* Modified the Business Impact section to remove track-specific language */}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <h5 className="text-xs font-medium text-blue-300 uppercase tracking-wider mb-1">Key Outcomes</h5>
                            <p className="text-white/80 text-xs line-clamp-2">
                              Accelerate development time and ship AI applications with production-ready architectures
                            </p>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              {/* Removed badges per request */}
                            </div>
                            
                            <span className="text-blue-300 text-xs flex items-center">
                              Explore
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress indicator for multi-part topics with many resources */}
                      {topic.resources.length >= 4 && (
                        <div className="mt-4 pt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/70">Progress</span>
                            <span className="text-white/70">
                              {completedNodes.includes(topic.id) ? "Completed" : "0%"}
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className={`${completedNodes.includes(topic.id) ? "bg-emerald-500" : "bg-blue-500/50"} h-1.5 rounded-full`} 
                              style={{ width: completedNodes.includes(topic.id) ? "100%" : "0%" }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-950 to-[#0f1b40] border border-indigo-400/30 text-white max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl">
                    <DialogHeader className="mb-6 px-2">
                      <div className="flex items-center gap-5">
                        <div className={`p-5 rounded-xl ${getTrackColor(topic.track)} backdrop-blur-sm border border-white/30 shadow-lg`}>
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <DialogTitle className="text-3xl font-bold text-white mb-1 tracking-tight">{topic.title}</DialogTitle>
                            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-xs px-2 py-1 rounded-full text-blue-900 dark:text-blue-100 font-semibold">
                              {topic.resources.length} resources
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-emerald-500/70 text-white border-emerald-500/50 font-medium px-3 py-1 rounded-full">Completed</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogDescription className="text-white mt-5 text-lg font-medium leading-relaxed">
                        {topic.description}
                      </DialogDescription>
                      
                      <div className="mt-4 space-y-3">
                        <p className="text-white/90 text-base">
                          After mastering this, your team will:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-white/90">Build {topic.track === "data" ? "RAG pipelines" : topic.track === "core" ? "LLM applications" : "specialized AI systems"} with enterprise-grade security</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-white/90">Optimize for performance and accuracy in production environments</span>
                          </li>
                        </ul>
                      </div>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-2">
                      {topic.resources.map(resource => (
                        <ResourceCard 
                          key={resource.id}
                          resource={resource}
                          isSelected={false}
                          onSelect={() => {}}
                        />
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <div className="mt-8 mx-2 mb-4">
                      <hr className="border-indigo-500/20 mb-6" />
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-3 text-white">Ready to lead the AI revolution?</h3>
                        <p className="mb-5 text-white/80 max-w-xl mx-auto">Accelerate your team&apos;s expertise and business outcomes with proven AI architectures.</p>
                        <button 
                          className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3.5 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:translate-y-[-2px]"
                          onClick={() => setIsConsultationOpen(true)}
                        >
                          <span>Schedule Your Transformation</span>
                          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mt-4 pt-5 px-2 pb-2">
                      <DialogClose asChild>
                        <Button className="bg-transparent hover:bg-indigo-600/10 text-white border border-indigo-400/30 font-medium px-8">
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
      <ConsultationForm 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </>
  )
} 