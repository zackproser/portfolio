'use client';

import dynamic from 'next/dynamic';

const DynamicFreeChapters = dynamic(() => import('./FreeChapters').then(mod => mod.FreeChapters), { ssr: false });

interface FreeChaptersWrapperProps {
  title: string;
  productSlug: string;
}

const FreeChaptersWrapper = ({ title, productSlug }: FreeChaptersWrapperProps) => {
  return (
    <DynamicFreeChapters title={title} productSlug={productSlug} />
  );
};

export default FreeChaptersWrapper; 