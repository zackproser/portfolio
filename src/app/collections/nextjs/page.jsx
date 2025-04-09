
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { getAllContent } from '@/lib/content-handlers'

export const metadata = {
  title: "Nextjs And Vercel",
  description: "Next.js, how-to's, design patterns, and tips for using Vercel"
}

export default async function CollectionPage() {
  let articles = await getAllContent('blog', ["data-driven-pages-next-js","how-to-next-js-sitemap","javascript-git","how-to-run-background-jobs-on-vercel-without-a-queue","javascript-ai","javascript-git","opengraph-integration"])

  return (
    <SimpleLayout title="Nextjs And Vercel Collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <ContentCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    