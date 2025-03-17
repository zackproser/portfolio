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
import NewsletterWrapper from "@/components/NewsletterWrapper"
import { track } from "@vercel/analytics"

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
  // Track user engagement with the tool
  const [hasEngaged, setHasEngaged] = useState<boolean>(false);
  // Track active tab to determine engagement level
  const [activeTab, setActiveTab] = useState<string>("company");
  // Track whether to show the prominent newsletter
  const [showProminentNewsletter, setShowProminentNewsletter] = useState<boolean>(false);
  
  // Custom handler for database selection with direct state updates
  const handleDatabaseSelection = useCallback((ids: string[]) => {
    console.log('Setting selected databases to:', ids);
    // Force a new array reference to ensure state updates
    setSelectedDatabases([...ids]);
    
    // Mark that the user has engaged with the tool
    if (!hasEngaged && ids.length > 0) {
      setHasEngaged(true);
      track('vector_db_tool_engagement', { action: 'database_selection' });
    }
  }, [hasEngaged]);
  
  // Handle tab changes to track deeper engagement
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track when user explores beyond the first tab
    if (value !== "company" && !hasEngaged) {
      setHasEngaged(true);
      track('vector_db_tool_engagement', { action: 'tab_exploration', tab: value });
    }
    
    // Show the prominent newsletter after user has explored tabs
    // Use a different trigger than just checking the tab value
    if (!showProminentNewsletter && 
        ((value === "performance" || value === "algorithms" || value === "ai") || 
        (hasEngaged && ['features', 'security', 'search'].includes(value)))) {
      // Delay showing the newsletter slightly to let the user see the tab content first
      setTimeout(() => {
        setShowProminentNewsletter(true);
        track('vector_db_tool_newsletter', { action: 'newsletter_shown', tab: value });
      }, 3000);
    }
  };
  
  // Add a scroll tracking effect to show the newsletter after scrolling
  useEffect(() => {
    if (hasEngaged && !showProminentNewsletter) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        // Show newsletter after scrolling down the page
        if (scrollPosition > 300) {
          setShowProminentNewsletter(true);
          track('vector_db_tool_newsletter', { action: 'newsletter_shown', trigger: 'scroll' });
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasEngaged, showProminentNewsletter]);
  
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

      {/* Prominent newsletter that appears after engagement - simplified to just use the component directly */}
      {showProminentNewsletter && (
        <div className="mb-6 relative">
          <button 
            className="absolute top-2 right-2 z-10 text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            onClick={() => setShowProminentNewsletter(false)}
            aria-label="Close newsletter signup"
          >
            ✕
          </button>
          <NewsletterWrapper 
            title="Join our Vector Database Community" 
            body="Be the first to know about new comparisons, benchmarks, and expert insights on vector databases."
            successMessage="🚀 Welcome to the community! You&apos;ll receive our next vector database insights directly to your inbox."
          />
        </div>
      )}

      {filteredDatabases.length > 0 ? (
        <Tabs defaultValue="company" className="w-full" onValueChange={handleTabChange}>
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
      
      {/* Bottom newsletter - always visible */}
      <div className="mt-8">
        <NewsletterWrapper 
          title="Stay updated on Vector Database innovations" 
          body="Subscribe to receive comparisons, benchmarks, and expert insights on vector databases directly to your inbox."
          successMessage="🎉 Thank you for subscribing! You'll receive exclusive vector database insights, benchmarks, and early access to new comparison features."
        />
      </div>
    </div>
  )
} 