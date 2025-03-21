"use client"

import { useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Trash2, GripVertical, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { LinkItem } from "./newsletter-builder"
import LinkTagger from "./link-tagger"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface LinkListProps {
  links: LinkItem[]
  selectedLinkId: string | null
  onSelectLink: (linkId: string) => void
  onBulletPointChange: (linkId: string, index: number, value: string) => void
  onAddBulletPoint: (linkId: string, content?: string) => void
  onRemoveBulletPoint: (linkId: string, index: number) => void
  onRemoveLink: (linkId: string) => void
  onMoveLink: (dragIndex: number, hoverIndex: number) => void
  onAddTag?: (linkId: string, tag: string) => void
  onRemoveTag?: (linkId: string, tag: string) => void
  onCreateTag?: (tag: string) => void
  availableTags?: string[]
}

interface DragItem {
  index: number
  id: string
  type: string
}

function LinkCard({
  link,
  index,
  isSelected,
  onSelect,
  onBulletPointChange,
  onAddBulletPoint,
  onRemoveBulletPoint,
  onRemoveLink,
  onMoveLink,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  availableTags,
}: {
  link: LinkItem
  index: number
  isSelected: boolean
  onSelect: () => void
  onBulletPointChange: (linkId: string, index: number, value: string) => void
  onAddBulletPoint: (linkId: string, content?: string) => void
  onRemoveBulletPoint: (linkId: string, index: number) => void
  onRemoveLink: (linkId: string) => void
  onMoveLink: (dragIndex: number, hoverIndex: number) => void
  onAddTag?: (linkId: string, tag: string) => void
  onRemoveTag?: (linkId: string, tag: string) => void
  onCreateTag?: (tag: string) => void
  availableTags?: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const [{ isDragging }, drag, preview] = useDrag({
    type: "LINK_CARD",
    item: { type: "LINK_CARD", id: link.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "LINK_CARD",
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      onMoveLink(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={`mb-4 ${isDragging ? "opacity-50" : ""} ${isSelected ? "border-blue-500 bg-blue-900/30" : "bg-white/10 border-white/20"} backdrop-blur-sm text-white rounded-lg border`}
    >
      <div className="p-4" onClick={onSelect}>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <div ref={ref} className="cursor-move">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              {link.title}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveLink(link.id)
              }}
              className="h-8 w-8 p-0 text-white hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove link</span>
            </Button>
          </div>
        </div>

        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 ml-7">
            {link.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-800/50 text-blue-200 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-4">
          {link.image && (
            <img
              src={link.image || "/placeholder.svg"}
              alt={link.title}
              className="w-full h-40 object-cover rounded-md"
            />
          )}

          <p className="text-sm text-blue-200">{link.description}</p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-blue-100">Bullet Points:</h4>

            {link.bulletPoints.map((bulletPoint, bpIndex) => (
              <div key={bpIndex} className="flex items-start space-x-2">
                <Textarea
                  value={bulletPoint}
                  onChange={(e) => onBulletPointChange(link.id, bpIndex, e.target.value)}
                  placeholder={`Bullet point ${bpIndex + 1}`}
                  className="flex-1 min-h-[60px] bg-white/20 border-white/20 placeholder:text-white/50 text-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveBulletPoint(link.id, bpIndex)
                  }}
                  disabled={link.bulletPoints.length <= 1}
                  className="h-8 w-8 p-0 mt-1 text-white hover:bg-red-500/20 hover:text-red-300"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Remove bullet point</span>
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAddBulletPoint(link.id)
              }}
              className="w-full border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bullet Point
            </Button>
          </div>

          {onAddTag && onRemoveTag && onCreateTag && availableTags && (
            <LinkTagger
              link={link}
              availableTags={availableTags}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onCreateTag={onCreateTag}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function LinkList({
  links,
  selectedLinkId,
  onSelectLink,
  onBulletPointChange,
  onAddBulletPoint,
  onRemoveBulletPoint,
  onRemoveLink,
  onMoveLink,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  availableTags = [],
}: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 border border-white/20 rounded-md bg-white/5 text-white">
        <p className="text-gray-300">No links added yet. Add links above to get started.</p>
      </div>
    )
  }

  return (
    <div>
      {links.map((link, index) => (
        <LinkCard
          key={link.id}
          link={link}
          index={index}
          isSelected={selectedLinkId === link.id}
          onSelect={() => onSelectLink(link.id)}
          onBulletPointChange={onBulletPointChange}
          onAddBulletPoint={onAddBulletPoint}
          onRemoveBulletPoint={onRemoveBulletPoint}
          onRemoveLink={onRemoveLink}
          onMoveLink={onMoveLink}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onCreateTag={onCreateTag}
          availableTags={availableTags}
        />
      ))}
    </div>
  )
}

