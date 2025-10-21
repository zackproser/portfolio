import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../auth'

export async function POST(req: NextRequest) {
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, bulletPoints, description } = body

    if (!title || !bulletPoints || !Array.isArray(bulletPoints) || bulletPoints.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Title and bullet points are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug already exists
    const existing = await prisma.newsletter.findUnique({
      where: { slug }
    })

    if (existing) {
      // Append timestamp to make unique
      const timestamp = Date.now()
      const uniqueSlug = `${slug}-${timestamp}`

      const newsletter = await prisma.newsletter.create({
        data: {
          slug: uniqueSlug,
          title,
          description: description || null,
          bulletPoints,
          status: 'draft'
        }
      })

      return NextResponse.json(newsletter)
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        slug,
        title,
        description: description || null,
        bulletPoints,
        status: 'draft'
      }
    })

    return NextResponse.json(newsletter)

  } catch (error) {
    console.error('Error creating newsletter:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create newsletter' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
