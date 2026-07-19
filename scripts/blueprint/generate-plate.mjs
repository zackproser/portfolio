// Typesets a DETACHABLE PLATE PDF for a Blueprint post from its
// plate.md content file, via headless Chrome print-to-PDF:
//
//   node scripts/blueprint/generate-plate.mjs --slug the-attention-head --asset bp-010-circuit-tracing
//
// Page 1 is an A2 landscape poster header (title block + plate name);
// following pages are the worksheet typeset from plate.md (a
// constrained markdown subset: ## sections, ### subheads, - bullets,
// numbered lists, paragraphs, --- rules, | tables |, and blank
// fill-in lines written as `____`).
//
// Output: scripts/blueprint/out/<asset>.pdf  → upload to Bunny at
// plates/<asset>.pdf with upload-plate.mjs.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const outDir = path.join(root, 'scripts', 'blueprint', 'out')
fs.mkdirSync(outDir, { recursive: true })

const arg = (flag) => {
  const i = process.argv.indexOf(flag)
  return i !== -1 ? process.argv[i + 1] : null
}
const slug = arg('--slug')
const assetId = arg('--asset')
if (!slug || !assetId) {
  console.error('usage: node scripts/blueprint/generate-plate.mjs --slug <post> --asset <asset-id>')
  process.exit(1)
}

const meta = JSON.parse(fs.readFileSync(path.join(root, 'src', 'content', 'blog', slug, 'metadata.json'), 'utf8'))
const bp = meta.blueprint || {}
const plateMd = fs.readFileSync(path.join(root, 'src', 'content', 'blog', slug, 'plate.md'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const inline = (s) => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/_{4,}/g, '<span class="blank"></span>')

// Constrained markdown → HTML
function renderMd(md) {
  const lines = md.replace(/\r/g, '').split('\n')
  const out = []
  let list = null // 'ul' | 'ol'
  let table = null // string[][]
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null } }
  const closeTable = () => {
    if (table) {
      const [head, ...rows] = table
      out.push('<table><thead><tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>')
      for (const r of rows) out.push('<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>')
      out.push('</tbody></table>')
      table = null
    }
  }
  for (const raw of lines) {
    const s = raw.trim()
    if (/^\|/.test(s)) {
      closeList()
      const cells = s.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue // separator row
      table = table || []
      table.push(cells)
      continue
    }
    closeTable()
    if (s.startsWith('### ')) { closeList(); out.push(`<h3>${inline(s.slice(4))}</h3>`); continue }
    if (s.startsWith('## ')) { closeList(); out.push(`<h2>${inline(s.slice(3))}</h2>`); continue }
    if (s.startsWith('# ')) { closeList(); out.push(`<h2>${inline(s.slice(2))}</h2>`); continue }
    if (/^---+$/.test(s)) { closeList(); out.push('<hr/>'); continue }
    const li = s.match(/^(?:[-*]|\d+[.)])\s+(.*)$/)
    if (li) {
      const want = /^\d/.test(s) ? 'ol' : 'ul'
      if (list !== want) { closeList(); out.push(`<${want}>`); list = want }
      out.push(`<li>${inline(li[1])}</li>`)
      continue
    }
    closeList()
    if (s) out.push(`<p>${inline(s)}</p>`)
  }
  closeList(); closeTable()
  return out.join('\n')
}

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
@page { size: A4; margin: 0; }
@page poster { size: A2 landscape; margin: 0; }
html, body { margin: 0; padding: 0; }
.poster { page: poster; width: 594mm; height: 420mm; box-sizing: border-box; position: relative;
  background-color: #16213e;
  background-image: linear-gradient(rgba(125,211,252,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.08) 1px, transparent 1px), linear-gradient(rgba(125,211,252,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.16) 1px, transparent 1px);
  background-size: 8mm 8mm, 8mm 8mm, 40mm 40mm, 40mm 40mm;
  color: #fbf7f0; font-family: 'Inter', sans-serif; padding: 30mm; }
.poster .frame { position: absolute; inset: 10mm; border: 1.2mm solid #e9f2fb; }
.poster .frame2 { position: absolute; inset: 14mm; border: 0.3mm solid rgba(233,242,251,.42); }
.poster .kicker { font-family: 'JetBrains Mono', monospace; font-size: 9mm; letter-spacing: 2mm; text-transform: uppercase; color: #cbd5e1; }
.poster .kicker b { color: #f39c12; font-weight: 400; }
.poster h1 { font-family: 'Source Serif 4', serif; font-weight: 800; font-size: 42mm; line-height: 1; margin: 18mm 0 8mm; letter-spacing: -0.02em; }
.poster .sub { font-family: 'JetBrains Mono', monospace; font-size: 8mm; color: #cbd5e1; letter-spacing: 1mm; }
.poster .tb { position: absolute; left: 30mm; right: 30mm; bottom: 24mm; display: flex; border: 0.4mm solid rgba(233,242,251,.42); font-family: 'JetBrains Mono', monospace; }
.poster .tb div { padding: 5mm 8mm; border-right: 0.3mm solid rgba(233,242,251,.42); font-size: 6mm; }
.poster .tb div:last-child { border-right: none; flex: 1; }
.poster .tb .lbl { display: block; font-size: 3.5mm; letter-spacing: 0.8mm; color: #94a3b8; }
.poster .tb .acc { color: #f39c12; }

.sheet { box-sizing: border-box; width: 210mm; min-height: 297mm; padding: 18mm 16mm; page-break-before: always;
  background: #fdfcf9; color: #1f2d3d; font-family: 'Inter', sans-serif; font-size: 10.5pt; line-height: 1.55; position: relative; }
.sheet .head { display: flex; justify-content: space-between; border-bottom: 0.6mm solid #2b5e8f; padding-bottom: 3mm; margin-bottom: 6mm;
  font-family: 'JetBrains Mono', monospace; font-size: 8pt; letter-spacing: 1px; text-transform: uppercase; color: #4d6b85; }
.sheet .head b { color: #b84a00; font-weight: 500; }
h2 { font-family: 'JetBrains Mono', monospace; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; color: #b84a00;
  border-top: 0.4mm solid #2b5e8f; padding-top: 3mm; margin: 8mm 0 3mm; }
h3 { font-family: 'Inter', sans-serif; font-size: 10.5pt; margin: 5mm 0 2mm; color: #1f2d3d; }
p { margin: 0 0 2.5mm; }
ul, ol { margin: 0 0 3mm; padding-left: 6mm; }
li { margin-bottom: 1.2mm; }
code { font-family: 'JetBrains Mono', monospace; font-size: 9pt; background: rgba(230,126,34,.08); color: #b84a00; padding: 0 1mm; }
hr { border: 0; border-top: 0.25mm dashed #a9c6de; margin: 5mm 0; }
table { border-collapse: collapse; width: 100%; margin: 2mm 0 4mm; font-size: 9.5pt; }
th, td { border: 0.25mm solid #a9c6de; padding: 1.8mm 2.5mm; text-align: left; vertical-align: top; }
th { font-family: 'JetBrains Mono', monospace; font-size: 8pt; letter-spacing: 1px; text-transform: uppercase; color: #4d6b85; background: #eef4fa; }
.blank { display: inline-block; min-width: 40mm; border-bottom: 0.3mm solid #4d6b85; height: 1em; }
</style></head>
<body>
  <div class="poster">
    <div class="frame"></div><div class="frame2"></div>
    <div class="kicker"><b>Nº ${esc(bp.number || '')}</b> · BLUEPRINT DEEP DIVE · DETACHABLE PLATE</div>
    <h1>${esc(meta.title)}</h1>
    <div class="sub">${esc(assetId.toUpperCase())} · ISSUED WITH TDD-${esc(bp.number || '')} · zackproser.com/blog/${esc(slug)}</div>
    <div class="tb">
      <div><span class="lbl">DRAWING</span>TDD-${esc(bp.number || '')}</div>
      <div><span class="lbl">SUBJECT</span>${esc(bp.subject || '')}</div>
      <div><span class="lbl">PLATE</span><span class="acc">${esc(assetId)}</span></div>
      <div><span class="lbl">DRAWN BY</span>zackproser.com</div>
    </div>
  </div>
  <div class="sheet">
    <div class="head"><span>${esc(assetId.toUpperCase())} · WORKSHEET</span><span><b>TDD-${esc(bp.number || '')}</b> · zackproser.com</span></div>
    ${renderMd(plateMd)}
  </div>
</body></html>`

const htmlPath = path.join(outDir, `${assetId}.html`)
fs.writeFileSync(htmlPath, html)

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]
const chrome = CHROME_PATHS.find((p) => fs.existsSync(p))
if (!chrome) {
  console.error('generate-plate: no Chrome/Chromium found')
  process.exit(1)
}
const pdfPath = path.join(outDir, `${assetId}.pdf`)
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-pdf-header-footer',
  '--virtual-time-budget=10000',
  `--print-to-pdf=${pdfPath}`,
  `file://${htmlPath}`,
])
fs.unlinkSync(htmlPath)
console.log(pdfPath)
