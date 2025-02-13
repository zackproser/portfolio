import { ArticleLayout } from '@/components/ArticleLayout'
import { Article } from '@/lib/content/types/blog'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'

type Props = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const article = await Article.fromSlug(resolvedParams.slug)
    return createMetadata({
      title: article.title,
      description: article.description,
    })
  } catch {
    return createMetadata({
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    })
  }
}

function ArticleContent({ article, Content }: { article: Article, Content: React.ComponentType }) {
  return (
    <ArticleLayout metadata={article}>
      <Content />
    </ArticleLayout>
  )
}

export default async function BlogPost({ params }: Props) {
  try {
    const resolvedParams = await params
    const article = await Article.fromSlug(resolvedParams.slug)
    const { default: Content } = await import(`@/app/blog/${resolvedParams.slug}/page.mdx`)

    return (
      <Suspense fallback={<div>Loading article...</div>}>
        <ArticleContent article={article} Content={Content} />
      </Suspense>
    )
  } catch (error) {
    notFound()
  }
} 