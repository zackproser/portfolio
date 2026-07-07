// Generates src/data/corpus.json for the Mind on Fire hero.
// Scans src/content/blog/*/metadata.json, keeps posts that are not
// hiddenFromIndex, and extracts the opening paragraph from page.mdx.
// Runs at the start of `npm run build`, so the hero's star count,
// previews, and links stay correct as posts are added.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'src', 'content', 'blog')
const outFile = path.join(root, 'src', 'data', 'corpus.json')

function extractExcerpt(mdxPath, fallback) {
  let ex = ''
  try {
    const lines = fs.readFileSync(mdxPath, 'utf8').split('\n')
    let buf = []
    for (const line of lines) {
      const s = line.trim()
      if (!s) {
        if (buf.join(' ').length > 100) break
        buf = []
        continue
      }
      if (/^(import|export|#|<|!\[|\{|-|\*|\||```|>)/.test(s)) {
        buf = []
        continue
      }
      buf.push(s)
      if (buf.join(' ').length > 400) break
    }
    ex = buf
      .join(' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    /* no page.mdx — fall through to description */
  }
  if (ex.length < 60 && fallback) ex = fallback
  if (ex.length > 220) ex = ex.slice(0, 217).replace(/\s+\S*$/, '') + '…'
  return ex
}

const posts = []
let hidden = 0
for (const dir of fs.readdirSync(blogDir)) {
  const metaPath = path.join(blogDir, dir, 'metadata.json')
  if (!fs.existsSync(metaPath)) continue
  let meta
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  } catch {
    continue
  }
  if (!meta.title) continue
  if (meta.hiddenFromIndex === true) {
    hidden++
    continue
  }
  posts.push({
    t: meta.title,
    s: dir,
    d: (meta.date || '').slice(0, 7),
    e: extractExcerpt(path.join(blogDir, dir, 'page.mdx'), meta.description),
    img: meta.image || '',
  })
}

posts.sort((a, b) => (b.d || '').localeCompare(a.d || ''))
fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify({ count: posts.length, posts }))
console.log(`corpus: ${posts.length} indexable posts (${hidden} hidden) → src/data/corpus.json`)
