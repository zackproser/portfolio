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

// Anchored substring -> interaction archetype. Order matters: products whose
// names contain broad category words must be checked before those categories.
const ARCHETYPE_RULES: ArchetypeRule[] = [
  { pattern: /github[-\s]+copilot/, archetype: 'ai-completion', displayName: 'GitHub Copilot' },

  { pattern: /apple(?:'s)?[-\s]+voice[-\s]+memos?/, archetype: 'recorder', displayName: 'Apple Voice Memos' },
  { pattern: /samsung[-\s]+voice[-\s]+recorder/, archetype: 'recorder', displayName: 'Samsung Voice Recorder' },
  { pattern: /google[-\s]+recorder/, archetype: 'recorder', displayName: 'Google Recorder' },
  { pattern: /transcribe[-\s]*me/, archetype: 'recorder', displayName: 'TranscribeMe' },
  { pattern: /speech[-\s]*notes/, archetype: 'recorder', displayName: 'Speechnotes' },
  { pattern: /speechify/, archetype: 'recorder', displayName: 'Speechify' },
  { pattern: /rev(?:\.ai|[-\s]+ai|[-\s]+mobile)?\b/, archetype: 'recorder', displayName: 'Rev' },
  { pattern: /voice[-\s]+memos?/, archetype: 'recorder', displayName: 'Voice Memos' },

  { pattern: /google[-\s]+voice[-\s]+typing/, archetype: 'system-dictation', displayName: 'Google Voice Typing' },
  { pattern: /microsoft[-\s]+dictate/, archetype: 'system-dictation', displayName: 'Microsoft Dictate' },
  { pattern: /apple[-\s]+dictation/, archetype: 'system-dictation', displayName: 'Apple Dictation' },
  { pattern: /mac(?:os)?(?:[-\s]+built[-\s]+in)?[-\s]+dictation/, archetype: 'system-dictation', displayName: 'Mac Dictation' },
  { pattern: /dragon(?:[-\s]+naturally[-\s]*speaking)?/, archetype: 'system-dictation', displayName: 'Dragon' },

  { pattern: /fireflies(?:\.ai)?/, archetype: 'meeting-bot', displayName: 'Fireflies' },
  { pattern: /otter(?:\.ai)?/, archetype: 'meeting-bot', displayName: 'Otter.ai' },
  { pattern: /avoma/, archetype: 'meeting-bot', displayName: 'Avoma' },
  { pattern: /grain/, archetype: 'meeting-bot', displayName: 'Grain' },
  { pattern: /jamie(?:[-\s]+ai)?/, archetype: 'meeting-bot', displayName: 'Jamie' },
  { pattern: /notta/, archetype: 'meeting-bot', displayName: 'Notta' },
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

  const tagSet = tags.map(lower)
  return tagSet.some(tag => TAG_KEYWORDS.some(keyword => tag.includes(keyword)))
}

function titleCompetitor(title?: string): string | null {
  if (!title) return null
  const match = title.match(/\bwispr\s*flow\s+vs\.?\s+(.+?)(?=\s*[:?]|\s+[—–-]\s+|\s+which\b|\s+comparison\b|$)/i)
  if (!match?.[1]) return null
  return match[1].replace(/\s+20\d{2}\b.*$/, '').trim()
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
