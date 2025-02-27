import { ProductLanding } from '@/components/ProductLanding';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/articles-compat';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ 
  params,
  searchParams 
}: Props) {
  const resolvedParams = await params;
  const content = await getArticleBySlug(resolvedParams.slug);

  if (!content) {
    notFound();
  }

  return <ProductLanding content={content} />;
} 