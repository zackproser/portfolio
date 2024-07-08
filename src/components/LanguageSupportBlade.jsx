import React from 'react';
import Image from 'next/image';
import { getLogoById } from '@/lib/logoImports';

const LanguageSupportBlade = ({ languageSupport }) => {
  if (!languageSupport || Object.keys(languageSupport).length === 0) {
    return <div className="text-center p-4">No language support information provided.</div>;
  }

  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-bold mb-4">Supported Languages</h2>
      <div className="flex space-x-4">
        {Object.entries(languageSupport).map(([language, isSupported]) => {
          const logo = getLogoById(language.toLowerCase());
          return (
            <div
              key={language}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isSupported ? 'bg-green-100 shadow-lg' : 'bg-gray-200'
              }`}
            >
              <Image
                src={logo}
                alt={`${language} logo`}
                width={60}
                height={60}
                className={`rounded-full ${isSupported ? 'glow' : 'grayscale'}`}
              />
              <span className="mt-2 text-sm dark:text-zinc-800">{language}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSupportBlade;