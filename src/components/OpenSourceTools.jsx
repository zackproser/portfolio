import React from 'react';
import Image from 'next/image'
import data from '../../schema/data/ai-assisted-developer-tools.json';

const OpenSourceTools = () => {
  const openSourceTools = data.tools.filter(tool => tool.open_source.client || tool.open_source.backend || tool.open_source.model);

  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">🛠️</span>
        <span>Enterprise-Grade Open Source AI Tools</span>
        <span className="ml-2 bg-emerald-100 dark:bg-emerald-900 text-xs px-2 py-1 rounded-full">{openSourceTools.length} tools</span>
      </h2>
      
      <div className="space-y-6">
        {openSourceTools.map((tool, index) => (
          <div key={index} className="p-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border-l-4 border-emerald-500 transition-all hover:shadow-xl">
            <div className="flex items-center mb-3">
              <Image src={tool.icon} alt={`${tool.name} logo`} width={32} height={32} className="w-8 h-8 mr-3" />
              <strong className="text-lg">{tool.name}</strong>
            </div>
            
            <p className="mb-3 text-gray-700 dark:text-gray-300">{tool.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center">
                <span className="text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-1 rounded mr-2">Category</span>
                <span>{tool.category}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-1 rounded mr-2">Creator</span>
                <span>{tool.creator}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="font-medium mb-2">Open Source Components:</div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${tool.open_source.client ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  Client {tool.open_source.client ? '✓' : '✗'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${tool.open_source.backend ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  Backend {tool.open_source.backend ? '✓' : '✗'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${tool.open_source.model ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  Model {tool.open_source.model ? '✓' : '✗'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <a href={tool.homepage_link} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                <span>Visit Homepage</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {tool.review_link && (
                <a href={tool.review_link} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                  Read Review →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white shadow-lg">
        <h3 className="text-xl font-bold mb-2">Ready to lead the AI revolution?</h3>
        <p className="mb-4">Accelerate your team&apos;s expertise and business outcomes with proven AI architectures.</p>
        <a 
          href="#consultation" 
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Schedule Your Transformation Consultation →
        </a>
      </div>
    </div>
  );
};

export default OpenSourceTools;