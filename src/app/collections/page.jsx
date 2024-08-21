import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllCollections } from '@/lib/collections'
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: "Writing Collections",
  description: "Explore curated collections of articles on topics like security, AI, and more.",
})

export default async function CollectionPage() {
  let collections = await getAllCollections()

  return (
    <SimpleLayout title="Writing Collections">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(collection => (
          <BlogPostCard key={collection.slug} article={collection} />
        ))}
      </div>
    </SimpleLayout>
  );
}