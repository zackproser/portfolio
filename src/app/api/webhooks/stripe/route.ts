import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'
import { importContentMetadata } from '@/lib/content-handlers'

// Initialize Stripe and Prisma
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
const prisma = new PrismaClient()

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  console.log('🎯 Webhook received - START')
  console.log('🎯 Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET)
  console.log('🎯 Postmark API key configured:', !!process.env.POSTMARK_API_KEY)
  
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')!
  console.log('🎯 Stripe signature present:', !!sig)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    console.log('🎯 Event constructed successfully')
    console.log('🎯 Event type:', event.type)
    console.log('🎯 Event data:', JSON.stringify(event.data.object, null, 2))
  } catch (err) {
    console.error('🔴 Webhook signature verification failed:', err)
    console.error('🔴 Webhook secret used:', endpointSecret?.substring(0, 5) + '...')
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('🎯 Session metadata:', session.metadata)
    
    if (!session.metadata?.slug || !session.metadata?.type) {
      console.error('🔴 Missing required metadata:', session.metadata)
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
      console.error('🔴 No email found in session data')
      return NextResponse.json({ error: 'No email found in session data' }, { status: 400 })
    }
    
    console.log('🎯 Processing completed checkout:', { slug, userId, email, type })

    try {
      // Check if we have a userId or need to look it up by email
      let user = null
      
      if (userId) {
        // Verify the user exists and get their details
        console.log('🎯 Verifying user exists by ID')
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true }
        })
        
        if (user) {
          console.log('🎯 Found user by ID:', { email: user.email, name: user.name })
        }
      }
      
      if (!user && email) {
        // Try to find user by email
        console.log('🎯 Looking up user by email:', email)
        user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true }
        })
        
        if (user) {
          console.log('🎯 Found user by email:', { id: user.id, name: user.name })
        } else {
          console.log('🎯 No user found with email:', email)
          // We'll proceed with just the email for the purchase
        }
      }

      // 1. Record the purchase
      console.log('🎯 Recording purchase')
      try {
        const contentType = type === 'article' || type === 'blog' ? 'article' : type
        const contentSlug = slug
        
        // Create the purchase record using Prisma
        // Always include the email, even if we have a user ID
        await prisma.purchase.create({
          data: {
            user: user ? { connect: { id: user.id } } : undefined,
            contentType,
            contentSlug,
            stripePaymentId: session.payment_intent as string || session.id,
            amount: session.amount_total! / 100,
            email: email // Always include the email
          }
        })
        
        // If it's a course and we have a user, also record in courseenrollments
        if (type === 'course' && user) {
          const course = await prisma.course.findUnique({
            where: { slug: contentSlug }
          })
          
          if (course) {
            await prisma.courseEnrollment.upsert({
              where: {
                userId_courseId: {
                  userId: user.id,
                  courseId: course.id
                }
              },
              update: {},
              create: {
                userId: user.id,
                courseId: course.id
              }
            })
          }
        }
        
        console.log('✅ Purchase recorded successfully')
      } catch (dbError) {
        console.error('🔴 Failed to record purchase:', dbError instanceof Error ? dbError.message : String(dbError));
        // Don't throw the error, just log it and continue
        // This allows the webhook to complete even if there's an issue with recording the purchase
      }

      // 2. Get content details
      console.log('🎯 Fetching content details for slug:', slug);
      try {
        let content;
        if (type === 'article' || type === 'blog') {
          content = await importContentMetadata(slug, 'blog')
        } else if (type === 'course') {
          content = await prisma.course.findUnique({
            where: { slug },
            select: { title: true, description: true, slug: true }
          })
        }
        
        console.log('🎯 Found content:', { title: content?.title });
        if (!content) {
          console.error(`🔴 No content found with slug ${slug}`);
          // Instead of throwing, we'll continue with a fallback
          content = {
            title: `${type === 'article' ? 'Article' : 'Course'} ${slug}`,
            description: `Premium ${type === 'article' ? 'Article' : 'Course'} Content`
          };
        }

        // 3. Check if we've already sent an email for this purchase
        console.log('🎯 Checking for existing email notification')
        const existingNotification = await prisma.emailNotification.findFirst({
          where: {
            email,
            contentType: type,
            contentSlug: slug,
            emailType: 'purchase_confirmation'
          }
        })
        
        console.log('🎯 Existing email notifications found:', existingNotification ? 1 : 0)

        // Always attempt to send the email for purchases
        console.log('🎯 Preparing to send email')
        const emailInput: SendReceiptEmailInput = {
          From: "purchases@zackproser.com",
          To: email,
          TemplateAlias: "receipt",
          TemplateModel: {
            CustomerName: user?.name || 'Valued Customer',
            ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'article' ? 'blog' : 'learn/courses'}/${slug}${type === 'course' ? '/0' : ''}`,
            ProductName: content.title,
            Date: new Date().toLocaleDateString('en-US'),
            ReceiptDetails: {
              Description: content.description || `Premium ${type === 'article' ? 'Article' : 'Course'} Access`,
              Amount: `$${session.amount_total! / 100}`,
              SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            },
            Total: `$${session.amount_total! / 100}`,
            SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
            ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'article' ? 'blog' : 'learn/courses'}/${slug}${type === 'course' ? '/0' : ''}`,
            CompanyName: "Modern Coding",
            CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
          },
        }

        console.log('🎯 Sending email with input:', JSON.stringify(emailInput, null, 2))
        console.log('🎯 User email:', email)
        console.log('🎯 Content title:', content.title)
        console.log('🎯 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
        
        try {
          console.log('🎯 Attempting to send email...')
          const emailResponse = await sendReceiptEmail(emailInput)
          console.log('✅ Email sent successfully:', emailResponse)

          // Only record the email notification if we haven't before and the send was successful
          if (!existingNotification) {
            console.log('🎯 Recording email notification')
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
              console.log('✅ Email notification recorded')
            } catch (dbError) {
              console.error('🔴 Failed to record email notification:', dbError)
              throw dbError
            }
          }
        } catch (emailError) {
          console.error('🔴 Failed to send email:', emailError instanceof Error ? emailError.message : String(emailError));
          // Log but don't throw, allow the webhook to complete
        }
      } catch (contentError) {
        console.error('🔴 Error processing content:', contentError instanceof Error ? contentError.message : String(contentError));
        // Log but don't throw, allow the webhook to complete
      }
    } catch (error) {
      console.error('🔴 Error processing purchase:', error instanceof Error ? error.message : String(error));
      // Return a 200 response to Stripe to prevent retries, but log the error
      // This is a common pattern for webhook handlers
      return NextResponse.json({ received: true, error: 'Error processing purchase' })
    }
  }

  // Always return a 200 response to Stripe to acknowledge receipt
  console.log('✅ Webhook processed successfully');
  return NextResponse.json({ received: true })
} 