import React from 'react';
import Image from 'next/image';
import { getLogoById } from '@/lib/logoImports';

const IDESupportBlade = ({ ideSupport }) => {
  if (!ideSupport || Object.keys(ideSupport).length === 0) {
    return <div className="text-center p-4">No IDE support information provided.</div>;
  }

  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4">Supported IDEs / editors</h2>
      <div className="flex space-x-4">
        {Object.entries(ideSupport).map(([ide, isSupported]) => {
          const logo = getLogoById(ide.toLowerCase());
          return (
            <div
              key={ide}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isSupported ? 'bg-green-100 shadow-lg' : 'bg-gray-200'
              }`}
            >
              <Image
                src={logo}
                alt={`${ide} logo`}
                width={60}
                height={60}
                className={`rounded-full ${isSupported ? 'glow' : 'grayscale'}`}
              />
              <span className="mt-2 text-sm dark:text-zinc-800">{ide}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IDESupportBlade;
