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

export default function ToolDetailPage({ params }) {
  const toolName = decodeURIComponent(params.name); 
  const tool = getToolByName(toolName);
  const [openSections, setOpenSections] = useState(tool ? Object.keys(tool) : []); // Initialize with all keys or empty array
  const toolLogo = getLogoById(toolName.toLowerCase());
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

  const toggleAllSections = () => {
    if (openSections.length === Object.keys(tool).length) {
      setOpenSections([]);
    } else {
      setOpenSections(Object.keys(tool));
    }
  };

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
          {tool.multimedia.screenshots && tool.multimedia.screenshots.map((screenshot, index) => (
            <div key={index} className="flex-none w-1/4 p-4 border rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <Image
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                width={320}
                height={180}
                className="rounded-lg"
              />
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

  return (
    <SimpleLayout
      title={``}
      intro={``}
    >
      <div className="flex items-center space-x-6 mb-6">
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
        <div className="flex flex-col space-y-4">
          <div>
            <strong>Category:</strong> {tool.category}
          </div>
          <div>
            <strong>Description:</strong> {tool.description}
          </div>
        </div>
      </div>

      {renderMultimediaSection()}

      <IDESupportBlade ideSupport={tool.ide_support} />

      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <Link href="/devtools">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
          <Link href={`/devtools/compare?tools=${encodeURIComponent(tool.name)}`}>
            <Button variant="outline">Compare</Button>
          </Link>
          {tool.review_link && (
            <Link href={tool.review_link}>
              <Button variant="outline">Read Review</Button>
            </Link>
          )}
        </div>
        <Button onClick={toggleAllSections}>
          {openSections.length === Object.keys(tool).length ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Expand All
            </>
          )}
        </Button>
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        {Object.entries(tool || {}).map(([key, value]) => {
          if (key !== 'name' && key !== 'icon' && key !== 'multimedia' && key !== 'category' && key !== 'description') {
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