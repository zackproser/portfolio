
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { getAllContent } from '@/lib/content-handlers'

export const metadata = {
  title: "Security",
  description: "I have worked in security companies most of my career. Here are tips I have picked up for staying secure."
}

export default async function CollectionPage() {
  let articles = await getAllContent('blog', ["ggshield-can-save-you-from-yourself","yubikey-sudo-git-signing","aws-vault-open-source-tool"])

  return (
    <SimpleLayout title="Security Collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <ContentCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    