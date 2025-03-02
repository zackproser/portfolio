'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

const DynamicFreeChapters = dynamic(() => import('./FreeChapters').then(mod => mod.FreeChapters), { ssr: false });

interface FreeChaptersWrapperProps {
  title: string;
  productSlug: string;
}

const FreeChaptersWrapper = ({ title, productSlug }: FreeChaptersWrapperProps) => {
  return (
    <SessionProvider>
      <DynamicFreeChapters title={title} productSlug={productSlug} />
    </SessionProvider>
  );
};

export default FreeChaptersWrapper; 