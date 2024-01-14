import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {

  console.log(`checkout-sessions POST`)

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: 'price_1OYaktEDHFkvZ1e9OIvcUsdD',
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url:
        `${req.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
    });


    return new NextResponse(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
    })

  } catch (err: unknown) {

    if (err instanceof Error) {
      return new NextResponse(JSON.stringify({ error: err.message }), {
        status: 500,
      })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Unknown Error' }), {
        status: 500,
      })
    }
  }
}

export async function GET(req: NextRequest) {

  console.log(`checkout-sessions GET`)

  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      throw new Error('Session ID is missing');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.customer_details) {
      throw new Error('Customer details are missing in the session');
    }

    return new NextResponse(JSON.stringify({
      status: session.payment_status,
      customer_email: session.customer_details.email,
    }), {
      status: 200,
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return new NextResponse(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: 'Unknown Error' }), {
        status: 500,
      });
    }
  }
}

export async function OPTIONS() {
  let respHeaders = new Headers()
  respHeaders.set('Allow', 'POST, GET')
  respHeaders.set('Content-Type', 'application/json')

  return NextResponse.next({
    request: {
      headers: respHeaders,
    }
  });
}

