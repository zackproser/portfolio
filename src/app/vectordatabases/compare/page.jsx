'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ComparisonForm from '@/components/ComparisonForm';
import { getDatabases } from '../../../lib/getDatabases';

export default function ComparePage({ searchParams }) {
  const databases = getDatabases();
  const selectedDbs = searchParams.dbs ? searchParams.dbs.split(',') : [];

  const renderFeatureComparison = (feature) => (
    <TableRow key={feature}>
      <TableCell>{feature}</TableCell>
      {selectedDbs.map(dbName => {
        const db = databases.find(d => d.name === dbName);
        return (
          <TableCell key={dbName}>
            {typeof db[feature] === 'object'
              ? Object.entries(db[feature]).filter(([_, v]) => v).map(([k]) => k).join(', ')
              : String(db[feature])}
          </TableCell>
        );
      })}
    </TableRow>
  );

  const chartData = selectedDbs.map(dbName => {
    const db = databases.find(d => d.name === dbName);
    return {
      name: db.name,
      features: Object.values(db).filter(v => typeof v === 'object').reduce((acc, curr) => acc + Object.values(curr).filter(Boolean).length, 0)
    };
  });

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Vector Database Comparison</h1>

      <ComparisonForm databases={databases} selectedDbs={selectedDbs} />

      {selectedDbs.length > 0 && (
        <>
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
              {Object.keys(databases[0]).filter(key => key !== 'name').map(renderFeatureComparison)}
            </TableBody>
          </Table>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Feature Comparison Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="features" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Container>
  );
}
