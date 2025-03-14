import { ProductLanding } from '@/components/ProductLanding';
import path from 'path';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/content-handlers';
import { Content } from '@/types';
import { generateMetadata as productMetadata } from '@/components/ProductLanding';

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
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // The product is already in the format expected by ProductLanding
  return <ProductLanding content={product as Content} />;
} 