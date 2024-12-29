import { importArticleMetadata } from '@/lib/articles'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await importArticleMetadata(`${params.slug}/page.mdx`)
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
} 