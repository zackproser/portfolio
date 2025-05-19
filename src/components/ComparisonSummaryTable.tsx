import React from 'react';
import type { Database } from '@/types/database'; // Adjust path if necessary
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; // Assuming you have these
import { Check, X } from 'lucide-react'; // For boolean display

interface ComparisonSummaryTableProps {
  db1: Database | any;
  db2: Database | any;
}

const renderFeature = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? <Check className="text-green-500" /> : <X className="text-red-500" />;
  }
  if (value === undefined || value === null) {
    return <span className="text-gray-400">-</span>;
  }
  return String(value);
};

export const ComparisonSummaryTable: React.FC<ComparisonSummaryTableProps> = ({ db1, db2 }) => {
  // Try to detect if we're dealing with vector databases or tools
  const isVectorDb = !!(db1.company || db1.features || db1.performance || db1.aiCapabilities);
  
  // Different summary features based on item type
  const vectorDbFeatures = [
    {
      label: 'Founded Year',
      accessor: (db: any) => db.company?.founded,
    },
    {
      label: 'Serverless Option',
      accessor: (db: any) => db.features?.serverless,
    },
    {
      label: 'Query Latency (ms)',
      accessor: (db: any) => db.performance?.queryLatencyMs,
    },
    {
      label: 'LLM Integration Score',
      accessor: (db: any) => db.aiCapabilities?.scores?.llmIntegration,
    },
    {
      label: 'RAG Support',
      accessor: (db: any) => db.aiCapabilities?.features?.ragSupport,
    },
  ];

  const toolFeatures = [
    {
      label: 'Open Source',
      accessor: (tool: any) => tool.open_source?.client || tool.open_source?.backend || tool.open_source?.model,
    },
    {
      label: 'Free Tier',
      accessor: (tool: any) => tool.free_tier,
    },
    {
      label: 'Founded Year',
      accessor: (tool: any) => tool.business_info?.founding_year,
    },
    {
      label: 'VS Code Support',
      accessor: (tool: any) => tool.ide_support?.vs_code,
    },
    {
      label: 'Local Model Support',
      accessor: (tool: any) => tool.supports_local_model,
    },
  ];

  // Choose which features to display
  const summaryFeatures = isVectorDb ? vectorDbFeatures : toolFeatures;

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-3">At-a-Glance Comparison</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead>{db1.name}</TableHead>
            <TableHead>{db2.name}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaryFeatures.map((feature) => (
            <TableRow key={feature.label}>
              <TableCell className="font-medium">{feature.label}</TableCell>
              <TableCell>{renderFeature(feature.accessor(db1))}</TableCell>
              <TableCell>{renderFeature(feature.accessor(db2))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 