'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/Container';
import Link from 'next/link';

export default function CheckoutResult() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setError('No session ID provided');
      return;
    }

    // Verify payment status
    fetch(`/api/checkout-sessions?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Checkout session data:', data);
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.payment_status === 'paid') {
          setStatus('success');
          // Extract article slug from metadata
          if (data.metadata?.slug) {
            setArticleSlug(data.metadata.slug);
          } else {
            console.error('No article slug found in metadata:', data.metadata);
            throw new Error('Article information not found');
          }
        } else {
          console.error('Payment status:', data.payment_status);
          throw new Error(`Payment not completed (status: ${data.payment_status})`);
        }
      })
      .catch((err) => {
        console.error('Error verifying payment:', err);
        setStatus('error');
        setError(err.message || 'Failed to verify payment');
      });
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Verifying payment...</span>
        </div>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Payment verification failed
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="rounded-lg bg-green-50 dark:bg-green-900/10 p-8 text-center">
        <h3 className="text-xl font-medium text-green-800 dark:text-green-200 mb-4">
          Payment Successful!
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-6">
          Thank you for your purchase. Your article is now available.
        </p>
        {articleSlug && (
          <Link
            href={`/blog/${articleSlug}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Read Your Article
          </Link>
        )}
      </div>
    </Container>
  );
} 