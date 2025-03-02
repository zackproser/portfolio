'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentCard';
import { Blog } from '@/types';
import { sendGTMEvent } from '@next/third-parties/google';
import { useSession, signIn } from 'next-auth/react';

// Import the utility function for generating content URLs
import { createMetadata } from '@/utils/createMetadata';

interface PurchasedContent {
  content: Blog;
  user: {
    email: string;
    name?: string | null;
  };
  session: any;
  payment_status: string;
  verificationEmailSent: boolean;
}

function CheckoutResultContent() {
  const [content, setContent] = useState<PurchasedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const { data: authSession, status: authStatus } = useSession();

  // Function to get the content URL based on content type
  const getContentUrl = (content: Blog) => {
    // Remove any leading slashes and content type prefixes from the slug
    const cleanSlug = content.slug.replace(/^\/+/, '').replace(/^(blog|learn\/courses)\//, '');
    
    // Generate the URL path based on content type
    let url = '';
    
    switch (content.type) {
      case 'blog':
        url = `/blog/${cleanSlug}`;
        break;
      case 'course':
        url = `/learn/courses/${cleanSlug}/0`; // Append /0 for courses
        break;
      case 'video':
        url = `/videos/${cleanSlug}`;
        break;
      case 'demo':
        url = `/demos/${cleanSlug}`;
        break;
      default:
        // Fallback to the content slug directly
        url = `/${content.type}/${cleanSlug}`;
    }
    
    // Remove leading slash for Next.js Link component
    return url.startsWith('/') ? url.substring(1) : url;
  };

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

        // If user is not authenticated, we'll show them a button to sign in
        // rather than trying to auto-login
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCheckoutSession();
  }, [sessionId, authStatus, router]);

  // Function to handle email sign-in and redirect to verification page
  const handleEmailSignIn = async (email: string, contentUrl: string) => {
    try {
      setIsLoggingIn(true);
      
      // Use environment variable for base URL
      let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
      
      // Remove trailing slash from baseUrl if present
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      
      // Ensure the URL is absolute
      let absoluteUrl;
      if (contentUrl.startsWith('http')) {
        absoluteUrl = contentUrl;
      } else if (baseUrl) {
        // If we have a base URL from env, use it
        absoluteUrl = `${baseUrl}${contentUrl.startsWith('/') ? contentUrl : `/${contentUrl}`}`;
      } else {
        // Fallback to a simple path if no base URL is available
        absoluteUrl = contentUrl.startsWith('/') ? contentUrl : `/${contentUrl}`;
      }
      
      // First, trigger the email sign-in process
      await signIn("email", { 
        email, 
        callbackUrl: absoluteUrl,
      });
      
    } catch (error) {
      console.error('Error during sign-in process:', error);
      setIsLoggingIn(false);
      setError('Failed to send verification email. Please try again.');
    }
  };

  if (error) {
    return (
      <Container>
        <div className="py-16">
          <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">Your purchase was successful</h2>
            <p className="text-gray-700 mb-4">
              We&apos;ve received your payment and a receipt has been sent to your email. 
              {error.includes("being processed") ? (
                <span className="block mt-2">
                  {error}
                </span>
              ) : (
                <span className="block mt-2">
                  There was a small issue with the automatic login: <span className="text-amber-700">{error}</span>
                </span>
              )}
            </p>
            <p className="text-gray-700 mb-4">
              Don&apos;t worry! You can still access your content by logging in manually with the email you used for purchase.
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Log in
              </button>
              <Link href="/" className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
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

  if (isLoggingIn) {
    return (
      <Container>
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Sending verification email...</span>
        </div>
      </Container>
    );
  }

  const contentUrl = getContentUrl(content.content);

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="mb-8">
          A receipt has been sent to {content.user.email}.
          {authStatus === 'authenticated' && (
            <span className="ml-2 text-green-600">You&apos;re now logged in and can access your content immediately.</span>
          )}
          {authStatus === 'unauthenticated' && (
            <span className="ml-2">
              <button
                onClick={() => handleEmailSignIn(content.user.email, contentUrl)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Log in to access your content
              </button>
            </span>
          )}
        </p>

        {content.content.type === 'blog' && (
          <div className="mb-8">
            <ContentCard article={content.content} />
            <div className="mt-4">
              {authStatus === 'authenticated' ? (
                <Link
                  href={contentUrl}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Read Now
                </Link>
              ) : (
                <button
                  onClick={() => handleEmailSignIn(content.user.email, contentUrl)}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Sign in to Read
                </button>
              )}
              {authStatus === 'unauthenticated' && (
                <p className="mt-2 text-sm text-gray-600">
                  You&apos;ll need to verify your email before accessing the full content.
                </p>
              )}
            </div>
          </div>
        )}

        {content.content.type === 'course' && (
          <div className="mb-8">
            <p className="mb-4">
              Your course is now available. You can start learning right away!
            </p>
            {authStatus === 'authenticated' ? (
              <Link
                href={contentUrl}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Start Learning
              </Link>
            ) : (
              <button
                onClick={() => handleEmailSignIn(content.user.email, contentUrl)}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Sign in to Start Learning
              </button>
            )}
            {authStatus === 'unauthenticated' && (
              <p className="mt-2 text-sm text-gray-600">
                You&apos;ll need to verify your email before accessing the full course.
              </p>
            )}
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