import React from 'react';

interface OpenSourceProps {
  openSource: {
    client: boolean;
    backend: boolean;
    model: boolean;
  };
}

const OpenSourceStatus: React.FC<OpenSourceProps> = ({ openSource }) => {
  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4">🛠️ Open Source Status</h2>
      <div className="p-4 bg-emerald-500 dark:bg-zinc-800 rounded-lg shadow-lg text-white">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.client ? 'bg-green-300' : 'bg-red-500'}`}></span>
              <span className="text-white">Client: {openSource.client ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.backend ? 'bg-green-300' : 'bg-red-500'}`}></span>
              <span className="text-white">Backend: {openSource.backend ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.model ? 'bg-green-300' : 'bg-red-500'}`}></span>
              <span className="text-white">Model: {openSource.model ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceStatus;