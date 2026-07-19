// Generates the "drawing issued" broadcast email for a Blueprint post:
//
//   node scripts/blueprint/issue-email.mjs --slug the-tokenizer
//
// Writes scripts/blueprint/out/issue-<slug>.html and prints a suggested
// subject line. Send it as a Resend dashboard broadcast to the
// `interest:blueprint-series` topic segment (the topic is auto-created
// by the first capture signup; broadcasts to a topic go only to
// opted-in contacts and carry Resend's unsubscribe handling).
//
// Email HTML is table-based with inline styles for client
// compatibility; the hero image carries the blueprint look.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const outDir = path.join(root, 'scripts', 'blueprint', 'out')
fs.mkdirSync(outDir, { recursive: true })

const slugIdx = process.argv.indexOf('--slug')
const slug = slugIdx !== -1 ? process.argv[slugIdx + 1] : null
if (!slug) {
  console.error('usage: node scripts/blueprint/issue-email.mjs --slug <post-directory>')
  process.exit(1)
}

const meta = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'content', 'blog', slug, 'metadata.json'), 'utf8'),
)
const bp = meta.blueprint || {}
const number = bp.number || '000'
const url = `https://zackproser.com/blog/${slug}`
const ogImage = `https://zackproser.b-cdn.net/images/og-images/${slug}.png`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TDD-${esc(number)} issued</title></head>
<body style="margin:0;padding:0;background-color:#f5f1e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1e8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:2px;color:#8b7355;padding:0 4px 12px;text-transform:uppercase;">
          Revision notice &middot; Blueprint Deep Dive
        </td></tr>
        <tr><td style="border:2px solid #2b5e8f;background-color:#16213e;">
          <a href="${url}" style="text-decoration:none;">
            <img src="${ogImage}" width="600" alt="TDD-${esc(number)} — ${esc(meta.title)}" style="width:100%;height:auto;display:block;border:0;" />
          </a>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:24px 28px 8px;font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#fbf7f0;">
              ${esc(meta.title)}
            </td></tr>
            <tr><td style="padding:0 28px 18px;font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.5;color:#cbd5e1;">
              ${esc(bp.subtitle || meta.description || '')}
            </td></tr>
            <tr><td style="padding:0 28px 8px;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:1px;color:#94a3b8;">
              DRAWING TDD-${esc(number)} &middot; ${esc(bp.subject || '')} &middot; ${esc(bp.readTime || '')}
            </td></tr>
            <tr><td style="padding:16px 28px 28px;">
              <a href="${url}" style="display:inline-block;background-color:#f39c12;color:#ffffff;font-family:Menlo,Consolas,monospace;font-size:13px;letter-spacing:1px;padding:12px 24px;text-decoration:none;">OPEN THE DRAWING &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 4px;font-family:Menlo,Consolas,monospace;font-size:11px;line-height:1.7;color:#8b7355;">
          You're receiving this because you asked for the next Blueprint drawing on zackproser.com.<br/>
          <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8b7355;">Unsubscribe</a> &middot; Zachary Proser
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

const out = path.join(outDir, `issue-${slug}.html`)
fs.writeFileSync(out, html)
console.log(out)
console.log(`\nSuggested subject: TDD-${number} issued — ${meta.title}`)
console.log('Send as a Resend dashboard broadcast → audience: General → topic: interest:blueprint-series')
