'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ComparisonForm({ databases, selectedDbs }) {
  const router = useRouter();

  const handleDbSelect = (dbName) => {
    let newSelectedDbs;
    if (selectedDbs.includes(dbName)) {
      newSelectedDbs = selectedDbs.filter(name => name !== dbName);
      track('database_deselected', { database: dbName });
    } else if (selectedDbs.length < 3) {
      newSelectedDbs = [...selectedDbs, dbName];
      track('database_selected', { database: dbName });
    } else {
      return;
    }
    router.push(`/vectordatabases/compare?dbs=${newSelectedDbs.join(',')}`, { scroll: false });
  };

  return (
    <div className="mb-4">
      <Select onValueChange={handleDbSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a database" />
        </SelectTrigger>
        <SelectContent>
          {databases.map(db => (
            <SelectItem key={db.name} value={db.name}>{db.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
