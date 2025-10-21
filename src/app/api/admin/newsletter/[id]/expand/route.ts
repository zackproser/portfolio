import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../../../auth'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

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

    if (!newsletter.bulletPoints || newsletter.bulletPoints.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Newsletter has no bullet points to expand' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // AI expansion prompt - customize this to match your voice
    const prompt = `You are a technical newsletter writer for an AI/developer tools audience. Your voice is conversational, insightful, and practical - similar to Paul Graham or Patrick McKenzie.

Expand these bullet points into a complete, engaging newsletter article in MDX format:

${newsletter.bulletPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Newsletter Title: ${newsletter.title}
${newsletter.description ? `Context: ${newsletter.description}` : ''}

Guidelines:
- Conversational, authentic tone (write like you're emailing a smart friend)
- Technical depth but accessible to developers of all levels
- Include practical examples and code snippets where relevant
- Add clear section headings using ## and ###
- 800-1500 words target length
- Start with a compelling hook that draws readers in
- End with a clear call-to-action or thought-provoking question
- Use MDX format (markdown with optional JSX components)
- Be opinionated but fair - share your actual perspective
- Reference real tools, products, and experiences when relevant

Format as valid MDX with no preamble or meta-commentary. Start directly with the article content.`

    console.log('🤖 Calling Claude for content expansion...')

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const expandedContent = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    if (!expandedContent) {
      throw new Error('No content returned from AI')
    }

    // Save expansion to tracking table
    await prisma.newsletterExpansion.create({
      data: {
        newsletterId: newsletter.id,
        bulletPoints: newsletter.bulletPoints,
        expandedContent,
        model: 'claude-sonnet-4',
        tokensUsed: response.usage.output_tokens
      }
    })

    // Update newsletter with expanded content
    const updatedNewsletter = await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        contentMdx: expandedContent,
        updatedAt: new Date()
      }
    })

    console.log(`✅ Expanded newsletter "${newsletter.title}"`)
    console.log(`📊 Tokens used: ${response.usage.output_tokens}`)

    return NextResponse.json({
      success: true,
      content: expandedContent,
      tokensUsed: response.usage.output_tokens,
      newsletter: updatedNewsletter
    })

  } catch (error: any) {
    console.error('Error expanding newsletter:', error)

    if (error.message?.includes('ANTHROPIC_API_KEY')) {
      return new NextResponse(
        JSON.stringify({
          error: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to your .env file.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new NextResponse(
      JSON.stringify({ error: 'Failed to expand newsletter content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
