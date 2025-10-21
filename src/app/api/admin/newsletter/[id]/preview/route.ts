import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../../auth'
import { render } from '@react-email/render'
import NewsletterEmail from '@/emails/NewsletterTemplate'
import { mdxToSimpleHtml } from '@/lib/mdx-to-html'

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
        JSON.stringify({ error: 'Newsletter has no content yet. Run AI expansion first.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Convert MDX to HTML
    const contentHtml = await mdxToSimpleHtml(newsletter.contentMdx)

    // Render email template
    const emailHtml = await render(
      NewsletterEmail({
        title: newsletter.title,
        contentHtml,
        previewText: newsletter.description || undefined,
        newsletterSlug: newsletter.slug
      })
    )

    // Return HTML for preview
    return new NextResponse(emailHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    })

  } catch (error) {
    console.error('Error generating newsletter preview:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate preview' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
