import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDatabases } from '../../lib/getDatabases';
import { getEmoji } from '../../lib/emojiMapping';
import { getLogoById } from '../../lib/logoImports';

export default function GalleryPage() {
  const databases = getDatabases();

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4">Vector Database Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databases.map((db, index) => {
          const logo = getLogoById(db.logoId);
          return (
            <Card key={index}>
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
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{db.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {db.deployment.cloud && <Badge>{getEmoji('cloud')} Cloud</Badge>}
                  {db.deployment.local && <Badge>{getEmoji('local')} Local</Badge>}
                  {db.deployment.on_premises && <Badge>{getEmoji('on_premises')} On-Premises</Badge>}
                </div>
                <p className="text-sm mb-1">
                  {getEmoji('scalability')} Scalability: {Object.entries(db.scalability).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                </p>
                <p className="text-sm mb-1">
                  {getEmoji('vector_similarity_search')} Distance Metrics: {db.vector_similarity_search.distance_metrics.join(', ')}
                </p>
                <div className="mt-4">
                  <Link href={`/vectordatabases/compare?dbs=${db.name}`} className="text-blue-500 hover:underline mr-4">
                    Compare
                  </Link>
                  <Link href={`/vectordatabases/detail/${db.name}`} className="text-blue-500 hover:underline">
                    Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
