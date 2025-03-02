'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Pattern } from './Pattern'
import { usePathname } from 'next/navigation'
import { track } from '@vercel/analytics'
import { useSession } from 'next-auth/react'

interface FreeChaptersProps {
  title: string
  productSlug: string
}

export function FreeChapters({ title, productSlug }: FreeChaptersProps) {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRequested, setHasRequested] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const referrer = usePathname()

  // Set email from session if available
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Check if the user has already requested free chapters when they enter an email
  useEffect(() => {
    const checkRequestStatus = async () => {
      if (!email || email.indexOf('@') === -1) return;
      
      setIsChecking(true);
      try {
        const response = await fetch(`/api/check-free-chapters?email=${encodeURIComponent(email)}&productSlug=${encodeURIComponent(productSlug)}`);
        if (response.ok) {
          const data = await response.json();
          setHasRequested(data.hasRequested);
          
          if (data.hasRequested) {
            setFormSuccess(true);
          }
        }
      } catch (err) {
        console.error('Error checking request status:', err);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check to avoid too many requests
    const timeoutId = setTimeout(() => {
      checkRequestStatus();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email, productSlug]);

  const sendFormSubmissionEvent = () => {
    // Send analytics event
    track("free-chapters-request", {
      product: productSlug,
      referrer,
      authenticated: !!session?.user
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!email) {
      setError('Please enter your email address')
      setIsSubmitting(false)
      return
    }

    // If the user has already requested free chapters, just show success message
    if (hasRequested) {
      setFormSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/free-chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productSlug,
          referrer
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Success
      sendFormSubmissionEvent()
      setFormSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="free-chapters"
      aria-label="Free preview"
      className="scroll-mt-14 bg-blue-600 sm:scroll-mt-32 dark:bg-blue-800"
    >
      <div className="overflow-hidden lg:relative">
        <Container
          size="md"
          className="relative grid grid-cols-1 items-end gap-y-12 py-20 lg:static lg:grid-cols-2 lg:py-28 xl:py-32"
        >
          <Pattern className="absolute -top-32 left-0 w-full sm:left-3/4 sm:top-0 sm:ml-8 sm:w-auto md:left-2/3 lg:left-auto lg:right-2 lg:ml-0 xl:right-auto xl:left-2/3" />
          <div>
            <h2 className="font-display text-5xl font-extrabold tracking-tight text-white sm:w-3/4 sm:text-6xl md:w-2/3 lg:w-auto">
              Get a free chapter straight to your inbox
            </h2>
            <p className="mt-4 text-lg tracking-tight text-blue-200">
              Enter your email below and we&apos;ll send you a free chapter
              of <span className="font-bold text-white">{title}</span>, showing you how to set up your development environment
              and build your first RAG pipeline.
            </p>
          </div>
          {formSuccess ? (
            <div className="lg:pl-16">
              <div className="rounded-xl bg-white/10 p-8 backdrop-blur">
                <h3 className="text-xl font-medium tracking-tight text-white">
                  Thank you! 🎉
                </h3>
                <p className="mt-2 text-blue-200">
                  {hasRequested 
                    ? "We've already sent the free chapter to your inbox. Please check your email (including spam folder)."
                    : "We've sent the free chapter to your inbox. Check your email and get ready to dive in!"}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full lg:pl-16">
              <h3 className="text-base font-medium tracking-tight text-white">
                Get a free chapter straight to your inbox{' '}
                <span aria-hidden="true">&rarr;</span>
              </h3>
              <div className="mt-4 sm:relative sm:flex sm:items-center sm:py-0.5 sm:pr-2.5">
                <div className="relative sm:static sm:flex-auto">
                  <input
                    type="email"
                    id="email-address"
                    required
                    aria-label="Email address"
                    placeholder={session?.user?.email || "Email address"}
                    className="peer relative z-10 w-full appearance-none bg-transparent px-4 py-2 text-base text-white placeholder:text-blue-200 focus:outline-none sm:py-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isChecking || !!session?.user?.email}
                  />
                  <div className="absolute inset-0 rounded-md border border-white/20 peer-focus:border-blue-300 peer-focus:bg-blue-500 peer-focus:ring-1 peer-focus:ring-blue-300 sm:rounded-xl" />
                </div>
                <Button
                  type="submit"
                  color="white"
                  className="mt-4 w-full sm:relative sm:z-10 sm:mt-0 sm:w-auto sm:flex-none"
                  disabled={isSubmitting || isChecking}
                >
                  {isSubmitting ? 'Sending...' : isChecking ? 'Checking...' : 'Get free chapters'}
                </Button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-200">{error}</p>
              )}
              {session?.user && (
                <p className="mt-2 text-sm text-blue-200">
                  Using your account email: {session.user.email}
                </p>
              )}
            </form>
          )}
        </Container>
      </div>
    </section>
  )
} 