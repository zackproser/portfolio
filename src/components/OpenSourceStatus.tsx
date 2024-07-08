import React from 'react';

const OpenSourceStatus = ({ openSource }) => {
  return (
    <div className="mt-8 mb-8 p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🛠️ Open Source Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.client ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-white">Client: {openSource.client ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.backend ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-white">Backend: {openSource.backend ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center">
          <span className={`inline-block w-4 h-4 rounded-full mr-2 ${openSource.model ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-white">Model: {openSource.model ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceStatus;