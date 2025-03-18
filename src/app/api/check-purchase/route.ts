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

    // Add detailed logging of all parameters
    console.log('CHECK-PURCHASE DEBUG - Request parameters:', { 
      slug, 
      type, 
      email,
      session: session ? {
        id: session.user?.id,
        email: session.user?.email,
        provider: session.user?.provider
      } : null
    })

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    // Convert type to contentType format used in the database
    const contentType = type === 'blog' ? 'article' : type
    console.log('CHECK-PURCHASE DEBUG - Converted content type:', { originalType: type, convertedType: contentType })

    // Extract the base slug without path components
    // This allows products like 'rag-pipeline-tutorial' to be found regardless of path
    const baseSlug = slug.split('/').pop() || slug
    console.log('CHECK-PURCHASE DEBUG - Base slug:', { originalSlug: slug, baseSlug })
    
    // Create a more flexible search condition for contentSlug
    // Will match 'rag-pipeline-tutorial', 'blog/rag-pipeline-tutorial', etc.
    const slugCondition = {
      OR: [
        { contentSlug: slug },
        { contentSlug: baseSlug },
        { contentSlug: { contains: `/${baseSlug}` } },
        { contentSlug: { endsWith: `/${baseSlug}` } }
      ]
    }

    // If we have a session, use the user ID
    if (session?.user?.id) {
      console.log('CHECK-PURCHASE DEBUG - Checking purchase for user:', { 
        id: session.user.id, 
        email: session.user.email, 
        slug, 
        baseSlug,
        type,
        contentType 
      })

      // First, check if the user ID is valid (not empty string)
      if (session.user.id.trim() === '') {
        console.log('CHECK-PURCHASE DEBUG - User ID is empty string, skipping user ID check')
      } else {
        const purchase = await prisma.purchase.findFirst({
          where: {
            userId: session.user.id,
            contentType,
            ...slugCondition
          }
        })

        console.log('CHECK-PURCHASE DEBUG - Purchase check result by user ID:', purchase)
        
        if (purchase) {
          return NextResponse.json({ purchased: true })
        }
      }
    }
    
    // If we have an email (either from session or from parameter), check by email
    const userEmail = session?.user?.email || email
    
    if (userEmail) {
      console.log('CHECK-PURCHASE DEBUG - Checking purchase for email:', { 
        email: userEmail, 
        slug,
        baseSlug,
        type,
        contentType 
      })
      
      // Check for purchases with exact email match
      const purchase = await prisma.purchase.findFirst({
        where: {
          email: userEmail,
          contentType,
          ...slugCondition
        }
      })
      
      console.log('CHECK-PURCHASE DEBUG - Purchase check result by email (exact match):', purchase)
      
      if (purchase) {
        return NextResponse.json({ purchased: true })
      }
      
      // If no exact match, try case-insensitive match
      const purchaseCaseInsensitive = await prisma.purchase.findFirst({
        where: {
          email: { equals: userEmail, mode: 'insensitive' },
          contentType,
          ...slugCondition
        }
      })
      
      console.log('CHECK-PURCHASE DEBUG - Purchase check result by email (case-insensitive):', purchaseCaseInsensitive)
      
      if (purchaseCaseInsensitive) {
        return NextResponse.json({ purchased: true })
      }
      
      // If still no match, check all purchases to see what's available
      const allPurchases = await prisma.purchase.findMany({
        where: {
          OR: [
            { email: { contains: userEmail.split('@')[0], mode: 'insensitive' } },
            { contentSlug: slug },
            { contentSlug: baseSlug },
            { contentSlug: { contains: `/${baseSlug}` } },
            { contentSlug: { endsWith: `/${baseSlug}` } }
          ]
        },
        take: 5
      })
      
      console.log('CHECK-PURCHASE DEBUG - Related purchases found:', allPurchases)
      
      return NextResponse.json({ purchased: false })
    }
    
    // If we have neither a session nor an email parameter, return not purchased
    console.log('CHECK-PURCHASE DEBUG - No session or email provided, returning false')
    return NextResponse.json({ purchased: false })
  } catch (error) {
    console.error('CHECK-PURCHASE DEBUG - Error checking purchase:', error)
    return NextResponse.json({ error: 'Failed to check purchase' }, { status: 500 })
  }
} 