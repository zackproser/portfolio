#!/usr/bin/env node
// Fetch real YouTube chapters for every video in src/content/videos/
// and cache them to <slug>/chapters.json so the Theater page can show
// authentic timestamps without refetching at build time.
//
// Source of truth, in order:
//   1. ytInitialData.playerOverlays …multiMarkersPlayerBarRenderer
//      (YouTube's own chapter rail — populated when the author marked
//      chapters, or when the Auto-Chapters feature ran)
//   2. Timestamp lines in the video description, e.g. "0:00 Intro"
//      (what creators write when they want chapters on a video that
//      doesn't qualify for the rail)
//
// Skips videos that already have chapters.json unless --force is set.
// Writes [] when nothing is found, so the page knows to hide the
// section instead of showing fake placeholders.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIDEOS_DIR = path.join(__dirname, '..', 'src', 'content', 'videos')
const YT_ID_RE = /(?:youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/
const TIMESTAMP_LINE_RE = /^\s*(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s+[-–—:]?\s*(.+?)\s*$/gm
const FORCE = process.argv.includes('--force')
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'

function toSeconds(h, m, s) {
  return (Number(h) || 0) * 3600 + Number(m) * 60 + Number(s)
}

function extractYouTubeId(mdx) {
  const m = mdx.match(YT_ID_RE)
  return m ? m[1] : null
}

// Pull ytInitialData's chapter array. The JSON is embedded in the watch
// page as `var ytInitialData = {...};`. We balance braces from the first
// `{` after that marker to isolate the object, then dig into it.
function parseYtInitialData(html) {
  const marker = 'var ytInitialData = '
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
  try { return JSON.parse(html.slice(objStart, end)) }
  catch { return null }
}

function chaptersFromInitialData(data) {
  const chapters = data?.playerOverlays?.playerOverlayRenderer
    ?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar
    ?.multiMarkersPlayerBarRenderer?.markersMap?.[0]?.value?.chapters
  if (!Array.isArray(chapters) || !chapters.length) return null
  const out = []
  for (const c of chapters) {
    const r = c?.chapterRenderer
    if (!r) continue
    const title = r?.title?.simpleText
    const ms = r?.timeRangeStartMillis
    if (typeof title !== 'string' || typeof ms !== 'number') continue
    out.push({ t: Math.round(ms / 1000), title: title.trim() })
  }
  return out.length ? out : null
}

function descriptionFromInitialData(data) {
  const parts = data?.contents?.twoColumnWatchNextResults?.results?.results
    ?.contents
  if (!Array.isArray(parts)) return ''
  for (const p of parts) {
    const runs = p?.videoSecondaryInfoRenderer?.attributedDescription?.content
    if (typeof runs === 'string' && runs.length) return runs
    const r2 = p?.videoSecondaryInfoRenderer?.description?.runs
    if (Array.isArray(r2)) return r2.map(x => x.text || '').join('')
  }
  return ''
}

function chaptersFromDescription(desc) {
  if (!desc) return null
  const found = []
  for (const m of desc.matchAll(TIMESTAMP_LINE_RE)) {
    const [, h, mm, ss, title] = m
    if (!title) continue
    const t = toSeconds(h, mm, ss)
    // Guard against garbage: first chapter must be 0 or very close.
    if (!found.length && t > 15) continue
    found.push({ t, title: title.replace(/[-–—:]\s*$/, '').trim() })
  }
  // Must have at least 2 markers and be strictly ascending to count.
  if (found.length < 2) return null
  for (let i = 1; i < found.length; i++) if (found[i].t <= found[i - 1].t) return null
  return found
}

async function fetchChaptersForId(ytId) {
  const url = `https://www.youtube.com/watch?v=${ytId}&hl=en`
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const data = parseYtInitialData(html)
  if (!data) return []
  const fromOverlay = chaptersFromInitialData(data)
  if (fromOverlay) return fromOverlay
  const fromDesc = chaptersFromDescription(descriptionFromInitialData(data))
  return fromDesc || []
}

async function processOne(slug) {
  const dir = path.join(VIDEOS_DIR, slug)
  const mdxPath = path.join(dir, 'page.mdx')
  const chaptersPath = path.join(dir, 'chapters.json')

  if (!FORCE) {
    try {
      await fs.access(chaptersPath)
      return { slug, status: 'skip (cached)', count: null }
    } catch {}
  }

  let mdx
  try { mdx = await fs.readFile(mdxPath, 'utf8') }
  catch { return { slug, status: 'no page.mdx', count: null } }

  const ytId = extractYouTubeId(mdx)
  if (!ytId) return { slug, status: 'no youtube id', count: null }

  try {
    const chapters = await fetchChaptersForId(ytId)
    await fs.writeFile(chaptersPath, JSON.stringify(chapters, null, 2) + '\n', 'utf8')
    return { slug, status: chapters.length ? 'ok' : 'none', count: chapters.length }
  } catch (err) {
    return { slug, status: `error: ${err.message}`, count: null }
  }
}

async function main() {
  const entries = await fs.readdir(VIDEOS_DIR, { withFileTypes: true })
  const slugs = entries.filter(e => e.isDirectory()).map(e => e.name).sort()

  console.log(`Found ${slugs.length} videos. Force=${FORCE}`)
  for (const slug of slugs) {
    const r = await processOne(slug)
    const count = r.count == null ? '' : ` (${r.count})`
    console.log(`  ${r.status.padEnd(14)} ${slug}${count}`)
    await new Promise(res => setTimeout(res, 400)) // be polite to YouTube
  }
}

main().catch(err => { console.error(err); process.exit(1) })
