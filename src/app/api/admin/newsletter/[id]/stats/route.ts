import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../../auth'

export async function GET(
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
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        sentAt: true,
        publishedAt: true,
        emailsSent: true,
        emailsDelivered: true,
        emailsOpened: true,
        emailsClicked: true,
        emailsBounced: true,
        resendBroadcastId: true
      }
    })

    if (!newsletter) {
      return new NextResponse(
        JSON.stringify({ error: 'Newsletter not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Calculate rates
    const deliveryRate = newsletter.emailsSent > 0
      ? (newsletter.emailsDelivered / newsletter.emailsSent) * 100
      : 0

    const openRate = newsletter.emailsDelivered > 0
      ? (newsletter.emailsOpened / newsletter.emailsDelivered) * 100
      : 0

    const clickRate = newsletter.emailsOpened > 0
      ? (newsletter.emailsClicked / newsletter.emailsOpened) * 100
      : 0

    const bounceRate = newsletter.emailsSent > 0
      ? (newsletter.emailsBounced / newsletter.emailsSent) * 100
      : 0

    return NextResponse.json({
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        slug: newsletter.slug,
        status: newsletter.status,
        sentAt: newsletter.sentAt,
        publishedAt: newsletter.publishedAt,
        broadcastId: newsletter.resendBroadcastId
      },
      stats: {
        sent: newsletter.emailsSent,
        delivered: newsletter.emailsDelivered,
        opened: newsletter.emailsOpened,
        clicked: newsletter.emailsClicked,
        bounced: newsletter.emailsBounced
      },
      rates: {
        delivery: Math.round(deliveryRate * 10) / 10,
        open: Math.round(openRate * 10) / 10,
        click: Math.round(clickRate * 10) / 10,
        bounce: Math.round(bounceRate * 10) / 10
      },
      publishedUrl: `https://zackproser.com/newsletter/${newsletter.slug}`
    })

  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch newsletter stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
