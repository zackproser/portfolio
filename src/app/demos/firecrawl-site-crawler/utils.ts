// Pure simulation engine for the Firecrawl crawl demo.
//
// Given a seed site and a crawl config (depth, limit, path globs), this walks
// the site's link graph breadth-first and produces an ordered list of crawl
// events plus a final set of crawled pages — mirroring how a real Firecrawl
// /crawl job discovers and scrapes URLs. No network calls; everything is
// derived from the hand-built data in data.ts.

import type { SeedPage, SeedSite } from './data'

export type CrawlFormat = 'markdown' | 'html' | 'links'

export type CrawlConfig = {
  /** Max crawl depth from the seed (seed = 0). */
  maxDepth: number
  /** Hard cap on the number of pages to crawl. */
  limit: number
  /** RegExp strings; a path must match one of these (if any are present). */
  includePaths: string[]
  /** RegExp strings; a path matching one of these is skipped. */
  excludePaths: string[]
  /** Output formats requested for each page. */
  formats: CrawlFormat[]
  /** Strip nav/footer/ads and keep only the main content. */
  onlyMainContent: boolean
  /** Skip the sitemap and rely on link discovery only. */
  ignoreSitemap: boolean
}

export const DEFAULT_CONFIG: CrawlConfig = {
  maxDepth: 2,
  limit: 25,
  includePaths: [],
  excludePaths: [],
  formats: ['markdown', 'links'],
  onlyMainContent: true,
  ignoreSitemap: false,
}

export type PageStatus = 'queued' | 'rendering' | 'markdown' | 'done' | 'skipped' | 'error'

/** A page node in the simulated crawl, enriched with runtime fields. */
export type CrawledPage = {
  url: string
  path: string
  title: string
  depth: number
  statusCode: number
  rawHtmlBytes: number
  /** Markdown chosen based on onlyMainContent. */
  markdown: string
  /** Always the chrome-stripped version (for the Raw vs Clean tab). */
  cleanMarkdown: string
  /** Always the version with nav/footer/ads (for the Raw vs Clean tab). */
  chromeMarkdown: string
  /** Links discovered on this page that the crawler will follow. */
  discoveredLinks: string[]
  /** Estimated token count of the chosen markdown. */
  tokens: number
  /** Simulated wall-clock cost of rendering + extracting this page, in ms. */
  elapsedMs: number
  status: PageStatus
  /** URL of the page that linked to this one (null for the seed). */
  discoveredFrom: string | null
  /** Reason a page was skipped, when status === 'skipped'. */
  skipReason?: string
}

export type CrawlEventType =
  | 'map'
  | 'discovered'
  | 'queued'
  | 'rendering'
  | 'markdown'
  | 'done'
  | 'skipped'

/** One step in the simulated crawl timeline. */
export type CrawlEvent = {
  index: number
  type: CrawlEventType
  url: string
  /** Human-readable description for the live feed. */
  message: string
  /** Cumulative pages completed at this point. */
  pagesCompleted: number
  /** Cumulative tokens extracted at this point. */
  tokensExtracted: number
  /** Cumulative simulated elapsed time, in ms. */
  elapsedMs: number
}

export type CrawlResult = {
  /** Every page the crawler touched, in discovery order. */
  pages: CrawledPage[]
  /** Ordered timeline of events for playback. */
  events: CrawlEvent[]
  /** URLs returned by the /map endpoint (sitemap + homepage links). */
  mappedLinks: string[]
  totals: {
    discovered: number
    crawled: number
    skipped: number
    tokens: number
    rawBytes: number
    elapsedMs: number
  }
}

export function estimateTokens(text: string): number {
  // ~4 characters per token is the usual rule of thumb.
  return Math.max(1, Math.round(text.length / 4))
}

export function bytesToReadable(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function safeRegex(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern)
  } catch {
    return null
  }
}

/** Decide whether a path passes the include/exclude globs. */
export function pathPasses(
  path: string,
  includePaths: string[],
  excludePaths: string[],
): { allowed: boolean; reason?: string } {
  for (const pattern of excludePaths) {
    const re = safeRegex(pattern)
    if (re && re.test(path)) {
      return { allowed: false, reason: `Excluded by ${pattern}` }
    }
  }

  if (includePaths.length > 0) {
    const matched = includePaths.some((pattern) => {
      const re = safeRegex(pattern)
      return re ? re.test(path) : false
    })
    if (!matched) {
      return { allowed: false, reason: 'No includePaths match' }
    }
  }

  return { allowed: true }
}

/**
 * Simulate a Firecrawl /map call: return the full link set the endpoint would
 * surface. With a sitemap, that's every page; without one (or with
 * ignoreSitemap), it's the seed page plus its direct links.
 */
export function simulateMap(site: SeedSite, ignoreSitemap: boolean): string[] {
  const usesSitemap = site.hasSitemap && !ignoreSitemap
  if (usesSitemap) {
    return site.pages.map((p) => p.url)
  }
  const seed = site.pages.find((p) => p.depth === 0)
  const seedLinks = seed ? seed.discoveredLinks : []
  return Array.from(new Set([site.seedUrl, ...seedLinks]))
}

/**
 * Run the full crawl simulation. Walks the site graph breadth-first, applies
 * depth/limit/path filters, and emits an ordered event timeline plus the set of
 * crawled pages.
 */
export function simulateCrawl(site: SeedSite, config: CrawlConfig): CrawlResult {
  const pagesByUrl = new Map<string, SeedPage>()
  site.pages.forEach((p) => pagesByUrl.set(p.url, p))

  const mappedLinks = simulateMap(site, config.ignoreSitemap)

  const events: CrawlEvent[] = []
  const crawled: CrawledPage[] = []
  const visited = new Set<string>()

  let pagesCompleted = 0
  let tokensExtracted = 0
  let rawBytes = 0
  let elapsedMs = 0
  let skipped = 0
  let eventIndex = 0

  const push = (type: CrawlEventType, url: string, message: string) => {
    events.push({
      index: eventIndex++,
      type,
      url,
      message,
      pagesCompleted,
      tokensExtracted,
      elapsedMs,
    })
  }

  // Map event kicks things off.
  push(
    'map',
    site.seedUrl,
    config.ignoreSitemap || !site.hasSitemap
      ? `Mapped ${mappedLinks.length} links from the seed page (no sitemap)`
      : `Mapped ${mappedLinks.length} links from sitemap.xml`,
  )

  // BFS queue seeded with the start URL, or all mapped links if using a sitemap.
  type QueueItem = { url: string; from: string | null }
  const usesSitemap = site.hasSitemap && !config.ignoreSitemap
  const queue: QueueItem[] = []
  if (usesSitemap) {
    // When using a sitemap, seed the queue with all mapped links that exist in our page data.
    mappedLinks.forEach((url) => {
      if (pagesByUrl.has(url) && !visited.has(url)) {
        visited.add(url)
        queue.push({ url, from: null })
      }
    })
    // Sort by depth to maintain BFS order.
    queue.sort((a, b) => {
      const depthA = pagesByUrl.get(a.url)?.depth ?? 0
      const depthB = pagesByUrl.get(b.url)?.depth ?? 0
      return depthA - depthB
    })
  } else {
    // Without a sitemap, start with just the seed URL.
    queue.push({ url: site.seedUrl, from: null })
    visited.add(site.seedUrl)
  }

  while (queue.length > 0) {
    const { url, from } = queue.shift() as QueueItem
    const seedPage = pagesByUrl.get(url)
    if (!seedPage) continue

    // Depth gate.
    if (seedPage.depth > config.maxDepth) {
      skipped++
      crawled.push(buildSkipped(seedPage, from, `Beyond maxDepth ${config.maxDepth}`, config))
      push('skipped', url, `Skipped ${seedPage.path} — beyond maxDepth ${config.maxDepth}`)
      continue
    }

    // Path globs.
    const verdict = pathPasses(seedPage.path, config.includePaths, config.excludePaths)
    if (!verdict.allowed) {
      skipped++
      crawled.push(buildSkipped(seedPage, from, verdict.reason ?? 'Filtered', config))
      push('skipped', url, `Skipped ${seedPage.path} — ${verdict.reason}`)
      continue
    }

    // Limit gate.
    if (pagesCompleted >= config.limit) {
      skipped++
      crawled.push(buildSkipped(seedPage, from, `Limit ${config.limit} reached`, config))
      push('skipped', url, `Skipped ${seedPage.path} — limit ${config.limit} reached`)
      continue
    }

    // Discover + queue this page.
    push('discovered', url, `Discovered ${seedPage.path} (depth ${seedPage.depth})`)
    push('queued', url, `Queued ${seedPage.path}`)

    // Rendering stage (JS render). Cost scales with raw HTML size.
    const renderMs = Math.round(180 + seedPage.rawHtmlBytes / 900)
    elapsedMs += renderMs
    push('rendering', url, `Rendering ${seedPage.path} (JS)`)

    // Markdown extraction stage.
    const chosenMarkdown = config.onlyMainContent ? seedPage.markdown : seedPage.markdownWithChrome
    const tokens = estimateTokens(chosenMarkdown)
    const extractMs = Math.round(60 + chosenMarkdown.length / 50)
    elapsedMs += extractMs
    push('markdown', url, `Extracted markdown from ${seedPage.path} (${tokens} tokens)`)

    const isError = seedPage.statusCode >= 400
    const page: CrawledPage = {
      url: seedPage.url,
      path: seedPage.path,
      title: seedPage.title,
      depth: seedPage.depth,
      statusCode: seedPage.statusCode,
      rawHtmlBytes: seedPage.rawHtmlBytes,
      markdown: chosenMarkdown,
      cleanMarkdown: seedPage.markdown,
      chromeMarkdown: seedPage.markdownWithChrome,
      discoveredLinks: seedPage.discoveredLinks,
      tokens,
      elapsedMs: renderMs + extractMs,
      status: isError ? 'error' : 'done',
      discoveredFrom: from,
    }
    crawled.push(page)

    if (!isError) {
      pagesCompleted++
      tokensExtracted += tokens
      rawBytes += seedPage.rawHtmlBytes
    }
    push(
      'done',
      url,
      isError
        ? `Page ${seedPage.path} returned ${seedPage.statusCode}`
        : `Completed ${seedPage.path} (${seedPage.statusCode})`,
    )

    // Enqueue children for the next depth level.
    if (seedPage.depth < config.maxDepth) {
      seedPage.discoveredLinks.forEach((link) => {
        if (!visited.has(link) && pagesByUrl.has(link)) {
          visited.add(link)
          queue.push({ url: link, from: url })
        }
      })
    }
  }

  return {
    pages: crawled,
    events,
    mappedLinks,
    totals: {
      discovered: crawled.length,
      crawled: pagesCompleted,
      skipped,
      tokens: tokensExtracted,
      rawBytes,
      elapsedMs,
    },
  }
}

function buildSkipped(
  seedPage: SeedPage,
  from: string | null,
  reason: string,
  config: CrawlConfig,
): CrawledPage {
  return {
    url: seedPage.url,
    path: seedPage.path,
    title: seedPage.title,
    depth: seedPage.depth,
    statusCode: seedPage.statusCode,
    rawHtmlBytes: seedPage.rawHtmlBytes,
    markdown: '',
    cleanMarkdown: seedPage.markdown,
    chromeMarkdown: seedPage.markdownWithChrome,
    discoveredLinks: seedPage.discoveredLinks,
    tokens: 0,
    elapsedMs: 0,
    status: 'skipped',
    discoveredFrom: from,
    skipReason: reason,
  }
}

/** Build the exact POST /v1/crawl request body for a given config. */
export function buildCrawlRequestBody(seedUrl: string, config: CrawlConfig) {
  const scrapeOptions: Record<string, unknown> = {
    formats: config.formats,
    onlyMainContent: config.onlyMainContent,
  }
  const body: Record<string, unknown> = {
    url: seedUrl,
  }
  if (config.includePaths.length > 0) body.includePaths = config.includePaths
  if (config.excludePaths.length > 0) body.excludePaths = config.excludePaths
  body.maxDepth = config.maxDepth
  body.limit = config.limit
  body.ignoreSitemap = config.ignoreSitemap
  body.scrapeOptions = scrapeOptions
  return body
}

/** Build the /v1/map request body. */
export function buildMapRequestBody(seedUrl: string) {
  return { url: seedUrl }
}

/** Pretty-print a JSON object with 2-space indentation. */
export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

/**
 * Build a representative async crawl response, including a sample of the
 * per-page data Firecrawl returns when polling GET /v1/crawl/{id}.
 */
export function buildCrawlResponse(result: CrawlResult) {
  const completed = result.pages.filter((p) => p.status === 'done')
  const sample = completed.slice(0, 2).map((p) => ({
    markdown: p.markdown.length > 160 ? `${p.markdown.slice(0, 157)}...` : p.markdown,
    metadata: {
      sourceURL: p.url,
      statusCode: p.statusCode,
      title: p.title,
    },
    links: p.discoveredLinks,
  }))

  return {
    status: 'completed',
    total: result.totals.crawled,
    completed: completed.length,
    creditsUsed: completed.length,
    data: sample,
  }
}

// ── Live mode ────────────────────────────────────────────────────────────────

/** Shape of the live /api/firecrawl-demo crawl response payload. */
export interface LiveCrawlData {
  links: string[]
  seed: {
    url: string
    markdown: string
    title?: string
    statusCode?: number
    discoveredLinks: string[]
  }
}

/** Derive a path (with query) from a full URL, falling back to the raw string. */
function urlToPath(url: string): string {
  try {
    const u = new URL(url)
    return (u.pathname || '/') + (u.search || '')
  } catch {
    return url
  }
}

/** Short title from a URL path, used when the live response has no <title>. */
function titleFromUrl(url: string): string {
  const path = urlToPath(url)
  if (path === '/' || path === '') return 'Home'
  const last = path.split('/').filter(Boolean).pop() ?? path
  return last.replace(/[-_]/g, ' ')
}

/**
 * Turn a live /map + /scrape response into the same CrawlResult shape the
 * simulation produces, so the visualization and inspector render real URLs and
 * real markdown without any other changes. The seed page (depth 0) carries the
 * scraped markdown; every other discovered URL is shown as a depth-1 node that
 * the real API would crawl next.
 */
export function buildLiveResult(data: LiveCrawlData): CrawlResult {
  const seedUrl = data.seed.url
  const seedMarkdown = data.seed.markdown ?? ''
  const seedTokens = estimateTokens(seedMarkdown)
  const seedBytes = seedMarkdown.length

  const seedPage: CrawledPage = {
    url: seedUrl,
    path: urlToPath(seedUrl),
    title: data.seed.title || titleFromUrl(seedUrl),
    depth: 0,
    statusCode: data.seed.statusCode ?? 200,
    rawHtmlBytes: seedBytes,
    markdown: seedMarkdown,
    cleanMarkdown: seedMarkdown,
    chromeMarkdown: seedMarkdown,
    discoveredLinks: data.seed.discoveredLinks ?? [],
    tokens: seedTokens,
    elapsedMs: 0,
    status: (data.seed.statusCode ?? 200) >= 400 ? 'error' : 'done',
    discoveredFrom: null,
  }

  // Every other mapped URL becomes a depth-1 discovered node. The live call only
  // scrapes the seed, so these are listed as queued-and-discovered, not fetched.
  const seen = new Set<string>([seedUrl])
  const discoveredPages: CrawledPage[] = []
  for (const link of data.links) {
    if (seen.has(link)) continue
    seen.add(link)
    discoveredPages.push({
      url: link,
      path: urlToPath(link),
      title: titleFromUrl(link),
      depth: 1,
      statusCode: 200,
      rawHtmlBytes: 0,
      markdown: '',
      cleanMarkdown: '',
      chromeMarkdown: '',
      discoveredLinks: [],
      tokens: 0,
      elapsedMs: 0,
      status: 'queued',
      discoveredFrom: seedUrl,
    })
  }

  const pages = [seedPage, ...discoveredPages]

  // A minimal event timeline so the scrubber and counters stay coherent.
  const events: CrawlEvent[] = []
  let eventIndex = 0
  const mappedLinks = Array.from(new Set([seedUrl, ...data.links]))
  events.push({
    index: eventIndex++,
    type: 'map',
    url: seedUrl,
    message: `Mapped ${mappedLinks.length} live URLs from /map`,
    pagesCompleted: 0,
    tokensExtracted: 0,
    elapsedMs: 0,
  })
  events.push({
    index: eventIndex++,
    type: 'discovered',
    url: seedUrl,
    message: `Discovered ${seedPage.path} (depth 0)`,
    pagesCompleted: 0,
    tokensExtracted: 0,
    elapsedMs: 0,
  })
  events.push({
    index: eventIndex++,
    type: 'rendering',
    url: seedUrl,
    message: `Rendering ${seedPage.path} (JS)`,
    pagesCompleted: 0,
    tokensExtracted: 0,
    elapsedMs: 0,
  })
  events.push({
    index: eventIndex++,
    type: 'markdown',
    url: seedUrl,
    message: `Extracted markdown from ${seedPage.path} (${seedTokens} tokens)`,
    pagesCompleted: 0,
    tokensExtracted: seedTokens,
    elapsedMs: 0,
  })
  events.push({
    index: eventIndex++,
    type: 'done',
    url: seedUrl,
    message: `Completed ${seedPage.path} (${seedPage.statusCode})`,
    pagesCompleted: seedPage.status === 'done' ? 1 : 0,
    tokensExtracted: seedTokens,
    elapsedMs: 0,
  })
  discoveredPages.forEach((p) => {
    events.push({
      index: eventIndex++,
      type: 'discovered',
      url: p.url,
      message: `Discovered ${p.path} (depth 1)`,
      pagesCompleted: seedPage.status === 'done' ? 1 : 0,
      tokensExtracted: seedTokens,
      elapsedMs: 0,
    })
  })

  return {
    pages,
    events,
    mappedLinks,
    totals: {
      discovered: pages.length,
      crawled: seedPage.status === 'done' ? 1 : 0,
      skipped: 0,
      tokens: seedTokens,
      rawBytes: seedBytes,
      elapsedMs: 0,
    },
  }
}

// ── Code export ──────────────────────────────────────────────────────────────

export type CodeLang = 'node' | 'python'

function jsArray(values: string[]): string {
  return `[${values.map((v) => `'${v.replace(/'/g, "\\'")}'`).join(', ')}]`
}

function pyList(values: string[]): string {
  return `[${values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(', ')}]`
}

/**
 * Generate copy-pasteable Firecrawl SDK code that matches the current crawl
 * config exactly. Supports the Node (@mendable/firecrawl-js) and Python
 * (firecrawl-py) SDKs.
 */
export function buildCrawlCode(seedUrl: string, config: CrawlConfig, lang: CodeLang): string {
  if (lang === 'node') {
    const opts: string[] = []
    if (config.includePaths.length > 0) opts.push(`  includePaths: ${jsArray(config.includePaths)},`)
    if (config.excludePaths.length > 0) opts.push(`  excludePaths: ${jsArray(config.excludePaths)},`)
    opts.push(`  maxDepth: ${config.maxDepth},`)
    opts.push(`  limit: ${config.limit},`)
    if (config.ignoreSitemap) opts.push(`  ignoreSitemap: true,`)
    opts.push(`  scrapeOptions: {`)
    opts.push(`    formats: ${jsArray(config.formats)},`)
    opts.push(`    onlyMainContent: ${config.onlyMainContent},`)
    opts.push(`  },`)

    return `import FirecrawlApp from '@mendable/firecrawl-js'

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

// Crawl the whole site into clean, LLM-ready markdown.
const result = await app.crawlUrl('${seedUrl}', {
${opts.join('\n')}
})

for (const page of result.data) {
  console.log(page.metadata.sourceURL, page.markdown.length, 'chars')
}`
  }

  // Python
  const params: string[] = []
  if (config.includePaths.length > 0) params.push(`    include_paths=${pyList(config.includePaths)},`)
  if (config.excludePaths.length > 0) params.push(`    exclude_paths=${pyList(config.excludePaths)},`)
  params.push(`    max_depth=${config.maxDepth},`)
  params.push(`    limit=${config.limit},`)
  if (config.ignoreSitemap) params.push(`    ignore_sitemap=True,`)
  params.push(`    scrape_options=ScrapeOptions(`)
  params.push(`        formats=${pyList(config.formats)},`)
  params.push(`        only_main_content=${config.onlyMainContent ? 'True' : 'False'},`)
  params.push(`    ),`)

  return `import os
from firecrawl import FirecrawlApp, ScrapeOptions

app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

# Crawl the whole site into clean, LLM-ready markdown.
result = app.crawl_url(
    "${seedUrl}",
${params.join('\n')}
)

for page in result.data:
    print(page.metadata.source_url, len(page.markdown), "chars")`
}

// ── Output exports ───────────────────────────────────────────────────────────

/**
 * Build a JSONL string with one { url, markdown, metadata } object per line —
 * the exact shape you would stream into a RAG ingestion pipeline.
 */
export function buildJsonl(pages: CrawledPage[]): string {
  return pages
    .filter((p) => p.status === 'done' || p.status === 'error')
    .map((p) =>
      JSON.stringify({
        url: p.url,
        markdown: p.markdown,
        metadata: {
          title: p.title,
          sourceURL: p.url,
          statusCode: p.statusCode,
          depth: p.depth,
          tokens: p.tokens,
        },
      }),
    )
    .join('\n')
}
