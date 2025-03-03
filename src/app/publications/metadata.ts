import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: 'Publications by Zachary Proser',
  description: 'Articles, tutorials, and blog posts on AI, engineering, and modern software development',
  author: 'Zachary Proser',
  date: new Date().toISOString(),
  type: 'blog',
  slug: 'publications'
}); 