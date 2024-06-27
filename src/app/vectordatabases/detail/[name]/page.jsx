'use client'

import React, { useState } from 'react';
import { SimpleLayout } from '@/components/SimpleLayout';
import { getDatabaseByName } from '@/lib/getDatabases';
import { getLogoById } from '@/lib/logoImports';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { emojiMapper } from '@/lib/emojiMapping';
import { sentenceCase } from '@/utils/sentencesCase'; 
import Link from 'next/link';

export default function DatabaseDetailPage({ params }) {
  const database = getDatabaseByName(decodeURIComponent(params.name));
  const logo = getLogoById(database.logoId);

  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    const expanded = {};
    Object.keys(database).forEach(key => {
      if (typeof database[key] === 'object') {
        expanded[key] = true;
      }
    });
    setExpandedSections(expanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
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
        <div className="space-x-2">
          <Button onClick={expandAll} variant="outline">Expand All</Button>
          <Button onClick={collapseAll} variant="outline">Collapse All</Button>
        </div>
      </div>
      <div className="space-y-4">
        {sectionOrder.map(key => {
          const value = database[key];
          if (typeof value === 'object' && value !== null) {
            const isExpanded = expandedSections?.[key];
            const emoji = emojiMapper?.[key];
            if (!value) return null;
            return (
              <Card key={key} className="dark:bg-zinc-800">
                <CardHeader 
                  className="flex flex-row items-center space-x-4 cursor-pointer"
                  onClick={() => toggleSection(key)}
                >
                  {emoji && (
                    <span role="img" aria-label={`${key} emoji`} className="text-2xl">
                      {emoji}
                    </span>
                  )}
                  <CardTitle className="capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                  {isExpanded ? (
                    <ChevronUpIcon className="ml-auto" />
                  ) : (
                    <ChevronDownIcon className="ml-auto" />
                  )}
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    {renderSectionContent(key, value)}
                  </CardContent>
                )}
              </Card>
            );
          }
          return null;
        })}
      </div>
    </SimpleLayout>
  );
}
