#!/usr/bin/env node
// Dump the GHX glossary chat Q&A log — the raw material for the
// post-event report. Usage: node scripts/ghx-chat-report.mjs [N]
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
