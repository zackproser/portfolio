import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../auth'

export async function GET(req: NextRequest) {
  // Check authentication
  try {
    const session = await auth()
    console.log('[Newsletter List] Session:', session?.user?.email || 'No session')

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  } catch (authError) {
    console.error('[Newsletter List] Auth error:', authError)
    return new NextResponse('Authentication failed', { status: 500 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = status ? { status } : {}

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      }),
      prisma.newsletter.count({ where })
    ])

    return NextResponse.json({
      newsletters,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error listing newsletters:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to list newsletters' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
