export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { sql } from '@vercel/postgres'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  try {
    const headersList = headers()
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ purchased: false })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    console.log('Checking purchase for:', { email: session.user.email, slug })

    const result = await sql`
      SELECT * FROM articlepurchases 
      WHERE user_id = ${session.user.id}::int 
      AND article_slug = ${slug}
    `

    console.log('Purchase check result:', result)

    return NextResponse.json({ purchased: result.rows.length > 0 })
  } catch (error) {
    console.error('Error checking purchase:', error)
    return NextResponse.json({ error: 'Failed to check purchase' }, { status: 500 })
  }
} 