/**
 * Export contacts from EmailOctopus to CSV and sync to Prisma database
 *
 * Usage: tsx scripts/newsletter/export-emailoctopus-contacts.ts
 *
 * Requirements:
 * - EMAIL_OCTOPUS_API_KEY in .env
 * - EMAIL_OCTOPUS_LIST_ID in .env
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

interface EmailOctopusContact {
  id: string
  email_address: string
  status: string
  fields: {
    FirstName?: string
    LastName?: string
    [key: string]: any
  }
  tags: string[]
  created_at: string
}

interface ExportedContact {
  email: string
  first_name: string
  last_name: string
  status: string
  tags: string
  subscribed_at: string
}

async function exportContacts(): Promise<void> {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
  const listId = process.env.EMAIL_OCTOPUS_LIST_ID

  if (!apiKey || !listId) {
    throw new Error('EMAIL_OCTOPUS_API_KEY and EMAIL_OCTOPUS_LIST_ID must be set in .env')
  }

  console.log('🚀 Starting EmailOctopus contact export...')
  console.log(`📋 List ID: ${listId}`)

  let allContacts: EmailOctopusContact[] = []
  let page = 1
  const limit = 100

  // Paginate through all contacts
  while (true) {
    console.log(`📥 Fetching page ${page}...`)

    const url = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts?api_key=${apiKey}&limit=${limit}&page=${page}`

    try {
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`EmailOctopus API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()

      if (!data.data || data.data.length === 0) {
        console.log('✅ Reached end of contacts')
        break
      }

      allContacts.push(...data.data)
      console.log(`   Found ${data.data.length} contacts (total: ${allContacts.length})`)

      page++

      // Rate limiting - be nice to EmailOctopus API
      await new Promise(resolve => setTimeout(resolve, 250))

    } catch (error) {
      console.error(`❌ Error fetching page ${page}:`, error)
      throw error
    }
  }

  console.log(`\n📊 Total contacts exported: ${allContacts.length}`)

  // Convert to CSV format
  const exportedContacts: ExportedContact[] = allContacts.map(c => ({
    email: c.email_address,
    first_name: c.fields?.FirstName || '',
    last_name: c.fields?.LastName || '',
    status: c.status,
    tags: c.tags.join(','),
    subscribed_at: c.created_at
  }))

  // Save to CSV
  const csvHeader = 'email,first_name,last_name,status,tags,subscribed_at\n'
  const csvRows = exportedContacts.map(c =>
    `"${c.email}","${c.first_name}","${c.last_name}","${c.status}","${c.tags}","${c.subscribed_at}"`
  ).join('\n')

  const csvContent = csvHeader + csvRows
  const csvPath = path.join(process.cwd(), 'scripts/newsletter/emailoctopus-contacts.csv')

  await fs.writeFile(csvPath, csvContent, 'utf-8')
  console.log(`\n💾 CSV saved to: ${csvPath}`)

  // Sync to Prisma database (for backup)
  console.log('\n🔄 Syncing to Prisma database...')

  try {
    let syncedCount = 0
    let skippedCount = 0

    for (const contact of exportedContacts) {
      try {
        await prisma.newsletterSubscription.upsert({
          where: { email: contact.email },
          create: {
            email: contact.email,
            firstName: contact.first_name || null,
            lastName: contact.last_name || null,
            status: contact.status,
            source: 'emailoctopus_migration',
            subscribedAt: new Date(contact.subscribed_at),
          },
          update: {
            firstName: contact.first_name || null,
            lastName: contact.last_name || null,
            status: contact.status,
            lastSyncedAt: new Date(),
          }
        })
        syncedCount++
      } catch (err) {
        console.error(`   ⚠️  Failed to sync ${contact.email}:`, err)
        skippedCount++
      }
    }

    console.log(`✅ Synced ${syncedCount} contacts to database`)
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} contacts due to errors`)
    }

  } catch (error) {
    console.error('❌ Error syncing to database:', error)
    console.log('💡 Note: Database may not be available yet. CSV export is still saved.')
  } finally {
    await prisma.$disconnect()
  }

  // Print statistics
  console.log('\n📈 Export Statistics:')
  console.log(`   Total contacts: ${allContacts.length}`)

  const statusCounts = exportedContacts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('   By status:')
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`      ${status}: ${count}`)
  })

  console.log('\n✨ Export complete!')
}

// Run the export
exportContacts().catch((error) => {
  console.error('💥 Export failed:', error)
  process.exit(1)
})
