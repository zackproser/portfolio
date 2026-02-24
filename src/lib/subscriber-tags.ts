/**
 * Maps referrer URLs to subscriber tags for EmailOctopus.
 *
 * When someone signs up from a specific page, they get auto-tagged
 * with interest and vertical tags. These tags power EmailOctopus
 * automations that send targeted affiliate content.
 */

interface TagRule {
  /** Substring match against the referrer path */
  match: string
  /** Tags to apply when matched */
  tags: string[]
}

const TAG_RULES: TagRule[] = [
  // Voice AI interest
  { match: 'voice', tags: ['interest:voice-ai'] },
  { match: 'wisprflow', tags: ['interest:voice-ai', 'interest:wisprflow'] },
  { match: 'granola', tags: ['interest:voice-ai', 'interest:granola'] },
  { match: 'dictat', tags: ['interest:voice-ai'] },
  { match: 'meeting-notes', tags: ['interest:voice-ai', 'interest:meetings'] },
  { match: 'meeting-assistant', tags: ['interest:voice-ai', 'interest:meetings'] },
  { match: 'transcribe', tags: ['interest:voice-ai', 'interest:meetings'] },

  // Real estate vertical
  { match: 'realtor', tags: ['vertical:real-estate'] },
  { match: 'real-estate', tags: ['vertical:real-estate'] },
  { match: 'listing-description', tags: ['vertical:real-estate'] },
  { match: 'property-manager', tags: ['vertical:real-estate', 'vertical:property-mgmt'] },
  { match: 'mortgage', tags: ['vertical:real-estate', 'vertical:mortgage'] },
  { match: 'home-inspector', tags: ['vertical:real-estate', 'vertical:home-inspection'] },
  { match: 'crm-for-real-estate', tags: ['vertical:real-estate'] },

  // Professional verticals
  { match: 'lawyer', tags: ['vertical:legal'] },
  { match: 'legal', tags: ['vertical:legal'] },
  { match: 'accountant', tags: ['vertical:accounting'] },
  { match: 'cpa', tags: ['vertical:accounting'] },
  { match: 'insurance', tags: ['vertical:insurance'] },
  { match: 'financial-advisor', tags: ['vertical:finance'] },
  { match: 'small-business', tags: ['vertical:small-business'] },
  { match: 'consultant', tags: ['vertical:consulting'] },
  { match: 'therapist', tags: ['vertical:healthcare'] },
  { match: 'doctor', tags: ['vertical:healthcare'] },

  // Developer/tech interest
  { match: 'rag', tags: ['interest:ai-engineering'] },
  { match: 'vector', tags: ['interest:ai-engineering'] },
  { match: 'openai', tags: ['interest:ai-engineering'] },
  { match: 'codex', tags: ['interest:ai-engineering'] },
  { match: 'cursor', tags: ['interest:ai-engineering'] },
  { match: 'vibe-cod', tags: ['interest:ai-engineering'] },

  // Product interest
  { match: 'demos/voice', tags: ['interest:voice-ai', 'source:demo'] },
  { match: 'tokenize', tags: ['interest:ai-engineering'] },
  { match: 'firecrawl', tags: ['interest:web-scraping', 'source:demo'] },

  // Comparison pages (high purchase intent)
  { match: 'vs-', tags: ['intent:comparison'] },
  { match: '-vs-', tags: ['intent:comparison'] },
]

/**
 * Given a referrer path (e.g., "/blog/ai-voice-tools-for-real-estate"),
 * returns an array of tags to apply to the subscriber.
 */
export function getTagsFromReferrer(referrer: string | undefined | null): string[] {
  if (!referrer) return []

  const path = referrer.toLowerCase()
  const tagSet = new Set<string>()

  for (const rule of TAG_RULES) {
    if (path.includes(rule.match)) {
      rule.tags.forEach(tag => tagSet.add(tag))
    }
  }

  // Add source tag based on signup location
  if (path.includes('/blog/')) {
    tagSet.add('source:blog')
  } else if (path.includes('/demos/')) {
    tagSet.add('source:demo')
  } else if (path.includes('/products/') || path.includes('/learn/')) {
    tagSet.add('source:product')
  } else if (path === '/' || path === '') {
    tagSet.add('source:homepage')
  }

  return Array.from(tagSet)
}

/**
 * Generate a click-tracked affiliate link for use in EmailOctopus emails.
 *
 * This wraps the affiliate URL through /api/click so that clicking the
 * link in an email also tags the subscriber with behavioral data.
 *
 * @param siteUrl - Base URL of your site (e.g., "https://zackproser.com")
 * @param product - The affiliate product ("wisprflow" or "granola")
 * @param campaign - Campaign identifier for UTM tracking
 * @param tags - Additional tags to apply on click
 * @returns URL string for use in EmailOctopus email templates
 *
 * @example
 * // In an EmailOctopus email template, use the merge tag for email:
 * // {{EmailAddress}} will be replaced by EmailOctopus
 *
 * getEmailAffiliateLink(
 *   "https://zackproser.com",
 *   "wisprflow",
 *   "welcome-sequence",
 *   ["clicked:wisprflow", "email:welcome-1"]
 * )
 * // Returns: https://zackproser.com/api/click?e={{EmailAddress}}&tag=clicked:wisprflow&tag=email:welcome-1&r=https://ref.wisprflow.ai/zack-proser?utm_source=zackproser&utm_medium=newsletter&utm_campaign=welcome-sequence&utm_content=email-cta
 */
export function getEmailAffiliateLink(
  siteUrl: string,
  product: 'wisprflow' | 'granola',
  campaign: string,
  tags: string[] = []
): string {
  const BASE_LINKS: Record<string, string> = {
    wisprflow: 'https://ref.wisprflow.ai/zack-proser',
    granola: 'https://go.granola.ai/zack-proser'
  }

  // Build the affiliate destination URL with UTM params
  const affiliateUrl = new URL(BASE_LINKS[product])
  affiliateUrl.searchParams.set('utm_source', 'zackproser')
  affiliateUrl.searchParams.set('utm_medium', 'newsletter')
  affiliateUrl.searchParams.set('utm_campaign', campaign)
  affiliateUrl.searchParams.set('utm_content', 'email-cta')

  // Build the click-tracking wrapper URL
  // Note: {{EmailAddress}} is an EmailOctopus merge tag - it gets replaced per-subscriber
  const clickUrl = new URL('/api/click', siteUrl)
  clickUrl.searchParams.set('e', '{{EmailAddress}}')

  // Always tag with the product click
  const allTags = [`clicked:${product}`, ...tags]
  allTags.forEach(tag => clickUrl.searchParams.append('tag', tag))

  clickUrl.searchParams.set('r', affiliateUrl.toString())

  return clickUrl.toString()
}

/**
 * Generate a click-tracked content link for use in EmailOctopus emails.
 *
 * Routes through /api/click to tag the subscriber based on what content
 * they clicked, then redirects to the actual page.
 */
export function getEmailContentLink(
  siteUrl: string,
  contentPath: string,
  tags: string[] = []
): string {
  const clickUrl = new URL('/api/click', siteUrl)
  clickUrl.searchParams.set('e', '{{EmailAddress}}')
  tags.forEach(tag => clickUrl.searchParams.append('tag', tag))
  clickUrl.searchParams.set('r', `${siteUrl}${contentPath}`)
  return clickUrl.toString()
}
