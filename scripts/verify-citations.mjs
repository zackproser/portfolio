// Citation verifier — guards against hallucinated or dead references.
//
//   node scripts/verify-citations.mjs --slug the-attention-head
//   node scripts/verify-citations.mjs --all            # every blog post
//
// Extracts every external URL a post cites — from BpReferences
// `items={[{ href }]}` entries and inline markdown/JSX links — fetches
// each, and fails (exit 1) on:
//   - any non-2xx/3xx response (dead link), and
//   - any arXiv / ACL Anthology / DOI link whose fetched title does not
//     share significant words with the citation's own label (wrong-paper
//     / hallucinated-title guard).
// Publisher hosts that bot-block (403/303 to a real page) are reported
// as UNVERIFIED, not failed, so correct-but-paywalled DOIs don't break
// the build — but they're listed so a human can eyeball them.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'src', 'content', 'blog')

const args = process.argv.slice(2)
const slugArg = (() => { const i = args.indexOf('--slug'); return i !== -1 ? args[i + 1] : null })()
const all = args.includes('--all')
if (!slugArg && !all) {
  console.error('usage: node scripts/verify-citations.mjs --slug <post> | --all')
  process.exit(2)
}

const slugs = all
  ? fs.readdirSync(blogDir).filter((d) => fs.existsSync(path.join(blogDir, d, 'page.mdx')))
  : [slugArg]

const STOP = new Set(['the','a','an','of','for','and','to','in','on','with','is','are','how','why','from','into','your','you','it','its','as','at','by','or','via'])
const words = (s) => (s.toLowerCase().match(/[a-z0-9]{4,}/g) || []).filter((w) => !STOP.has(w))

// Pull citation {url, label} pairs from a post. Two sources:
//  - BpReferences items: { label: '...', href: '...' }
//  - inline links: [label](url)  and  href="url" ... >label<
function extractCitations(mdx) {
  const out = []
  const seen = new Set()
  const add = (url, label) => {
    if (!/^https?:\/\//.test(url)) return
    if (url.includes('zackproser.') || url.includes('b-cdn.net')) return // own assets/site
    const key = url.split('#')[0]
    if (seen.has(key)) return
    seen.add(key)
    out.push({ url: key, label: label || '' })
  }
  // BpReferences items. Labels are quoted strings that themselves
  // often contain the *other* quote char (single-quoted label holding
  // a double-quoted paper title), so match the label as "opening quote
  // … same quote", non-greedy — a naive [^'"]+ silently matches
  // nothing and the whole post reads as zero citations.
  for (const m of mdx.matchAll(/label:\s*(['"])(.*?)\1\s*,\s*href:\s*(['"])(https?:[^'"]+)\3/gs)) add(m[4], m[2])
  for (const m of mdx.matchAll(/href:\s*(['"])(https?:[^'"]+)\1\s*,\s*label:\s*(['"])(.*?)\3/gs)) add(m[2], m[4])
  // Any remaining href: URLs not paired above (labelless), so a link is never skipped
  for (const m of mdx.matchAll(/href:\s*(['"])(https?:[^'"]+)\1/g)) add(m[2], '')
  // inline markdown links
  for (const m of mdx.matchAll(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g)) add(m[2], m[1])
  return out
}

// Bidirectional-citation integrity. Posts using makeCitations([...]) declare
// each source's stable id once; the body cites it with <Cite id="..." />.
// A body cite pointing at an id the post never declared is a broken jump link
// (and a sign of a miscopied reference) — that fails. A declared source never
// cited inline is reported, not failed (an appendix may list further reading).
function extractCiteIntegrity(mdx) {
  const declared = []
  const call = mdx.match(/makeCitations\(\s*\[([\s\S]*?)\]\s*\)/)
  if (call) for (const m of call[1].matchAll(/\bid:\s*(['"])([^'"]+)\1/g)) declared.push(m[2])
  const used = []
  for (const m of mdx.matchAll(/<Cite\s+id=(['"])([^'"]+)\1\s*\/>/g)) used.push(m[2])
  const declaredSet = new Set(declared)
  const usedSet = new Set(used)
  return {
    declared,
    used,
    unknown: [...usedSet].filter((id) => !declaredSet.has(id)), // cited but not declared → FAIL
    uncited: declared.filter((id) => !usedSet.has(id)), // declared but never cited → note
  }
}

async function head(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 citation-verify' } })
    let title = ''
    const ct = res.headers.get('content-type') || ''
    if (res.ok && ct.includes('text/html')) {
      const body = (await res.text()).slice(0, 200000)
      const m = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
      title = m ? m[1].replace(/\s+/g, ' ').trim() : ''
    }
    return { status: res.status, title }
  } finally {
    clearTimeout(t)
  }
}

const TITLE_HOSTS = /(^|\.)arxiv\.org$|aclanthology\.org$/
let failures = 0
let unverified = 0

for (const slug of slugs) {
  const mdx = fs.readFileSync(path.join(blogDir, slug, 'page.mdx'), 'utf8')
  const cites = extractCitations(mdx)
  const link = extractCiteIntegrity(mdx)
  if (!cites.length && !link.declared.length) continue
  console.log(`\n${slug} — ${cites.length} citation(s)${link.used.length ? `, ${link.used.length} inline marker(s)` : ''}`)
  for (const id of link.unknown) { console.log(`  FAIL   <Cite id="${id}"> has no matching source in makeCitations — broken jump link`); failures++ }
  for (const id of link.uncited) console.log(`  note   source "${id}" is listed but never cited inline`)
  for (const { url, label } of cites) {
    let r
    try { r = await head(url) } catch (e) { console.log(`  FAIL   ${url}  (${e.name === 'AbortError' ? 'timeout' : e.message})`); failures++; continue }
    const host = new URL(url).host
    const titleHost = TITLE_HOSTS.test(host)
    if (r.status >= 400) {
      // Bot-blocked publishers (OUP, Springer, ACM, doi.org) — real page, not verifiable by us
      if ([401, 403, 429].includes(r.status) || host.includes('doi.org')) { console.log(`  UNVER  ${url}  (HTTP ${r.status} — publisher bot-block; verify by hand)`); unverified++; continue }
      console.log(`  FAIL   ${url}  (HTTP ${r.status})`); failures++; continue
    }
    if (titleHost && label && r.title) {
      const lw = new Set(words(label))
      const overlap = words(r.title).filter((w) => lw.has(w))
      if (overlap.length < 2) { console.log(`  FAIL   ${url}\n         label: "${label}"\n         page : "${r.title}"  (title mismatch — wrong or hallucinated citation)`); failures++; continue }
    }
    console.log(`  OK     ${url}${titleHost ? `  ✓ "${r.title.slice(0, 60)}"` : ''}`)
  }
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${failures} broken/mismatched, ${unverified} unverified (bot-blocked)`)
process.exit(failures === 0 ? 0 : 1)
