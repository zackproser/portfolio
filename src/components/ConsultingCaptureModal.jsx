import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import { Button } from '@/components/Button';


import hackerForHire from '@/images/hacker-for-hire.webp'

import RenderNumYearsExperience from './NumYearsExperience'; RenderNumYearsExperience

export default function ConsultingCaptureModal({ delay }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userDismissedModal = localStorage.getItem('dismissedModal');
    if (userDismissedModal !== 'true') {
      const timer = setTimeout(() => {
        console.log('ConsultingCaptureModal firing...');
        // Capture google analytics event 
        gtag("event", "display_consulting_modal", {
          event_category: "advertising",
          event_label: "consulting_modal",
        });

        setShowModal(true);
      }, delay);

      return () => clearTimeout(timer);  // Clear the timer if the component is unmounted
    }
  }, [delay]);

  const dismissModal = () => {
    // Capture google analytics event 
    gtag("event", "dismiss_consulting_modal", {
      event_category: "advertising",
      event_label: "consulting_modal",
    });
    setShowModal(false);
    localStorage.setItem('dismissedModal', 'true');
  };

  console.log('ConsultingCaptureModal running...');

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="relative bg-gray-900 w-full max-h-[100%] overflow-auto md:overflow-visible">
        <button
          onClick={dismissModal}
          className="absolute top-4 right-4 bg-white rounded-full p-2"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4 text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 5.293a1 1 0 011.414 0L10 7.586l2.293-2.293a1 1 0 111.414 1.414L11.414 9l2.293 2.293a1 1 0 01-1.414 1.414L10 10.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 9 6.293 6.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-slate-900 hidden md:block">
            <Image
              src={hackerForHire}
              className="w-100"
              alt="Hacker for hire"
            />
          </div>
          <div className="w-full md:w-2/3 pl-6 pr-6">
            <p className="text-3xl font-bold tracking-tight text-indigo-500 sm:text-4xl">Hacker for hire!</p>
            <p className="mt-1 text-base leading-7 text-gray-300">
              I have spent the last {RenderNumYearsExperience()} years working in world-class startups:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 not-prose">
              <li className="text-sm"><span className="text-indigo-400 font-semibold">Pinecone.io</span> - vector databases and AI - Staff Developer Advocate</li>
              <li className="text-sm"><span className="text-indigo-400 font-semibold">Gruntwork.io</span> - AWS, Infrastructure as Code - Tech Lead and Senior software engineer</li>
              <li className="text-sm"><span className="text-indigo-400 font-semibold">Cloudflare</span> - Applications and infrastructure at a global scale - Senior software engineer</li>
              <li className="text-sm"><span className="text-indigo-400 font-semibold">Cloudmark / Proofpoint</span> - Application development, security software - Software engineer</li>
            </ul>
            <p className="mt-6 text-base leading-7 text-gray-300">
              I advise investors, startups, product managers and technical leaders on everything from AI-assisted developer tooling to security best practices,
              team dynamics and improving velocity. I can provide product feedback, hands-on stress testing and marketing amplification, and a staff-level developer
              perspective on your product or strategy.
            </p>
            <div className="ml-22 p-8 mt-6 mb-3 z-50">
              <Button
                variant="blue"
                className="bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-500"
                href={"https://calendly.com/zackproser/60min"}
              >
                Book a consultation - $500 per hour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ConsultingCaptureModal.defaultProps = {
  delay: 15000, // Default delay of 15 seconds
}
