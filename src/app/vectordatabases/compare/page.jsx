'use client'

import React, { useState } from 'react';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Share2, X, RefreshCw } from 'lucide-react';
import { getDatabases, getCategories, getFeatures } from '@/lib/getDatabases';
import { getEmoji } from '@/lib/emojiMapping';
import ComparisonForm from '@/components/ComparisonForm';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { track } from '@vercel/analytics';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function ComparePage({ searchParams }) {
  const router = useRouter();
  const allDatabases = getDatabases();
  const categories = getCategories();
  const features = getFeatures();
  const selectedDbNames = searchParams.dbs ? searchParams.dbs.split(',') : [];
  const selectedDatabases = selectedDbNames.map(name => allDatabases.find(db => db.name === name));

  const [openSections, setOpenSections] = useState([]);

  const getDbColor = (index) => `hsla(${index * 360 / selectedDatabases.length}, 70%, 70%, 0.8)`;

  const getFundingData = () => {
    const labels = [];
    const datasets = selectedDatabases.map((db, index) => {
      const data = [];
      let cumulativeAmount = 0;
      db.business_info.funding_rounds.forEach(round => {
        const date = new Date(round.date);
        const amount = parseFloat(round.amount.replace(/[^0-9.-]+/g, ""));
        cumulativeAmount += amount;
        labels.push(date.toISOString().split('T')[0]);
        data.push(cumulativeAmount);
      });
      return {
        label: db.name,
        data: data,
        borderColor: getDbColor(index),
        backgroundColor: `${getDbColor(index)}80`,
      };
    });
    return { labels, datasets };
  };

  const getValuationData = () => {
    const labels = selectedDatabases.map(db => db.name);
    const data = selectedDatabases.map(db => parseFloat(db.business_info.latest_valuation.replace(/[^0-9.-]+/g, "")));
    return {
      labels,
      datasets: [{
        label: 'Valuation',
        data: data,
        backgroundColor: selectedDatabases.map((_, index) => getDbColor(index)),
      }]
    };
  };

  const getEmployeeCountData = () => {
    const labels = selectedDatabases.map(db => db.name);
    const data = selectedDatabases.map(db => parseInt(db.business_info.employee_count.split('-')[1] || db.business_info.employee_count));
    return {
      labels,
      datasets: [{
        label: 'Employee Count',
        data: data,
        backgroundColor: selectedDatabases.map((_, index) => getDbColor(index)),
      }]
    };
  };

  const renderChart = (title, chartComponent) => (
    <Card className="mb-4 w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartComponent}
      </CardContent>
    </Card>
  );

  const renderBusinessInfoComparison = () => (
    <AccordionItem value="business_info">
      <AccordionTrigger className="text-xl">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getEmoji('business')}</span>
          <span>Business Information</span>
        </div>
        <p className="text-sm text-gray-600 ml-2">Compare key business metrics and funding details</p>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              {selectedDatabases.map((db, index) => (
                <TableHead key={db.name} style={{ color: getDbColor(index) }}>{db.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(selectedDatabases[0].business_info).map(key => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</TableCell>
                {selectedDatabases.map((db, index) => (
                  <TableCell key={db.name}>
                    {key === 'funding_rounds' ? (
                      <ul>
                        {db.business_info[key].map((round, i) => (
                          <li key={i}>{round.date}: {round.amount} (Series {round.series})</li>
                        ))}
                      </ul>
                    ) : key === 'key_people' ? (
                      <ul>
                        {db.business_info[key].map((person, i) => (
                          <li key={i}>{person.name}: {person.position}</li>
                        ))}
                      </ul>
                    ) : (
                      db.business_info[key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );

  const renderComparison = (category) => (
    <AccordionItem value={category} key={category}>
      <AccordionTrigger className="text-xl">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getEmoji(category)}</span>
          <span>{category}</span>
        </div>
        <p className="text-sm text-gray-600 ml-2">{categories[category].description}</p>
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-sm text-gray-600 mb-4">Why it&apos;s important: {categories[category].importance}</p>
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
            {Object.entries(selectedDatabases[0][category]).map(([feature, _]) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">
                  <span className="text-xl mr-2">{getEmoji(feature)}</span> {feature}
                  <p className="text-xs text-gray-600">{features[feature]?.description}</p>
                </TableCell>
                {selectedDatabases.map((db, index) => {
                  const value = db[category][feature];
                  return (
                    <TableCell key={db.name}>
                      {typeof value === 'boolean' ? (
                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                          {getEmoji(value.toString())} {value ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        value?.toString() ?? ''
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

  const toggleAllSections = () => {
    if (openSections.length === Object.keys(categories).length + 1) {
      setOpenSections([]);
    } else {
      setOpenSections(['business_info', ...Object.keys(categories)]);
    }
  };

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Comparison URL copied to clipboard!');
      track('share_comparison', { databases: selectedDbNames });
    });
  };

  const removeDatabase = (dbName) => {
    const newSelectedDbs = selectedDbNames.filter(name => name !== dbName);
    router.push(`/vectordatabases/compare?dbs=${newSelectedDbs.join(',')}`);
  };

  const resetComparison = () => {
    router.push('/vectordatabases/compare');
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4">Vector Database Comparison</h1>
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
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex-grow">
          <p className="text-sm text-gray-600 mb-2">Select up to 3 databases to compare:</p>
          <ComparisonForm databases={allDatabases} selectedDbs={selectedDbNames} />
        </div>
        <Button onClick={shareComparison} className="ml-2 bg-green-500 text-white hover:bg-green-600">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
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
