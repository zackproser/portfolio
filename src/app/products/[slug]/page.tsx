import { ProductLanding } from '@/components/ProductLanding';
import { notFound } from 'next/navigation';
import { getContentBySlug } from '@/lib/content-handlers';
import { Content } from '@/lib/shared-types';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ 
  params,
  searchParams 
}: Props) {
  const resolvedParams = await params;
  const content = await getContentBySlug(resolvedParams.slug, 'blog');

  if (!content) {
    notFound();
  }

  // Transform the content structure to match what ProductLanding expects
  const transformedContent: Content = {
    ...content.metadata,
    MdxContent: content.MdxContent
  };

  return <ProductLanding content={transformedContent} />;
} 