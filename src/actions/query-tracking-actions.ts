'use server'

import { trackQuery, trackQueryClick, type TrackQueryParams } from '@/lib/query-tracking-service'

export async function trackSearchQuery(params: TrackQueryParams) {
  try {
    const result = await trackQuery(params)
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Failed to track query:', error)
    return { success: false, error: 'Failed to track query' }
  }
}

export async function trackSearchClick(queryId: string) {
  try {
    await trackQueryClick(queryId)
    return { success: true }
  } catch (error) {
    console.error('Failed to track click:', error)
    return { success: false }
  }
}
