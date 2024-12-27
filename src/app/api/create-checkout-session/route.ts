import { auth } from '../../../../auth'
import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Must be signed in to purchase articles' },
        { status: 401 }
      )
    }

    const { slug, price, title } = await req.json()

    // Get user ID from email
    const { rows: userRows } = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `
    
    if (!userRows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Redirect to the checkout page
    return NextResponse.json({ 
      redirectUrl: `/checkout?product=blog-${slug}`
    })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 