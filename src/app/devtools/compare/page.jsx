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

  const getToolColor = (index) => `hsla(${index * 360 / selectedTools.length}, 80%, 40%, 0.9)`;

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
    if (category === 'name' || category === 'icon' || category === 'category' || category === 'description') {
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
                  <TableHead key={tool.name} style={{ color: getToolColor(index) }}>{tool.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">
                    <span className="text-2xl mr-2">{getEmoji(feature)}</span> {sentenceCase(feature)}
                  </TableCell>
                  {selectedTools.map((tool) => renderCellValue((typeof categoryData === 'object' && categoryData)? tool[category][feature] : tool[category]))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const renderCellValue = (value) => {
    if (typeof value === 'boolean') {
      return (
        <TableCell className={value ? 'text-green-600' : 'text-red-600'}>
          {getEmoji(value.toString())}
        </TableCell>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <TableCell>
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <span className="font-medium">{sentenceCase(key)}:</span>{' '}
              {typeof val === 'boolean' ? getEmoji(val.toString()) : val.toString()}
            </div>
          ))}
        </TableCell>
      );
    }
    if (typeof value === 'string') {
      return <TableCell>{value}</TableCell>;
    }
    return <TableCell>{value?.toString() ?? ''}</TableCell>;
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
            style={{ color: getToolColor(index) }}
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
      {selectedTools.length > 0 && (
        <>
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
