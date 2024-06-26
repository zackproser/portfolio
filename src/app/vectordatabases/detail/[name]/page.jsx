import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDatabase } from '../../../../lib/getDatabases';
import { getEmoji } from '../../../../lib/emojiMapping';

export default function DetailPage({ params }) {
  const database = getDatabase(params.name);

  if (!database) {
    return <div>Database not found</div>;
  }

  const renderSection = (title, data) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{getEmoji(title)} {title}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            {getEmoji(key)} {key}: {' '}
            {typeof value === 'boolean'
              ? (value ? getEmoji('yes') : getEmoji('no'))
              : (typeof value === 'string' ? `${value} ${getEmoji(value)}` : value.toString())}
          </p>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Container>
      <div className="mb-8">
        <Image src={database.logo} alt={`${database.name} logo`} width={200} height={200} className="mx-auto" />
        <h1 className="text-3xl font-bold text-center mt-4">{database.name}</h1>
      </div>
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
