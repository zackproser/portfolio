import { ProductLanding } from '@/components/ProductLanding';
import { notFound } from 'next/navigation';
import { getProductContent } from '@/lib/products';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductContent(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductLanding product={product} />;
} 