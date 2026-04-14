import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { SimpleLayout } from '@/components/SimpleLayout'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLink, Calendar, Users, Building2, Youtube, Link as LinkIcon, Mic, Presentation, GraduationCap, Play } from 'lucide-react'
import { speakingEngagements, galleryImages } from './speaking-data'

export const metadata = createMetadata({
  title: 'Speaking Engagements - Zachary Proser',
  description: 'AI engineer speaker, conference presenter, and technical trainer. Public talks on AI, infrastructure as code, vector databases, and developer tools. Available for speaking engagements and corporate training.',
  author: 'Zachary Proser',
  date: '2025-6-02',
  slug: 'speaking',
  image: 'https://zackproser.b-cdn.net/images/a16z-1.webp',
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
        return 'bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white';
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
  const imagePositionClass = engagement.imagePosition === 'top' ? 'object-top' : 'object-center';

  const cardContent = (
    <div className="bg-parchment-50 dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-burnt-400 to-burnt-500 dark:from-amber-500 dark:to-amber-600">
        <Image src={engagement.image}
          alt={engagement.title}
          fill
          className={`object-cover ${imagePositionClass}`}
         />
        {/* Badge for internal vs public */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            engagement.type === 'internal'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          }`}>
            {engagement.type === 'internal' ? <Building2 className="h-3 w-3" /> : <Users className="h-3 w-3" />}
            {engagement.type === 'internal' ? 'Internal' : 'Public'}
          </span>
          {engagement.slidevUrl && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Play className="h-3 w-3" />
              Interactive Deck
            </span>
          )}
        </div>

      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-parchment-500 dark:text-slate-400 mb-2">
          <Calendar className="h-4 w-4" />
          {engagement.date}
        </div>
        
        <h3 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-2">
          {engagement.title}
        </h3>
        
        <p className="text-burnt-400 dark:text-amber-400 font-medium mb-3">
          {engagement.event}
        </p>
        
        <p className="text-parchment-600 dark:text-slate-300 mb-4 line-clamp-3">
          {engagement.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-parchment-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            <span>{engagement.audience}</span>
          </div>
          <div className="text-parchment-500 dark:text-slate-400">
            📍 {engagement.location}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {engagement.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-burnt-400/10 dark:bg-amber-500/20 text-burnt-500 dark:text-amber-400 text-xs rounded-md"
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

  if (engagement.slug) {
    return <Link href={`/speaking/${engagement.slug}`}>{cardContent}</Link>;
  }
  return cardContent;
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

        {/* Featured Keynote */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Presentation className="h-6 w-6 text-red-600" />
            DevSecCon 2025 Keynote
          </h2>
          <div className="">
            <YoutubeEmbed urls="https://www.youtube.com/watch?v=kwIzRkzO_Z4" title="DevSecCon 2025 Keynote" />
            <div className="mt-4">
              <ExternalLinkButton link={{ type: 'youtube', url: 'https://www.youtube.com/watch?v=kwIzRkzO_Z4', label: 'Watch on YouTube' }} />
            </div>
          </div>
        </section>


        {/* Public Engagements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Mic className="h-6 w-6 text-burnt-400 dark:text-amber-400" />
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
            {galleryImages.map((img, index) => (
              <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                 />
              </div>
            ))}
          </div>
        </section>

        {/* Internal Training */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-6 flex items-center gap-2">
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
        <section className="bg-parchment-50 dark:bg-slate-800 border border-parchment-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">Looking for a Speaker?</h2>
          <p className="text-parchment-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            I&apos;m available for conference talks, meetups, corporate training, and workshops. 
            I speak about AI engineering, infrastructure as code, vector databases, developer tools, 
            and practical machine learning implementations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-semibold rounded-md transition-colors"
            >
              Book a Speaking Engagement
            </Link>
            <Link
              href="/ai-training"
              className="inline-flex items-center justify-center px-6 py-3 bg-parchment-100 hover:bg-parchment-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-charcoal-50 dark:text-slate-100 font-semibold rounded-md transition-colors"
            >
              View Training Services
            </Link>
          </div>
        </section>
      </SimpleLayout>
    </>
  );
} 