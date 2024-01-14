'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Container } from '@/components/Container'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const SomePage = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch("/api/checkout-sessions", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, []);

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

export default SomePage;

