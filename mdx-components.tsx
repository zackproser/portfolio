import { type MDXComponents } from 'mdx/types'
import { ContentCard } from '@/components/ContentCard'
import { Mermaid } from '@/components/Mermaid'

export function useMDXComponents(components: MDXComponents) {
  return {
    // Add custom components that can be used in MDX
    ContentCard: ({ article, ...props }: { article: any; [key: string]: any }) => (
      <ContentCard article={article} {...props} />
    ),
    // Theme-aware Mermaid diagrams (light/dark), used as <Mermaid chart={`...`} />
    Mermaid,
    // Allow other components to be passed in
    ...components,
  }
}
