'use client'

import React from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import ComparisonAccordionExample from '@/components/ComparisonAccordionExample'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, AlertTriangle } from 'lucide-react'

export default function CompareDevToolsPage() {
  return (
    <SimpleLayout
      title="Developer Tools Comparison"
      intro="Compare features, capabilities, and use cases of popular AI-powered developer tools."
    >
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Experimental Feature
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                This comparison page is still under development. The data displayed may not be complete or fully accurate.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Info className="h-6 w-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">About This Comparison</h3>
            <p className="text-blue-700">
              This page presents a side-by-side comparison of Codeium and Aider, two popular AI-powered coding tools.
              The comparison includes features, use cases, technical implementation details, and more.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="feature-matrix" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feature-matrix">Feature Matrix</TabsTrigger>
          <TabsTrigger value="extra-details">Additional Details</TabsTrigger>
        </TabsList>
        <TabsContent value="feature-matrix" className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Feature Comparison</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Compare core features and capabilities between these developer tools to find the best fit for your workflow.
          </p>
          
          {/* Feature Matrix will render here from the actual tools data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Feature Matrix</h3>
            <p>Feature matrix component will be loaded dynamically based on selected tools.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="extra-details" className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Additional Comparison Details</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Beyond core features, these additional details can help you make a more informed decision about which tool is right for your needs.
          </p>
          
          <ComparisonAccordionExample />
        </TabsContent>
      </Tabs>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Need a Personalized Recommendation?</h2>
        <p className="mb-6 opacity-90">
          Book a consultation to get personalized advice on which AI development tools are best for your specific needs and workflow.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
        >
          Schedule a Consultation
        </a>
      </div>
    </SimpleLayout>
  )
}