'use client'

import React, { useState } from 'react';
import { SimpleLayout } from '@/components/SimpleLayout';
import { getDatabaseByName } from '@/lib/getDatabases';
import { getLogoById } from '@/lib/logoImports';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getEmoji } from '@/lib/emojiMapping';
import { sentenceCase } from '@/utils/sentencesCase'; 
import Link from 'next/link';

export default function DatabaseDetailPage({ params }) {
  const database = getDatabaseByName(decodeURIComponent(params.name));
  const logo = getLogoById(database.logoId);

  const [openSections, setOpenSections] = useState([]);

  const toggleAllSections = () => {
    if (openSections.length === sectionOrder.length) {
      setOpenSections([]);
    } else {
      setOpenSections(sectionOrder);
    }
  };

  const renderSectionContent = (key, value) => {
    if (typeof value === 'string') {
      return <p>{value}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index}>{typeof item === 'object' ? renderSectionContent(key, item) : item}</li>
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
              {renderHumanReadableValue(subKey, subValue)}
            </div>
          ))}
        </div>
      );
    }

    return value.toString();
  };

  const renderHumanReadableValue = (key, value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return renderSectionContent(key, value);
    }
    return value.toString();
  };

  const sectionOrder = [
    'business_info',
    'deployment',
    'scalability',
    'data_management',
    'vector_similarity_search',
    'integration_api',
    'security',
    'community_ecosystem',
    'pricing',
    'additional_features',
    'specific_details'
  ];

  return (
    <SimpleLayout
      title={''}
      intro={''}
    >
      <div className="flex items-center space-x-4 mb-6">
        {logo && (
          <Image
            src={logo}
            alt={`${database.name} logo`}
            width={60}
            height={60}
          />
        )}
        <h1 className="text-3xl font-bold">{database.name}</h1>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <Link href="/vectordatabases">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
          <Link href={`/vectordatabases/compare?databases=${database.name}`}>
            <Button variant="outline">Start Comparison</Button>
          </Link>
        </div>
        <Button onClick={toggleAllSections}>
          {openSections.length === sectionOrder.length ? (
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
        {sectionOrder.map(key => {
          const value = database[key];
          if (typeof value === 'object' && value !== null) {
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
