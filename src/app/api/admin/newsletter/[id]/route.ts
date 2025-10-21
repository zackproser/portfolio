import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!newsletter) {
      return new NextResponse(
        JSON.stringify({ error: 'Newsletter not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Prevent deletion of sent newsletters (optional safety check)
    if (newsletter.status === 'sent') {
      return new NextResponse(
        JSON.stringify({ error: 'Cannot delete sent newsletters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await prisma.newsletter.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting newsletter:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete newsletter' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
