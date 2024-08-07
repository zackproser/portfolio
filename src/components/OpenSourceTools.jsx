import React from 'react';
import Image from 'next/image'
import data from '../../schema/data/ai-assisted-developer-tools.json';

const OpenSourceTools = () => {
  const openSourceTools = data.tools.filter(tool => tool.open_source.client || tool.open_source.backend || tool.open_source.model);

  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4">🛠️ Open Source Tools Wakkaz</h2>
      <div className="space-y-4">
        {openSourceTools.map((tool, index) => (
          <div key={index} className="p-4 bg-emerald-800 dark:bg-zinc-800 rounded-lg shadow-lg text-white">
            <div className="flex items-center mb-2">
              <Image src={tool.icon} alt={`${tool.name} logo`} className="w-8 h-8 mr-2" />
              <strong className="text-lg">{tool.name}</strong>
            </div>
            <p>{tool.description}</p>
            <div className="mt-2">
              <strong>Category:</strong> {tool.category}
            </div>
            <div className="mt-2">
              <strong>Open Source Status:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Client: {tool.open_source.client ? 'Yes' : 'No'}</li>
                <li>Backend: {tool.open_source.backend ? 'Yes' : 'No'}</li>
                <li>Model: {tool.open_source.model ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div className="mt-2">
              <strong>Homepage:</strong> <a href={tool.homepage_link} className="text-blue-400" target="_blank" rel="noopener noreferrer">{tool.homepage_link}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenSourceTools;