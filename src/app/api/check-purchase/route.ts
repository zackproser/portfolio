export const dynamic = 'force-dynamic'

import { auth } from '../../../../auth'
import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ purchased: false })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required', purchased: false },
        { status: 400 }
      )
    }

    console.log('Checking purchase for:', { email: session.user.email, slug })

    const { rows } = await sql`
      SELECT ap.* 
      FROM articlepurchases ap
      JOIN users u ON ap.user_id = u.id
      WHERE u.email = ${session.user.email}
      AND ap.article_slug = ${slug}
    `

    console.log('Purchase check result:', { rows })

    return NextResponse.json({ 
      purchased: rows.length > 0,
      debug: {
        email: session.user.email,
        slug,
        rowCount: rows.length
      }
    })
  } catch (error) {
    console.error('Error checking purchase:', error)
    return NextResponse.json({ 
      purchased: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 