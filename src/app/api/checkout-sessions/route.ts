import { auth } from '../../../../auth'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import { getContentItemByDirectorySlug } from '@/lib/content-handlers'
import { Content } from '@/types'

const prisma = new PrismaClient()

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }
  return new Stripe(secretKey, { apiVersion: '2023-10-16' })
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const { slug, type, email, license } = body as { 
      slug: string; 
      type: Content['type']; 
      email?: string,
      license?: 'team' | 'individual'
    }

    // Get email from session if available, but don't require it
    const userEmail = session?.user?.email || email
    
    if (!slug || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const contentType = type === 'course' ? 'learn/courses' : type;
    const content = await getContentItemByDirectorySlug(contentType, slug)
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }
    
    if (!content.commerce?.isPaid) {
      return NextResponse.json(
        { error: 'Content is not available for purchase' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    // Team license uses configurable teamPrice when available
    const isTeam = license === 'team'
    const basePrice = isTeam
      ? (content.commerce?.teamPrice ?? content.commerce.price)
      : content.commerce.price
    const unitAmount = basePrice * 100

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      ui_mode: 'embedded',
      // Only set customer_email if we have it from the session
      ...(userEmail && { customer_email: userEmail }),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: content.title ? String(content.title) : 'Premium Content',
              description: isTeam ? 'Team/Company License (unlimited seats for one email domain)' : (content.description ? String(content.description) : 'Premium Content Access'),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        // Include userId if available
        ...(session?.user?.id && { userId: String(session.user.id) }),
        // Include email if available
        ...(userEmail && { email: userEmail }),
        slug,
        type: content.type,
        license: isTeam ? 'team' : 'individual'
      },
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    }

    const checkoutSession = await stripe.checkout.sessions.create(params)
    return NextResponse.json({ clientSecret: checkoutSession.client_secret })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
  }

  try {
    const stripe = getStripeClient()
    // Try to retrieve the Stripe checkout session
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
      
      if (stripeSession.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      }
    } catch (stripeError) {
      // If Stripe checkout retrieval fails, check if this is a manually provisioned purchase
      console.log('Could not retrieve Stripe session, checking for manual provision:', sessionId);
      
      // Look for a purchase record with this session ID as stripePaymentId
      const purchase = await prisma.purchase.findFirst({
        where: { stripePaymentId: sessionId }
      });
      
      if (!purchase) {
        console.error('No purchase found for session ID:', sessionId);
        throw stripeError; // Re-throw if no purchase found
      }
      
      console.log('Found manually provisioned purchase:', purchase);
      
      // Default to 'blog' content directory since we no longer store contentType
      const contentDir = 'blog';
      
      // Load the content metadata using the new function
      const content = await getContentItemByDirectorySlug(contentDir, purchase.contentSlug);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      
      // Get user info if available
      let user = null;
      if (purchase.userId) {
        user = await prisma.user.findUnique({
          where: { id: purchase.userId },
          select: { id: true, email: true, name: true }
        });
      }
      
      // If no user but we have an email, create a minimal user object
      if (!user && purchase.email) {
        user = {
          email: purchase.email,
          name: 'Customer'
        };
      }
      
      // Return a response that mimics the Stripe session response
      return NextResponse.json({
        content,
        user,
        session: { id: sessionId },
        payment_status: 'paid'
      });
    }

    // If we get here, we have a valid Stripe session
    const { slug, type } = stripeSession.metadata as { slug: string; type: Content['type'] }
    const userId = stripeSession.metadata?.userId
    const email = stripeSession.metadata?.email || stripeSession.customer_details?.email
    
    if (!email) {
      return NextResponse.json({ error: 'No email found in session' }, { status: 400 })
    }

    // Get user info if available
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true }
      })
    }
    
    // If no user found by ID but we have an email, try to find by email
    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true }
      })
    }
    
    // If still no user, create a minimal user object with just the email
    if (!user) {
      user = {
        email,
        name: 'Customer'
      }
    }

    const contentType = type === 'course' ? 'learn/courses' : type;
    const content = await getContentItemByDirectorySlug(contentType, slug)

    return NextResponse.json({
      content,
      user,
      session: stripeSession,
      payment_status: stripeSession.payment_status
    })
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: 'Failed to retrieve checkout session' }, { status: 500 })
  }
}

export async function OPTIONS() {
  const respHeaders = new Headers();
  respHeaders.set("Allow", "POST, GET");
  respHeaders.set("Content-Type", "application/json");

  return NextResponse.next({
    request: {
      headers: respHeaders,
    },
  });
}
