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

export default function ToolDetailPage({ params }) {
  const toolName = decodeURIComponent(params.name); // Decode the URL parameter
  const tool = getToolByName(toolName);
  const [openSections, setOpenSections] = useState(tool ? Object.keys(tool) : []); // Initialize with all keys or empty array

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
      title={tool.name}
      intro={`Details for ${tool.name}`}
    >
      <div className="flex items-center space-x-4 mb-6">
        {tool.image && (
          <Image
            src={tool.image}
            alt={`${tool.name} logo`}
            width={60}
            height={60}
          />
        )}
        <h1 className="text-3xl font-bold">{tool.name}</h1>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <Link href="/devtools">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
          <Link href={`/devtools/compare?tools=${encodeURIComponent(tool.name)}`}>
            <Button variant="outline">Compare</Button>
         </Link>
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
          if (key !== 'name' && key !== 'image') {
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