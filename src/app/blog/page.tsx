import { Metadata } from 'next'
import BlogClient from './blog-client'
import { createMetadata } from '@/utils/createMetadata'
import { getAllContent } from '@/lib/content-handlers'
import { Blog } from '@/types/content'

// Base metadata using createMetadata
const baseMetadata = createMetadata({
  title: 'Zack Proser Blog - AI Engineering, RAG & Developer Tools',
  description: 'Technical writing from staff AI engineer Zack Proser on AI engineering, RAG pipelines, vector databases, LLMs, and the developer tools he ships with.',
})

// Export final metadata including metadataBase
export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL('https://zackproser.com'),
}


export default async function ArticlesIndex() {
  const articles = (await getAllContent('blog')).filter((a) =>
    (a.type === 'blog' || a.type === 'video' || a.type === 'demo') &&
    !a.hiddenFromIndex  // Exclude SEO/affiliate articles from main listing
  ) as Blog[];

  return <BlogClient articles={articles} />;
}

