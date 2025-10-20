'use client';

interface QuickAnswerProps {
  children: React.ReactNode;
}

/**
 * Quick Answer component - displays persona-specific recommendations
 * Can be used with or without children for flexibility
 */
export function QuickAnswer({ children }: QuickAnswerProps) {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Answer
      </h3>
      <div className="text-blue-800 space-y-2 prose prose-blue max-w-none">
        {children}
      </div>
    </div>
  );
}
