
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllArticles } from '@/lib/articles'

export default async function CollectionPage() {
  let articles = await getAllArticles(["data-driven-pages-next-js","how-to-next-js-sitemap","javascript-git","how-to-run-background-jobs-on-vercel-without-a-queue","javascript-ai","opengraph-integration"])

  return (
    <SimpleLayout title="nextjs collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <BlogPostCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    