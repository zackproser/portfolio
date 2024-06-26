'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDatabases } from '@/lib/getDatabases';
import { getEmoji } from '@/lib/emojiMapping';
import { getLogoById } from '@/lib/logoImports';
import SearchFilter from '@/components/SearchFilter';

export default function GalleryPage() {
  const allDatabases = getDatabases();
  const [filteredDatabases, setFilteredDatabases] = useState(allDatabases);

  const handleFilter = (filtered) => {
    setFilteredDatabases(filtered);
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4">Vector Database Gallery</h1>
      <SearchFilter databases={allDatabases} onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDatabases.map((db, index) => {
          const logo = getLogoById(db.logoId);
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                {logo && (
                  <Image
                    src={logo}
                    alt={`${db.name} logo`}
                    width={50}
                    height={50}
                    className="mb-2"
                  />
                )}
                <CardTitle>{db.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-2">{db.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {db.deployment.cloud && <Badge variant="outline">{getEmoji('cloud')} Cloud</Badge>}
                  {db.deployment.local && <Badge variant="outline">{getEmoji('local')} Local</Badge>}
                  {db.deployment.on_premises && <Badge variant="outline">{getEmoji('on_premises')} On-Premises</Badge>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    {getEmoji('scalability')} Scalability: {Object.entries(db.scalability).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                  </p>
                  <p className="text-sm">
                    {getEmoji('vector_similarity_search')} Metrics: {db.vector_similarity_search.distance_metrics.join(', ')}
                  </p>
                  <p className="text-sm">
                    {getEmoji('integration_api')} SDKs: {db.integration_api.sdks.join(', ')}
                  </p>
                  <p className="text-sm">
                    {getEmoji('pricing')} Pricing: {Object.entries(db.pricing).filter(([_, v]) => v).map(([k]) => k.replace('_', ' ')).join(', ')}
                  </p>
                </div>
              </CardContent>
              <div className="p-4 mt-auto">
                <Link href={`/vectordatabases/compare?dbs=${db.name}`} className="text-blue-500 hover:underline mr-4">
                  Compare
                </Link>
                <Link href={`/vectordatabases/detail/${db.name}`} className="text-blue-500 hover:underline">
                  Details
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
