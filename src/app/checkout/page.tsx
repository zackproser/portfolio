'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Container } from '@/components/Container'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutPage = () => {
  const searchParams = useSearchParams()
  const product = searchParams.get('product');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {

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
  }, [product]); // useEffect will re-run when 'product' changes

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

