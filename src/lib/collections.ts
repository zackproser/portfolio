import { ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

import { getAllArticles } from './articles'

export interface Collection {
  title: string
  description: string
  slug: string
  articles: ArticleWithSlug[]
}

export async function getAllCollections(): Promise<Collection[]> {
  let articles = await getAllArticles()

  let collections = [
    {
      title: 'AI',
      description: 'Articles about artificial intelligence, machine learning, and their applications.',
      slug: 'ai',
      articles: articles.filter((article) => article.tags?.includes('ai')),
    },
    {
      title: 'Rants',
      description: 'Opinionated articles about software development and the tech industry.',
      slug: 'rants',
      articles: articles.filter((article) => article.tags?.includes('rants')),
    },
    {
      title: 'Reviews',
      description: 'Reviews of software, tools, and services.',
      slug: 'reviews',
      articles: articles.filter((article) => article.tags?.includes('reviews')),
    },
    {
      title: 'Comics',
      description: 'Comics about software development and the tech industry.',
      slug: 'comics',
      articles: articles.filter((article) => article.tags?.includes('comics')),
    },
    {
      title: 'Projects',
      description: 'Articles about my personal projects and side ventures.',
      slug: 'projects',
      articles: articles.filter((article) => article.tags?.includes('projects')),
    },
    {
      title: 'Pinecone',
      description: 'Articles about Pinecone, the vector database.',
      slug: 'pinecone',
      articles: articles.filter((article) => article.tags?.includes('pinecone')),
    },
    {
      title: 'Career Advice',
      description: 'Articles about career development and professional growth.',
      slug: 'career',
      articles: articles.filter((article) => article.tags?.includes('career')),
    },
    {
      title: 'Spectacular Hacks',
      description: 'Articles about clever hacks and solutions.',
      slug: 'spectacular',
      articles: articles.filter((article) => article.tags?.includes('spectacular')),
    },
    {
      title: 'Flights of Fancy',
      description: 'Articles about creative and imaginative ideas.',
      slug: 'flights',
      articles: articles.filter((article) => article.tags?.includes('flights')),
    },
    {
      title: 'Personal',
      description: 'Personal articles and stories.',
      slug: 'personal',
      articles: articles.filter((article) => article.tags?.includes('personal')),
    },
    {
      title: 'Next.js and Vercel',
      description: 'Articles about Next.js and Vercel.',
      slug: 'nextjs',
      articles: articles.filter((article) => article.tags?.includes('nextjs')),
    },
    {
      title: 'Security',
      description: 'Articles about security and privacy.',
      slug: 'security',
      articles: articles.filter((article) => article.tags?.includes('security')),
    },
  ]

  return collections
}
