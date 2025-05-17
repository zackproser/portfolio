import { ArticleLayout } from '@/components/ArticleLayout'
import { getContentWithComponentByDirectorySlug } from '@/lib/content-handlers'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Build a Static Site with GitHub Pages'
}

export default async function Page() {
  const result = await getContentWithComponentByDirectorySlug('blog', 'static-site-with-github-pages')
  if (!result) {
    return notFound()
  }
  const { MdxContent, content } = result
  return (
    <ArticleLayout metadata={content}>
      {<MdxContent />}
    </ArticleLayout>
  )
}
