"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyMetrics from "@/components/company-metrics"
import FeatureComparison from "@/components/feature-comparison"
import PerformanceMetrics from "@/components/performance-metrics"
import SecurityComparison from "@/components/security-comparison"
import AlgorithmComparison from "@/components/algorithm-comparison"
import SearchCapabilities from "@/components/search-capabilities"
import AICapabilities from "@/components/ai-capabilities"
import { useState } from "react"
import { DatabaseFilter } from "@/components/database-filter"
import type { Database } from "@/types/database"

interface DatabaseComparisonToolProps {
  databases: Database[]
}

export function DatabaseComparisonTool({ databases }: DatabaseComparisonToolProps) {
  const [selectedDatabases, setSelectedDatabases] = useState(databases.map((db) => db.id))

  const filteredDatabases = databases.filter((db) => selectedDatabases.includes(db.id))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Select Databases to Compare</h2>
        <DatabaseFilter
          databases={databases}
          selectedDatabases={selectedDatabases}
          setSelectedDatabases={setSelectedDatabases}
        />
      </div>

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
    </div>
  )
} 