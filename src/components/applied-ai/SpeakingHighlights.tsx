'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Users, Calendar, MapPin } from 'lucide-react'

// Import speaking images for credibility
import a16z1 from '@/images/a16z-1.webp'
import aieWorkshop from '@/images/aie-workshop-room.webp'
import aiFundamentals from '@/images/ai-fundamentals.webp'
import neuralNetworksLearn from '@/images/neural-networks-learn.webp'
import whatIsAVectorDB from '@/images/what-is-a-vector-db-thumb.webp'

interface SpeakingEvent {
  title: string
  description: string
  image: any
  venue: string
  audience: string
  date: string
  link: string
  linkType: 'blog' | 'speaking' | 'external'
}

const speakingEvents: SpeakingEvent[] = [
  {
    title: "Pinecone Vector Database Explainer Video",
    description: "One of the leading vector database explainer videos on YouTube, teaching neural networks, embeddings, vectors, and semantic search concepts.",
    image: whatIsAVectorDB,
    venue: "YouTube",
    audience: "10,000+ developers globally",
    date: "2023",
    link: "/videos/what-is-a-vector-database",
    linkType: 'external'
  },
  {
    title: "Taking AI Apps to Production",
    description: "Keynote presentation on AI production architectures and vector database scaling strategies",
    image: a16z1,
    venue: "a16z San Francisco",
    audience: "125+ AI engineers & VCs",
    date: "Dec 2023",
    link: "/blog/a16z-sf-dec-2023-ai-apps-production",
    linkType: 'blog'
  },
  {
    title: "AI Pipelines and Agents with Mastra.ai",
    description: "Live 2-hour workshop teaching 70+ engineers to build AI workflows and grant agent access using TypeScript",
    image: aieWorkshop,
    venue: "AI Engineering World Fair",
    audience: "70+ engineers",
    date: "June 2025",
    link: "/speaking",
    linkType: 'speaking'
  },
  {
    title: "AI-Enabled Content Creation Workshop",
    description: "Interactive workshop teaching content teams how to leverage AI tools for writing, editing, and optimization",
    image: neuralNetworksLearn,
    venue: "WorkOS Content Team",
    audience: "50+ content & marketing team members",
    date: "May 2025",
    link: "/speaking",
    linkType: 'speaking'
  },
  {
    title: "AI Fundamentals Training",
    description: "Corporate training on neural networks, embeddings, semantic search, and LLM implementation",
    image: aiFundamentals,
    venue: "WorkOS Engineering Team",
    audience: "40+ engineering team members",
    date: "May 2025",
    link: "/speaking",
    linkType: 'speaking'
  }
]

const SpeakingEventCard = ({ event, index }: { event: SpeakingEvent; index: number }) => {
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      className="group"
    >
      <Link href={event.link as any} className="block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500"
            />
          </div>
          
          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Event metadata */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.audience}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {event.date}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {event.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description}
            </p>
            
            {/* Link indicator */}
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">
                {event.linkType === 'blog' ? 'Read full story' : 'View speaking page'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function SpeakingHighlights() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Speaking & Training Highlights
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From conference keynotes to corporate workshops, I translate complex AI concepts into 
            actionable insights for engineering teams and technical leaders.
          </p>
        </div>

        {/* Speaking Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {speakingEvents.map((event, index) => (
            <SpeakingEventCard key={event.title} event={event} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href="/speaking"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl"
          >
            <Users className="w-5 h-5" />
            View All Speaking Engagements
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
} 