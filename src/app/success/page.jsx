'use client';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { Container } from '@/components/Container'
import PurchaseSuccess from '@/components/PurchaseSuccess'

import { getProductDetails } from '@/utils/productUtils';

export default function CheckoutSuccess() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get('session_id');
  const productName = urlParams.get('product');

  const productDetails = getProductDetails(productName);

  useEffect(() => {
    fetch(`/api/checkout-sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('success page fetched json:')
        console.log(data);
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  useEffect(() => {
    if (status === 'paid' || status === 'complete') {
      fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          customerEmail,
          courseId: productDetails.courseId,
        }),
      })
        .then(res => {
          if (res.ok) {
            console.log('Purchase updated successfully!')
          } else {
            console.log('Error updating purchase')
          }
        })
    }
  }, [status, sessionId, customerEmail, productDetails.courseId])

  if (status === 'open') {
    return (
      redirect('/')
    )
  }

  if (status === 'paid' || status === 'complete') {
    return (
      <Container className="mt-16 sm:mt-32">
        <PurchaseSuccess
          customerEmail={customerEmail}
          productName={productDetails.fullName}
        />
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
