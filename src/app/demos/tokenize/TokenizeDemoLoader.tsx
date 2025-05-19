'use client';

import dynamic from 'next/dynamic';

const TokenizationDemoClient = dynamic(() => import('./TokenizationDemoClient'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading Interactive Demo...</div>,
});

export default function TokenizeDemoLoader() {
  return <TokenizationDemoClient />;
} 