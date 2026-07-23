// Generates the three Blueprint Deep Dive card images for a post from
// its metadata.json, via headless Chrome (same approach as
// scripts/og/hero-snap.mjs):
//
//   node scripts/blueprint/generate-art.mjs --slug the-tokenizer
//
// Outputs to scripts/blueprint/out/:
//   <slug>.png                     1200x630  OG card (dark)
//   blueprint-<slug>-hero.webp     1000x1250 index hero (dark)
//   blueprint-<slug>-hero-light.webp         index hero (light print)
//
// Requires Google Chrome and (for .webp) cwebp on PATH. Upload with
// scripts/blueprint/upload-art.mjs.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const outDir = path.join(root, 'scripts', 'blueprint', 'out')
fs.mkdirSync(outDir, { recursive: true })

const slugIdx = process.argv.indexOf('--slug')
const slug = slugIdx !== -1 ? process.argv[slugIdx + 1] : null
if (!slug) {
  console.error('usage: node scripts/blueprint/generate-art.mjs --slug <post-directory>')
  process.exit(1)
}

const metaPath = path.join(root, 'src', 'content', 'blog', slug, 'metadata.json')
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
const bp = meta.blueprint || {}
const title = meta.title
const subtitle = bp.subtitle || meta.description || ''
const number = bp.number || '000'
const readTime = bp.readTime || ''

const THEMES = {
  dark: {
    pageBg: '#0f0f1f',
    vars: '--bp-paper:#16213e;--bp-grid:rgba(125,211,252,.08);--bp-grid-major:rgba(125,211,252,.16);--bp-line:#e9f2fb;--bp-line-soft:rgba(233,242,251,.42);--og-ink:#fbf7f0;--og-muted:#cbd5e1;--og-accent:#f39c12',
  },
  light: {
    pageBg: '#dbe9f6',
    vars: '--bp-paper:#dbe9f6;--bp-grid:rgba(43,94,143,.14);--bp-grid-major:rgba(43,94,143,.24);--bp-line:#2b5e8f;--bp-line-soft:rgba(43,94,143,.4);--og-ink:#1f2d3d;--og-muted:#4d6b85;--og-accent:#e67e22',
  },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Per-post signature figure. A post distinguishes its card by dropping a
// standalone `hero-figure.svg` (a distilled version of one of its own
// diagrams, currentColor, no external classes) beside its metadata. When
// present it replaces the generic transformer block below, so a wall of
// blueprints reads as distinct drawings instead of one card repeated.
const heroFigurePath = path.join(root, 'src', 'content', 'blog', slug, 'hero-figure.svg')
const HERO_FIGURE = fs.existsSync(heroFigurePath) ? fs.readFileSync(heroFigurePath, 'utf8') : null

// Motif for the card center: the post's signature figure sized to `maxW`,
// else the default transformer schematic.
const MOTIF = (height, yOff, maxW) =>
  HERO_FIGURE
    ? `<div style="width:${maxW}px;max-width:100%;color:var(--bp-line);opacity:.62">${HERO_FIGURE}</div>`
    : SCHEMATIC(height, yOff)

const SCHEMATIC = (height, yOff) => `
  <svg viewBox="0 0 400 ${height}" width="380" style="color:var(--bp-line);opacity:.6">
    <g fill="none" stroke="currentColor" stroke-width="1.2">
      <rect x="90" y="${yOff + 40}" width="220" height="56"></rect>
      <rect x="90" y="${yOff + 150}" width="220" height="56"></rect>
      <rect x="90" y="${yOff + 260}" width="220" height="56"></rect>
      <circle cx="200" cy="${yOff + 370}" r="16"></circle>
      <path d="M200 ${yOff} v40 M200 ${yOff + 96} v54 M200 ${yOff + 206} v54 M200 ${yOff + 316} v38" stroke-dasharray="5 4"></path>
      <path d="M330 ${yOff + 68} v310 h-114" stroke-dasharray="5 4"></path>
      <path d="M356 ${yOff + 40} v276 M348 ${yOff + 40} h16 M348 ${yOff + 316} h16"></path>
    </g>
    <g style="font:13px 'JetBrains Mono',monospace" fill="currentColor">
      <text x="104" y="${yOff + 72}">MULTI-HEAD ATTN</text>
      <text x="104" y="${yOff + 182}">LAYER NORM</text>
      <text x="104" y="${yOff + 292}">FFN · 4×</text>
      <text x="194" y="${yOff + 375}">+</text>
      <text x="366" y="${yOff + 184}" transform="rotate(90 366 ${yOff + 184})">× N LAYERS</text>
    </g>
    <circle cx="200" cy="${yOff + 20}" r="4" fill="var(--og-accent)" style="filter:drop-shadow(0 0 6px rgba(243,156,18,.8))"></circle>
    <circle cx="200" cy="${yOff + 404}" r="4" fill="var(--og-accent)" style="filter:drop-shadow(0 0 6px rgba(243,156,18,.8))"></circle>
  </svg>`

function shell(theme, width, height, body) {
  const t = THEMES[theme]
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,800;1,8..60,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
html,body{margin:0;padding:0;background:${t.pageBg}}
.og{${t.vars}}
</style></head>
<body>
<div class="og" style="width:${width}px;height:${height}px;box-sizing:border-box;position:relative;overflow:hidden;background-color:var(--bp-paper);background-image:linear-gradient(var(--bp-grid) 1px,transparent 1px),linear-gradient(90deg,var(--bp-grid) 1px,transparent 1px),linear-gradient(var(--bp-grid-major) 1px,transparent 1px),linear-gradient(90deg,var(--bp-grid-major) 1px,transparent 1px);background-size:24px 24px,24px 24px,120px 120px,120px 120px;color:var(--og-ink);font-family:'Inter',sans-serif">
  <div style="position:absolute;inset:24px;border:2px solid var(--bp-line);pointer-events:none"></div>
  <div style="position:absolute;inset:32px;border:1px solid var(--bp-line-soft);pointer-events:none"></div>
  <div style="position:absolute;top:14px;left:14px;width:14px;height:14px;border-top:2px solid var(--og-accent);border-left:2px solid var(--og-accent)"></div>
  <div style="position:absolute;top:14px;right:14px;width:14px;height:14px;border-top:2px solid var(--og-accent);border-right:2px solid var(--og-accent)"></div>
  <div style="position:absolute;bottom:14px;left:14px;width:14px;height:14px;border-bottom:2px solid var(--og-accent);border-left:2px solid var(--og-accent)"></div>
  <div style="position:absolute;bottom:14px;right:14px;width:14px;height:14px;border-bottom:2px solid var(--og-accent);border-right:2px solid var(--og-accent)"></div>
  ${body}
</div>
</body></html>`
}

const titleblock = (fontSize) => `
    <div style="display:flex;gap:0;border:1px solid var(--bp-line-soft);font-family:'JetBrains Mono',monospace">
      <div style="padding:${fontSize}px 22px;border-right:1px solid var(--bp-line-soft)"><div style="font-size:11px;letter-spacing:.14em;color:var(--og-muted)">DRAWING</div><div style="font-size:16px;margin-top:4px">TDD-${esc(number)}</div></div>
      <div style="padding:${fontSize}px 22px;border-right:1px solid var(--bp-line-soft)"><div style="font-size:11px;letter-spacing:.14em;color:var(--og-muted)">READ TIME</div><div style="font-size:16px;margin-top:4px;color:var(--og-accent)">${esc(readTime)}</div></div>
      <div style="padding:${fontSize}px 22px;flex:1"><div style="font-size:11px;letter-spacing:.14em;color:var(--og-muted)">DRAWN BY</div><div style="font-size:16px;margin-top:4px">zackproser.com</div></div>
    </div>`

const strip = (fs2) => `
    <div style="display:flex;align-items:center;gap:14px;font-family:'JetBrains Mono',monospace;font-size:${fs2}px;letter-spacing:.18em;text-transform:uppercase;color:var(--og-muted)">
      <span style="color:var(--og-accent)">Nº ${esc(number)}</span>
      <span style="flex:1;border-top:1px solid var(--bp-line-soft)"></span>
      <span>Blueprint Deep Dive</span>
    </div>`

function ogBody() {
  return `
  <div style="position:absolute;right:40px;top:0;height:100%;width:400px;display:flex;align-items:center;justify-content:center">${MOTIF(460, 40, 380)}</div>
  <div style="position:absolute;left:64px;top:64px;right:440px;bottom:64px;display:flex;flex-direction:column">
    ${strip(15)}
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="font-family:'Source Serif 4',serif;font-weight:800;font-size:84px;line-height:1;letter-spacing:-0.02em">${esc(title)}</div>
      <div style="font-family:'Source Serif 4',serif;font-style:italic;font-size:26px;color:var(--og-muted);margin-top:22px;max-width:600px;line-height:1.35">${esc(subtitle)}</div>
    </div>
    ${titleblock(12)}
  </div>`
}

function heroBody() {
  return `
  <div style="position:absolute;left:64px;right:64px;top:64px;bottom:64px;display:flex;flex-direction:column">
    ${strip(16)}
    <div style="margin-top:64px">
      <div style="font-family:'Source Serif 4',serif;font-weight:800;font-size:96px;line-height:1.02;letter-spacing:-0.02em">${esc(title)}</div>
      <div style="font-family:'Source Serif 4',serif;font-style:italic;font-size:30px;color:var(--og-muted);margin-top:26px;line-height:1.4">${esc(subtitle)}</div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">${MOTIF(460, 20, 840)}</div>
    ${titleblock(14)}
  </div>`
}

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]
const chrome = CHROME_PATHS.find((p) => fs.existsSync(p))
if (!chrome) {
  console.error('generate-art: no Chrome/Chromium binary found')
  process.exit(1)
}

function snap(html, width, height, outPng) {
  const htmlPath = outPng.replace(/\.png$/, '.html')
  fs.writeFileSync(htmlPath, html)
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    `--window-size=${width},${height}`,
    '--virtual-time-budget=8000',
    `--screenshot=${outPng}`,
    `file://${htmlPath}`,
  ])
  fs.unlinkSync(htmlPath)
}

function toWebp(png, webp) {
  try {
    execFileSync('cwebp', ['-q', '88', png, '-o', webp], { stdio: 'ignore' })
    fs.unlinkSync(png)
    return webp
  } catch {
    console.warn(`cwebp unavailable — keeping ${png} (upload will use .png)`)
    return png
  }
}

const ogOut = path.join(outDir, `${slug}.png`)
snap(shell('dark', 1200, 630, ogBody()), 1200, 630, ogOut)
console.log(ogOut)

const heroPng = path.join(outDir, `blueprint-${slug}-hero.png`)
snap(shell('dark', 1000, 1250, heroBody()), 1000, 1250, heroPng)
console.log(toWebp(heroPng, path.join(outDir, `blueprint-${slug}-hero.webp`)))

const heroLightPng = path.join(outDir, `blueprint-${slug}-hero-light.png`)
snap(shell('light', 1000, 1250, heroBody()), 1000, 1250, heroLightPng)
console.log(toWebp(heroLightPng, path.join(outDir, `blueprint-${slug}-hero-light.webp`)))
