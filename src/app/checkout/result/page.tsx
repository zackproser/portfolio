'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { BlogPostCard } from '@/components/BlogPostCard';
import { Article } from '@/lib/shared-types';

function CheckoutResultPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [article, setArticle] = useState<(Article & { slug: string }) | null>(null);
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
      .then(async (data) => {
        console.log('Checkout session data:', data);
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.payment_status === 'paid') {
          setStatus('success');
          // Extract article slug from metadata
          if (data.metadata?.slug) {
            // Fetch article metadata
            const res = await fetch(`/api/articles/${data.metadata.slug}`);
            const articleData = await res.json();
            if (articleData.error) {
              throw new Error(articleData.error);
            }
            setArticle({ ...articleData, slug: data.metadata.slug });
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
          <span className="ml-3 text-zinc-700 dark:text-zinc-300">Verifying payment...</span>
        </div>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="rounded-xl bg-red-50 dark:bg-red-900/10 p-6 shadow-lg border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
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
      <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 shadow-xl border border-green-200 dark:border-green-800">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
            🎉 Payment Successful!
          </h3>
          <p className="text-lg text-green-700 dark:text-green-300 mb-6">
            Thank you for your purchase. Your article is now available.
          </p>
        </div>

        {article && (
          <div className="mb-8">
            <BlogPostCard article={article} />
          </div>
        )}

        {article && (
          <div className="text-center">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Read Your Article →
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

export default function CheckoutResultPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutResultPage />
    </Suspense>
  );
} 