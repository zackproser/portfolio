import { Metadata } from 'next'
import BlogClient from './blog-client'
import { createMetadata } from '@/utils/createMetadata'
import { getAllContent } from '@/lib/content-handlers'
import { Blog } from '@/types/content'

// Base metadata using createMetadata
const baseMetadata = createMetadata({
  title: 'Modern Coding - Research',
  description: 'Staff AI engineer - technical writing and development blog',
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

  const years = [...new Set(articles.map((a) => new Date(a.date).getFullYear().toString()))].sort((a, b) => parseInt(b) - parseInt(a));

  return <BlogClient articles={articles} years={years} />;
}

