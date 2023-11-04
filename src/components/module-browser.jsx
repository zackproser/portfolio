'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { SimpleLayout } from '@/components/SimpleLayout';

export default function ModuleBrowser({
  course,
  segments,
  currentSegment
}) {

  console.log(`ModuleBrowser: ${course}, ${segments}, ${currentSegment}`);

  const CurrentSegment = dynamic(() =>
    import(`@/app/learn/courses/${course}/${currentSegment}/page.mdx`)
  );

  const renderStatusIcon = (index) => {
    if (index === currentSegment) {
      // Active segment indicator
      return <span className="text-blue-500">●</span>;
    } else if (segments[index].completed) {
      // Completed segment indicator
      return <span className="text-green-500">✓</span>;
    }
    return null;
  };

  return (
    <SimpleLayout title={course} description={course}>
      <div className="flex flex-col w-64 h-screen bg-white dark:bg-zinc-800 border-r overflow-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Git Basics</h2>
          <svg
            className=" w-6 h-6 text-zinc-500 dark:text-zinc-400"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </div>
        <nav className="mt-2">
          {Array.isArray(segments) && segments.map((segment, index) => (
            <div key={index} className="px-4 py-2">
              <Link
                className={`block rounded-md p-2 text-sm font-medium ${index === currentSegment ? 'bg-zinc-300 dark:bg-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}
                href={`/learn/${course}/${index}`} />
              {renderStatusIcon(index)} {segment.title}
            </div>
          ))}
        </nav>
        <div className="segment-content">
          <CurrentSegment />
        </div>
      </div>
    </SimpleLayout >
  );
}
