import { createMetadata } from '@/utils/createMetadata'
import PublicationsClient from './publications-client'
import PublicationsData from './publications-data'

export const metadata = createMetadata({
  title: "Zachary Proser's publications",
  description: "A searchable list of Zachary Proser's published articles and tutorials on AI, security, authentication, vector databases, and developer tooling across the web.",
  author: "Zachary Proser",
  type: "website",
});

export default function PublicationsPage() {
  const { publications, categories, years, allTags } = PublicationsData
  return (
    <PublicationsClient 
      publications={publications}
      categories={categories}
      years={years}
      allTags={allTags}
    />
  )
}
