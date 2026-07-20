// Uploads a generated DETACHABLE PLATE PDF to Bunny CDN:
//
//   node scripts/blueprint/upload-plate.mjs --asset bp-010-circuit-tracing
//
// Reads scripts/blueprint/out/<asset>.pdf → plates/<asset>.pdf, then
// purges the edge cache. Same credentials flow as upload-art.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
dotenv.config({ path: path.join(root, '.env') })

const i = process.argv.indexOf('--asset')
const asset = i !== -1 ? process.argv[i + 1] : null
if (!asset) {
  console.error('usage: node scripts/blueprint/upload-plate.mjs --asset <asset-id>')
  process.exit(1)
}
const apiKey = process.env.BUNNY_API_KEY
if (!apiKey) {
  console.error('upload-plate: BUNNY_API_KEY not set (.env)')
  process.exit(1)
}
const localPath = path.join(root, 'scripts', 'blueprint', 'out', `${asset}.pdf`)
if (!fs.existsSync(localPath)) {
  console.error(`upload-plate: missing ${localPath} — run blueprint:plate first`)
  process.exit(1)
}

const zones = await (await fetch('https://api.bunny.net/storagezone', { headers: { AccessKey: apiKey } })).json()
const zone = zones.find((z) => z.Name === 'zackproser')
if (!zone) {
  console.error('upload-plate: storage zone `zackproser` not found')
  process.exit(1)
}
const remote = `plates/${asset}.pdf`
const res = await fetch(`https://storage.bunnycdn.com/zackproser/${remote}`, {
  method: 'PUT',
  headers: { AccessKey: zone.Password, 'Content-Type': 'application/pdf' },
  body: fs.readFileSync(localPath),
})
const purge = await fetch(
  `https://api.bunny.net/purge?url=${encodeURIComponent(`https://zackproser.b-cdn.net/${remote}`)}`,
  { method: 'POST', headers: { AccessKey: apiKey } },
)
console.log(`${res.status} upload · ${purge.status} purge · https://zackproser.b-cdn.net/${remote}`)
