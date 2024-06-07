import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/articles'
import { createMetadata } from '@/utils/createMetadata'
import ArticleSearch from '@/components/ArticleSearch'

export const metadata: Metadata = createMetadata({
  title: "Zachary Proser - Blog",
  description: "Staff AI engineer - technical writing and development blog"
});

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="I write to learn, and publish to share."
      intro="All of my technical tutorials, musings and developer rants"
    >
      <ArticleSearch articles={JSON.parse(JSON.stringify(articles))} />
    </SimpleLayout>
  )
}

