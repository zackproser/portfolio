'use client';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { Container } from '@/components/Container'

export default function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');


  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/api/checkout-sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('return page fetched json:')
        console.log(data);
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      redirect('/')
    )
  }

  if (status === 'paid' || status === 'complete') {
    return (
      <Container className="mt-16 sm:mt-32">
        <section id="success">
          <p>
            We appreciate your business! A confirmation email will be sent to {customerEmail}.

            If you have any questions, please email <a href="mailto:orders@zackproser.com">orders@zackproser.com</a>.
          </p>
        </section>
      </Container>
    )
  }

  return (
    <Container className="mt-16 sm:mt-32">
      <section id="success">
        <h1>Default condition!</h1>
      </section>
    </Container>

  );
}
