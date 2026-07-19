// Uploads a Blueprint post's generated card images from
// scripts/blueprint/out/ to Bunny CDN and purges the edge cache:
//
//   node scripts/blueprint/upload-art.mjs --slug the-tokenizer
//
// Reads BUNNY_API_KEY (account-level) from .env; fetches the
// `zackproser` storage-zone password via the Bunny API, then PUTs:
//   images/og-images/<slug>.png
//   images/blueprint-<slug>-hero.webp
//   images/blueprint-<slug>-hero-light.webp
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
dotenv.config({ path: path.join(root, '.env') })

const slugIdx = process.argv.indexOf('--slug')
const slug = slugIdx !== -1 ? process.argv[slugIdx + 1] : null
if (!slug) {
  console.error('usage: node scripts/blueprint/upload-art.mjs --slug <post-directory>')
  process.exit(1)
}
const apiKey = process.env.BUNNY_API_KEY
if (!apiKey) {
  console.error('upload-art: BUNNY_API_KEY not set (.env)')
  process.exit(1)
}

const outDir = path.join(root, 'scripts', 'blueprint', 'out')
const files = [
  { local: `${slug}.png`, remote: `images/og-images/${slug}.png`, type: 'image/png' },
  { local: `blueprint-${slug}-hero.webp`, remote: `images/blueprint-${slug}-hero.webp`, type: 'image/webp' },
  { local: `blueprint-${slug}-hero-light.webp`, remote: `images/blueprint-${slug}-hero-light.webp`, type: 'image/webp' },
]

const zones = await (
  await fetch('https://api.bunny.net/storagezone', { headers: { AccessKey: apiKey } })
).json()
const zone = zones.find((z) => z.Name === 'zackproser')
if (!zone) {
  console.error('upload-art: storage zone `zackproser` not found')
  process.exit(1)
}

for (const f of files) {
  const localPath = path.join(outDir, f.local)
  if (!fs.existsSync(localPath)) {
    console.warn(`skip (missing): ${localPath}`)
    continue
  }
  const res = await fetch(`https://storage.bunnycdn.com/zackproser/${f.remote}`, {
    method: 'PUT',
    headers: { AccessKey: zone.Password, 'Content-Type': f.type },
    body: fs.readFileSync(localPath),
  })
  const purge = await fetch(
    `https://api.bunny.net/purge?url=${encodeURIComponent(`https://zackproser.b-cdn.net/${f.remote}`)}`,
    { method: 'POST', headers: { AccessKey: apiKey } },
  )
  console.log(`${res.status} upload · ${purge.status} purge · https://zackproser.b-cdn.net/${f.remote}`)
}
