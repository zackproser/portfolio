import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createMetadata } from '@/utils/createMetadata'
import { getAffiliateLink } from '@/lib/affiliate'
import { GranolaCaptureForm } from './GranolaCaptureForm'
import {
  JumpBarScrollSpy,
  ReadingProgress,
  TimeSavedBar,
} from './GranolaInteractivity'

// ─────────────────────────────────────────────────────────
// Granola pillar review — implementation of the Claude Design handoff.
//
// Layout follows the design HTML 1:1, with these adaptations for the
// production Next.js site:
//   - Site nav comes from the layout, so the design's <header class=nav>
//     is dropped.
//   - The "tweaks" panel + theme toggle are prototype-only — site has
//     its own dark-mode handling. Dropped.
//   - All CTAs route through getAffiliateLink({ campaign: 'granola-pillar',
//     medium: 'blog', placement, term }) so the Granola dashboard can
//     split conversions by section.
//   - Form posts to /api/form with the standard tags (interest:granola,
//     interest:meetings, source:granola-pillar) — see GranolaCaptureForm.
//   - Interactive elements (reading progress, jump-bar scroll-spy, the
//     time-saved bar) live in GranolaInteractivity.tsx as client
//     components.
// ─────────────────────────────────────────────────────────

const PAGE_URL = 'https://zackproser.com/granola'
const PAGE_IMAGE = 'https://zackproser.b-cdn.net/images/granola-applied-ai-workos-hero.webp'
const PUBLISHED_AT = '2026-05-13'
const MODIFIED_AT = '2026-05-14'

export const metadata: Metadata = {
  title:
    'Granola Review — 12 Months With the AI Notetaker',
  description:
    'A long-form review of Granola after twelve months of daily use — the four meeting shapes I run it for, the prompt pack, the comparison, the cost, and the limits.',
  authors: [{ name: 'Zachary Proser', url: 'https://zackproser.com' }],
  keywords: [
    'Granola',
    'Granola AI',
    'Granola review',
    'Granola AI review',
    'AI meeting notes',
    'AI notetaker',
    'AI notetaker review',
    'meeting workflow',
    'local audio capture',
    'no-bot meeting notes',
    'Granola vs Otter',
    'Granola vs Fireflies',
    'Granola vs Zoom AI Companion',
    'Granola pricing',
    'Applied AI',
    'WorkOS Applied AI',
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'Granola review — the AI notetaker I actually use, every meeting, 12 months in',
    description:
      'Twelve months of daily use. Four meeting shapes, the prompt pack, the comparison, the cost, the limits. The first AI tool whose absence would measurably raise my baseline.',
    siteName: 'Zachary Proser',
    publishedTime: `${PUBLISHED_AT}T00:00:00.000Z`,
    modifiedTime: `${MODIFIED_AT}T00:00:00.000Z`,
    authors: ['Zachary Proser'],
    images: [
      {
        url: PAGE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Granola running on a Mac during a live meeting — local capture, structured notes, transcript on the right.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granola review — 12 months in',
    description:
      'Long-form review · four meeting shapes · prompt pack · comparison · pricing · the limits I keep. Local audio capture, no bot ever joins.',
    images: [PAGE_IMAGE],
    creator: '@zackproser',
  },
}

// ---- Affiliate URLs --------------------------------------------------------

const CAMPAIGN = 'granola-pillar'
const MEDIUM = 'blog' as const

function gLink(placement: 'hero-card' | 'sticky-cta' | 'text-link' | 'inline-cta' | 'compact-card', term: string) {
  return getAffiliateLink({ product: 'granola', campaign: CAMPAIGN, medium: MEDIUM, placement, term })
}

const links = {
  s02EarlyCta: gLink('hero-card', 's02-early-cta'),
  pricingFree: gLink('text-link', 'pricing-free'),
  pricingIndividual: gLink('sticky-cta', 'pricing-individual'),
  pricingBusiness: gLink('text-link', 'pricing-business'),
  s10MidCta: gLink('hero-card', 's10-mid-cta'),
  s15FinalCta: gLink('hero-card', 's15-final-cta'),
  sideRailPrimary: gLink('sticky-cta', 'side-rail-primary'),
  sideRailSkipEmail: gLink('text-link', 'side-rail-skip-email'),
  fig01: gLink('compact-card', 'fig01-interface-shot'),
  fig02: gLink('compact-card', 'fig02-rendered-output'),
} as const

// ---- JSON-LD ---------------------------------------------------------------

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Review',
      '@id': `${PAGE_URL}#review`,
      url: PAGE_URL,
      name: 'Granola — twelve months of daily use, reviewed',
      headline:
        'Granola review — the AI notetaker I actually use every meeting, 12 months in',
      datePublished: PUBLISHED_AT,
      dateModified: MODIFIED_AT,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
        jobTitle: 'Applied AI engineer',
        worksFor: { '@type': 'Organization', name: 'WorkOS' },
      },
      publisher: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
      },
      image: { '@type': 'ImageObject', url: PAGE_IMAGE, width: 1200, height: 630 },
      reviewBody:
        'Twelve months running Granola through every meeting on my calendar — exec syncs, customer calls, hiring screens, external strategy. Local-audio capture, no bot joins the call. Templates per meeting shape. The first AI tool whose absence would measurably raise my baseline.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.6',
        bestRating: '5',
        worstRating: '1',
      },
      itemReviewed: {
        '@type': 'SoftwareApplication',
        '@id': 'https://granola.ai#app',
        name: 'Granola',
        url: 'https://granola.ai',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'macOS, Windows, iOS',
        description:
          'A desktop AI notetaker that captures meeting audio locally on your machine without joining the call as a bot.',
        offers: [
          { '@type': 'Offer', name: 'Basic', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Business', price: '14', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Enterprise', price: '35', priceCurrency: 'USD' },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Writing',
          item: 'https://zackproser.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tool reviews',
          item: 'https://zackproser.com/blog?tag=review',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Partnerships',
          item: 'https://zackproser.com/partnerships',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Granola — 12 months',
          item: PAGE_URL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Granola join the meeting as a bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'No. Granola captures the audio locally on your machine without joining the call as a participant. The other side does not see a bot in the meeting.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does Granola cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'As of May 2026, Granola has three tiers: Basic (free), Business ($14/user/month), and Enterprise ($35/user/month). Confirm current pricing on granola.ai.',
          },
        },
        {
          '@type': 'Question',
          name: 'What platforms does Granola run on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Granola has a desktop app for macOS and Windows, plus an iOS app for phone-call capture on the go.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does Granola not work well?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Capture quality drops in cold-room transcription (multiple people through a single speakerphone), with heavily overlapping speakers, and in non-English meetings beyond Spanish and French. The first week of use is also a tax until you have templates set up.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is Granola different from Otter, Fireflies, or the Zoom AI Companion?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Granola is the only one of the four that captures audio locally without joining the meeting as a bot. It also works on personal devices without calendar integration, supports user-defined templates per meeting shape, and lets you chat against the transcript afterward to produce derived artifacts like Slack updates and CRM rows.',
          },
        },
      ],
    },
  ],
}

// ---- Page ------------------------------------------------------------------

export default function GranolaPillarPage() {
  return (
    <div className="granola-pillar" data-density="comfortable">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      {/* ============ JUMP NAV ============ */}
      <div className="g-jumpbar" id="jumpbar">
        <div className="gx-container g-jumpbar-inner">
          <span className="label">§ Sections</span>
          <a href="#s01">01 Verdict</a><span className="sep">·</span>
          <a href="#s03">03 Shapes</a><span className="sep">·</span>
          <a href="#s05">05 Templates</a><span className="sep">·</span>
          <a href="#s08">08 Comparison</a><span className="sep">·</span>
          <a href="#s10">10 Pricing</a><span className="sep">·</span>
          <a href="#s11">11 Prompts</a><span className="sep">·</span>
          <a href="#s12">12 Where it breaks</a><span className="sep">·</span>
          <a href="#s14">14 The take</a><span className="sep">·</span>
          <a href="#cta-trial">Try free →</a>
        </div>
      </div>
      <JumpBarScrollSpy />

      <GranolaPillarBody links={links} />
    </div>
  )
}
