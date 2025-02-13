import { ProductLanding } from '@/components/ProductLanding';
import { notFound } from 'next/navigation';
import { getProductContent } from '@/lib/commerce';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ 
  params,
  searchParams 
}: Props) {
  const resolvedParams = await params;
  const product = await getProductContent(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductLanding product={product} />;
} 