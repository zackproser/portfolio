import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { getAllContent } from '@/lib/content-handlers'
import { Content } from '@/types'

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and authorized
    const session = await auth()
    
    if (!session || session.user?.email !== 'zackproser@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse URL to get search parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const typesParam = searchParams.get('types')
    
    // Support both "article" in search and "blog" in content system
    let types = typesParam ? typesParam.split(',') : []
    if (types.includes('article')) {
      types = types.filter(t => t !== 'article').concat('blog')
    }

    // Get all content
    const blogContent = await getAllContent('blog')
    const videoContent = await getAllContent('videos')
    
    // Combine content
    let allContent: Content[] = [...blogContent, ...videoContent]
    
    // Filter by type if specified and not "all"
    if (types.length > 0 && !types.includes('all')) {
      allContent = allContent.filter(content => types.includes(content.type))
    }
    
    // Filter by search query if provided
    if (query) {
      const lowerQuery = query.toLowerCase()
      allContent = allContent.filter(content => 
        content.title.toLowerCase().includes(lowerQuery) || 
        content.description.toLowerCase().includes(lowerQuery) ||
        (content.tags && content.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      )
    }
    
    // Sort content by date descending
    allContent.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0
      const dateB = b?.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })

    // Format the results to match what the client component expects
    const results = allContent.map(content => ({
      id: content._id || `${content.type}-${content.slug}`,
      title: content.title,
      description: content.description,
      type: content.type,
      slug: content.slug,
      date: content.date,
      image: content.image,
      tags: content.tags || [],
      author: content.author,
      commerce: content.commerce,
      isSuggested: false // The sidebar component will handle marking items as suggested
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error searching content library:', error)
    
    return NextResponse.json(
      { error: 'Failed to search content library' },
      { status: 500 }
    )
  }
} 