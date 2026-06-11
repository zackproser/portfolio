#!/usr/bin/env node
// Dump the GHX glossary chat Q&A log — the raw material for the
// post-event report. Usage: node scripts/ghx-chat-report.mjs [N]
//
// NOTE: local .env points at a DIFFERENT Neon endpoint than production
// (ep-polished-dew vs ep-rough-voice). Real workshop traffic lands in
// production. To read it:
//   npx vercel env pull /tmp/prod-env --environment=production
//   POSTGRES_URL="$(grep ^POSTGRES_URL= /tmp/prod-env | cut -d'"' -f2)" \
//     node scripts/ghx-chat-report.mjs 100 && rm /tmp/prod-env
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const limit = Number(process.argv[2] ?? 50)

const rows = await prisma.ghxChatLog.findMany({
  orderBy: { createdAt: 'desc' },
  take: limit,
})
console.log(`${rows.length} most recent questions (of ${await prisma.ghxChatLog.count()} total)\n`)
for (const r of rows.reverse()) {
  console.log(`── ${r.createdAt.toISOString()}`)
  console.log(`Q: ${r.question}`)
  console.log(`A: ${r.answer.slice(0, 300)}${r.answer.length > 300 ? '…' : ''}\n`)
}
await prisma.$disconnect()
