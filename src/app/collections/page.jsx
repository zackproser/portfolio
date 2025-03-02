
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { getAllCollections } from '@/lib/collections'

export default async function CollectionPage() {
  let collections = await getAllCollections()

  return (
    <SimpleLayout title="Writing collections">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(collection => (
          <ContentCard key={collection.slug} article={collection} />
        ))}
      </div>
    </SimpleLayout>
  );
}
