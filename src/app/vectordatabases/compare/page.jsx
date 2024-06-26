'use client';

import React, { useState } from 'react';
import { Container } from '@/components/Container';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getDatabases, getCategories, getFeatures } from '../../../lib/getDatabases';
import { getEmoji } from '../../../lib/emojiMapping';
import ComparisonForm from '@/components/ComparisonForm';
import RadarChart from '@/components/ComparisonChart';

export default function ComparePage({ searchParams }) {
  const databases = getDatabases();
  const categories = getCategories();
  const features = getFeatures();
  const selectedDbs = searchParams.dbs ? searchParams.dbs.split(',') : [];

  // State to keep track of open/closed sections
  const [openSections, setOpenSections] = useState(Object.keys(categories));

  const toggleSection = (category) => {
    setOpenSections(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderComparison = (category) => (
    <Accordion
      type="multiple"
      value={openSections}
      onValueChange={setOpenSections}
      className="mb-4"
    >
      <AccordionItem value={category}>
        <AccordionTrigger onClick={() => toggleSection(category)}>
          {getEmoji(category)} {category}
        </AccordionTrigger>
        <AccordionContent forceMount>
          <p className="mb-2">{categories[category].description}</p>
          <p className="text-sm text-gray-600 mb-4">Why it's important: {categories[category].importance}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {selectedDbs.map(dbName => (
                  <TableHead key={dbName}>{dbName}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(databases[0][category]).map(([feature, _]) => (
                <TableRow key={feature}>
                  <TableCell>
                    {getEmoji(feature)} {feature}
                    <p className="text-xs text-gray-600">{features[feature]?.description}</p>
                  </TableCell>
                  {selectedDbs.map(dbName => {
                    const db = databases.find(d => d.name === dbName);
                    const value = db[category][feature];
                    return (
                      <TableCell key={dbName}>
                        {typeof value === 'boolean' ? (value ? '✅' : '❌') : value.toString()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4">Vector Database Comparison</h1>
      <ComparisonForm databases={databases} selectedDbs={selectedDbs} />
      {selectedDbs.length > 0 && (
        <>
          <div className="flex justify-center mb-8">
            <RadarChart databases={databases} selectedDbs={selectedDbs} width={400} height={300} />
          </div>
          {Object.keys(categories).map(renderComparison)}
        </>
      )}
    </Container>
  );
}
