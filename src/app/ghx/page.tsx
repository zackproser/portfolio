import { Metadata } from 'next'
import GlossaryClient from './GlossaryClient'
import glossary from './glossary.json'

// Private workshop leave-behind for GHX Collaboration Week (June 17, 2026).
// Deliberately unlisted: noindex here + excluded from the sitemap in
// src/app/sitemap.js. Reached via QR code in the room.
export const metadata: Metadata = {
  title: 'The AI Glossary — GHX × Mind On Fire',
  description:
    'Every term you have heard in a meeting and were too polite to ask about — from zero to hero, in order.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function GhxGlossaryPage() {
  return <GlossaryClient glossary={glossary} />
}
