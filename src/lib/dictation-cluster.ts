// Detection + competitor interaction inference for the WisprFlow / dictation
// SEO cluster. EditorialArticleLayout uses this to add the comparison figure
// without editing each generated MDX post.

import { isMeetingNotesClusterPost } from '@/lib/meeting-notes-cluster'

export type CompetitorArchetype =
  | 'recorder'
  | 'system-dictation'
  | 'meeting-bot'
  | 'ai-completion'
  | 'generic'

export interface CompetitorInference {
  archetype: CompetitorArchetype
  competitorName: string
}

const SLUG_KEYWORDS = [
  'wisprflow', 'dictation', 'voice-to-text', 'voice-typing', 'voice-coding',
  'voice-notes', 'speech-to-text',
]

const TAG_KEYWORDS = ['voice', 'dictation']

interface ArchetypeRule {
  pattern: RegExp
  archetype: CompetitorArchetype
  displayName: string
}

// Short names that are ordinary English words ("grain", "rev", "jamie") only
// count when adjacent to a "vs" — otherwise "fine-grained" or "rev-share" in a
// slug/title would misidentify the competitor.
function vsAnchored(name: string): RegExp {
  return new RegExp(`\\bvs\\.?[-\\s]+${name}\\b|\\b${name}[-\\s]+vs\\b`)
}

// Anchored word matches -> interaction archetype. Order matters: products
// whose names contain broad category words come before those categories.
const ARCHETYPE_RULES: ArchetypeRule[] = [
  { pattern: /\bgithub[-\s]+copilot\b/, archetype: 'ai-completion', displayName: 'GitHub Copilot' },

  { pattern: /\bapple(?:'s)?[-\s]+voice[-\s]+memos?\b/, archetype: 'recorder', displayName: 'Apple Voice Memos' },
  { pattern: /\bsamsung[-\s]+voice[-\s]+recorder\b/, archetype: 'recorder', displayName: 'Samsung Voice Recorder' },
  { pattern: /\bgoogle[-\s]+recorder\b/, archetype: 'recorder', displayName: 'Google Recorder' },
  { pattern: /\btranscribe[-\s]*me\b/, archetype: 'recorder', displayName: 'TranscribeMe' },
  { pattern: /\bspeech[-\s]*notes\b/, archetype: 'recorder', displayName: 'Speechnotes' },
  { pattern: /\bspeechify\b/, archetype: 'recorder', displayName: 'Speechify' },
  { pattern: vsAnchored('rev(?:\\.ai|[-\\s]+ai|[-\\s]+mobile)?'), archetype: 'recorder', displayName: 'Rev' },
  { pattern: /\bvoice[-\s]+memos?\b/, archetype: 'recorder', displayName: 'Voice Memos' },

  { pattern: /\bgoogle[-\s]+voice[-\s]+typing\b/, archetype: 'system-dictation', displayName: 'Google Voice Typing' },
  { pattern: /\bmicrosoft[-\s]+dictate\b/, archetype: 'system-dictation', displayName: 'Microsoft Dictate' },
  { pattern: /\bapple[-\s]+dictation\b/, archetype: 'system-dictation', displayName: 'Apple Dictation' },
  { pattern: /\bmac(?:os)?(?:[-\s]+built[-\s]+in)?[-\s]+dictation\b/, archetype: 'system-dictation', displayName: 'Mac Dictation' },
  { pattern: /\bdragon(?:[-\s]+naturally[-\s]*speaking)?\b/, archetype: 'system-dictation', displayName: 'Dragon' },

  { pattern: /\bfireflies(?:\.ai)?\b/, archetype: 'meeting-bot', displayName: 'Fireflies' },
  { pattern: /\botter(?:\.ai)?\b/, archetype: 'meeting-bot', displayName: 'Otter.ai' },
  { pattern: /\bavoma\b/, archetype: 'meeting-bot', displayName: 'Avoma' },
  { pattern: vsAnchored('grain'), archetype: 'meeting-bot', displayName: 'Grain' },
  { pattern: vsAnchored('jamie(?:[-\\s]+ai)?'), archetype: 'meeting-bot', displayName: 'Jamie' },
  { pattern: /\bnotta\b/, archetype: 'meeting-bot', displayName: 'Notta' },
]

function lower(s: string | undefined): string {
  return (s || '').toLowerCase()
}

// CRITICAL: only auto-inject into hidden-from-index SEO posts. Meeting-notes
// owns overlaps, so its detector is deliberately consulted before dictation.
export function isDictationClusterPost(
  slugLike: string,
  tags: string[] = [],
  opts: { hiddenFromIndex?: boolean } = {}
): boolean {
  if (!opts.hiddenFromIndex) return false
  if (isMeetingNotesClusterPost(slugLike, tags, opts)) return false

  const slug = lower(slugLike)
  if (!slug) return false
  if (SLUG_KEYWORDS.some(keyword => slug.includes(keyword))) return true

  // Whole-word tag matching: "Voice AI" counts, "Invoicing" does not.
  return tags.some(tag =>
    lower(tag)
      .split(/[^a-z0-9]+/)
      .some(word => TAG_KEYWORDS.includes(word)),
  )
}

function titleCompetitor(title?: string): string | null {
  if (!title) return null
  const match = title.match(/\bwispr\s*flow\s+vs\.?\s+(.+?)(?=\s*[:?]|\s+[—–-]\s+|\s+which\b|\s+comparison\b|$)/i)
  if (!match?.[1]) return null
  return match[1]
    .replace(/\s+20\d{2}\b.*$/, '')
    .replace(/\s+(?:in|for|on|the)$/i, '')
    .trim()
}

function slugCompetitor(slugLike: string): string | null {
  const base = lower(slugLike).split('/').filter(Boolean).pop() || ''
  const match = base.match(/(?:wispr-?flow)-vs-(.+)/)
  if (!match?.[1]) return null

  const cleaned = match[1]
    .replace(/-20\d{2}(?:-|$).*$/, '')
    .replace(/-(?:comparison|review|alternative).*$/, '')
    .replace(/-/g, ' ')
    .trim()

  return cleaned
    ? cleaned.replace(/\b\w/g, character => character.toUpperCase())
    : null
}

export function inferCompetitorArchetype(
  slugLike: string,
  title?: string
): CompetitorInference {
  const haystack = `${lower(slugLike)} ${lower(title)}`
  for (const rule of ARCHETYPE_RULES) {
    if (rule.pattern.test(haystack)) {
      return { archetype: rule.archetype, competitorName: rule.displayName }
    }
  }

  return {
    archetype: 'generic',
    competitorName: titleCompetitor(title) || slugCompetitor(slugLike) || 'Traditional typing',
  }
}
