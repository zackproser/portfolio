'use client'

import React, { useState } from 'react';
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

export default function ToolDetailPage({ params }) {
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
        <div className="flex flex-wrap gap-4">
          {tool.multimedia.demo_videos && tool.multimedia.demo_videos.map((video, index) => (
            <div key={index} className="flex-none w-1/4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <a href={video} target="_blank" rel="noopener noreferrer">
                <Image
                  src={`https://img.youtube.com/vi/${video.split('v=')[1]}/0.jpg`}
                  alt="YouTube Video"
                  width={320}
                  height={180}
                  className="rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {tool.multimedia.blog_posts && tool.multimedia.blog_posts.map((post, index) => (
            <div key={index} className="flex-none w-1/3 mb-6">
              <div className="p-4 border rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:bg-zinc-800">
                <Link
                  target='_blank'
                  href={post}
                  className="block rounded-lg text-wrap"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📖</div>
                    <div className="text-lg font-semibold truncate">{post}</div>
                  </div>
                </Link>
              </div>
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