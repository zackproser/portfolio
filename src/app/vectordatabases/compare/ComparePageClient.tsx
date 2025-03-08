'use client'

import Link from 'next/link'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Share2, X, RefreshCw, Clipboard } from 'lucide-react';
import { getEmoji } from '@/lib/emojiMapping';
import { track } from '@vercel/analytics';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Database } from '@/types/database';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface Category {
  description: string;
  importance: string;
}

interface Feature {
  description: string;
}

interface ComparePageClientProps {
  allDatabases: Database[];
  categories: { [key: string]: Category };
  features: { [key: string]: Feature };
  selectedDatabases: Database[];
  selectedDbNames: string[];
}

interface DatabaseSelectorProps {
  databases: Database[];
  selectedDbs: string[];
  onChange: (newSelection: string[]) => void;
}

const formatFieldName = (fieldName: string): string => {
  return fieldName.split('_').map((word, index) => 
    index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
  ).join(' ');
};

const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({ databases, selectedDbs, onChange }) => {
  const availableDatabases = databases.filter(db => !selectedDbs.includes(db.name));

  return (
    <div className="flex flex-wrap gap-2">
      {availableDatabases.map(db => (
        <Badge
          key={db.name}
          variant="outline"
          className="text-sm py-2 px-3 cursor-pointer transition-all bg-background text-foreground hover:bg-secondary"
          onClick={() => onChange([...selectedDbs, db.name])}
        >
          {db.name}
        </Badge>
      ))}
    </div>
  );
};

export default function ComparePageClient({ 
  allDatabases, 
  categories, 
  features, 
  selectedDatabases, 
  selectedDbNames 
}: ComparePageClientProps) {
  const router = useRouter();

  const [openSections, setOpenSections] = useState<string[]>([]);

  const getDbColor = (index: number): string => `hsla(${index * 360 / selectedDatabases.length}, 80%, 40%, 0.9)`;

  const getFundingData = () => {
    const datasets = selectedDatabases.map((db, i) => {
      const data: number[] = [];
      let cumulativeAmount = 0;
      db.business_info?.funding_rounds?.forEach(round => {
        const date = new Date(round.date);
        const amount = parseFloat(round.amount.replace(/[^0-9.-]+/g, ""));
        cumulativeAmount += amount;
        data.push(cumulativeAmount);
      });
      return {
        label: db.name,
        data,
        backgroundColor: getDbColor(i),
        borderColor: getDbColor(i),
      };
    });

    const labels = ["Seed", "Series A", "Series B", "Series C", "Series D+"];
    return { labels, datasets };
  };

  const getValuationData = () => {
    const labels = selectedDatabases.map(db => db.name);
    const data = selectedDatabases.map(db => {
      const valuation = db.business_info?.latest_valuation || "$0";
      return parseFloat(valuation.replace(/[^0-9.-]+/g, "")) || 0;
    });
    return {
      labels,
      datasets: [{
        label: 'Latest Valuation ($ Million)',
        data,
        backgroundColor: labels.map((_, i) => getDbColor(i)),
      }]
    };
  };

  const getEmployeeCountData = () => {
    const labels = selectedDatabases.map(db => db.name);
    const data = selectedDatabases.map(db => {
      const employeeCount = db.business_info?.employee_count || "0";
      return parseInt(employeeCount.split('-')[1] || employeeCount) || 0;
    });
    return {
      labels,
      datasets: [{
        label: 'Employee Count',
        data,
        backgroundColor: labels.map((_, i) => getDbColor(i)),
      }]
    };
  };

  const renderChart = (title: string, chartComponent: React.ReactNode) => (
    <Card className="mb-4 w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartComponent}
      </CardContent>
    </Card>
  );

  const renderBusinessInfoComparison = () => {
    const hasBusinessInfo = selectedDatabases.some(db => db.business_info);
    
    if (selectedDatabases.length === 0 || !hasBusinessInfo) {
      return (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No business information available for the selected databases.</p>
          </CardContent>
        </Card>
      );
    }
    
    const dbWithInfo = selectedDatabases.find(db => db.business_info) || selectedDatabases[0];
    const businessInfoKeys = dbWithInfo.business_info ? Object.keys(dbWithInfo.business_info) : [];
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                {selectedDatabases.map(db => (
                  <TableHead key={db.name}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessInfoKeys.map(key => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{formatFieldName(key)}</TableCell>
                  {selectedDatabases.map((db, index) => (
                    <TableCell key={index}>
                      {key === 'funding_rounds' ? (
                        <ul>
                          {db.business_info?.[key]?.map((round, i) => (
                            <li key={i}>{round.date}: {round.amount} (Series {round.series})</li>
                          )) || 'No data'}
                        </ul>
                      ) : key === 'key_people' ? (
                        <ul>
                          {(db.business_info?.[key] as Array<{ name: string; position: string }> || []).map((person, i) => (
                            <li key={i}>{person.name}: {person.position}</li>
                          ))}
                        </ul>
                      ) : (
                        db.business_info?.[key] || 'N/A'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderComparison = (category: string) => {
    const allHaveCategory = selectedDatabases.every(db => db[category]);
    
    if (!allHaveCategory || selectedDatabases.length === 0) {
      return (
        <AccordionItem value={category} key={category}>
          <AccordionTrigger className="text-xl">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getEmoji(category)}</span>
              <span>{formatFieldName(category)}</span>
            </div>
            <p className="text-sm text-gray-600 ml-2">{categories[category]?.description || ''}</p>
          </AccordionTrigger>
          <AccordionContent>
            <p>No data available for this category.</p>
          </AccordionContent>
        </AccordionItem>
      );
    }
    
    const dbWithCategory = selectedDatabases.find(db => db[category]) || selectedDatabases[0];
    const categoryFeatures = dbWithCategory[category] ? Object.keys(dbWithCategory[category] as object) : [];
    
    return (
      <AccordionItem value={category} key={category}>
        <AccordionTrigger className="text-xl">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getEmoji(category)}</span>
            <span>{formatFieldName(category)}</span>
          </div>
          <p className="text-sm text-gray-600 ml-2">{categories[category]?.description || ''}</p>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-gray-600 mb-4">Why it&apos;s important: {categories[category]?.importance || ''}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {selectedDatabases.map((db, index) => (
                  <TableHead key={db.name} style={{ color: getDbColor(index) }}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryFeatures.map(feature => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">
                    <span className="text-2xl mr-2">{getEmoji(feature)}</span> {formatFieldName(feature)}
                    <p className="text-xs text-gray-600">{features[feature]?.description || ''}</p>
                  </TableCell>
                  {selectedDatabases.map((db, index) => {
                    const categoryObj = db[category] as { [feature: string]: any } || {};
                    const value = categoryObj[feature];
                    return (
                      <TableCell key={db.name}>
                        {typeof value === 'boolean' ? (
                          <span className={value ? 'text-green-600' : 'text-red-600'}>
                            {getEmoji(value.toString())}
                          </span>
                        ) : (
                          value?.toString() || 'N/A'
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const toggleAllSections = () => {
    if (openSections.length === Object.keys(categories).length + 1) {
      setOpenSections([]);
    } else {
      setOpenSections(['business_info', ...Object.keys(categories)]);
    }
  };

  const [shareButtonText, setShareButtonText] = useState('Share');
  const [shareButtonIcon, setShareButtonIcon] = useState<React.ReactNode>(<Share2 className="mr-2 h-4 w-4" />);

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareButtonText('Copied to clipboard!');
      setShareButtonIcon(<Clipboard className="mr-2 h-4 w-4" />);
      track('share_comparison', { databases: selectedDbNames.join(',') });

      setTimeout(() => {
        setShareButtonText('Share');
        setShareButtonIcon(<Share2 className="mr-2 h-4 w-4" />);
      }, 2500);
    });
  };

  const removeDatabase = (dbName: string) => {
    const newSelectedDbs = selectedDbNames.filter(name => name !== dbName);
    router.push(`/vectordatabases/compare?dbs=${newSelectedDbs.join(',')}`);
  };

  const resetComparison = () => {
    setOpenSections([]);
    router.push('/vectordatabases/compare');
  };

  const handleDatabaseSelection = (newSelection: string[]) => {
    router.push(`/vectordatabases/compare?dbs=${newSelection.join(',')}`, { scroll: false });
  };

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold pt-8 mb-4">Compare Vector Databases</h1>
        <Link href="/vectordatabases">
            ← Back to Gallery
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <p className="font-semibold">Comparing:</p>
        {selectedDatabases.map((db, index) => (
          <Button
            key={db.name}
            variant="outline"
            style={{ color: getDbColor(index) }}
            onClick={() => removeDatabase(db.name)}
          >
            {db.name} <X className="ml-2 h-4 w-4" />
          </Button>
        ))}
        <Button variant="outline" onClick={resetComparison}>
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600" onClick={shareComparison}>
          {shareButtonIcon}
          {shareButtonText}
        </Button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Select additional vector databases to compare:</p>
        <DatabaseSelector
          databases={allDatabases}
          selectedDbs={selectedDbNames}
          onChange={handleDatabaseSelection}
        />
      </div>
      {selectedDatabases.length > 0 && (
        <>
          <div className="flex flex-wrap -mx-2">
            {renderChart("Funding Timeline",
              <Line data={getFundingData()} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
            )}
            {renderChart("Latest Valuation",
              <Bar data={getValuationData()} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
            )}
            {renderChart("Employee Count",
              <Bar data={getEmployeeCountData()} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detailed Comparison</h2>
            <Button onClick={toggleAllSections}>
              {openSections.length === Object.keys(categories).length + 1 ? (
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
            {renderBusinessInfoComparison()}
            {Object.keys(categories).map(renderComparison)}
          </Accordion>
        </>
      )}
    </Container>
  );
}