'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import  OpenSourceStatus  from '@/components/OpenSourceStatus';
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
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getToolColor = (index, totalTools) => `hsla(${index * 360 / totalTools}, 80%, 40%, 0.9)`;

const renderCellValue = (value) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  if (typeof value === 'boolean') {
    return (
      <span className={value ? 'text-green-600' : 'text-red-600'}>
        {getEmoji(value.toString())}
      </span>
    );
  }
  if (Array.isArray(value)) {
    return (
      <div>
        {value.map((item, index) => (
          <div key={index}>
            {typeof item === 'object' ? renderNestedObject(item) : renderValue(item)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object' && value !== null) {
    if (value.client !== undefined && value.backend !== undefined && value.model !== undefined) {
      return <OpenSourceStatus openSource={value} />;
    }
    return renderNestedObject(value);
  }
  return renderValue(value);
};

const renderValue = (value) => {
  if (typeof value === 'string' && isValidURL(value)) {
    return (
      <Link href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        {value}
      </Link>
    );
  }
  return value?.toString() ?? '';
};

const renderNestedObject = (obj) => {
  return Object.entries(obj).map(([key, val]) => (
    <div key={key} className="mb-1">
      <span className="font-medium">{sentenceCase(key)}:</span>{' '}
      {typeof val === 'object' ? renderNestedObject(val) : renderValue(val)}
    </div>
  ));
};

const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const BarCharts = ({ selectedTools }) => {
  const businessData = {
    labels: selectedTools.map(tool => tool.name),
    datasets: [
      {
        label: 'Employee Count',
        data: selectedTools.map(tool => tool.business_info.employee_count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Funding',
        data: selectedTools.map(tool => parseFloat(tool.business_info.funding.replace(/[^0-9.-]+/g, ""))),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue',
        data: selectedTools.map(tool => parseFloat(tool.business_info.revenue.replace(/[^0-9.-]+/g, ""))),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userCountData = {
    labels: selectedTools.map(tool => tool.name),
    datasets: [
      {
        label: 'User Count',
        data: selectedTools.map(tool => tool.usage_stats.number_of_users),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mb-4 flex flex-wrap">
      <div className="w-full md:w-1/2 p-2">
        <Bar data={businessData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>
      <div className="w-full md:w-1/2 p-2">
        <Bar data={userCountData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>
    </div>
  );
};

export const BusinessInfo = ({ selectedTools }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold pt-4">Company profiles</h2>
        <Button onClick={toggleExpansion}>
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Collapse
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Expand
            </>
          )}
        </Button>
      </div>
      {isExpanded && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              {selectedTools.map((tool, index) => (
                <TableHead key={tool.name} style={{ color: getToolColor(index, selectedTools.length) }}>{tool.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(selectedTools[0].business_info).map((feature) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">
                  <span className="text-2xl mr-2">{getEmoji(feature)}</span> {sentenceCase(feature)}
                </TableCell>
                {selectedTools.map((tool) => (
                  <TableCell key={tool.name}>
                    {renderCellValue(tool.business_info[feature])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const renderComparison = (category, selectedTools) => {
  if (category === 'name' || category === 'icon' || category === 'category' || category === 'description' || category === 'business_info' || category === 'user_reviews') {
    return null;
  }

  const categoryData = selectedTools[0][category];
  const features = (typeof categoryData === 'object' && categoryData) ? Object.keys(categoryData) : [category];

  return (
    <AccordionItem value={category} key={category}>
      <AccordionTrigger className="text-xl">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getEmoji(category)}</span>
          <span>{sentenceCase(category)}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              {selectedTools.map((tool, index) => (
                <TableHead key={tool.name} style={{ color: getToolColor(index, selectedTools.length) }}>{tool.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">
                  {sentenceCase(feature)}
                </TableCell>
                {selectedTools.map((tool) => (
                  <TableCell key={tool.name}>
                    {category === 'open_source' 
                      ? renderOpenSourceStatus(tool[category])
                      : renderCellValue(typeof categoryData === 'object' ? tool[category]?.[feature] : tool[category])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
};

const renderOpenSourceStatus = (status) => {
  if (typeof status === 'object') {
    return (
      <div>
        {Object.entries(status).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{sentenceCase(key)}:</span>{' '}
            <span className={value ? 'text-green-600' : 'text-red-600'}>
              {value ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <span className={status ? 'text-green-600' : 'text-red-600'}>
      {status ? '✓' : '✗'}
    </span>
  );
};

export const DetailedComparison = ({ tools }) => {
  const [openSections, setOpenSections] = useState([]);

  const toggleAllSections = () => {
    if (openSections.length === 0) {
      setOpenSections(Object.keys(tools[0] || {}));
    } else {
      setOpenSections([]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Detailed Comparison</h2>
        <Button onClick={toggleAllSections}>
          {openSections.length === 0 ? (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Expand All
            </>
          ) : (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Collapse All
            </>
          )}
        </Button>
      </div>
      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        {Object.keys(tools[0] || {}).map(category => renderComparison(category, tools))}
      </Accordion>
    </div>
  );
};