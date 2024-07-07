import { ArticleWithSlug } from '@/lib/shared-types'

interface DevToolCardProps {
  tool: ArticleWithSlug;
  renderToolDetails: (tool: ArticleWithSlug) => JSX.Element;
}

const DevToolCard: React.FC<DevToolCardProps> = ({ tool, renderToolDetails }) => {
  return (
    <div className="dev-tool-card">
      {renderToolDetails(tool)}
    </div>
  )
}

export default DevToolCard
