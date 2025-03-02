export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const headersList = headers()
    const session = await auth()
    
    // Get parameters from URL
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const type = searchParams.get('type') || 'blog'  // Default to blog if not specified
    const email = searchParams.get('email')  // Allow checking by email parameter

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    // Convert type to contentType format used in the database
    const contentType = type === 'blog' ? 'article' : type

    // If we have a session, use the user ID
    if (session?.user?.id) {
      console.log('Checking purchase for user:', { id: session.user.id, email: session.user.email, slug, type })

      const purchase = await prisma.purchase.findFirst({
        where: {
          userId: session.user.id,
          contentType,
          contentSlug: slug
        }
      })

      console.log('Purchase check result by user ID:', purchase)
      
      if (purchase) {
        return NextResponse.json({ purchased: true })
      }
    }
    
    // If we have an email (either from session or from parameter), check by email
    const userEmail = session?.user?.email || email
    
    if (userEmail) {
      console.log('Checking purchase for email:', { email: userEmail, slug, type })
      
      const purchase = await prisma.purchase.findFirst({
        where: {
          email: userEmail,
          contentType,
          contentSlug: slug
        }
      })
      
      console.log('Purchase check result by email:', purchase)
      
      return NextResponse.json({ purchased: !!purchase })
    }
    
    // If we have neither a session nor an email parameter, return not purchased
    return NextResponse.json({ purchased: false })
  } catch (error) {
    console.error('Error checking purchase:', error)
    return NextResponse.json({ error: 'Failed to check purchase' }, { status: 500 })
  }
} 