import { getContentItemByDirectorySlug } from '@/lib/content-handlers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    if (!params.slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    const content = await getContentItemByDirectorySlug('blog', params.slug)

    if (!content) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
} 