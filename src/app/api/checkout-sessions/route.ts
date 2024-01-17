import { NextRequest, NextResponse } from 'next/server';

import { redirect } from 'next/navigation';

import { getProductDetails, ProductDetails } from '@/utils/productUtils';

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";

import { EmailTemplate } from '@/components/TransactionalEmail'

export async function POST(req: NextRequest) {
  console.log(`checkout-sessions POST`)

  const nextSession = await getServerSession(authOptions);

  if (!nextSession) {
    redirect('/api/auth/signin')
  }

  const customerEmail = nextSession.user.email as unknown as string;
  const customerName = nextSession.user.name as unknown as string;

  const data = await req.json();

  let productSlug: string = data.product ?? 'unknown';

  const productDetails: ProductDetails | null = await getProductDetails(productSlug);

  if (!productDetails) {
    throw new Error('Invalid product name');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: productDetails.price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url:
        `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&product=${productSlug}`,
    });


    // Send transactional email to customer
    const { data, error } = await resend.emails.send({
      //from: 'Orders <orders@zackproser.com>',
      from: 'Onboarding <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `${customerName}, class is in session!`,
      react: EmailTemplate({ firstName: customerName, courseName: productSlug }),
      text: "Your purchased course is ready!"
    });

    console.log(`data: ${JSON.stringify(data)}`)
    console.log(`error: ${JSON.stringify(error)}`)


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

    console.log(`session: ${JSON.stringify(session)}`)

    const product = req.nextUrl.searchParams.get('product');

    if (!session.customer_details) {
      throw new Error('Customer details are missing in the session');
    }

    return new NextResponse(JSON.stringify({
      status: session.payment_status,
      customer_email: session.customer_details.email,
      product: product
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

