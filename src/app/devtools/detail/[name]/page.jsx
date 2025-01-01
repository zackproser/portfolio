'use client'

import React, { useState, use } from 'react';
import { SimpleLayout } from '@/components/SimpleLayout';
import { getToolByName } from '@/lib/getTools';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getEmoji } from '@/lib/emojiMapping';
import { sentenceCase } from '@/utils/sentencesCase'; 
import Link from 'next/link';
import { getLogoById } from '@/lib/logoImports';
import IDESupportBlade from '@/components/IDESupportBlade';
import PricingDetails from '@/components/PricingDetails';
import OpenSourceStatus from '@/components/OpenSourceStatus';
import LanguageSupportBlade from '@/components/LanguageSupportBlade';
import BusinessInfoBlade from '@/components/BusinessInfoBlade';

export default function ToolDetailPage(props) {
  const params = use(props.params);
  const toolName = decodeURIComponent(params.name);
  const tool = getToolByName(toolName);
  const [openSections, setOpenSections] = useState(tool ? Object.keys(tool) : []);
  const toolLogo = toolName ? getLogoById(toolName.toLowerCase()) : null;
  console.log(`toolLogo: %o`, toolLogo)

  if (!tool) {
    return (
      <SimpleLayout title="Tool Not Found" intro="The requested tool could not be found.">
        <Link href="/devtools">
          <Button variant="outline">Back to Gallery</Button>
        </Link>
      </SimpleLayout>
    );
  }

  const renderMultimediaSection = () => {
    if (!tool.multimedia) return null;

    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Reviews and discussion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tool.multimedia.demo_videos && tool.multimedia.demo_videos.map((video, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800">
              <a href={video} target="_blank" rel="noopener noreferrer" className="block">
                <Image
                  src={`https://img.youtube.com/vi/${video.split('v=')[1]}/0.jpg`}
                  alt="YouTube Video"
                  width={320}
                  height={180}
                  className="w-full object-cover aspect-video"
                />
                <div className="p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>Watch video</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
          {tool.multimedia.blog_posts && tool.multimedia.blog_posts.map((post, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800">
              <Link
                href={post}
                target="_blank"
                className="block p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📖</div>
                  <div>
                    <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {new URL(post).hostname}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {post}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSectionContent = (key, value) => {
    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
      return <p>{value.toString()}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <strong>{sentenceCase(subKey)}:</strong>{' '}
              {typeof subValue === 'object' ? JSON.stringify(subValue) : subValue}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const includedSections = [
    // Add any sections you want to include here
  ];

  return (
    <SimpleLayout
      title={tool.name}
      intro={tool.description}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <h1 className="text-4xl font-bold">{tool.name}</h1>
          {toolLogo && (
            <Image
              src={toolLogo}
              alt={`${tool.name} logo`}
              width={60}
              height={60}
              className="rounded-full border border-gray-300"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/devtools">
            <Button variant="solid" className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto">
              🏠 Back to Gallery
            </Button>
          </Link>
          <Link href={`/devtools/compare?tools=${encodeURIComponent(tool.name)}`}>
            <Button variant="solid" className="bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto">
              🔍 Compare
            </Button>
          </Link>
          {tool.review_link && (
            <Link href={tool.review_link}>
              <Button variant="solid" className="bg-yellow-500 text-white hover:bg-yellow-600 w-full sm:w-auto">
                📖 Read My Review
              </Button>
            </Link>
          )}
        </div>
      </div>

      <BusinessInfoBlade 
        category={tool.category} 
        description={tool.description} 
        creator={tool.creator} 
        supportsLocalModel={tool.supports_local_model} 
        supportsOfflineUse={tool.supports_offline_use} 
      />

      {renderMultimediaSection()}

      {tool.ide_support && <IDESupportBlade ideSupport={tool.ide_support} />}
      
      {tool.language_support && <LanguageSupportBlade languageSupport={tool.language_support} />}

      {tool.pricing && <PricingDetails pricing={tool.pricing} />}

      {tool.open_source && <OpenSourceStatus openSource={tool.open_source} />}

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        {Object.entries(tool || {}).map(([key, value]) => {
          if (includedSections.includes(key)) {
            const emoji = getEmoji(key);
            return (
              <AccordionItem value={key} key={key}>
                <AccordionTrigger className="text-xl">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{emoji}</span>
                    <span>{sentenceCase(key)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderSectionContent(key, value)}
                </AccordionContent>
              </AccordionItem>
            );
          }
          return null;
        })}
      </Accordion>
    </SimpleLayout>
  );
}