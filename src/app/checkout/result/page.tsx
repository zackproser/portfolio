'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentCard';
import { Blog } from '@/lib/shared-types';
import { sendGTMEvent } from '@next/third-parties/google';

interface PurchasedContent {
  content: Blog;
  user: {
    email: string;
    name?: string | null;
  };
  session: any;
  payment_status: string;
}

function CheckoutResultContent() {
  const [content, setContent] = useState<PurchasedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      return;
    }

    const fetchCheckoutSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout-sessions?session_id=${sessionId}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Could not retrieve checkout session details');
        }

        const data: PurchasedContent = await response.json();

        if (data.payment_status !== 'paid') {
          throw new Error('Payment not completed');
        }

        setContent(data);

        // Send GTM event for successful purchase
        sendGTMEvent({
          event: 'purchase',
          value: data.content.commerce?.price,
          items: [
            {
              item_name: data.content.title,
              price: data.content.commerce?.price,
            },
          ],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCheckoutSession();
  }, [sessionId]);

  if (error) {
    return (
      <Container>
        <div className="py-16">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container>
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Verifying payment...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="mb-8">
          A receipt has been sent to {content.user.email}.
        </p>

        {content.content.type === 'blog' && (
          <div className="mb-8">
            <ContentCard article={content.content} />
          </div>
        )}

        {content.content.type === 'course' && (
          <div className="mb-8">
            <p>
              Your course is now available. Start learning{' '}
              <Link
                href={`/learn/courses/${content.content.slug}`}
                className="text-blue-500 hover:text-blue-600"
              >
                here
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default function CheckoutResult() {
  return (
    <Suspense fallback={
      <Container>
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Loading checkout result...</span>
        </div>
      </Container>
    }>
      <CheckoutResultContent />
    </Suspense>
  );
} 