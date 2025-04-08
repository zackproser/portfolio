import React from 'react';

interface OpenSourceProps {
  openSource: {
    client: boolean;
    backend: boolean;
    model: boolean;
  };
}

const OpenSourceStatus: React.FC<OpenSourceProps> = ({ openSource }) => {
  // Calculate how much of the stack is open source
  const openSourceCount = Object.values(openSource).filter(Boolean).length;
  const totalComponents = Object.values(openSource).length;
  const openSourcePercentage = Math.round((openSourceCount / totalComponents) * 100);
  
  return (
    <div className="mt-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Open Source Architecture</span>
        <span className="ml-2 bg-emerald-100 dark:bg-emerald-900 text-xs px-2 py-1 rounded-full">
          {openSourcePercentage}% open
        </span>
      </h2>
      
      <div className="p-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            Open source components allow for greater customization, security auditing, and community-driven improvements.
          </p>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full" 
              style={{ width: `${openSourcePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg flex flex-col items-center ${openSource.client ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${openSource.client ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-center">Client</h3>
            <div className={`mt-1 text-sm ${openSource.client ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {openSource.client ? 'Open Source' : 'Proprietary'}
            </div>
            {openSource.client && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 text-center">
                Customize and extend the user interface
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg flex flex-col items-center ${openSource.backend ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${openSource.backend ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="font-medium text-center">Backend</h3>
            <div className={`mt-1 text-sm ${openSource.backend ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {openSource.backend ? 'Open Source' : 'Proprietary'}
            </div>
            {openSource.backend && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 text-center">
                Deploy on your infrastructure with full control
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg flex flex-col items-center ${openSource.model ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${openSource.model ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
              </svg>
            </div>
            <h3 className="font-medium text-center">Model</h3>
            <div className={`mt-1 text-sm ${openSource.model ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {openSource.model ? 'Open Source' : 'Proprietary'}
            </div>
            {openSource.model && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 text-center">
                Fine-tune the AI model for your specific needs
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-gray-700 dark:text-gray-300">Business Impact:</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {openSourcePercentage > 66 ? 
                'Maximum flexibility and customization potential' : 
                openSourcePercentage > 33 ? 
                  'Moderate flexibility with some vendor lock-in' : 
                  'Limited customization with significant vendor dependency'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceStatus;