'use client'

import { ArrowUpRight } from 'lucide-react'
import { track } from '@vercel/analytics'

type Persona =
  | 'sales'
  | 'consultant'
  | 'executive'
  | 'engineer'
  | 'product'
  | 'photographer'
  | 'therapist'
  | 'researcher'
  | 'founder'
  | 'general'

interface ClusterPost {
  slug: string
  title: string
  hint: string
  personas: Persona[]
}

// Curated subset — the cluster has 100+ posts; these are the ones worth surfacing.
const CLUSTER: ClusterPost[] = [
  {
    slug: '/blog/how-to-transcribe-meetings-without-bot',
    title: 'How to Transcribe Meetings Without a Bot',
    hint: 'The no-bot meeting notes guide',
    personas: ['general', 'sales', 'consultant', 'executive', 'founder'],
  },
  {
    slug: '/blog/best-ai-meeting-notes-2026',
    title: 'Best AI Meeting Notes in 2026',
    hint: 'The current field, tested and compared',
    personas: ['general', 'sales', 'consultant', 'executive', 'engineer', 'product', 'founder'],
  },
  {
    slug: '/blog/how-to-record-meetings-2026',
    title: 'How to Record Meetings in 2026',
    hint: 'Practical options with and without a bot',
    personas: ['general', 'sales', 'consultant', 'executive', 'founder'],
  },
  {
    slug: '/blog/granola-ai-review',
    title: 'Granola AI Review: The App I Use Every Meeting',
    hint: 'My honest long-form review',
    personas: ['general', 'consultant', 'executive', 'founder'],
  },
  {
    slug: '/blog/granola-vs-otter',
    title: 'Granola vs Otter.ai: I Tested Both for Months',
    hint: 'Bot vs no-bot, head to head',
    personas: ['general', 'sales', 'product'],
  },
  {
    slug: '/blog/granola-vs-fathom',
    title: 'Granola vs Fathom: Invisible vs Visible Meeting AI',
    hint: 'When the free Zoom option is enough',
    personas: ['general', 'engineer', 'product'],
  },
  {
    slug: '/blog/granola-vs-fireflies',
    title: 'Granola vs Fireflies.ai: Privacy vs CRM Sync',
    hint: 'For sales teams choosing between trust and CRM data',
    personas: ['sales', 'general'],
  },
  {
    slug: '/blog/granola-vs-traditional-meeting-notes',
    title: 'Granola vs Traditional Meeting Notes',
    hint: 'Why typing through a meeting is expensive',
    personas: ['general', 'consultant', 'executive'],
  },
  {
    slug: '/blog/best-ai-meeting-notes-remote-teams-2026',
    title: 'Best AI Meeting Notes for Remote Teams',
    hint: 'For distributed orgs',
    personas: ['general', 'engineer', 'product', 'founder'],
  },
  {
    slug: '/blog/i-hate-taking-meeting-notes',
    title: 'I Hate Taking Meeting Notes (So I Stopped)',
    hint: 'The essay behind why I switched',
    personas: ['general', 'consultant', 'executive', 'founder'],
  },
  {
    slug: '/blog/adhd-meeting-notes-strategy',
    title: 'ADHD Meeting Notes: Why Traditional Note-Taking Fails',
    hint: 'If holding two threads is the problem',
    personas: ['general', 'engineer', 'product', 'researcher'],
  },
  {
    slug: '/blog/granola-photographers-portfolio-meetings',
    title: 'Granola for Photographers: Client Consultations',
    hint: 'Creative briefs without breaking eye contact',
    personas: ['photographer'],
  },
  {
    slug: '/blog/granola-mobile-developers-release-planning',
    title: 'Granola for Mobile Developers: Release Planning',
    hint: 'Stakeholder syncs that turn into release notes',
    personas: ['engineer'],
  },
]

const EVIDENCE_LEADERS = [
  '/blog/how-to-transcribe-meetings-without-bot',
  '/blog/best-ai-meeting-notes-2026',
  '/blog/how-to-record-meetings-2026',
  '/blog/granola-ai-review',
]

function normalizeSlug(slug = ''): string {
  const clean = slug.split('?')[0].split('#')[0].replace(/\/$/, '')
  if (!clean) return ''
  return clean.startsWith('/blog/') ? clean : `/blog/${clean.replace(/^\//, '')}`
}

export function pickFor(persona: Persona, max = 5, currentSlug?: string): ClusterPost[] {
  const current = normalizeSlug(currentSlug)
  const leaders = EVIDENCE_LEADERS
    .map(slug => CLUSTER.find(p => p.slug === slug))
    .filter((p): p is ClusterPost => Boolean(p))
  const exact = CLUSTER.filter(p => p.personas.includes(persona) && persona !== 'general')
  const general = CLUSTER.filter(p => p.personas.includes('general'))
  const seen = new Set<string>()
  const out: ClusterPost[] = []
  for (const p of [...leaders, ...exact, ...general]) {
    if (out.length >= max) break
    if (seen.has(p.slug)) continue
    if (current && normalizeSlug(p.slug) === current) continue
    seen.add(p.slug)
    out.push(p)
  }
  return out
}

interface RailProps {
  persona?: Persona
  campaign: string
  // Override the heading per host post if the default reads weird.
  heading?: string
  // Current post slug to exclude from rail links.
  currentSlug?: string
}

export function MeetingNotesClusterRail({ persona = 'general', campaign, heading, currentSlug }: RailProps) {
  const posts = pickFor(persona, 5, currentSlug)
  const personaLabel: Record<Persona, string> = {
    sales: 'sales people',
    consultant: 'consultants',
    executive: 'executives',
    engineer: 'engineers',
    product: 'PMs',
    photographer: 'photographers',
    therapist: 'therapists & coaches',
    researcher: 'researchers',
    founder: 'founders',
    general: 'this',
  }

  return (
    <section className="mn-rail" aria-label="More from the meeting notes series">
      <header className="mnr-head">
        <span className="mnr-eyebrow">§ More in the series</span>
        <h3 className="mnr-title">
          {heading ?? (
            <>
              More for{' '}
              <em>{personaLabel[persona]}</em>.
            </>
          )}
        </h3>
      </header>
      <ul className="mnr-list">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <a
              href={p.slug}
              className="mnr-link"
              onClick={() => track('cluster_rail_click', { campaign, slug: p.slug, persona, position: i + 1 })}
            >
              <span className="mnr-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="mnr-body">
                <span className="mnr-name">{p.title}</span>
                <span className="mnr-hint">{p.hint}</span>
              </span>
              <ArrowUpRight size={16} className="mnr-arrow" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MeetingNotesClusterRail
