
import { SimpleLayout } from '@/components/SimpleLayout'
import { CollectionCard } from '@/components/CollectionCard'
import { getAllCollections } from '@/lib/collections'

export default async function CollectionPage() {
  let collections = await getAllCollections()

  return (
    <SimpleLayout title="Writing collections">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(collection => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </SimpleLayout>
  );
}
