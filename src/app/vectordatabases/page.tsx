"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyMetrics from "@/components/company-metrics"
import FeatureComparison from "@/components/feature-comparison"
import PerformanceMetrics from "@/components/performance-metrics"
import SecurityComparison from "@/components/security-comparison"
import AlgorithmComparison from "@/components/algorithm-comparison"
import SearchCapabilities from "@/components/search-capabilities"
import AICapabilities from "@/components/ai-capabilities"
import { databases } from "@/data/databases"
import { useState } from "react"
import { DatabaseFilter } from "@/components/database-filter"
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Vector Database Comparison
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Compare leading vector databases across company metrics, features, performance, security, algorithms, and
          capabilities
        </p>

        <DatabaseComparisonTool />
      </div>
      {/* Add the chat interface */}
      <ChatInterface />
    </main>
  )
}

function DatabaseComparisonTool() {
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
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="ai">AI Capabilities</TabsTrigger>
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
