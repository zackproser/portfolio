'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  BookOpen, 
  Users, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  Code,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface ResourceCard {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  count?: string
  external?: boolean
  gradient?: string
}

const resourceCards: ResourceCard[] = [
  {
    title: "Video Tutorials",
    description: "In-depth technical videos covering AI, vector databases, and LLM implementation",
    icon: Video,
    href: "/videos",
    count: "25+ Videos",
    gradient: "from-red-500 to-pink-600"
  },
  {
    title: "Publications & Articles",
    description: "Technical deep-dives on infrastructure, AI, and software engineering best practices",
    icon: BookOpen,
    href: "/publications",
    count: "50+ Articles",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "Client Testimonials",
    description: "Real feedback from companies and teams who have worked with me",
    icon: Users,
    href: "/testimonials",
    count: "30+ Reviews",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "Open Source Projects",
    description: "Production-ready code, reference architectures, and developer tools",
    icon: Code,
    href: "/projects",
    count: "15+ Repos",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    title: "Technical Blog",
    description: "Weekly insights on AI engineering, infrastructure, and career development",
    icon: FileText,
    href: "/blog",
    count: "100+ Posts",
    gradient: "from-orange-500 to-amber-600"
  },
  {
    title: "Speaking & Workshops",
    description: "Conference talks, workshops, and training sessions on AI and infrastructure",
    icon: MessageSquare,
    href: "/speaking",
    count: "10+ Events",
    gradient: "from-teal-500 to-cyan-600"
  }
]

const ResourceCard = ({ resource, index }: { resource: ResourceCard; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      className="group"
    >
      <Link href={resource.href as any} target={resource.external ? '_blank' : '_self'} rel={resource.external ? 'noopener noreferrer' : undefined}>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group-hover:-translate-y-1">
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          {/* Sparkle animations on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div
              animate={{ 
                x: [0, 10, 0],
                y: [0, -5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5
              }}
              className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
            />
            <motion.div
              animate={{ 
                x: [0, -8, 0],
                y: [0, 8, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: index * 0.3
              }}
              className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
            />
          </div>
          
          <div className="relative p-8">
            {/* Icon with enhanced animation */}
            <motion.div 
              initial={{ scale: 0, rotate: -90 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${resource.gradient} rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
            >
              <resource.icon className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {resource.title}
                </h3>
                {resource.external && (
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {resource.description}
              </p>
              
              {resource.count && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${resource.gradient} rounded-full text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                  <Trophy className="w-4 h-4" />
                  {resource.count}
                </div>
              )}
              
              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300">
                <span>Explore Resources</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ResourcesNavigation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Explore My Work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Comprehensive Resources for
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Hiring Managers</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Dive deep into my technical expertise, track record, and thought leadership across multiple channels. 
            Each resource provides unique insights into my capabilities and approach to solving complex technical challenges.
          </p>
        </motion.div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {resourceCards.map((resource, index) => (
            <ResourceCard key={resource.title} resource={resource} index={index} />
          ))}
        </div>
        

      </div>
    </section>
  )
} 