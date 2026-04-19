#!/usr/bin/env node
// For every video in src/content/videos/, read the real durSec and
// viewCount out of YouTube's ytInitialPlayerResponse blob and write
// them back to metadata.json. Run once; re-run with --force to
// refresh the view counts periodically.
//
// The numbers Cursor seeded into metadata.json were random
// placeholders (all in the 500–1700 range); this replaces them with
// authoritative values so the Theater's "X videos · Y hours · Z
// views · updated" rule reflects reality.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIDEOS_DIR = path.join(__dirname, '..', 'src', 'content', 'videos')
const YT_ID_RE = /(?:youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/
const FORCE = process.argv.includes('--force')
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'

function extractBalanced(html, marker) {
  const start = html.indexOf(marker)
  if (start === -1) return null
  const objStart = start + marker.length
  let depth = 0, inStr = false, esc = false, end = -1
  for (let i = objStart; i < html.length; i++) {
    const ch = html[i]
    if (esc) { esc = false; continue }
    if (ch === '\\') { esc = true; continue }
    if (ch === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) { end = i + 1; break }
    }
  }
  if (end === -1) return null
  try { return JSON.parse(html.slice(objStart, end)) } catch { return null }
}

function extractYouTubeId(mdx) {
  const m = mdx.match(YT_ID_RE)
  return m ? m[1] : null
}

async function fetchStatsForId(ytId) {
  const url = `https://www.youtube.com/watch?v=${ytId}&hl=en`
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const player = extractBalanced(html, 'var ytInitialPlayerResponse = ')
  if (!player) throw new Error('no ytInitialPlayerResponse')
  const details = player?.videoDetails
  if (!details) throw new Error('no videoDetails')
  const durSec = Number(details.lengthSeconds) || 0
  const views = Number(details.viewCount) || 0
  return { durSec, views }
}

async function processOne(slug) {
  const dir = path.join(VIDEOS_DIR, slug)
  const mdxPath = path.join(dir, 'page.mdx')
  const metaPath = path.join(dir, 'metadata.json')

  let mdx
  try { mdx = await fs.readFile(mdxPath, 'utf8') }
  catch { return { slug, status: 'no page.mdx' } }
  const ytId = extractYouTubeId(mdx)
  if (!ytId) return { slug, status: 'no youtube id' }

  let meta
  try { meta = JSON.parse(await fs.readFile(metaPath, 'utf8')) }
  catch { return { slug, status: 'no metadata.json' } }

  if (!FORCE && meta._ytStatsFetchedAt) {
    return { slug, status: 'skip (cached)' }
  }

  try {
    const { durSec, views } = await fetchStatsForId(ytId)
    meta.durSec = durSec
    meta.views = views
    meta._ytStatsFetchedAt = new Date().toISOString().slice(0, 10)
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8')
    return { slug, status: `ok  ${durSec}s / ${views.toLocaleString()} views` }
  } catch (err) {
    return { slug, status: `error: ${err.message}` }
  }
}

async function main() {
  const entries = await fs.readdir(VIDEOS_DIR, { withFileTypes: true })
  const slugs = entries.filter(e => e.isDirectory()).map(e => e.name).sort()

  console.log(`Fetching real stats for ${slugs.length} videos. Force=${FORCE}`)
  for (const slug of slugs) {
    const r = await processOne(slug)
    console.log(`  ${r.status.padEnd(40)} ${slug}`)
    await new Promise(res => setTimeout(res, 400))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
