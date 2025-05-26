'use client'

import React from 'react';
import { SimpleLayout } from '@/components/SimpleLayout';
import ToolComparisonHero from './ToolComparisonHero';
import ToolComparisonIntro from './ToolComparisonIntro';
import ProsConsComparison from './ProsConsComparison';
import FeatureMatrix from './FeatureMatrix';
import RadarComparison from './RadarComparison';
import UserReviewComparison from './UserReviewComparison';
import ToolRecommendation from './ToolRecommendation';
import NewsletterWrapper from './NewsletterWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ComparisonPageLayout = ({ tool1, tool2, proseParagraphs }) => {
  const tools = [tool1, tool2];

  return (
    <SimpleLayout>
      {/* Hero section with logo vs logo */}
      <ToolComparisonHero tool1={tool1} tool2={tool2} />
      
      {/* Early newsletter capture - positioned right after hero */}
      <div className="mb-10 p-5 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Get notified when we update this comparison
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              AI tools evolve rapidly. Be the first to know when features change or new data is available.
            </p>
          </div>
          <div className="md:w-1/3 w-full">
            <NewsletterWrapper 
              className="w-full"
              theme="light"
              title="Stay updated" 
              buttonText="Notify me"
            />
          </div>
        </div>
      </div>
      
      {/* Introduction text for what these tools are */}
      <div className="prose dark:prose-invert mb-12 max-w-none">
        <h2 className="text-3xl font-bold mb-6">Overview</h2>
        {proseParagraphs.map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph ? <p className="text-lg">{paragraph}</p> : <br />}
          </React.Fragment>
        ))}
      </div>
      
      {/* Pros and Cons Comparison */}
      <ProsConsComparison tools={tools} />
      
      {/* Interactive radar chart comparison */}
      <RadarComparison tools={tools} />
      
      {/* Mid-page newsletter signup - AI focus */}
      <div className="mt-6 mb-12 pt-8 pb-8 max-w-6xl mx-auto bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-800 dark:to-blue-900 rounded-xl shadow-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-15 pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">AI Engineering Mastery for Teams That Ship</h3>
          <p className="text-white/80 mb-6 max-w-3xl">
            Get insights on the most promising AI developer tools and architectures — honed at Cloudflare, Pinecone, 
            and Fortune 500s, and distilled into practical applications.
          </p>
          <NewsletterWrapper 
            className="max-w-md"
            theme="dark"
            title="Join 1500+ engineers learning to build what actually works"
          />
        </div>
      </div>
      
      {/* Feature Matrix comparison */}
      <h2 className="text-3xl font-bold mb-6">Detailed Feature Comparison</h2>
      <FeatureMatrix tools={tools} />
      
      {/* Newsletter after feature matrix - developer focused */}
      <div className="my-12 p-6 max-w-6xl mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Developer Newsletter</h3>
            <p className="text-gray-700 dark:text-gray-200">
              Get practical code examples, best practices, and integration guides for the exact tools you&apos;re evaluating.
            </p>
          </div>
          <div className="md:w-1/3 w-full">
            <NewsletterWrapper 
              className="w-full"
              buttonText="Send me code examples"
            />
          </div>
        </div>
      </div>
      
      {/* User reviews comparison */}
      <UserReviewComparison tools={tools} />
      
      {/* Smart recommendation engine */}
      <ToolRecommendation tools={tools} />
      
      {/* Author info section - replaced with newsletter */}
      <ToolComparisonIntro tool1={tool1.name} tool2={tool2.name} />
      
      {/* Final call to action */}
      <div className="mt-12 p-8 max-w-6xl mx-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 border border-blue-200 dark:border-blue-800 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-2">Transform Your AI Engineering Capabilities</h3>
            <p className="text-white/90 mb-4">
              Get honest reviews of AI-assisted development tools from someone who uses them every day. No marketing fluff, just practical insights.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Link href="/services">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Schedule Your Transformation →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default ComparisonPageLayout;
export { ComparisonPageLayout };