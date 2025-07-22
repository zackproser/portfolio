import { type MDXComponents } from 'mdx/types'
import { ContentCard } from '@/components/ContentCard'

export function useMDXComponents(components: MDXComponents) {
  return {
    // Add custom components that can be used in MDX
    ContentCard: ({ article, ...props }: { article: any; [key: string]: any }) => (
      <ContentCard article={article} {...props} />
    ),
    // Allow other components to be passed in
    ...components,
  }
}
