import React from 'react';
import Image from 'next/image';
import { getLogoById } from '@/lib/logoImports';

const LanguageSupportBlade = ({ languageSupport }) => {
  if (!languageSupport || Object.keys(languageSupport).length === 0) {
    return <div className="text-center p-4">No language support information provided.</div>;
  }

  // Count supported languages
  const supportedCount = Object.values(languageSupport).filter(Boolean).length;
  const totalLanguages = Object.keys(languageSupport).length;
  const supportPercentage = Math.round((supportedCount / totalLanguages) * 100);

  return (
    <div className="mt-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span>Multi-Language Development Support</span>
        <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-xs px-2 py-1 rounded-full">
          {supportedCount} languages
        </span>
      </h2>
      
      <div className="p-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            Accelerate your development across multiple programming languages to build integrated systems with consistent patterns.
          </p>
        </div>
        
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span>Language Coverage</span>
            <span className="font-medium">{supportPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${supportPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(languageSupport).map(([language, isSupported]) => {
            const logo = getLogoById(language.toLowerCase());
            const formattedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
            
            return (
              <div
                key={language}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  isSupported 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700' 
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 relative mb-2 ${isSupported ? '' : 'grayscale opacity-50'}`}>
                  <Image
                    src={logo}
                    alt={`${formattedLanguage} logo`}
                    width={48}
                    height={48}
                    className="rounded-md object-contain"
                  />
                  {isSupported && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formattedLanguage}
                </span>
              </div>
            );
          })}
        </div>
        
        {supportedCount > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2">Your Team Will Benefit From:</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Write code patterns that work consistently across {supportedCount} languages</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Reduce context-switching between different development environments</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Accelerate polyglot architecture implementation by 40%</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSupportBlade;