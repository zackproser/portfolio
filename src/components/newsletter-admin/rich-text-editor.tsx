"use client"

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { NewsletterLink } from './extensions/newsletter-link'
import NewsletterLinkComponent from './extensions/newsletter-link-component'
import { LinkItem } from './newsletter-builder'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  links: LinkItem[]
  onLinkRemove?: (linkId: string) => void
}

export default function RichTextEditor({ content, onChange, links, onLinkRemove }: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      NewsletterLink.configure({
        HTMLAttributes: {
          class: 'newsletter-link-card',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer) {
          const linkId = event.dataTransfer.getData('text/link-id')
          if (linkId) {
            const link = links.find(l => l.id === linkId)
            if (link) {
              const { tr } = view.state
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })
              
              if (coordinates) {
                view.dispatch(tr.insert(coordinates.pos, view.state.schema.nodes.newsletterLink.create({ linkId })))
                return true
              }
            }
          }
        }
        return false
      },
    },
  })

  // Update editor content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // Update or add link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl, target: '_blank' })
      .run()

    setLinkUrl('')
    setIsLinkDialogOpen(false)
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor) return
    
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setIsImageDialogOpen(false)
    }
  }, [editor, imageUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="rich-text-editor border border-blue-900 rounded-md overflow-hidden bg-white w-full">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-blue-950/50">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive('bold') ? 'bg-blue-900/50' : ''}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive('italic') ? 'bg-blue-900/50' : ''}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-blue-800 h-8"></div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-900/50' : ''}`}
            title="Heading"
          >
            <Heading className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive('bulletList') ? 'bg-blue-900/50' : ''}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive('orderedList') ? 'bg-blue-900/50' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-blue-800 h-8"></div>

        <div className="flex gap-1">
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-blue-900/50 ${editor.isActive('link') ? 'bg-blue-900/50' : ''}`}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="link-url"
                    placeholder="https://example.com"
                    className="col-span-4"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setLink()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsLinkDialogOpen(false)} variant="outline">Cancel</Button>
                <Button onClick={setLink}>Save Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-900/50"
                title="Add Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    className="col-span-4"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addImage()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsImageDialogOpen(false)} variant="outline">Cancel</Button>
                <Button onClick={addImage}>Insert Image</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border-r border-blue-800 h-8"></div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-900/50' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-900/50' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`text-white hover:bg-blue-900/50 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-900/50' : ''}`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-r border-blue-800 h-8"></div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="text-white hover:bg-blue-900/50 disabled:text-blue-300/50"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="text-white hover:bg-blue-900/50 disabled:text-blue-300/50"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none w-full bg-white" 
        style={{
          padding: '1.5rem',
          minHeight: '400px',
        }}
      />
    </div>
  )
} 