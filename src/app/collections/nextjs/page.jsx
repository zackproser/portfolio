

import Image from 'next/image'

import collectionImage from "@/images/nextjs-data-driven-website.webp"

import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllContent } from '@/lib/content-handlers'

export const metadata = {
  title: "NEXTJS AND VERCEL",
  description: "Next.js, how-to's, design patterns, and tips for using Vercel",
  image: collectionImage, 
}

export default async function CollectionPage() {
  let articles = await getAllContent('blog', ["data-driven-pages-next-js","how-to-next-js-sitemap","javascript-git","how-to-run-background-jobs-on-vercel-without-a-queue","javascript-ai","javascript-git","opengraph-integration"])

  return (
    <SimpleLayout title="Nextjs and vercel collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <BlogPostCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    