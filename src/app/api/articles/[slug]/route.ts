import { importContentMetadata } from '@/lib/content-handlers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const article = await importContentMetadata(params.slug, 'blog')
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
} 