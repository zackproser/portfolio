import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'
import { getContentItemByDirectorySlug } from '@/lib/content-handlers'
import { COURSES_DISABLED } from '@/types'
import { stripeLogger as logger } from '@/utils/logger' // Import centralized logger
import { getContentUrl } from '@/lib/content-url'
import { normalizeRouteOrFileSlug } from '@/lib/content-handlers'

// Initialize Stripe and Prisma
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
const prisma = new PrismaClient()

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  logger.info('WEBHOOK: Handler entry')
  const payload = await req.text()
  logger.debug('WEBHOOK: Raw payload:', payload)
  const sig = req.headers.get('stripe-signature')!
  logger.debug('WEBHOOK: Stripe signature:', sig)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    logger.info('WEBHOOK: Event constructed successfully')
    logger.info('WEBHOOK: Event type:', event.type)
    logger.debug('WEBHOOK: Event data:', JSON.stringify(event.data.object, null, 2))
  } catch (err) {
    logger.error('WEBHOOK: Signature verification failed:', err)
    logger.error('WEBHOOK: Secret used:', endpointSecret?.substring(0, 5) + '...')
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    logger.info('WEBHOOK: Processing checkout.session.completed')
    logger.debug('WEBHOOK: Session metadata:', session.metadata)
    logger.debug('WEBHOOK: Session customer_details:', session.customer_details)
    logger.debug('WEBHOOK: Session customer_email:', session.customer_email)
    
    if (!session.metadata?.slug || !session.metadata?.type) {
      logger.error('WEBHOOK: Missing required metadata:', session.metadata)
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 })
    }
    
    const { slug, type } = session.metadata
    const userId = session.metadata?.userId
    logger.debug('WEBHOOK: Slug:', slug, 'Type:', type, 'UserId:', userId)
    
    // Normalize the slug to always use the directory slug
    const directorySlug = normalizeRouteOrFileSlug(slug);
    logger.debug('WEBHOOK: Normalized directorySlug:', directorySlug)
    
    // Get email from Stripe session - first check metadata, then customer_details
    const email = session.metadata?.email || 
                  session.customer_details?.email || 
                  session.customer_email
    logger.debug('WEBHOOK: Resolved email:', email)
    
    if (!email) {
      logger.error('WEBHOOK: No email found in session data')
      return NextResponse.json({ error: 'No email found in session data' }, { status: 400 })
    }
    
    logger.info('WEBHOOK: Processing completed checkout details:', { slug, userId, email, type })

    try {
      // Check if we have a userId or need to look it up by email
      let user = null
      if (userId) {
        logger.debug('WEBHOOK: Verifying user exists by ID')
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true }
        })
        logger.debug('WEBHOOK: User by ID lookup result:', user)
      }
      if (!user && email) {
        logger.debug('WEBHOOK: Looking up user by email:', email)
        user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true }
        })
        logger.debug('WEBHOOK: User by email lookup result:', user)
      }
      // 1. Load the canonical content object to get the true type
      const loadedContent = await getContentItemByDirectorySlug('blog', directorySlug);
      if (!loadedContent || !loadedContent.type) {
        logger.error('WEBHOOK: FATAL - Could not load canonical content or type missing', { directorySlug, loadedContent });
        return NextResponse.json({ error: 'Could not load canonical content or type missing' }, { status: 500 });
      }
      const canonicalType = loadedContent.type;
      logger.info('WEBHOOK: Using canonical content type for purchase record:', canonicalType);
      // 2. Record the purchase
      logger.info('WEBHOOK: Recording purchase')
      try {
        const contentType = canonicalType;
        const contentSlug = directorySlug;
        logger.debug('WEBHOOK: Purchase upsert details:', { userId: user?.id, contentType, contentSlug, email, sessionId: session.id })
        let result;
        if (user?.id) {
          logger.debug('WEBHOOK: Upserting by userId')
          result = await prisma.purchase.upsert({
            where: {
              userId_contentType_contentSlug: {
                userId: user.id,
                contentType,
                contentSlug
              }
            },
            update: {
              purchaseDate: new Date(),
              stripePaymentId: session.id,
              amount: session.amount_total! / 100,
              email: email
            },
            create: {
              userId: user.id,
              contentType,
              contentSlug,
              purchaseDate: new Date(),
              stripePaymentId: session.id,
              amount: session.amount_total! / 100,
              email: email
            }
          })
        } else {
          logger.debug('WEBHOOK: Upserting by email')
          result = await prisma.purchase.upsert({
            where: {
              email_contentType_contentSlug: {
                email,
                contentType,
                contentSlug
              }
            },
            update: {
              purchaseDate: new Date(),
              stripePaymentId: session.id,
              amount: session.amount_total! / 100,
              email: email
            },
            create: {
              userId: null,
              contentType,
              contentSlug,
              purchaseDate: new Date(),
              stripePaymentId: session.id,
              amount: session.amount_total! / 100,
              email: email
            }
          })
        }
        logger.debug('WEBHOOK: Purchase upsert result:', result)
        logger.info('WEBHOOK: Purchase recorded successfully')
      } catch (dbError) {
        logger.error('WEBHOOK: Failed to record purchase:', dbError instanceof Error ? dbError.message : String(dbError))
        logger.error('WEBHOOK: Error details:', dbError)
      }
      // 3. Get content details
      logger.info('WEBHOOK: Fetching content details for slug:', slug)
      try {
        let content;
        if (type === 'article' || type === 'blog') {
          content = await getContentItemByDirectorySlug('blog', directorySlug)
        } else if (type === 'course') {
          logger.warn('WEBHOOK: Course purchase detected, using fallback content details as courses are disabled')
          content = {
            title: `Course: ${slug}`,
            description: 'Premium Course Content'
          };
        }
        logger.debug('WEBHOOK: Found content:', { title: content?.title })
        if (!content) {
          logger.error('WEBHOOK: No content found with slug', slug)
          content = {
            title: `${type === 'article' ? 'Article' : 'Course'} ${slug}`,
            description: `Premium ${type === 'article' ? 'Article' : 'Course'} Content`
          };
        }
        // 4. Check if we've already sent an email for this purchase
        logger.info('WEBHOOK: Checking for existing email notification')
        const existingNotification = await prisma.emailNotification.findFirst({
          where: {
            email,
            contentType: type,
            contentSlug: directorySlug,
            emailType: 'purchase_confirmation'
          }
        })
        logger.info('WEBHOOK: Existing email notifications found:', existingNotification ? 1 : 0)
        // Always use directorySlug for URLs to avoid double-prepending
        const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${getContentUrl(type, directorySlug)}`;
        logger.info('WEBHOOK: Preparing to send email')
        const emailInput: SendReceiptEmailInput = {
          From: "purchases@zackproser.com",
          To: email,
          TemplateAlias: "receipt",
          TemplateModel: {
            CustomerName: user?.name || 'Valued Customer',
            ProductURL: productUrl,
            ProductName: content?.title || `${type === 'article' ? 'Article' : 'Course'}: ${slug}`,
            Date: new Date().toLocaleDateString('en-US'),
            ReceiptDetails: {
              Description: content?.description || `Premium ${type === 'article' ? 'Article' : 'Course'} Access`,
              Amount: `$${session.amount_total! / 100}`,
              SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            },
            Total: `$${session.amount_total! / 100}`,
            SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            ActionURL: productUrl,
            CompanyName: "Modern Coding",
            CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
          },
        }
        logger.debug('WEBHOOK: Sending email with input:', JSON.stringify(emailInput, null, 2))
        try {
          logger.info('WEBHOOK: Attempting to send email...')
          const emailResponse = await sendReceiptEmail(emailInput)
          logger.info('WEBHOOK: Email sent successfully:', emailResponse)
          if (!existingNotification) {
            logger.info('WEBHOOK: Recording email notification')
            try {
              await prisma.emailNotification.create({
                data: {
                  userId: user?.id || null,
                  contentType: type,
                  contentSlug: directorySlug,
                  emailType: 'purchase_confirmation',
                  email
                }
              })
              logger.info('WEBHOOK: Email notification recorded')
            } catch (notificationError) {
              logger.error('WEBHOOK: Failed to record email notification:', notificationError)
            }
          }
        } catch (emailError) {
          logger.error('WEBHOOK: Failed to send receipt email:', emailError)
        }
      } catch (contentError) {
         logger.error('WEBHOOK: Failed to fetch content details for email:', contentError)
      }
    } catch (error) {
      logger.error('WEBHOOK: Unexpected error processing checkout session:', error)
    }
    logger.info('WEBHOOK: Processing complete')
    return NextResponse.json({ received: true })
  } else {
    logger.warn('WEBHOOK: Unhandled event type:', event.type)
    return NextResponse.json({ received: true, message: `Unhandled event type: ${event.type}` })
  }
} 