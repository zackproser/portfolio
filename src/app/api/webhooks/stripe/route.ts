import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'
import { getContentItemByDirectorySlug } from '@/lib/content-handlers'
import { COURSES_DISABLED } from '@/types'
import { stripeLogger as logger } from '@/utils/logger' // Import centralized logger

// Remove the import from content-handlers
// import { getContentUrl } from '@/lib/content-handlers'

// Initialize Stripe and Prisma
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
const prisma = new PrismaClient()

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Function to get the content URL based on content type
const getContentUrl = (type: string, slug: string) => {
  // Remove any leading slashes from the slug
  const cleanSlug = slug.replace(/^\/+/, '');
  
  // For all content types, use the /blog/ path since we're only selling blog content
  return `/blog/${cleanSlug}`;
};

export async function POST(req: Request) {
  logger.info('Webhook received - START')
  logger.debug('Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET)
  logger.debug('Postmark API key configured:', !!process.env.POSTMARK_API_KEY)
  
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')!
  logger.debug('Stripe signature present:', !!sig)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    logger.info('Event constructed successfully')
    logger.info('Event type:', event.type)
    logger.debug('Event data:', JSON.stringify(event.data.object, null, 2)) // Keep as debug
  } catch (err) {
    logger.error('Webhook signature verification failed:', err)
    logger.error('Webhook secret used:', endpointSecret?.substring(0, 5) + '...')
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    logger.info('Processing checkout.session.completed')
    logger.debug('Session metadata:', session.metadata)
    
    if (!session.metadata?.slug || !session.metadata?.type) {
      logger.error('Missing required metadata:', session.metadata)
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 })
    }
    
    const { slug, type } = session.metadata
    const userId = session.metadata?.userId
    
    // Get email from Stripe session - first check metadata, then customer_details
    // This ensures we always have an email for the purchase
    const email = session.metadata?.email || 
                  session.customer_details?.email || 
                  session.customer_email
    
    if (!email) {
      logger.error('No email found in session data')
      return NextResponse.json({ error: 'No email found in session data' }, { status: 400 })
    }
    
    logger.info('Processing completed checkout details:', { slug, userId, email, type })

    try {
      // Check if we have a userId or need to look it up by email
      let user = null
      
      if (userId) {
        // Verify the user exists and get their details
        logger.debug('Verifying user exists by ID')
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true }
        })
        
        if (user) {
          logger.debug('Found user by ID:', { email: user.email, name: user.name })
        }
      }
      
      if (!user && email) {
        // Try to find user by email
        logger.debug('Looking up user by email:', email)
        user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true }
        })
        
        if (user) {
          logger.debug('Found user by email:', { id: user.id, name: user.name })
        } else {
          logger.debug('No user found with email:', email)
          // We'll proceed with just the email for the purchase
        }
      }

      // 1. Record the purchase
      logger.info('Recording purchase')
      try {
        const contentType = type === 'article' || type === 'blog' ? 'article' : type
        const contentSlug = slug
        
        logger.debug('PURCHASE DEBUG - Purchase details:', { 
          userId: user?.id || null,
          contentType,
          type,
          contentSlug,
          email,
          sessionId: session.id
        })
        
        // Record the purchase in the database
        const result = await prisma.purchase.upsert({
          where: {
            userId_contentType_contentSlug: {
              userId: user?.id || '',
              contentType,
              contentSlug
            }
          },
          update: {
            purchaseDate: new Date(),
            stripePaymentId: session.id,
            amount: session.amount_total! / 100,
            email: email // Always include the email
          },
          create: {
            userId: user?.id || null,
            contentType,
            contentSlug,
            purchaseDate: new Date(),
            stripePaymentId: session.id,
            amount: session.amount_total! / 100,
            email: email // Always include the email
          }
        })
        
        logger.debug('PURCHASE DEBUG - Purchase record result:', result)
        
        // Course enrollments are disabled
        // If it's a course and we have a user, also record in courseenrollments
        if (type === 'course' && user && !COURSES_DISABLED) {
          // This code is temporarily disabled as courses are disabled
          logger.warn('Course purchase detected but course enrollments are temporarily disabled');
        }
        
        logger.info('Purchase recorded successfully')
      } catch (dbError) {
        logger.error('PURCHASE DEBUG - Failed to record purchase:', dbError instanceof Error ? dbError.message : String(dbError));
        logger.error('PURCHASE DEBUG - Error details:', dbError);
        // Don't throw the error, just log it and continue
        // This allows the webhook to complete even if there's an issue with recording the purchase
      }

      // 2. Get content details
      logger.info('Fetching content details for slug:', slug);
      try {
        let content;
        if (type === 'article' || type === 'blog') {
          content = await getContentItemByDirectorySlug('blog', slug)
        } else if (type === 'course') {
          // Courses are disabled, use a fallback
          logger.warn('Course purchase detected, using fallback content details as courses are disabled');
          content = {
            title: `Course: ${slug}`,
            description: 'Premium Course Content'
          };
        }
        
        logger.debug('Found content:', { title: content?.title });
        if (!content) {
          logger.error(`No content found with slug ${slug}. Using fallback for email.`);
          // Instead of throwing, we'll continue with a fallback
          content = {
            title: `${type === 'article' ? 'Article' : 'Course'} ${slug}`,
            description: `Premium ${type === 'article' ? 'Article' : 'Course'} Content`
          };
        }

        // 3. Check if we've already sent an email for this purchase
        logger.info('Checking for existing email notification')
        const existingNotification = await prisma.emailNotification.findFirst({
          where: {
            email,
            contentType: type,
            contentSlug: slug,
            emailType: 'purchase_confirmation'
          }
        })
        
        logger.info('Existing email notifications found:', existingNotification ? 1 : 0)

        // Always attempt to send the email for purchases
        logger.info('Preparing to send email')
        const emailInput: SendReceiptEmailInput = {
          From: "purchases@zackproser.com",
          To: email,
          TemplateAlias: "receipt",
          TemplateModel: {
            CustomerName: user?.name || 'Valued Customer',
            ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}${getContentUrl(type, slug)}`,
            ProductName: content?.title || `${type === 'article' ? 'Article' : 'Course'}: ${slug}`,
            Date: new Date().toLocaleDateString('en-US'),
            ReceiptDetails: {
              Description: content?.description || `Premium ${type === 'article' ? 'Article' : 'Course'} Access`,
              Amount: `$${session.amount_total! / 100}`,
              SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            },
            Total: `$${session.amount_total! / 100}`,
            SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}${getContentUrl(type, slug)}`,
            CompanyName: "Modern Coding",
            CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
          },
        }

        logger.debug('Sending email with input:', JSON.stringify(emailInput, null, 2))
        logger.debug('User email:', email)
        logger.debug('Content title:', content?.title || 'No title available')
        logger.debug('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
        
        try {
          logger.info('Attempting to send email...')
          const emailResponse = await sendReceiptEmail(emailInput)
          logger.info('Email sent successfully:', emailResponse)

          // Only record the email notification if we haven't before and the send was successful
          if (!existingNotification) {
            logger.info('Recording email notification')
            try {
              await prisma.emailNotification.create({
                data: {
                  userId: user?.id || null,
                  contentType: type,
                  contentSlug: slug,
                  emailType: 'purchase_confirmation',
                  email
                }
              })
              logger.info('Email notification recorded')
            } catch (notificationError) {
              logger.error('Failed to record email notification:', notificationError)
              // Continue processing even if notification recording fails
            }
          }
        } catch (emailError) {
          logger.error('Failed to send receipt email:', emailError)
          // Continue processing even if email sending fails
        }
      } catch (contentError) {
         logger.error('Failed to fetch content details for email:', contentError)
         // Continue processing webhook even if content lookup fails
      }

    } catch (error) {
      logger.error('🔴 Unexpected error processing checkout session:', error)
    }

    // Send response after processing
    logger.info('✅ Webhook processing complete')
    return NextResponse.json({ received: true })
  } else {
    logger.warn(`Unhandled event type: ${event.type}`)
    return NextResponse.json({ received: true, message: `Unhandled event type: ${event.type}` })
  }
} 