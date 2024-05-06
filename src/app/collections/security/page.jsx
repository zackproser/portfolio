
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllArticles } from '@/lib/articles'

export default async function CollectionPage() {
  let articles = await getAllArticles(["ggshield-can-save-you-from-yourself","yubikey-sudo-git-signing"])

  return (
    <SimpleLayout title="security collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <BlogPostCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    