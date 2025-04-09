"use client"

import { useState, useEffect } from "react"
import { Database, Brain, BookOpen, Sparkles, Zap, BarChart, Layers, Code, GitBranch, Network, Settings, Scale, Wrench, FileText, Video, ScrollText, Laptop, Lock, Shield, CheckCircle, CircleDot, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { track } from '@vercel/analytics'
import ConsultationForm from "./ConsultationForm"
import { motion } from "framer-motion"

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

// Add global keyframes and styles for animations
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes circuit-pulse {
      0%, 100% { 
        opacity: 0.3;
        transform: scale(0.98);
      }
      50% { 
        opacity: 1;
        transform: scale(1.02);
      }
    }
    
    @keyframes blueprint-glow {
      0%, 100% { 
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
      }
      50% { 
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
      }
    }
    
    @keyframes metal-shine {
      0% {
        background-position: -100% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    @keyframes servo-move {
      0%, 100% { transform: rotate(-1deg); }
      50% { transform: rotate(1deg); }
    }
    
    @keyframes pin-tack {
      0% { transform: translateY(-20px); opacity: 0; }
      50% { transform: translateY(5px); opacity: 1; }
      75% { transform: translateY(-2px); }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes connector-pulse {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.8;
      }
    }
    
    @keyframes gold-border-pulse {
      0% { 
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
        border-color: rgba(255, 255, 255, 0.2);
      }
      50% { 
        box-shadow: 0 0 10px 1px rgba(255, 215, 0, 0.6);
        border-color: rgba(255, 215, 0, 0.7);
      }
      100% { 
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
    
    @keyframes blink-warning {
      0%, 92%, 100% { 
        opacity: 1;
      }
      94%, 98% { 
        opacity: 0.2;
      }
    }
    
    .animate-circuit-pulse {
      animation: circuit-pulse 3s infinite ease-in-out;
    }
    
    .animate-blueprint-glow {
      animation: blueprint-glow 4s infinite ease-in-out;
    }
    
    .animate-metal-shine {
      background: linear-gradient(
        90deg, 
        rgba(255,255,255,0) 25%, 
        rgba(255,255,255,0.15) 50%, 
        rgba(255,255,255,0) 75%
      );
      background-size: 200% 100%;
      animation: metal-shine 3s infinite linear;
    }
    
    .animate-servo-move {
      animation: servo-move 3s infinite ease-in-out;
    }
    
    .animate-pin-tack {
      animation: pin-tack 0.5s forwards ease-out;
    }
    
    .animate-gold-border-pulse {
      animation: gold-border-pulse 2s ease-in-out;
    }
    
    .hover-gold-border-pulse:hover {
      animation: gold-border-pulse 2s infinite ease-in-out;
    }
    
    .connector-pulse {
      animation: connector-pulse 3s infinite ease-in-out;
    }
    
    .text-shadow-gold {
      text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }
    
    .text-shadow-white {
      text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
    }
    
    .shadow-gold {
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
    }
    
    .blueprint-bg {
      background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: -1px -1px;
    }
    
    .resource-card-container {
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .resource-card-container:hover {
      transform: translateY(-5px) scale(1.03);
      z-index: 20;
    }
    
    .rounded-card {
      border-radius: 12px;
    }
    
    .blink-warning {
      animation: blink-warning 4s infinite ease-in-out;
    }
  `}</style>
);

const ResourceCard = ({ resource, isSelected, onSelect }: { 
  resource: Resource; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  // Determine if resource is premium (projects are considered premium)
  const isPremium = resource.type === "project";
  const includesCode = resource.type === "project" || resource.type === "course";
  
  // Blueprint styles based on tier
  const blueprintStyles = {
    free: "bg-blue-900/95 border-blue-400/50", 
    premium: "bg-indigo-900/95 border-amber-400/50"
  };

  // Map resource types to themed icons and colors
  const resourceConfig = {
    project: {
      icon: "⚙️",
      chipColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200 border-amber-300/70 dark:border-amber-700/70 font-medium",
      cta: "🚀 Deploy Template"
    },
    course: {
      icon: "📚",
      chipColor: "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 border-green-300/70 dark:border-green-700/70 font-medium",
      cta: "⚡ Start Training"
    },
    article: {
      icon: "📝",
      chipColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200 border-blue-300/70 dark:border-blue-700/70 font-medium",
      cta: "📖 Read Analysis"
    },
    video: {
      icon: "🎥",
      chipColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200 border-purple-300/70 dark:border-purple-700/70 font-medium",
      cta: "▶️ Watch Walkthrough"
    },
    tool: {
      icon: "🧩",
      chipColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/70 dark:text-cyan-200 border-cyan-300/70 dark:border-cyan-700/70 font-medium",
      cta: "🔧 Launch Tool"
    },
    paper: {
      icon: "📄",
      chipColor: "bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-200 border-red-300/70 dark:border-red-700/70 font-medium",
      cta: "🔍 Inspect Research"
    }
  };
  
  // Handle resource click to track and navigate
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent dialog close
    
    // Add subtle haptic-like animation effect
    const card = e.currentTarget as HTMLElement;
    card.style.transform = "scale(0.98)";
    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 100);
    
    track('learning_map_interaction', {
      node_id: resource.id,
      node_type: 'resource',
      action: 'click_resource',
      node_title: resource.title
    });
    
    // The link inside will handle navigation
  };
  
  return (
    <a 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block resource-card-container"
    >
      <div 
        className={`
          relative group cursor-pointer transition-all duration-300
          ${isSelected ? 'z-10' : ''}
          ${isPremium ? 'shadow-amber-400/20' : 'shadow-blue-400/20'} shadow-lg
          rounded-lg overflow-hidden
        `}
      >
        {/* Card inner content with blueprint texture */}
        <div className={`
          p-6 border-2 relative overflow-hidden rounded-lg
          ${isPremium ? blueprintStyles.premium : blueprintStyles.free}
        `}>
          {/* Blueprint grid background */}
          <div className="absolute inset-0 z-0" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '-1px -1px'
            }}
          />
          
          {/* Decorative blueprint elements */}
          <div className="absolute top-1/2 left-0 w-10 h-px bg-blue-400/30"></div>
          <div className="absolute top-1/2 right-0 w-10 h-px bg-blue-400/30"></div>
          <div className="absolute bottom-10 -left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400/30 rounded-bl-lg"></div>
          <div className="absolute top-10 -right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400/30 rounded-tr-lg"></div>
          
          {/* "Classified" or "DRAFT" stamp for premium resources */}
          {isPremium && (
            <div className="absolute -top-1 -right-1 rotate-12 z-10">
              <div className="bg-amber-600/80 text-white px-6 py-1 text-xs font-bold tracking-wider border border-amber-400/50 shadow-lg transform">
                CLASSIFIED
              </div>
            </div>
          )}

          {/* Technical specs border */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-blue-400/50"></div>
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-blue-400/50"></div>

          {/* Title with technical-looking title block */}
          <div className="relative z-10 mt-2 mb-6">
            <div className="flex items-start mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-400/50 mr-2 mt-1.5"></div>
              <h3 className="font-mono text-white text-xl tracking-tight leading-tight uppercase">
                {resource.title}
              </h3>
            </div>
            
            {/* Technical blueprint divider line */}
            <div className="flex items-center w-full gap-2 mt-2 mb-2">
              <div className="flex-1 h-px bg-blue-400/40"></div>
              <div className="w-4 h-4 rounded-full border-2 border-blue-400/70 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-400/90 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-blue-400/40"></div>
            </div>
            
            <div className="ml-5 mb-4">
              <div className="font-mono text-blue-200/90 text-sm leading-relaxed pl-4 border-l-2 border-blue-400/40">
                {resource.description}
              </div>
            </div>
          </div>
            
          {/* Technical specs and metadata section */}
          <div className="relative z-10 pt-3 border-t border-blue-400/30 mt-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-blue-300/80 font-mono mb-1">
                  RESOURCE TYPE
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`px-2 py-1 bg-blue-800/60 rounded-sm border border-blue-500/30 text-blue-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1`}>
                    <span>{resourceConfig[resource.type].icon}</span>
                    <span>{resource.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex justify-end">
                <div className="flex flex-col items-end">
                  <div className="text-xs uppercase tracking-wider text-blue-300/80 font-mono mb-1">
                    SECURITY LEVEL
                  </div>
                  <div className={`px-2 py-1 rounded-sm border text-xs font-mono uppercase tracking-wider ${
                    isPremium 
                      ? "bg-amber-900/60 border-amber-500/50 text-amber-200" 
                      : "bg-green-900/60 border-green-500/50 text-green-200"
                  }`}>
                    {isPremium ? "RESTRICTED" : "PUBLIC ACCESS"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to action button styled as a technical control panel */}
            <div className="mt-4 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-blue-600/20 rounded-md pointer-events-none"></div>
              <div className={`
                text-white font-mono text-sm py-2 px-4 rounded-md inline-flex items-center justify-center w-full
                ${isPremium 
                  ? 'bg-gradient-to-r from-green-600/80 to-green-800/80 hover:from-green-500/80 hover:to-green-700/80 border border-green-500/50 shadow-inner' 
                  : 'bg-blue-700/50 hover:bg-blue-700/70 border border-blue-500/50 shadow-inner'}
                transition-colors duration-200 relative overflow-hidden
              `}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                <span className="mr-2">{resourceConfig[resource.type].cta}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          {/* Circular technical "nodes" at corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full border-2 border-blue-400/50"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full border-2 border-blue-400/50"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full border-2 border-blue-400/50"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full border-2 border-blue-400/50"></div>
        </div>
      </div>
    </a>
  );
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
      description: "Understand how vector embeddings capture semantic meaning for powerful search and similarity tasks.",
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
      description: "Enhance LLMs with external knowledge through retrieval systems to eliminate hallucinations.",
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
          description: "A comprehensive introduction to RAG architecture and fundamentals.",
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
          description: "Build a production-ready RAG system with Vercel AI SDK and Next.js.",
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
          description: "Create your first RAG application with LangChain and Pinecone vector database.",
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
          description: "Video tutorial showing how to build a custom RAG chatbot for your content.",
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
          description: "Test a working RAG chatbot that can answer questions about your uploaded documents.",
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
          description: "Learn how to measure RAG system performance and implement quality metrics.",
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
      description: "Adapt pre-trained models to your specific tasks and domain knowledge for improved performance.",
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
      description: "Build high-performance vector search systems that can handle millions of queries per second.",
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
      description: "Implement secure access controls to ensure users only see authorized information in RAG results.",
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
      description: "Create enterprise-grade document security systems with fine-grained permissions on AWS.",
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

  // Function to get the key outcome text based on topic ID
  const getKeyOutcome = (topicId: string) => {
    switch (topicId) {
      case "tokenization-guide":
        return "Understand how language models process and interpret text at the token level"
      case "embedding-intro":
        return "Create powerful semantic search capabilities with vector embeddings"
      case "rag-systems":
        return "Build AI systems that can access and reason with external knowledge sources"
      case "fine-tuning":
        return "Customize LLMs for specific tasks with higher accuracy and lower costs"
      case "scaling-vector-infra":
        return "Design vector databases that scale to handle millions of queries efficiently"
      case "secure-rag-fga":
        return "Ensure your AI systems enforce proper access controls to sensitive information"
      case "doc-access-control-fga":
        return "Integrate secure document workflows with AWS and fine-grained authorization"
      default:
        return "Accelerate development time and ship AI applications with production-ready architectures"
    }
  }

  return (
    <div className="space-y-16 py-8">
      <GlobalStyles />
      
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
                        border-2 border-white/20 
                        ${completedNodes.includes(topic.id) ? 'ring-2 ring-green-500/60 shadow-lg shadow-green-500/10' : 'shadow-md hover:shadow-xl'}
                        transform hover:scale-[1.02]
                        w-full mx-auto h-full relative
                        hover-gold-border-pulse
                      `}
                      onClick={() => handleOpenTopic(topic)}
                    >
                      {/* Add blueprint connector lines */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-400/30 group-hover:animate-connector-pulse"></div>
                      
                      {/* Add blueprint glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blueprint-bg pointer-events-none"></div>
                      
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
                              {getKeyOutcome(topic.id)}
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
                      {topic.resources.length >= 4 && topic.id !== "rag-systems" && (
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
                    {/* Update the DialogContent to use blueprint background */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 z-0" 
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '-1px -1px'
                      }}
                    />
                    
                    <DialogHeader className="mb-8 px-3 relative z-10">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <DialogTitle className="text-3xl font-bold text-white mb-1 tracking-tight">{topic.title}</DialogTitle>
                          <div className="flex gap-2 mt-2">
                            {completedNodes.includes(topic.id) && (
                              <Badge className="bg-emerald-500/70 text-white border-emerald-500/50 font-medium px-3 py-1 rounded-full">
                                <span className="mr-1">✅</span>
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogDescription className="text-white mt-5 text-lg font-medium leading-relaxed">
                        {topic.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 relative z-10 mb-8">
                      {/* Parchment texture background */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none" 
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                          backgroundSize: '100px 100px'
                        }}
                      />
                      
                      {/* Section heading */}
                      <div className="col-span-2 mb-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-400/70 mr-2"></div>
                          <h3 className="text-white text-xl font-mono tracking-tight uppercase">Available Resources</h3>
                          <div className="flex-1 h-px bg-blue-400/30 ml-4"></div>
                        </div>
                      </div>
                      
                      {/* "Pinned" resource cards to the blueprint scroll */}
                      {topic.resources.map((resource, idx) => (
                        <div 
                          key={resource.id} 
                          className="relative animate-pin-tack m-4" 
                          style={{ 
                            animationDelay: `${idx * 150}ms`, 
                            opacity: 0 
                          }}
                        >
                          {/* Resource card */}
                          <ResourceCard 
                            key={resource.id}
                            resource={resource}
                            isSelected={false}
                            onSelect={() => {}}
                          />
                          
                          {/* Decorative pin with subtle interaction */}
                          <div 
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-md z-20 hover:scale-125 transition-transform duration-200"
                            style={{ transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                          >
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-200"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Simplified footer with consultation CTA */}
                    <div className="px-6 pb-6 relative z-10 flex flex-col gap-4">
                      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg p-5 border border-blue-500/30 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white">Accelerate your AI engineering journey</h3>
                        <p className="text-white/80 mt-1 mb-3">Join our premium workshops to master enterprise-grade production AI systems.</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <Button 
                            onClick={() => setIsConsultationOpen(true)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium border-0 rounded-md px-4 py-2 shadow-lg hover:shadow-xl transition-all flex-grow"
                          >
                            Schedule a Consultation
                          </Button>
                          
                          <DialogClose asChild>
                            <Button 
                              variant="outline" 
                              className="text-white/60 border-white/10 hover:bg-white/5 px-3 w-16 text-sm h-10"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
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
    </div>
  )
} 