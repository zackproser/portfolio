
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllCollections } from '@/lib/collections'

export default async function CollectionPage() {
  let collections = await getAllCollections()

  return (
    <SimpleLayout title="Writing collections">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(collection => (
          <BlogPostCard key={collection.slug} article={collection} />
        ))}
      </div>
    </SimpleLayout>
  );
}
