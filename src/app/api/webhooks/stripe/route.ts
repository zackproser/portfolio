import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { slug, userId } = session.metadata!

    try {
      await sql`
        INSERT INTO articlepurchases (
          user_id, 
          article_slug, 
          stripe_payment_id,
          amount
        ) VALUES (
          ${userId}, 
          ${slug}, 
          ${session.payment_intent as string},
          ${session.amount_total! / 100}
        )
      `
    } catch (error) {
      console.error('Error recording purchase:', error)
      return NextResponse.json(
        { error: 'Error recording purchase' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
} 