import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { type ArticleWithSlug } from '@/lib/shared-types'
import { BlogPostCard } from '@/components/BlogPostCard'
import { createMetadata } from '@/utils/createMetadata'

import tokenizationDemo from '@/images/tokenization-demo.webp'
import embeddingsDemo from '@/images/embeddings-demo.webp'

export const metadata: Metadata = createMetadata({
  title: "NLP, ML and AI interactive Demos",
  description: "Learn the latest techniques through interactive demos"
});

export default async function DemosIndex() {
  let demos = [{
    author: "Zachary Proser",
    date: "2024-03-11",
    type: "demo",
    title: "Tokenization with Tiktoken",
    description: "Learn how tokenization converts our text into IDs that Large Language Models can read",
    slug: "tokenize",
    image: tokenizationDemo.src
  }, {
    author: "Zachary Proser",
    date: "2024-03-12",
    type: "demo",
    title: "Converting text to vectors",
    description: "Learn how embeddings (vectors) work and why they're fundamental for Artificial Intelligence",
    slug: "embeddings",
    image: embeddingsDemo.src
  }]

  return (
    <SimpleLayout
      title="NLP, ML and AI interactive Demos"
      intro="Learn the latest techniques through interactive demos."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {demos.map((demo: ArticleWithSlug) => (
            <BlogPostCard key={demo.slug} article={demo} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
