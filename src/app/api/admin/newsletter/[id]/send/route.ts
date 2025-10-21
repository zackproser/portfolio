import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../../auth'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import NewsletterEmail from '@/emails/NewsletterTemplate'
import { mdxToSimpleHtml } from '@/lib/mdx-to-html'
import fs from 'fs/promises'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
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

    if (!newsletter.contentMdx) {
      return new NextResponse(
        JSON.stringify({ error: 'Newsletter has no content. Run AI expansion first.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (newsletter.status === 'sent') {
      return new NextResponse(
        JSON.stringify({ error: 'Newsletter already sent' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📧 Preparing to send newsletter: "${newsletter.title}"`)

    // 1. Convert MDX to HTML for email
    console.log('🔄 Converting MDX to HTML...')
    const contentHtml = await mdxToSimpleHtml(newsletter.contentMdx)

    // 2. Render email template
    console.log('🎨 Rendering email template...')
    const emailHtml = await render(
      NewsletterEmail({
        title: newsletter.title,
        contentHtml,
        previewText: newsletter.description || undefined,
        newsletterSlug: newsletter.slug
      })
    )

    // 3. Save MDX to file system for website (create newsletter content directory)
    console.log('💾 Publishing to website...')
    const contentDir = path.join(
      process.cwd(),
      'src/content/newsletter',
      newsletter.slug
    )

    try {
      await fs.mkdir(contentDir, { recursive: true })

      // Save MDX file
      await fs.writeFile(
        path.join(contentDir, 'page.mdx'),
        newsletter.contentMdx,
        'utf-8'
      )

      // Save metadata
      const metadata = {
        type: 'newsletter',
        author: 'Zachary Proser',
        date: new Date().toISOString().split('T')[0],
        title: newsletter.title,
        description: newsletter.description || '',
        image: 'https://zackproser.b-cdn.net/images/newsletter-og.webp'
      }

      await fs.writeFile(
        path.join(contentDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2),
        'utf-8'
      )

      console.log(`✅ Published to: /newsletter/${newsletter.slug}`)
    } catch (fsError) {
      console.error('⚠️  Failed to publish to filesystem:', fsError)
      // Continue - email is more important than website publish
    }

    // 4. Send via Resend
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
      throw new Error('RESEND_AUDIENCE_ID not configured')
    }

    console.log('📮 Creating Resend broadcast...')

    // Create broadcast
    const broadcast = await resend.broadcasts.create({
      audienceId,
      from: 'Zachary Proser <newsletter@zackproser.com>',
      subject: newsletter.title,
      html: emailHtml
    })

    if (!broadcast.data?.id) {
      throw new Error('Failed to create Resend broadcast')
    }

    console.log(`✅ Broadcast created: ${broadcast.data.id}`)

    // Send immediately
    console.log('🚀 Sending to audience...')
    await resend.broadcasts.send(broadcast.data.id)

    // 5. Update database
    const updatedNewsletter = await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
        publishedAt: new Date(),
        resendBroadcastId: broadcast.data.id,
        resendAudienceId: audienceId,
        contentHtml: emailHtml,
        updatedAt: new Date()
      }
    })

    console.log('✨ Newsletter sent successfully!')

    return NextResponse.json({
      success: true,
      newsletter: updatedNewsletter,
      broadcastId: broadcast.data.id,
      publishedUrl: `https://zackproser.com/newsletter/${newsletter.slug}`
    })

  } catch (error: any) {
    console.error('❌ Error sending newsletter:', error)

    if (error.message?.includes('RESEND_API_KEY')) {
      return new NextResponse(
        JSON.stringify({
          error: 'Resend not configured. Add RESEND_API_KEY and RESEND_AUDIENCE_ID to your .env file.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to send newsletter',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
