/**
 * Import contacts from EmailOctopus export to Resend
 *
 * Usage: tsx scripts/newsletter/import-to-resend.ts
 *
 * Requirements:
 * - RESEND_API_KEY in .env
 * - RESEND_AUDIENCE_ID in .env
 * - scripts/newsletter/emailoctopus-contacts.csv (run export script first)
 */

import { Resend } from 'resend'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)
const prisma = new PrismaClient()

interface Contact {
  email: string
  first_name: string
  last_name: string
  status: string
  tags: string
  subscribed_at: string
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function parseCSV(filePath: string): Promise<Contact[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const lines = content.split('\n')

  // Skip header
  const dataLines = lines.slice(1).filter(line => line.trim())

  const contacts: Contact[] = []

  for (const line of dataLines) {
    // Simple CSV parser - handles quoted fields
    const matches = line.match(/"([^"]*)"/g)
    if (!matches || matches.length < 6) continue

    const values = matches.map(m => m.replace(/^"|"$/g, ''))

    contacts.push({
      email: values[0],
      first_name: values[1],
      last_name: values[2],
      status: values[3],
      tags: values[4],
      subscribed_at: values[5]
    })
  }

  return contacts
}

async function importContacts(): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey) {
    throw new Error('RESEND_API_KEY must be set in .env')
  }

  if (!audienceId) {
    throw new Error('RESEND_AUDIENCE_ID must be set in .env')
  }

  console.log('🚀 Starting Resend contact import...')
  console.log(`📋 Audience ID: ${audienceId}`)

  // Load contacts from CSV
  const csvPath = path.join(process.cwd(), 'scripts/newsletter/emailoctopus-contacts.csv')
  console.log(`📂 Reading contacts from: ${csvPath}`)

  let contacts: Contact[]
  try {
    contacts = await parseCSV(csvPath)
  } catch (error) {
    console.error('❌ Failed to read CSV file. Did you run export-emailoctopus-contacts.ts first?')
    throw error
  }

  console.log(`📊 Found ${contacts.length} contacts to import`)

  // Filter to only SUBSCRIBED contacts (don't import unsubscribed/bounced)
  const subscribedContacts = contacts.filter(c => c.status === 'SUBSCRIBED')
  console.log(`✅ Filtering to ${subscribedContacts.length} SUBSCRIBED contacts`)

  // Batch import (Resend recommends batching to avoid rate limits)
  const batches = chunk(subscribedContacts, 50) // Conservative batch size
  let successCount = 0
  let errorCount = 0

  console.log(`\n📦 Processing ${batches.length} batches...`)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`\n[Batch ${i + 1}/${batches.length}] Processing ${batch.length} contacts...`)

    for (const contact of batch) {
      try {
        // Create contact in Resend
        const result = await resend.contacts.create({
          audienceId,
          email: contact.email,
          firstName: contact.first_name || undefined,
          lastName: contact.last_name || undefined,
          unsubscribed: false
        })

        // Update Prisma with Resend contact ID
        try {
          await prisma.newsletterSubscription.update({
            where: { email: contact.email },
            data: {
              resendContactId: result.data?.id || null,
              lastSyncedAt: new Date()
            }
          })
        } catch (dbError) {
          // Database might not be available - that's ok, we can sync later
          console.log(`   ⚠️  Could not update database for ${contact.email} (will sync later)`)
        }

        successCount++
        console.log(`   ✓ ${contact.email}`)

      } catch (error: any) {
        errorCount++

        if (error.message?.includes('already exists') || error.statusCode === 409) {
          console.log(`   ⚠️  ${contact.email} (already exists)`)
          successCount++ // Count as success since contact is in Resend
        } else {
          console.error(`   ✗ ${contact.email} - Error: ${error.message}`)
        }
      }

      // Small delay between contacts to be polite to API
      await sleep(50)
    }

    // Longer delay between batches
    if (i < batches.length - 1) {
      console.log('   ⏳ Waiting 2s before next batch...')
      await sleep(2000)
    }
  }

  await prisma.$disconnect()

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📈 Import Summary:')
  console.log(`   Total contacts in CSV: ${contacts.length}`)
  console.log(`   Subscribed contacts: ${subscribedContacts.length}`)
  console.log(`   Successfully imported: ${successCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log('='.repeat(50))

  if (successCount === subscribedContacts.length) {
    console.log('\n✨ Import complete! All contacts imported successfully.')
  } else if (successCount > 0) {
    console.log(`\n⚠️  Import completed with some errors. Check the logs above.`)
  } else {
    console.log('\n❌ Import failed. Check the errors above.')
    process.exit(1)
  }
}

// Run the import
importContacts().catch((error) => {
  console.error('💥 Import failed:', error)
  process.exit(1)
})
