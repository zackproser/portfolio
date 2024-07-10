'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getEmoji } from '@/lib/emojiMapping';
import { sentenceCase } from '@/utils/sentencesCase';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getDbColor = (index, totalDbs) => `hsla(${index * 360 / totalDbs}, 80%, 40%, 0.9)`;

const BarCharts = ({ selectedDatabases }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const valuationData = {
    labels: selectedDatabases.map(db => db.name),
    datasets: [{
      label: 'Valuation',
      data: selectedDatabases.map(db => parseFloat(db.business_info.latest_valuation.replace(/[^0-9.-]+/g, ""))),
      backgroundColor: selectedDatabases.map((_, index) => getDbColor(index, selectedDatabases.length)),
    }]
  };

  const employeeCountData = {
    labels: selectedDatabases.map(db => db.name),
    datasets: [{
      label: 'Employee Count',
      data: selectedDatabases.map(db => parseInt(db.business_info.employee_count.split('-')[1] || db.business_info.employee_count)),
      backgroundColor: selectedDatabases.map((_, index) => getDbColor(index, selectedDatabases.length)),
    }]
  };

  return (
    <div className="space-y-8">
      <div className="h-64 relative">
        <h3 className="text-lg font-semibold mb-2">Latest Valuation</h3>
        <div className="absolute inset-0 top-8">
          <Bar data={valuationData} options={chartOptions} />
        </div>
      </div>
      <div className="h-64 relative">
        <h3 className="text-lg font-semibold mb-2">Employee Count</h3>
        <div className="absolute inset-0 top-8">
          <Bar data={employeeCountData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const BusinessInfo = ({ selectedDatabases }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">Business Info</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            {selectedDatabases.map((db, index) => (
              <TableHead key={db.name} style={{ color: getDbColor(index, selectedDatabases.length) }}>{db.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(selectedDatabases[0].business_info).map(key => (
            <TableRow key={key}>
              <TableCell className="font-medium">{sentenceCase(key)}</TableCell>
              {selectedDatabases.map((db) => (
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
    </div>
  );
};

const renderComparison = (category, selectedDatabases, categories, features) => {
  return (
    <AccordionItem value={category} key={category}>
      <AccordionTrigger className="text-xl">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getEmoji(category)}</span>
          <span>{sentenceCase(category)}</span>
        </div>
        <p className="text-sm text-gray-600 ml-2">{categories[category].description}</p>
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-sm text-gray-600 mb-4">Why it's important: {categories[category].importance}</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {selectedDatabases.map((db, index) => (
                <TableHead key={db.name} style={{ color: getDbColor(index, selectedDatabases.length) }}>{db.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(selectedDatabases[0][category]).map(([feature, _]) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">
                  <span className="text-2xl mr-2">{getEmoji(feature)}</span> {sentenceCase(feature)}
                  <p className="text-xs text-gray-600">{features[feature]?.description}</p>
                </TableCell>
                {selectedDatabases.map((db) => {
                  const value = db[category][feature];
                  return (
                    <TableCell key={db.name}>
                      {typeof value === 'boolean' ? (
                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                          {getEmoji(value.toString())}
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
};

const VectorDBComparison = ({ databases, categories, features }) => {
  const [openSections, setOpenSections] = useState([]);

  const toggleAllSections = () => {
    if (openSections.length === Object.keys(categories).length) {
      setOpenSections([]);
    } else {
      setOpenSections(Object.keys(categories));
    }
  };

  return (
    <div>
      <div className="mb-4 h-[calc(100vh-200px)] overflow-y-auto">
        <BarCharts selectedDatabases={databases} />
      </div>
      <BusinessInfo selectedDatabases={databases} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Detailed Comparison</h2>
        <Button onClick={toggleAllSections}>
          {openSections.length === Object.keys(categories).length ? (
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
        {Object.keys(categories).map(category => renderComparison(category, databases, categories, features))}
      </Accordion>
    </div>
  );
};

export default VectorDBComparison;