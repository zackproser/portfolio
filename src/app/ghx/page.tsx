import { Metadata } from 'next'
import GlossaryClient from './GlossaryClient'
import glossary from './glossary.json'

// Private workshop leave-behind for GHX Collaboration Week (June 17, 2026).
// Deliberately unlisted: noindex here + excluded from the sitemap in
// src/app/sitemap.js. Reached via QR code in the room.
const OG_IMAGE = 'https://zackproser.b-cdn.net/images/og-images/ghx-glossary.png'

// noindex, but link previews still matter: this URL gets pasted into GHX's
// internal Slack/Teams, and the unfurl is the first impression for everyone
// who wasn't in the room.
export const metadata: Metadata = {
  title: 'The AI Glossary — GHX × Mind On Fire',
  description:
    'Every term you have heard in a meeting and were too polite to ask about — from zero to hero, in order. 50 terms, 5 levels, live demos inside.',
  openGraph: {
    title: 'The AI Glossary — GHX × Mind On Fire',
    description:
      'Speak AI like you have been doing this for years. 50 terms, 5 levels, live demos inside — built for GHX Collaboration Week.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'The AI Glossary — GHX × Mind On Fire' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Glossary — GHX × Mind On Fire',
    description: 'Speak AI like you have been doing this for years.',
    images: [OG_IMAGE],
  },
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
