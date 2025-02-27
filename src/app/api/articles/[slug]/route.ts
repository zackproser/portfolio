import { importArticleMetadata } from '@/lib/articles-compat'
import { NextResponse } from 'next/server'

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const article = await importArticleMetadata(`${params.slug}/page.mdx`)
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
} 