// Detection + persona inference for the Granola / meeting-notes affiliate
// cluster. Used by EditorialArticleLayout to auto-inject the concierge and
// cluster rail into matching posts without per-post MDX edits.

export type ConciergeRole =
  | 'sales' | 'consultant' | 'executive' | 'engineer' | 'product'
  | 'recruiter' | 'therapist' | 'photographer' | 'researcher' | 'founder'
  | 'other'

export type RailPersona =
  | 'sales' | 'consultant' | 'executive' | 'engineer' | 'product'
  | 'photographer' | 'therapist' | 'researcher' | 'founder' | 'general'

const SLUG_KEYWORDS = [
  'granola', 'meeting-notes', 'meeting-note', 'meeting-intelligence',
  'meeting-transcription', 'meeting-assistant', 'meeting-app', 'meetings-',
  'session-notes', 'session-documentation', 'client-meeting',
]

const TAG_KEYWORDS = ['granola', 'meetings', 'meeting']

// Anchored substring → persona. Order matters: more specific first.
const ROLE_RULES: Array<[RegExp, ConciergeRole]> = [
  [/photograph/, 'photographer'],
  [/therapist|coach(es|ing)?\b|life-coach|executive-coach/, 'therapist'],
  [/recruiter|talent-acquisition/, 'recruiter'],
  [/researcher|user-research|ux-research|academic/, 'researcher'],
  [/founder|startup-founder|investor|vc/, 'founder'],
  [/executive|c-suite|c-level/, 'executive'],
  [/sales|account-executive|client-discovery/, 'sales'],
  [/product-manager|pm-|product-management/, 'product'],
  [/engineer|developer|data-scientist|ml-engineer/, 'engineer'],
  [/consultant|consulting/, 'consultant'],
]

const RAIL_RULES: Array<[RegExp, RailPersona]> = [
  [/photograph/, 'photographer'],
  [/therapist|coach(es|ing)?\b|life-coach|executive-coach/, 'therapist'],
  [/researcher|user-research|ux-research|academic/, 'researcher'],
  [/founder|startup-founder|investor|vc/, 'founder'],
  [/executive|c-suite|c-level/, 'executive'],
  [/sales|account-executive|client-discovery/, 'sales'],
  [/product-manager|pm-|product-management/, 'product'],
  [/engineer|developer|data-scientist|ml-engineer/, 'engineer'],
  [/consultant|consulting/, 'consultant'],
]

function lower(s: string | undefined): string {
  return (s || '').toLowerCase()
}

// CRITICAL: only auto-inject the concierge into hidden-from-index SEO posts.
// Real /blog index posts are credibility-building content and must never
// have an affiliate widget appended to them, even if they happen to mention
// "granola" or "meetings" by coincidence.
export function isMeetingNotesClusterPost(
  slugLike: string,
  tags: string[] = [],
  opts: { hiddenFromIndex?: boolean } = {}
): boolean {
  if (!opts.hiddenFromIndex) return false
  const slug = lower(slugLike)
  if (!slug) return false
  if (SLUG_KEYWORDS.some(k => slug.includes(k))) return true
  const tagSet = tags.map(lower)
  if (tagSet.some(t => TAG_KEYWORDS.includes(t))) return true
  return false
}

export function inferConciergeRole(slugLike: string, title?: string): ConciergeRole {
  const hay = `${lower(slugLike)} ${lower(title)}`
  for (const [re, role] of ROLE_RULES) {
    if (re.test(hay)) return role
  }
  return 'other'
}

export function inferRailPersona(slugLike: string, title?: string): RailPersona {
  const hay = `${lower(slugLike)} ${lower(title)}`
  for (const [re, persona] of RAIL_RULES) {
    if (re.test(hay)) return persona
  }
  return 'general'
}
