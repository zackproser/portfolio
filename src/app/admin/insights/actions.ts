'use server'

import { revalidatePath } from 'next/cache'
import { markContentCreated } from '@/lib/query-tracking-service'

export async function markContentCreatedAction(normalizedQuery: string, contentUrl?: string) {
  await markContentCreated(normalizedQuery, contentUrl)
  revalidatePath('/admin/insights')
  return { success: true }
}
