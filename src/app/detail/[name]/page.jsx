'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDatabase } from '../../../lib/getDatabases';

export default function DetailPage({ params }) {
  const database = getDatabase(params.name);

  console.log(`database: %o`, database);

  if (!database) {
    return <div>Database not found</div>;
  }

  const renderSection = (title, data) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>{key}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}</p>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">{database.name} Details</h1>
      <h1>{database.deployment.local}</h1>
      {renderSection('Deployment', database.deployment)}
      {renderSection('Scalability', database.scalability)}
      {renderSection('Data Management', database.data_management)}
      {renderSection('Vector Similarity Search', database.vector_similarity_search)}
      {renderSection('Integration API', database.integration_api)}
      {renderSection('Security', database.security)}
      {renderSection('Community & Ecosystem', database.community_ecosystem)}
      {renderSection('Pricing', database.pricing)}
      {renderSection('Additional Features', database.additional_features)}
    </Container>
  );
}
