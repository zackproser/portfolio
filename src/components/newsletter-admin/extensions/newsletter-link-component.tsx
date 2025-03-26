import React from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { LinkItem } from '../newsletter-builder'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Grip, X } from 'lucide-react'

interface NewsletterLinkComponentProps extends NodeViewProps {
  link?: LinkItem
  onRemove?: () => void
}

export default function NewsletterLinkComponent({ 
  node, 
  getPos, 
  editor,
  link,
  onRemove
}: NewsletterLinkComponentProps) {
  if (!link) {
    return null
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    const pos = getPos()
    editor.commands.deleteRange({ from: pos, to: pos + 1 })
  }

  return (
    <NodeViewWrapper>
      <Card className="relative group bg-white shadow-sm hover:shadow-md transition-shadow duration-200 my-4">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Grip className="h-4 w-4 text-gray-400" data-drag-handle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-4 pl-8">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {link.title}
              </a>
            </h3>
            {link.description && (
              <p className="text-gray-600">{link.description}</p>
            )}
            {link.image && (
              <img src={link.image} alt={link.title} className="w-full h-auto rounded-md" />
            )}
            {link.bulletPoints && link.bulletPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {link.bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
            {link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {link.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </NodeViewWrapper>
  )
} 