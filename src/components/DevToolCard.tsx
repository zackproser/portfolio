import type { FC, ReactElement } from 'react'
import { ArticleWithSlug } from '@/types'

interface DevToolCardProps {
  tool: ArticleWithSlug
  renderToolDetails: (tool: ArticleWithSlug) => ReactElement
}

const DevToolCard: FC<DevToolCardProps> = ({ tool, renderToolDetails }) => {
  return (
    <div className="dev-tool-card">
      {renderToolDetails(tool)}
    </div>
  )
}

export default DevToolCard
