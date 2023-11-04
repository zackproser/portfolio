'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { SimpleLayout } from '@/components/SimpleLayout';

export default function ModuleBrowser({
  course,
  segments,
  currentSegment,
}) {
  const CurrentSegment = dynamic(() =>
    import(`@/app/learn/courses/${course}/${currentSegment}/page.mdx`)
  );

  const renderStatusIcon = (index) => {
    if (index === currentSegment) {
      return <span className="text-blue-500">●</span>;
    } else if (segments[index].completed) {
      return <span className="text-green-500">✓</span>;
    }
    return null;
  };

  return (
    <SimpleLayout title={course} description={course}>
      <div className="flex">
        <div className="flex flex-col w-64 h-screen bg-white dark:bg-zinc-800 border-r overflow-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-semibold">{course}</h2>
          </div>
          <nav className="mt-2">
            {Array.isArray(segments) && segments.map((segment, index) => (
              <div key={index} className="px-4 py-2">
                <Link href={`/learn/${course}/${index}`}>
                  <a
                    className={`block rounded-md p-2 text-sm font-medium transition-transform transform ${index === currentSegment ? 'bg-zinc-300 dark:bg-zinc-500 border border-gray-400 shadow-inner translate-y-[-2px]' : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                  >
                    {renderStatusIcon(index)} {segment.title}
                  </a>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex-1 p-6">
          <div className="segment-content">
            <CurrentSegment />
          </div>
        </div>
      </div>
    </SimpleLayout >
  );
}

