import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { LinkItem } from '../newsletter-builder'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    newsletterLink: {
      /**
       * Add a newsletter link card
       */
      setNewsletterLink: (attributes: { linkId: string }) => ReturnType
    }
  }
}

export interface NewsletterLinkOptions {
  HTMLAttributes: Record<string, any>
}

export const NewsletterLink = Node.create<NewsletterLinkOptions>({
  name: 'newsletterLink',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      linkId: {
        default: null,
        parseHTML: element => element.getAttribute('data-link-id'),
        renderHTML: attributes => {
          if (!attributes.linkId) {
            return {}
          }

          return {
            'data-link-id': attributes.linkId,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-link-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'newsletter-link-card' })]
  },

  addCommands() {
    return {
      setNewsletterLink:
        attributes =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
}) 