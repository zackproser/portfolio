'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { track } from '@vercel/analytics';
import { SimpleLayout } from '@/components/SimpleLayout'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDatabases } from '@/lib/getDatabases';
import { getLogoById } from '@/lib/logoImports';
import SearchFilter from '@/components/SearchFilter';
import { Button } from "@/components/ui/button";
import { DiffIcon, SearchIcon } from "lucide-react";

export default function GalleryPage() {
  const router = useRouter();
  const allDatabases = getDatabases();
  const [filteredDatabases, setFilteredDatabases] = useState(allDatabases);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filtered, term) => {
    setFilteredDatabases(filtered);
    setSearchTerm(term);
  };

  const handleReset = () => {
    setFilteredDatabases(allDatabases);
    setSearchTerm('');
  };

  const handleCompareClick = (dbName) => {
    track('compare_click', { database: dbName });
    router.push(`/vectordatabases/compare?dbs=${encodeURIComponent(dbName)}`);
  };

  const handleDetailsClick = (dbName) => {
    track('details_click', { database: dbName });
    router.push(`/vectordatabases/detail/${encodeURIComponent(dbName)}`);
  };

  return (
    <SimpleLayout
      title="Vector Databases"
      intro="Explore and compare vector databases"
    >
      <SearchFilter 
        databases={allDatabases} 
        onFilter={handleFilter} 
        onReset={handleReset}
        searchTerm={searchTerm}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDatabases.map((db, index) => {
          const logo = getLogoById(db.logoId);
          return (
            <Card key={index} className="flex flex-col dark:bg-zinc-800">
              <CardHeader className="flex flex-row items-center space-x-4">
                {logo && (
                  <Image
                    src={logo}
                    alt={`${db.name} logo`}
                    width={40}
                    height={40}
                  />
                )}
                <CardTitle>{db.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-zinc-400">{db.description}</p>
              </CardContent>
              <div className="p-4 mt-auto flex justify-between">
                <Button
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleCompareClick(db.name)}
                >
                  <DiffIcon className="w-4 h-4 mr-2" />
                  Compare
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => handleDetailsClick(db.name)}
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </SimpleLayout>
  );
}
