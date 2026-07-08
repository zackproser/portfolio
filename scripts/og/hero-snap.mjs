// Captures the homepage hero (settled, chrome-free via ?snap) as a
// social share image. Run with the app serving locally:
//
//   pnpm build && pnpm start &
//   node scripts/og/hero-snap.mjs
//
// Writes public/og-hero.png (1200x630 @2x). Upload to the Bunny
// og-images path with the existing og:migrate flow when refreshing
// the homepage share card.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const out = path.join(root, 'public', 'og-hero.png')
const url = process.env.HERO_SNAP_URL || 'http://localhost:3000/?snap'

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]
const chrome = CHROME_PATHS.find((p) => fs.existsSync(p))
if (!chrome) {
  console.error('hero-snap: no Chrome/Chromium binary found')
  process.exit(1)
}

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--hide-scrollbars',
  '--force-device-scale-factor=2',
  '--window-size=1200,630',
  '--virtual-time-budget=8000',
  `--screenshot=${out}`,
  url,
])
console.log(`hero-snap: wrote ${out} from ${url}`)
