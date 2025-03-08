"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyMetrics from "@/components/company-metrics"
import FeatureComparison from "@/components/feature-comparison"
import PerformanceMetrics from "@/components/performance-metrics"
import SecurityComparison from "@/components/security-comparison"
import AlgorithmComparison from "@/components/algorithm-comparison"
import SearchCapabilities from "@/components/search-capabilities"
import AICapabilities from "@/components/ai-capabilities"
import { useState, useEffect } from "react"
import { DatabaseFilter } from "@/components/database-filter"
import type { Database } from "@/types/database"

interface DatabaseComparisonToolProps {
  databases: Database[]
}

export function DatabaseComparisonTool({ databases }: DatabaseComparisonToolProps) {
  // Log for debugging
  console.log(`DatabaseComparisonTool received ${databases.length} databases`);
  
  // Ensure all databases have valid IDs
  const databasesWithValidIds = databases.map(db => {
    if (!db.id) {
      console.warn(`Database ${db.name} has no ID, generating one`);
      return {
        ...db,
        id: db.name.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return db;
  });
  
  // Track selected databases
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  
  // Initialize selected databases whenever the databases array changes
  useEffect(() => {
    if (databasesWithValidIds.length > 0 && selectedDatabases.length === 0) {
      console.log(`Initializing with ${databasesWithValidIds.length} databases`);
      
      // Initialize with all database IDs
      const allIds = databasesWithValidIds.map(db => db.id);
      setSelectedDatabases(allIds);
      
      console.log(`Selected ${allIds.length} databases for initial state`);
    }
  }, [databasesWithValidIds, selectedDatabases.length]);
  
  // Filter databases based on selected IDs
  const filteredDatabases = databasesWithValidIds.filter(db => 
    selectedDatabases.includes(db.id)
  );
  
  // Debug information
  useEffect(() => {
    console.log(`Total available databases: ${databasesWithValidIds.length}`);
    console.log(`Selected database IDs: ${selectedDatabases.length}`);
    console.log(`Filtered databases: ${filteredDatabases.length}`);
    
    // Check for duplicates
    const idCounts: Record<string, number> = {};
    databasesWithValidIds.forEach(db => {
      idCounts[db.id] = (idCounts[db.id] || 0) + 1;
    });
    
    Object.entries(idCounts).forEach(([id, count]) => {
      if (count > 1) {
        console.warn(`Duplicate database ID found: ${id} appears ${count} times`);
      }
    });
  }, [databasesWithValidIds, selectedDatabases.length, filteredDatabases.length]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Select Databases to Compare</h2>
        {databasesWithValidIds.length > 0 ? (
          <DatabaseFilter
            databases={databasesWithValidIds}
            selectedDatabases={selectedDatabases}
            setSelectedDatabases={setSelectedDatabases}
          />
        ) : (
          <div className="text-amber-500 p-4 bg-amber-50 rounded-md">
            Loading databases...
          </div>
        )}
      </div>

      {filteredDatabases.length > 0 ? (
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="company" key="company">Company</TabsTrigger>
            <TabsTrigger value="features" key="features">Features</TabsTrigger>
            <TabsTrigger value="performance" key="performance">Performance</TabsTrigger>
            <TabsTrigger value="security" key="security">Security</TabsTrigger>
            <TabsTrigger value="algorithms" key="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="search" key="search">Search</TabsTrigger>
            <TabsTrigger value="ai" key="ai">AI Capabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-0">
            <CompanyMetrics databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            <FeatureComparison databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <PerformanceMetrics databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecurityComparison databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="algorithms" className="mt-0">
            <AlgorithmComparison databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="search" className="mt-0">
            <SearchCapabilities databases={filteredDatabases} />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <AICapabilities databases={filteredDatabases} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-6 text-center bg-gray-50 dark:bg-slate-700 rounded-md">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No databases selected. Please select at least one database to compare.
          </p>
        </div>
      )}
    </div>
  )
} 