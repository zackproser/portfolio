import { ArticleWithSlug } from '@/types/content'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

import { getAllContent } from './content-handlers'

// Default fallback image
import wakka from '@/images/wakka.webp'

export interface Collection {
  title: string
  description: string
  slug: string
  articles: ArticleWithSlug[]
  image?: string
}

// Read collections data from JSON file
const collectionsDataPath = path.join(process.cwd(), 'schema/data/collections.json')
const collectionsData = JSON.parse(fs.readFileSync(collectionsDataPath, 'utf8'))

// Helper function to get correct image path - now we're using absolute URLs
// which work better with Next.js Image component
function getImagePath(imageName: string): string {
  if (!imageName) return wakka.src;
  
  // For Next.js Image component, this should be the full URL
  // We'll use the default import method in the ContentCard component
  return imageName;
}

export async function getAllCollections(): Promise<Collection[]> {
  let articles = await getAllContent('blog', undefined)

  let collections = [
    {
      title: 'AI',
      description: 'Articles about artificial intelligence, machine learning, and their applications.',
      slug: '/collections/ai',
      articles: articles.filter((article) => article.tags?.includes('ai')),
      image: getImagePath(collectionsData.ai?.image || 'ai-assisted-dev-tools.webp')
    },
    {
      title: 'Rants',
      description: 'Opinionated articles about software development and the tech industry.',
      slug: '/collections/rants',
      articles: articles.filter((article) => article.tags?.includes('rants')),
      image: getImagePath(collectionsData.rants?.image || 'sisyphus-crt-monitor-2.webp')
    },
    {
      title: 'Reviews',
      description: 'Reviews of software, tools, and services.',
      slug: '/collections/reviews',
      articles: articles.filter((article) => article.tags?.includes('reviews')),
      image: getImagePath(collectionsData.reviews?.image || 'codeium-vs-chatgpt-review.webp')
    },
    {
      title: 'Comics',
      description: 'Comics about software development and the tech industry.',
      slug: '/collections/comics',
      articles: articles.filter((article) => article.tags?.includes('comics')),
      image: getImagePath(collectionsData.comics?.image || 'playing-eq.webp')
    },
    {
      title: 'Projects',
      description: 'Articles about my personal projects and side ventures.',
      slug: '/collections/projects',
      articles: articles.filter((article) => article.tags?.includes('projects')),
      image: getImagePath(collectionsData.projects?.image || 'teatutor-logo.webp')
    },
    {
      title: 'Pinecone',
      description: 'Articles about Pinecone, the vector database.',
      slug: '/collections/pinecone',
      articles: articles.filter((article) => article.tags?.includes('pinecone')),
      image: getImagePath(collectionsData.pinecone?.image || 'joining-pinecone.webp')
    },
    {
      title: 'Career Advice',
      description: 'Articles about career development and professional growth.',
      slug: '/collections/career',
      articles: articles.filter((article) => article.tags?.includes('career')),
      image: getImagePath(collectionsData["career-advice"]?.image || 'you-get-to-keep-the-neural-connections.webp')
    },
    {
      title: 'Spectacular Hacks',
      description: 'Articles about clever hacks and solutions.',
      slug: '/collections/spectacular',
      articles: articles.filter((article) => article.tags?.includes('spectacular')),
      image: getImagePath(collectionsData["spectacular-hacks"]?.image || 'automations.gif')
    },
    {
      title: 'Flights of Fancy',
      description: 'Articles about creative and imaginative ideas.',
      slug: '/collections/flights',
      articles: articles.filter((article) => article.tags?.includes('flights')),
      image: getImagePath(collectionsData["flights-of-fancy"]?.image || 'super-hearing-aid-safety-alert.webp')
    },
    {
      title: 'Personal',
      description: 'Personal articles and stories.',
      slug: '/collections/personal',
      articles: articles.filter((article) => article.tags?.includes('personal')),
      image: getImagePath(collectionsData.personal?.image || 'zachary-light.webp')
    },
    {
      title: 'Next.js and Vercel',
      description: 'Articles about Next.js and Vercel.',
      slug: '/collections/nextjs',
      articles: articles.filter((article) => article.tags?.includes('nextjs')),
      image: getImagePath(collectionsData["nextjs-and-vercel"]?.image || 'nextjs-data-driven-website.webp')
    },
    {
      title: 'Security',
      description: 'Articles about security and privacy.',
      slug: '/collections/security',
      articles: articles.filter((article) => article.tags?.includes('security')),
      image: getImagePath(collectionsData.security?.image || 'ggshield-preventing-a-secret-from-escaping.webp')
    },
  ]

  return collections
}
