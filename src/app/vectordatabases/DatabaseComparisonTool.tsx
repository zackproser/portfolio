"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyMetrics from "@/components/company-metrics"
import FeatureComparison from "@/components/feature-comparison"
import PerformanceMetrics from "@/components/performance-metrics"
import SecurityComparison from "@/components/security-comparison"
import AlgorithmComparison from "@/components/algorithm-comparison"
import SearchCapabilities from "@/components/search-capabilities"
import AICapabilities from "@/components/ai-capabilities"
import { useState, useEffect, useCallback } from "react"
import { DatabaseFilter } from "@/components/database-filter"
import type { Database } from "@/types/database"
import { InfoIcon } from "lucide-react"

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
  
  // Custom handler for database selection with direct state updates
  const handleDatabaseSelection = useCallback((ids: string[]) => {
    console.log('Setting selected databases to:', ids);
    // Force a new array reference to ensure state updates
    setSelectedDatabases([...ids]);
  }, []);
  
  // Initialize selected databases whenever the databases array changes
  useEffect(() => {
    if (databasesWithValidIds.length > 0 && selectedDatabases.length === 0) {
      console.log(`Initializing with ${databasesWithValidIds.length} databases`);
      
      // Initialize with all database IDs
      const allIds = databasesWithValidIds.map(db => db.id);
      setSelectedDatabases([...allIds]);
      
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
    console.log(`Selected IDs: ${selectedDatabases.join(', ')}`);
    console.log(`Filtered databases: ${filteredDatabases.length}`);
    console.log(`Filtered names: ${filteredDatabases.map(db => db.name).join(', ')}`);
    
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
  }, [databasesWithValidIds, selectedDatabases, filteredDatabases]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Select Databases to Compare</h2>
        {databasesWithValidIds.length > 0 ? (
          <>
            <div className="mb-4 flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 rounded-md">
              <InfoIcon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Click on a database in the dropdown below to select or deselect it. Use &quot;Select All&quot; or &quot;Clear All&quot; to quickly manage your selection.
              </p>
            </div>
            <DatabaseFilter
              databases={databasesWithValidIds}
              selectedDatabases={selectedDatabases}
              setSelectedDatabases={handleDatabaseSelection}
            />
          </>
        ) : (
          <div className="text-amber-500 p-4 bg-amber-50 rounded-md">
            Loading databases...
          </div>
        )}
      </div>

      {filteredDatabases.length > 0 ? (
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8 bg-slate-100 dark:bg-slate-700">
            <TabsTrigger value="company" key="company" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Company</TabsTrigger>
            <TabsTrigger value="features" key="features" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Features</TabsTrigger>
            <TabsTrigger value="performance" key="performance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Performance</TabsTrigger>
            <TabsTrigger value="security" key="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Security</TabsTrigger>
            <TabsTrigger value="algorithms" key="algorithms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Algorithms</TabsTrigger>
            <TabsTrigger value="search" key="search" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Search</TabsTrigger>
            <TabsTrigger value="ai" key="ai" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">AI Capabilities</TabsTrigger>
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