'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/Container'
import { useSession } from "next-auth/react"

import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation'

import { redirect } from 'next/navigation'

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutPage = () => {

  const { data: session, status } = useSession();

  console.log(`CheckoutPage: session: ${JSON.stringify(session)}`);

  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect('/api/auth/signin');
    }
  }, [status]);


  // Fetch client secret if logged in and product specified
  useEffect(() => {
    const product = searchParams.get('product');

    const payload = {
      product
    }

    if (product) {
      fetch(`/api/checkout-sessions`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }

  }, [session, searchParams]);

  return (
    <Container className="mt-16 sm:mt-32">

      <div id="checkout" className="bg-zinc-50 dark:bg-black">

        {clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}

      </div>

    </Container>
  )
};

export default CheckoutPage;
