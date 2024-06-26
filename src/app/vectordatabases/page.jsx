'use client'

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDatabases } from '../../lib/getDatabases';

export default function GalleryPage() {
  const databases = getDatabases();

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Vector Database Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databases.map((db, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{db.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Deployment: {Object.entries(db.deployment).filter(([_, v]) => v).map(([k]) => k).join(', ')}</p>
              <p>Scalability: {Object.entries(db.scalability).filter(([_, v]) => v).map(([k]) => k).join(', ')}</p>
              <div className="mt-4">
                <Link href={`/compare?dbs=${db.name}`} className="text-blue-500 hover:underline">
                  Compare
                </Link>
                <Link href={`/detail/${db.name}`} className="ml-4 text-blue-500 hover:underline">
                  Details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
