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
  position?: string;
  className?: string;
}

// Global state to ensure only ONE sticky newsletter appears
let stickyMasterInstance: string | null = null;
let globalShowSticky = false;
let globalIsDismissed = false;
let globalHandleScroll: (() => void) | null = null;
const stickyUpdateCallbacks = new Map<string, (show: boolean, dismissed: boolean) => void>();

const NewsletterWrapper = ({ 
  title, 
  body, 
  successMessage,
  onSubscribe,
  position = "content",
  className
}: NewsletterWrapperProps) => {
  const [showSticky, setShowSticky] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [isStickyMaster, setIsStickyMaster] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run after hydration to prevent SSR/client mismatch
    if (!isHydrated) return;

    // Check if user has previously dismissed the newsletter
    const hasUserDismissed = localStorage.getItem('newsletter-dismissed');
    if (hasUserDismissed) {
      globalIsDismissed = true;
      setIsDismissed(true);
      return;
    }

    // Only the FIRST instance becomes the sticky master
    if (stickyMasterInstance === null) {
      stickyMasterInstance = instanceId;
      setIsStickyMaster(true);
      
      globalHandleScroll = () => {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / totalHeight) * 100;
        globalShowSticky = scrollPercent >= 25;
        
        // Update the master instance only
        const masterCallback = stickyUpdateCallbacks.get(stickyMasterInstance!);
        if (masterCallback) {
          masterCallback(globalShowSticky, globalIsDismissed);
        }
      };

      window.addEventListener('scroll', globalHandleScroll);
    }

    // Register this instance for updates (but only master will receive sticky updates)
    const updateCallback = (show: boolean, dismissed: boolean) => {
      if (instanceId === stickyMasterInstance) {
        setShowSticky(show);
        setIsDismissed(dismissed);
      }
    };
    stickyUpdateCallbacks.set(instanceId, updateCallback);

    // Clean up this instance on unmount
    return () => {
      stickyUpdateCallbacks.delete(instanceId);
      
      // If this was the master instance, clean up and elect a new master
      if (instanceId === stickyMasterInstance) {
        if (globalHandleScroll) {
          window.removeEventListener('scroll', globalHandleScroll);
          globalHandleScroll = null;
        }
        
        // Elect a new master from remaining instances
        const remainingInstances = Array.from(stickyUpdateCallbacks.keys());
        if (remainingInstances.length > 0) {
          stickyMasterInstance = remainingInstances[0];
          // Restart scroll listener with new master
          if (!globalHandleScroll) {
            globalHandleScroll = () => {
              const scrollY = window.scrollY;
              const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
              const scrollPercent = (scrollY / totalHeight) * 100;
              globalShowSticky = scrollPercent >= 25;
              
              const masterCallback = stickyUpdateCallbacks.get(stickyMasterInstance!);
              if (masterCallback) {
                masterCallback(globalShowSticky, globalIsDismissed);
              }
            };
            window.addEventListener('scroll', globalHandleScroll);
          }
        } else {
          stickyMasterInstance = null;
        }
      }
    };
  }, [instanceId, isHydrated]);

  const handleDismiss = () => {
    globalIsDismissed = true;
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
        position={position}
        className={className || "mb-6"}
      />
      
      {/* Sticky Newsletter - only for master instance and after hydration */}
      {isHydrated && isStickyMaster && showSticky && !isDismissed && (
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
            body="Get my free RAG Pipeline Tutorial →"
            successMessage="Thanks! Tutorial link sent to your email."
            onSubscribe={onSubscribe}
            position="sticky-side"
            className="rounded-2xl bg-white dark:bg-zinc-900"
          />
        </div>
      )}
    </>
  );
};

export default NewsletterWrapper;
