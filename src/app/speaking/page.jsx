import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleLayout } from '@/components/SimpleLayout'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLink, Calendar, Users, Building2, Youtube, Link as LinkIcon, Mic, Presentation, GraduationCap } from 'lucide-react'

// Import speaking images from the a16z blog post
const a16z1 = 'https://zackproser.b-cdn.net/images/a16z-1.webp'
const a16z2 = 'https://zackproser.b-cdn.net/images/a16z-2.webp'
// Import WorkOS internal training images
const aiFundamentals = 'https://zackproser.b-cdn.net/images/ai-fundamentals.webp'
const neuralNetworksLearn = 'https://zackproser.b-cdn.net/images/neural-networks-learn.webp'
// Import AI Engineering World Fair workshop image
const aieWorkshop = 'https://zackproser.b-cdn.net/images/aie-workshop-room.webp'
// Import additional speaking and conference images
const zackAndNick = 'https://zackproser.b-cdn.net/images/zack-and-nick.webp'
const aieZackBadge = 'https://zackproser.b-cdn.net/images/aie-zack-badge.webp'

export const metadata = createMetadata({
  title: 'Speaking Engagements - Zachary Proser',
  description: 'AI engineer speaker, conference presenter, and technical trainer. Public talks on AI, infrastructure as code, vector databases, and developer tools. Available for speaking engagements and corporate training.',
  author: 'Zachary Proser',
  date: '2025-6-02',
  slug: 'speaking',
  image: a16z1,
  keywords: [
    'Zachary Proser speaking',
    'AI engineer speaker',
    'conference speaker',
    'technical trainer',
    'AI talks',
    'infrastructure as code speaker',
    'vector database expert',
    'developer tools speaker',
    'corporate training',
    'engineering training',
    'AI fundamentals',
    'machine learning speaker',
    'DevOps speaker',
    'cloud infrastructure'
  ],
  tags: [
    'speaking',
    'conferences',
    'AI',
    'machine learning',
    'infrastructure as code',
    'vector databases',
    'developer tools',
    'training',
    'workshops'
  ]
});

// Speaking engagements data
const speakingEngagements = [
  {
    id: 'aie-world-fair-june-2025',
    type: 'public',
    title: 'AI Pipelines and Agents in Pure TypeScript with Mastra.ai',
    event: 'AI Engineering World Fair',
    date: 'June 3, 2025',
    location: 'Workshop Session',
    description: 'We taught over 70 engineers over the course of a live 2 hour workshop how to build workflows to accomplish discrete tasks and how to grant access to those workflows to agents - which are the ideal human interface for accomplishing tasks with natural language.',
    image: aieWorkshop,
    audience: '70+ engineers',
    topics: ['AI Pipelines', 'Agents', 'TypeScript', 'Mastra.ai', 'Workflow Automation', 'Natural Language Interfaces']
  },
  {
    id: 'a16z-dec-2023',
    type: 'public',
    title: 'Navigating from Jupyter Notebooks to Production',
    event: 'Pinecone & Cohere Meetup at a16z',
    date: 'December 6, 2023',
    location: 'Andreesen Horowitz, San Francisco, CA',
    description: 'I introduced the new Pinecone AWS Reference Architecture with Pulumi and explained infrastructure as code, using a mountaineering metaphor to compare getting from prototype to production.',
    image: a16z1,
    audience: '~125 attendees',
    topics: ['Infrastructure as Code', 'Pinecone', 'AWS', 'Pulumi', 'Production Deployment'],
    links: [
      {
        type: 'blog',
        url: '/blog/a16z-sf-dec-2023-ai-apps-production',
        label: 'Read Full Blog Post'
      },
      {
        type: 'twitter',
        url: 'https://twitter.com/zackproser/status/1732228822626619637',
        label: 'Twitter Thread'
      }
    ]
  },
  {
    id: 'ai-fundamentals-internal',
    type: 'internal',
    title: 'AI Fundamentals for Engineering Teams',
    event: 'WorkOS Internal Training',
    date: 'May 2025',
    location: 'In-person',
    description: 'Comprehensive introduction to AI concepts, machine learning fundamentals, and practical applications for software engineering teams. Covered LLMs, vector databases, RAG, and hands-on implementation strategies.',
    image: aiFundamentals,
    audience: 'Engineering Team (40 developers)',
    topics: ['Machine Learning', 'Large Language Models', 'Vector Databases', 'RAG', 'AI Engineering']
  },
  {
    id: 'ai-content-creation-internal',
    type: 'internal', 
    title: 'AI-Enabled Content Creation Workshop',
    event: 'WorkOS Internal Training',
    date: 'May 2025',
    location: 'In-person',
    description: 'Interactive workshop teaching content teams how to leverage AI tools for writing, editing, ideation, and content optimization. Practical hands-on session with real-world use cases and workflow optimization.',
    image: neuralNetworksLearn,
    audience: 'Marketing & Content Team (25 members)',
    topics: ['AI Writing Tools', 'Content Strategy', 'Workflow Optimization', 'Prompt Engineering', 'Content Marketing']
  }
];

// Component for rendering external links with icons
function ExternalLinkButton({ link }) {
  const getIcon = () => {
    switch (link.type) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'blog':
        return <LinkIcon className="h-4 w-4" />;
      case 'twitter':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getButtonStyle = () => {
    switch (link.type) {
      case 'youtube':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'blog':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'twitter':
        return 'bg-sky-500 hover:bg-sky-600 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const isExternal = link.url.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  
  const linkProps = isExternal 
    ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: link.url };

  return (
    <LinkComponent
      {...linkProps}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${getButtonStyle()}`}
    >
      {getIcon()}
      {link.label}
    </LinkComponent>
  );
}

// Component for a single speaking engagement card
function SpeakingCard({ engagement }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-700">
        <Image src={engagement.image}
          alt={engagement.title}
          fill
          className="object-cover"
         />
        {/* Badge for internal vs public */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            engagement.type === 'internal' 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          }`}>
            {engagement.type === 'internal' ? <Building2 className="h-3 w-3" /> : <Users className="h-3 w-3" />}
            {engagement.type === 'internal' ? 'Internal' : 'Public'}
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Calendar className="h-4 w-4" />
          {engagement.date}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {engagement.title}
        </h3>
        
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
          {engagement.event}
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {engagement.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{engagement.audience}</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            📍 {engagement.location}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {engagement.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-md"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {engagement.links && engagement.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {engagement.links.map((link, index) => (
              <ExternalLinkButton key={index} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Speaking() {
  const publicEngagements = speakingEngagements.filter(e => e.type === 'public');
  const internalEngagements = speakingEngagements.filter(e => e.type === 'internal');

  return (
    <>
      <Head>
        <title>Speaking - Zachary Proser</title>
        <meta
          name="description"
          content="Public talks, internal training sessions, and conference presentations on AI, infrastructure, and developer tools."
        />
      </Head>
      <SimpleLayout
        title="Speaking Engagements"
        intro="I speak at conferences, meetups, and corporate events about AI, infrastructure as code, vector databases, and developer tools. I also provide internal training for engineering and content teams."
      >


        {/* Public Engagements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Mic className="h-6 w-6 text-blue-600" />
            Conference Talks & Public Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicEngagements.map((engagement) => (
              <SpeakingCard key={engagement.id} engagement={engagement} />
            ))}
          </div>
        </section>

        {/* Speaking Gallery */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
              <Image src="https://zackproser.b-cdn.net/images/zack-and-nick.webp"
                alt="Speaking at conferences and events"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
               />
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
              <Image src={a16z2}
                alt="Speaking at a16z venue"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
               />
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
              <Image src={aieZackBadge}
                alt="AI Engineering World Fair badge"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
               />
            </div>
          </div>
        </section>

        {/* Internal Training */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-amber-600" />
            Corporate Training & Team Development
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internalEngagements.map((engagement) => (
              <SpeakingCard key={engagement.id} engagement={engagement} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Looking for a Speaker?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I&apos;m available for conference talks, meetups, corporate training, and workshops. 
            I speak about AI engineering, infrastructure as code, vector databases, developer tools, 
            and practical machine learning implementations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
              Book a Speaking Engagement
            </Link>
            <Link
              href="/ai-training"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-md transition-colors"
            >
              View Training Services
            </Link>
          </div>
        </section>
      </SimpleLayout>
    </>
  );
} 