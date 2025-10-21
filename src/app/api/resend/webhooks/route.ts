import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Resend Webhook Handler
 *
 * Handles webhook events from Resend to track email analytics.
 *
 * Events:
 * - email.sent
 * - email.delivered
 * - email.opened
 * - email.clicked
 * - email.bounced
 * - contact.created
 * - contact.deleted
 *
 * Configure in Resend dashboard:
 * https://resend.com/webhooks
 * Add webhook URL: https://zackproser.com/api/resend/webhooks
 */

interface ResendWebhookPayload {
  type: string
  created_at: string
  data: {
    broadcast_id?: string
    email_id?: string
    email?: string
    from?: string
    to?: string[]
    subject?: string
    created_at?: string
    [key: string]: any
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: ResendWebhookPayload = await req.json()

    console.log(`📨 Received Resend webhook: ${payload.type}`)

    switch (payload.type) {
      case 'email.sent':
        await handleEmailSent(payload.data)
        break

      case 'email.delivered':
        await handleEmailDelivered(payload.data)
        break

      case 'email.opened':
        await handleEmailOpened(payload.data)
        break

      case 'email.clicked':
        await handleEmailClicked(payload.data)
        break

      case 'email.bounced':
        await handleEmailBounced(payload.data)
        break

      case 'contact.created':
        await handleContactCreated(payload.data)
        break

      case 'contact.deleted':
        await handleContactDeleted(payload.data)
        break

      default:
        console.log(`⚠️  Unhandled webhook type: ${payload.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Error processing Resend webhook:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

async function handleEmailSent(data: any) {
  if (!data.broadcast_id) return

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { resendBroadcastId: data.broadcast_id }
    })

    if (!newsletter) {
      console.log(`⚠️  Newsletter not found for broadcast: ${data.broadcast_id}`)
      return
    }

    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        emailsSent: { increment: 1 }
      }
    })

    console.log(`✅ Incremented sent count for newsletter: ${newsletter.title}`)
  } catch (error) {
    console.error('Error handling email.sent:', error)
  }
}

async function handleEmailDelivered(data: any) {
  if (!data.broadcast_id) return

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { resendBroadcastId: data.broadcast_id }
    })

    if (!newsletter) return

    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        emailsDelivered: { increment: 1 }
      }
    })

    console.log(`✅ Incremented delivered count for newsletter: ${newsletter.title}`)
  } catch (error) {
    console.error('Error handling email.delivered:', error)
  }
}

async function handleEmailOpened(data: any) {
  if (!data.broadcast_id) return

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { resendBroadcastId: data.broadcast_id }
    })

    if (!newsletter) return

    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        emailsOpened: { increment: 1 }
      }
    })

    console.log(`✅ Incremented opened count for newsletter: ${newsletter.title}`)
  } catch (error) {
    console.error('Error handling email.opened:', error)
  }
}

async function handleEmailClicked(data: any) {
  if (!data.broadcast_id) return

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { resendBroadcastId: data.broadcast_id }
    })

    if (!newsletter) return

    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        emailsClicked: { increment: 1 }
      }
    })

    console.log(`✅ Incremented clicked count for newsletter: ${newsletter.title}`)
  } catch (error) {
    console.error('Error handling email.clicked:', error)
  }
}

async function handleEmailBounced(data: any) {
  if (!data.broadcast_id) return

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { resendBroadcastId: data.broadcast_id }
    })

    if (!newsletter) return

    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        emailsBounced: { increment: 1 }
      }
    })

    // Also update subscriber status
    if (data.email) {
      await prisma.newsletterSubscription.updateMany({
        where: { email: data.email },
        data: {
          status: 'BOUNCED',
          lastSyncedAt: new Date()
        }
      })
    }

    console.log(`✅ Incremented bounced count for newsletter: ${newsletter.title}`)
  } catch (error) {
    console.error('Error handling email.bounced:', error)
  }
}

async function handleContactCreated(data: any) {
  if (!data.email) return

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        status: 'SUBSCRIBED',
        source: 'resend',
        resendContactId: data.id,
        subscribedAt: new Date(data.created_at || Date.now()),
        lastSyncedAt: new Date()
      },
      update: {
        resendContactId: data.id,
        status: 'SUBSCRIBED',
        lastSyncedAt: new Date()
      }
    })

    console.log(`✅ Synced new contact: ${data.email}`)
  } catch (error) {
    console.error('Error handling contact.created:', error)
  }
}

async function handleContactDeleted(data: any) {
  if (!data.email) return

  try {
    await prisma.newsletterSubscription.updateMany({
      where: { email: data.email },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
        lastSyncedAt: new Date()
      }
    })

    console.log(`✅ Marked contact as unsubscribed: ${data.email}`)
  } catch (error) {
    console.error('Error handling contact.deleted:', error)
  }
}
