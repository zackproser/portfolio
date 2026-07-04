/**
 * Parse a content date defensively. Handles strict and sloppy ISO-ish strings
 * ('2026-07-02', '2025-6-2', '2025') without ever producing an Invalid Date.
 * Returns a Date, or null when the string has no parseable date.
 */
export function parseContentDate(dateString) {
  if (!dateString) return null
  const s = String(dateString).trim()

  // A bare year ('2025') carries no month/day — let callers show it verbatim
  // rather than inventing January 1.
  if (/^\d{4}$/.test(s)) return null

  const ymd = s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/)
  if (ymd) {
    return new Date(Date.UTC(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3] || 1)))
  }

  const iso = new Date(`${s}T00:00:00Z`)
  if (!isNaN(iso)) return iso

  const loose = new Date(s)
  return isNaN(loose) ? null : loose
}

/**
 * Format a content date for display. Falls back to the raw string when the
 * date has no parseable form (e.g. '2025' renders as '2025', never
 * 'Invalid Date').
 */
export function formatDate(dateString, options) {
  const parsed = parseContentDate(dateString)
  if (!parsed) return dateString ? String(dateString) : ''
  return parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  })
}
