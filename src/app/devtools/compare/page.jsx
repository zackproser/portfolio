'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Share2, X, RefreshCw, Clipboard } from 'lucide-react';
import { getTools } from '@/lib/getTools';
import { getEmoji } from '@/lib/emojiMapping';
import { track } from '@vercel/analytics';
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
import OpenSourceStatus from '@/components/OpenSourceStatus';

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

const BarCharts = ({ selectedTools }) => {
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
      <table className="table-auto w-full mt-2">
        <thead>
          <tr>
            <th className="px-4 py-2">Tool</th>
            <th className="px-4 py-2">Employee Count</th>
            <th className="px-4 py-2">Funding</th>
            <th className="px-4 py-2">Revenue</th>
            <th className="px-4 py-2">User Count</th>
            <th className="px-4 py-2">Founding Year</th>
            <th className="px-4 py-2">Headquarters</th>
          </tr>
        </thead>
        <tbody>
          {selectedTools.map((tool) => (
            <tr key={tool.name}>
              <td className="border px-4 py-2">{tool.name}</td>
              <td className="border px-4 py-2">{tool.business_info.employee_count}</td>
              <td className="border px-4 py-2">{tool.business_info.funding}</td>
              <td className="border px-4 py-2">{tool.business_info.revenue}</td>
              <td className="border px-4 py-2">{tool.usage_stats.number_of_users}</td>
              <td className="border px-4 py-2">{tool.business_info.founding_year}</td>
              <td className="border px-4 py-2">{tool.business_info.headquarters}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BusinessInfo = ({ selectedTools }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">Business Info</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
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
    </div>
  );
};

const ToolSelector = ({ tools, selectedTools, onChange }) => {
  const availableTools = tools.filter(tool => !selectedTools.includes(tool.name));

  return (
    <div className="flex flex-wrap gap-2">
      {availableTools.map(tool => (
        <Badge
          key={tool.name}
          variant="outline"
          className="text-sm py-2 px-3 cursor-pointer transition-all bg-background text-foreground hover:bg-secondary"
          onClick={() => onChange([...selectedTools, tool.name])}
        >
          {tool.name}
        </Badge>
      ))}
    </div>
  );
};

export default function ComparePage({ searchParams }) {
  const router = useRouter();
  const allTools = getTools();
  const selectedToolNames = searchParams.tools 
    ? searchParams.tools.split(',').map(name => name.trim())
    : [];
  const selectedTools = selectedToolNames.map(name => 
    allTools.find(tool => tool.name === name)
  ).filter(Boolean);

  const [openSections, setOpenSections] = useState([]);
  const [shareButtonText, setShareButtonText] = useState('Share');
  const [shareButtonIcon, setShareButtonIcon] = useState(<Share2 className="mr-2 h-4 w-4" />);

  const toggleAllSections = () => {
    if (openSections.length === Object.keys(selectedTools[0] || {}).length) {
      setOpenSections([]);
    } else {
      setOpenSections(Object.keys(selectedTools[0] || {}));
    }
  };

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareButtonText('Copied to clipboard!');
      setShareButtonIcon(<Clipboard className="mr-2 h-4 w-4" />);
      track('share_comparison', { tools: selectedToolNames });

      setTimeout(() => {
        setShareButtonText('Share');
        setShareButtonIcon(<Share2 className="mr-2 h-4 w-4" />);
      }, 2500);
    });
  };

  const removeTool = (toolName) => {
    const newSelectedTools = selectedToolNames.filter(name => name !== toolName);
    router.push(`/devtools/compare?tools=${newSelectedTools.join(',')}`);
  };

  const resetComparison = () => {
    router.push('/devtools/compare');
  };

  const handleToolSelection = (newSelection) => {
    router.push(`/devtools/compare?tools=${newSelection.join(',')}`);
  };

  const renderComparison = (category) => {
    if (category === 'name' || category === 'icon' || category === 'category' || category === 'description' || category === 'business_info') {
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
                <TableHead>Feature</TableHead>
                {selectedTools.map((tool, index) => (
                  <TableHead key={tool.name} style={{ color: getToolColor(index, selectedTools.length) }}>{tool.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">
                    <span className="text-2xl mr-2">{getEmoji(feature)}</span> {sentenceCase(feature)}
                  </TableCell>
                  {selectedTools.map((tool) => (
                    <TableCell key={tool.name}>
                      {tool[category] && tool[category][feature] !== undefined
                        ? renderCellValue((typeof categoryData === 'object' && categoryData) ? tool[category][feature] : tool[category])
                        : 'N/A'}
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

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold pt-8 mb-4">Compare Developer Tools</h1>
        <Link href="/devtools">
          ← Back to Gallery
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <p className="font-semibold">Comparing:</p>
        {selectedTools.map((tool, index) => (
          <Button
            key={tool.name}
            variant="outline"
            style={{ color: getToolColor(index, selectedTools.length) }}
            onClick={() => removeTool(tool.name)}
          >
            {tool.name} <X className="ml-2 h-4 w-4" />
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
        <p className="text-sm text-gray-600 mb-2">Select additional developer tools to compare:</p>
        <ToolSelector
          tools={allTools}
          selectedTools={selectedToolNames}
          onChange={handleToolSelection}
        />
      </div>
      <BarCharts selectedTools={selectedTools} />
      {selectedTools.length > 0 && (
        <>
          <BusinessInfo selectedTools={selectedTools} />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detailed Comparison</h2>
            <Button onClick={toggleAllSections}>
              {openSections.length === Object.keys(selectedTools[0] || {}).length ? (
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
            {Object.keys(selectedTools[0] || {}).map(renderComparison)}
          </Accordion>
        </>
      )}
    </Container>
  );
}

