import React from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { notFound } from 'next/navigation'
import { ProductLanding, generateMetadata as productMetadata } from '@/components/ProductLanding'
import {
  getAllPurchasableContent,
  getProductByDirectorySlug,
  getContentSlugs
} from '@/lib/content-handlers'
import { Content } from '@/types'
import path from 'path';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Export the generateMetadata function for this page
export const generateMetadata = productMetadata;

export default async function ProductPage({ 
  params,
  searchParams 
}: Props) {
  const resolvedParams = await params;
  const product = await getProductByDirectorySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // The product is already in the format expected by ProductLanding
  return <ProductLanding content={product as Content} />;
} 