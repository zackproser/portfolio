import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import BlogClient from './blog-client'
import { createMetadata } from '@/utils/createMetadata'
import { getAllContent } from '@/lib/content-handlers'

const baseMetadata = createMetadata({
  title: 'Modern Coding - Research',
  description: 'Staff AI engineer - technical writing and development blog',
})

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL('https://zackproser.com'),
}

export default async function ArticlesIndex() {
  const articles = await getAllContent('blog')

  const years = [...new Set(articles.map((a) => new Date(a.date).getFullYear().toString()))]
    .sort((a, b) => parseInt(b) - parseInt(a))
  const allTags = [...new Set(articles.flatMap((a) => a.tags ?? []))].sort()

  return (
    <SimpleLayout
      title="I write to learn, and publish to share"
      intro="All of my technical tutorials, musings and developer rants"
    >
      <BlogClient articles={articles} years={years} allTags={allTags} />
    </SimpleLayout>
  )
}

