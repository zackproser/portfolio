#!/usr/bin/env node
/**
 * Verify that every published blog post emits a working Open Graph image.
 *
 * For each post it:
 *   1. fetches the rendered page and extracts the <meta property="og:image"> URL
 *   2. fails if that URL still contains the unresolved "[slug]" route segment
 *      (the bug where the OG route can't find the pre-generated static image)
 *   3. follows the URL and fails unless it returns HTTP 200 with an image/* type
 *
 * Exit code is non-zero if anything is broken, so it can BLOCK a CI pipeline.
 *
 * Usage:
 *   node scripts/og/verify-og.mjs                         # all posts vs production
 *   OG_VERIFY_BASE_URL=https://preview.example node ...   # against a preview deploy
 *   node scripts/og/verify-og.mjs --slug my-post          # one post
 *   node scripts/og/verify-og.mjs --sample 20             # a random-ish subset
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = (process.env.OG_VERIFY_BASE_URL || 'https://zackproser.com').replace(/\/$/, '')
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')
const CONCURRENCY = 8

const args = process.argv.slice(2)
const getArg = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : null
}
const onlySlug = getArg('--slug')
const sample = getArg('--sample') ? parseInt(getArg('--sample'), 10) : null

function getSlugs() {
  const dirs = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(BLOG_DIR, name, 'metadata.json')))
    .filter((name) => {
      try {
        const meta = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, name, 'metadata.json'), 'utf8'))
        return !meta.hiddenFromIndex
      } catch {
        return true
      }
    })
  if (onlySlug) return dirs.filter((s) => s === onlySlug)
  if (sample) return dirs.slice(0, sample)
  return dirs
}

const OG_RE = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i

async function check(slug) {
  const pageUrl = `${BASE_URL}/blog/${slug}`
  try {
    const res = await fetch(pageUrl, { headers: { 'user-agent': 'og-verify' } })
    if (!res.ok) return { slug, ok: false, reason: `page HTTP ${res.status}` }
    const html = await res.text()
    const m = html.match(OG_RE)
    if (!m) return { slug, ok: false, reason: 'no og:image meta tag' }
    const ogUrl = m[1].replace(/&amp;/g, '&')

    if (/%5Bslug%5D|\[slug\]/i.test(ogUrl)) {
      return { slug, ok: false, reason: 'og:image still contains unresolved [slug]' }
    }

    const imgRes = await fetch(ogUrl, { headers: { 'user-agent': 'og-verify' }, redirect: 'follow' })
    const type = imgRes.headers.get('content-type') || ''
    if (!imgRes.ok) return { slug, ok: false, reason: `og:image HTTP ${imgRes.status}` }
    if (!type.startsWith('image/')) return { slug, ok: false, reason: `og:image type "${type}"` }
    return { slug, ok: true }
  } catch (err) {
    return { slug, ok: false, reason: `fetch error: ${err.message}` }
  }
}

async function run() {
  const slugs = getSlugs()
  if (slugs.length === 0) {
    console.error(onlySlug ? `No post found for slug "${onlySlug}"` : 'No posts found')
    process.exit(1)
  }
  console.log(`Verifying OG images for ${slugs.length} post(s) against ${BASE_URL}\n`)

  const results = []
  for (let i = 0; i < slugs.length; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY)
    results.push(...(await Promise.all(batch.map(check))))
    process.stdout.write(`\r  checked ${Math.min(i + CONCURRENCY, slugs.length)}/${slugs.length}`)
  }
  process.stdout.write('\n\n')

  const failed = results.filter((r) => !r.ok)
  if (failed.length === 0) {
    console.log(`✅ All ${results.length} OG images are working.`)
    process.exit(0)
  }
  console.error(`❌ ${failed.length} of ${results.length} OG images are broken:\n`)
  for (const f of failed) console.error(`  • ${f.slug} — ${f.reason}`)
  process.exit(1)
}

run()
