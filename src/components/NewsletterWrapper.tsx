'use client'

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DynamicNewsletter = dynamic(() => import('./Newsletter'), { ssr: false });

interface NewsletterWrapperProps {
  title: string;
  body: string;
  successMessage?: string;
  onSubscribe?: () => void;
}

const NewsletterWrapper = ({ 
  title, 
  body, 
  successMessage,
  onSubscribe 
}: NewsletterWrapperProps) => {
  const [showSticky, setShowSticky] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the newsletter
    const hasUserDismissed = localStorage.getItem('newsletter-dismissed');
    if (hasUserDismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / totalHeight) * 100;
      setShowSticky(scrollPercent >= 25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowSticky(false);
    // Store dismissal in localStorage
    localStorage.setItem('newsletter-dismissed', 'true');
  };

  return (
    <>
      {/* Original Newsletter at content end */}
      <DynamicNewsletter 
        title={title} 
        body={body} 
        successMessage={successMessage}
        onSubscribe={onSubscribe}
        className="mb-6"
      />
      
      {/* Sticky Newsletter */}
      {showSticky && !isDismissed && (
        <div className="fixed bottom-4 right-4 z-50 w-96 shadow-xl animate-slide-up">
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 z-50 p-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors shadow-lg"
            aria-label="Dismiss newsletter"
          >
            <X className="h-5 w-5" />
          </button>
          <DynamicNewsletter 
            title="Want More No-Fluff AI Tutorials?"
            body="Get my free LangChain guide →"
            successMessage="Thanks! Tutorial link sent to your email."
            onSubscribe={onSubscribe}
            className="rounded-2xl bg-white dark:bg-zinc-900"
          />
        </div>
      )}
    </>
  );
};

export default NewsletterWrapper;
