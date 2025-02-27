import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'
import { importContentMetadata } from '@/lib/content-handlers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

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
    
    if (!session.metadata?.slug || !session.metadata?.userId || !session.metadata?.type) {
      console.error('🔴 Missing required metadata:', session.metadata)
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 })
    }
    
    const { slug, userId, type } = session.metadata
    console.log('🎯 Processing completed checkout:', { slug, userId, type })

    try {
      // Verify the user exists and get their details
      console.log('🎯 Verifying user exists')
      console.log('🎯 User ID from metadata:', userId)
      const userResult = await sql`
        SELECT id::int as id, email, name FROM users WHERE id = ${userId}::int
      `
      if (userResult.rows.length === 0) {
        throw new Error(`No user found with ID ${userId}`)
      }
      const user = userResult.rows[0]
      console.log('🎯 Found user:', { email: user.email, name: user.name })

      // 1. Record the purchase in the appropriate table
      console.log('🎯 Recording purchase')
      try {
        if (type === 'article' || type === 'blog') {
          await sql`
            INSERT INTO articlepurchases (
              user_id, 
              article_slug, 
              stripe_payment_id,
              amount
            ) VALUES (
              ${userId}::int, 
              ${slug}, 
              ${session.payment_intent as string},
              ${session.amount_total! / 100}
            )
          `
        } else if (type === 'course') {
          await sql`
            INSERT INTO coursepurchases (
              user_id, 
              course_slug, 
              stripe_payment_id,
              amount
            ) VALUES (
              ${userId}::int, 
              ${slug}, 
              ${session.payment_intent as string},
              ${session.amount_total! / 100}
            )
          `
        }
        console.log('✅ Purchase recorded successfully')
      } catch (sqlError) {
        console.error('🔴 Failed to record purchase:', sqlError)
        throw sqlError
      }

      // 2. Get content details
      console.log('🎯 Fetching content details for slug:', slug)
      try {
        let content;
        if (type === 'article' || type === 'blog') {
          content = await importContentMetadata(slug, 'blog')
        } else if (type === 'course') {
          const courseResult = await sql`
            SELECT title, description, slug FROM courses WHERE slug = ${slug}
          `
          if (courseResult.rows.length === 0) {
            throw new Error(`No course found with slug ${slug}`)
          }
          content = courseResult.rows[0]
        }
        
        console.log('🎯 Found content:', { title: content?.title })
        if (!content) {
          throw new Error(`No content found with slug ${slug}`)
        }

        // 3. Check if we've already sent an email for this purchase
        console.log('🎯 Checking for existing email notification')
        const emailResult = await sql`
          SELECT id FROM email_notifications 
          WHERE user_id = ${userId}::int 
          AND content_type = ${type}
          AND content_slug = ${slug} 
          AND email_type = 'purchase_confirmation'
        `
        console.log('🎯 Existing email notifications found:', emailResult.rows.length)

        // Always attempt to send the email for purchases
        console.log('🎯 Preparing to send email')
        const emailInput: SendReceiptEmailInput = {
          From: "purchases@zackproser.com",
          To: user.email,
          TemplateAlias: "receipt",
          TemplateModel: {
            CustomerName: user.name || 'Valued Customer',
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
        console.log('🎯 User email:', user.email)
        console.log('🎯 Content title:', content.title)
        console.log('🎯 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
        
        try {
          console.log('🎯 Attempting to send email...')
          const emailResponse = await sendReceiptEmail(emailInput)
          console.log('✅ Email sent successfully:', emailResponse)

          // Only record the email notification if we haven't before and the send was successful
          if (emailResult.rows.length === 0) {
            console.log('🎯 Recording email notification')
            try {
              await sql`
                INSERT INTO email_notifications (user_id, content_type, content_slug, email_type)
                VALUES (${userId}::int, ${type}, ${slug}, 'purchase_confirmation')
              `
              console.log('✅ Email notification recorded')
            } catch (sqlError) {
              console.error('🔴 Failed to record email notification:', sqlError)
              throw sqlError
            }
          }
        } catch (emailError) {
          console.error('🔴 Failed to send email:', emailError)
          throw emailError
        }
      } catch (contentError) {
        console.error('🔴 Error processing content:', contentError)
        throw contentError
      }
    } catch (error) {
      console.error('🔴 Error processing purchase:', error)
      throw error
    }
  }

  return NextResponse.json({ received: true })
} 