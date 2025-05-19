import React from 'react';
import type { Database } from '@/types/database'; // Adjust path if necessary
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; // Assuming you have these
import { Check, X } from 'lucide-react'; // For boolean display

interface ComparisonSummaryTableProps {
  db1: Database;
  db2: Database;
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
  const summaryFeatures = [
    {
      label: 'Founded Year',
      accessor: (db: Database) => db.company?.founded,
    },
    {
      label: 'Serverless Option',
      accessor: (db: Database) => db.features?.serverless,
    },
    {
      label: 'Query Latency (ms)',
      accessor: (db: Database) => db.performance?.queryLatencyMs,
    },
    {
      label: 'LLM Integration Score',
      accessor: (db: Database) => db.aiCapabilities?.scores?.llmIntegration,
    },
    {
      label: 'RAG Support',
      accessor: (db: Database) => db.aiCapabilities?.features?.ragSupport,
    },
  ];

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