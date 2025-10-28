import { Metadata } from 'next'
import {
  generateContentStaticParams,
  generateContentMetadata,
  getContentWithComponentByDirectorySlug,
} from '@/lib/content-handlers'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'
import React from 'react'
import { metadataLogger as logger } from '@/utils/logger'

// Content type for this handler
const CONTENT_TYPE = 'newsletter'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all newsletter posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  logger.debug(`Generating metadata for newsletter slug: ${slug}`);
  return generateContentMetadata(CONTENT_TYPE, slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  logger.debug(`Loading newsletter content for slug: ${slug}`);

  // Load newsletter content
  const result = await getContentWithComponentByDirectorySlug('newsletter', slug);

  if (!result) {
    logger.warn(`Newsletter content not found for slug ${slug}, returning 404`);
    return notFound();
  }

  const { MdxContent, content } = result;

  logger.debug(`Rendering newsletter page for slug: ${slug}`);

  // Newsletters are always free - render directly without auth/purchase checks
  return (
    <ArticleLayout metadata={content} hideNewsletter={false}>
      {React.createElement(MdxContent)}
    </ArticleLayout>
  );
}
