'use server'

import { revalidatePath } from 'next/cache'
import { verifyDatabaseField } from '@/lib/vector-database-service'

export async function verifyDatabaseFieldAction(
  databaseId: string,
  fieldName: string,
  sourceId: string,
  verifiedBy: string,
  notes?: string
) {
  await verifyDatabaseField(databaseId, fieldName, sourceId, verifiedBy, notes)
  revalidatePath('/admin/vectordatabases')
  revalidatePath('/vectordatabases')
  return { success: true }
}
