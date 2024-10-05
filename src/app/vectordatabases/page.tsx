import { Metadata } from 'next'
import VectorDatabasesPageClient from './VectorDatabasesPageClient'
import { getDatabases } from '@/lib/getDatabases'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Vector Databases Compared',
  description: 'Explore and compare vector databases',
})

export default function VectorDatabasesPage() {
  const databases = getDatabases()
  return <VectorDatabasesPageClient initialDatabases={databases} />
}
