// Pure simulation engine + shared types for the Firecrawl change-tracking demo.
// No network calls. Everything here mirrors the real Firecrawl change-tracking
// API shapes so the demo teaches the actual request/response contract.

// ─── Firecrawl change-tracking contract ─────────────────────────────────────

// changeStatus and visibility match the real Firecrawl changeTracking response.
export type ChangeStatus = 'new' | 'same' | 'changed' | 'removed'
export type Visibility = 'visible' | 'hidden'

// The diff mode the API can return. git-diff produces a unified text diff;
// json produces field-level { previous, current } pairs against your schema.
export type DiffMode = 'git-diff' | 'json'

// How often the scheduler re-scrapes a monitored page.
export type MonitorFrequency = 'hourly' | 'daily' | 'weekly'

export const FREQUENCY_SECONDS: Record<MonitorFrequency, number> = {
  hourly: 60 * 60,
  daily: 60 * 60 * 24,
  weekly: 60 * 60 * 24 * 7,
}

export const FREQUENCY_LABEL: Record<MonitorFrequency, string> = {
  hourly: 'Every hour',
  daily: 'Every day',
  weekly: 'Every week',
}

// A single structured field captured from a page (the json-mode payload).
export type StructuredFields = Record<string, string>

// One captured snapshot of a monitored page at a point in time.
export type Snapshot = {
  id: string
  // ISO 8601 with offset, matching Firecrawl's previousScrapeAt format.
  scrapedAt: string
  // The clean markdown Firecrawl returns for the page.
  markdown: string
  // Structured fields extracted for json-mode change tracking.
  fields: StructuredFields
}

// A monitored page = a target URL plus its snapshot timeline.
export type MonitoredPage = {
  id: string
  label: string
  url: string
  // Why someone would watch this page (compliance, pricing, etc.).
  purpose: string
  category: 'pricing' | 'changelog' | 'docs' | 'policy'
  // The json-mode extraction schema sent in the request (stringified JSON).
  schema: string
  // Suggested webhook/Slack channel for alerts.
  alertChannel: string
  snapshots: Snapshot[]
}

// ─── Diff result types ──────────────────────────────────────────────────────

export type DiffLineType = 'added' | 'removed' | 'context'

export type DiffLine = {
  type: DiffLineType
  text: string
}

// Field-level diff entry for json mode: { previous, current }.
export type FieldDiff = {
  field: string
  previous: string | null
  current: string | null
  // 'added' | 'removed' | 'modified' | 'unchanged'
  kind: 'added' | 'removed' | 'modified' | 'unchanged'
}

// A computed change event between two adjacent snapshots.
export type ChangeEvent = {
  id: string
  pageId: string
  pageLabel: string
  url: string
  category: MonitoredPage['category']
  // The snapshot that produced this event.
  snapshotId: string
  // The prior snapshot it was compared against (null on first scrape).
  previousSnapshotId: string | null
  previousScrapeAt: string | null
  currentScrapeAt: string
  changeStatus: ChangeStatus
  visibility: Visibility
  // Line-level diff for git-diff mode.
  diffLines: DiffLine[]
  // Field-level diff for json mode.
  fieldDiffs: FieldDiff[]
  // Short human summary used in the event feed.
  summary: string
  // Count of added / removed lines for badges.
  addedCount: number
  removedCount: number
}

// ─── Diff computation ───────────────────────────────────────────────────────

// A small LCS-based line differ. Good enough to produce a believable
// unified-diff view (added/removed/context) for hand-built markdown snapshots.
export function computeLineDiff(previous: string, current: string): DiffLine[] {
  const a = previous.split('\n')
  const b = current.split('\n')
  const n = a.length
  const m = b.length

  // LCS table.
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  )
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1])
      }
    }
  }

  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      lines.push({ type: 'context', text: a[i] })
      i += 1
      j += 1
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push({ type: 'removed', text: a[i] })
      i += 1
    } else {
      lines.push({ type: 'added', text: b[j] })
      j += 1
    }
  }
  while (i < n) {
    lines.push({ type: 'removed', text: a[i] })
    i += 1
  }
  while (j < m) {
    lines.push({ type: 'added', text: b[j] })
    j += 1
  }

  return lines
}

// Build the unified-diff text (with +/- prefixes) from diff lines.
export function diffLinesToText(lines: DiffLine[]): string {
  return lines
    .map((line) => {
      if (line.type === 'added') return `+ ${line.text}`
      if (line.type === 'removed') return `- ${line.text}`
      return `  ${line.text}`
    })
    .join('\n')
}

// Compare two structured field maps into a field-level diff (json mode).
export function computeFieldDiff(
  previous: StructuredFields | null,
  current: StructuredFields
): FieldDiff[] {
  const keys = new Set<string>([
    ...Object.keys(previous ?? {}),
    ...Object.keys(current),
  ])

  const diffs: FieldDiff[] = []
  keys.forEach((field) => {
    const prevValue = previous ? previous[field] ?? null : null
    const currValue = current[field] ?? null

    let kind: FieldDiff['kind']
    if (prevValue === null && currValue !== null) kind = 'added'
    else if (prevValue !== null && currValue === null) kind = 'removed'
    else if (prevValue !== currValue) kind = 'modified'
    else kind = 'unchanged'

    diffs.push({ field, previous: prevValue, current: currValue, kind })
  })

  // Sort changed fields first so the inspector leads with what matters.
  const order: Record<FieldDiff['kind'], number> = {
    modified: 0,
    added: 1,
    removed: 2,
    unchanged: 3,
  }
  return diffs.sort((x, y) => order[x.kind] - order[y.kind])
}

// Derive changeStatus from two snapshots, matching Firecrawl semantics.
export function deriveChangeStatus(
  previous: Snapshot | null,
  current: Snapshot
): ChangeStatus {
  if (!previous) return 'new'
  if (current.markdown.trim().length === 0) return 'removed'
  if (previous.markdown === current.markdown) return 'same'
  return 'changed'
}

// Produce a short, human-readable summary of the most significant field change.
function summarizeChange(
  status: ChangeStatus,
  fieldDiffs: FieldDiff[],
  addedCount: number,
  removedCount: number
): string {
  if (status === 'new') return 'First scrape — baseline captured'
  if (status === 'same') return 'No change since last check'
  if (status === 'removed') return 'Page content removed'

  const modified = fieldDiffs.find((d) => d.kind === 'modified')
  if (modified) {
    return `${modified.field}: ${modified.previous} → ${modified.current}`
  }
  const added = fieldDiffs.find((d) => d.kind === 'added')
  if (added) {
    return `New field "${added.field}" appeared`
  }
  return `${addedCount} line${addedCount === 1 ? '' : 's'} added, ${removedCount} removed`
}

// Build the full change-event timeline for one monitored page.
export function buildChangeEvents(page: MonitoredPage): ChangeEvent[] {
  const events: ChangeEvent[] = []

  page.snapshots.forEach((snapshot, index) => {
    const previous = index > 0 ? page.snapshots[index - 1] : null
    const status = deriveChangeStatus(previous, snapshot)

    const diffLines = previous
      ? computeLineDiff(previous.markdown, snapshot.markdown)
      : computeLineDiff('', snapshot.markdown)
    const fieldDiffs = computeFieldDiff(previous?.fields ?? null, snapshot.fields)

    const addedCount = diffLines.filter((l) => l.type === 'added').length
    const removedCount = diffLines.filter((l) => l.type === 'removed').length

    events.push({
      id: `${page.id}-event-${index}`,
      pageId: page.id,
      pageLabel: page.label,
      url: page.url,
      category: page.category,
      snapshotId: snapshot.id,
      previousSnapshotId: previous?.id ?? null,
      previousScrapeAt: previous?.scrapedAt ?? null,
      currentScrapeAt: snapshot.scrapedAt,
      changeStatus: status,
      visibility: 'visible',
      diffLines,
      fieldDiffs,
      summary: summarizeChange(status, fieldDiffs, addedCount, removedCount),
      addedCount,
      removedCount,
    })
  })

  return events
}

// ─── Firecrawl request / response builders ──────────────────────────────────

// Build the exact request body the demo would POST to /v2/scrape.
export function buildScrapeRequest(
  page: MonitoredPage,
  modes: DiffMode[],
  schema: string
): string {
  let schemaObject: unknown
  try {
    schemaObject = JSON.parse(schema)
  } catch {
    schemaObject = { error: 'Invalid JSON schema — fix the schema editor' }
  }

  const changeTracking: Record<string, unknown> = {
    type: 'changeTracking',
    modes,
  }
  if (modes.includes('json')) {
    changeTracking.schema = schemaObject
  }

  const body = {
    url: page.url,
    formats: ['markdown', changeTracking],
  }

  return JSON.stringify(body, null, 2)
}

// Build the exact changeTracking response object for a given event.
export function buildChangeTrackingResponse(
  event: ChangeEvent,
  snapshot: Snapshot,
  modes: DiffMode[]
): string {
  const changeTracking: Record<string, unknown> = {
    previousScrapeAt: event.previousScrapeAt,
    changeStatus: event.changeStatus,
    visibility: event.visibility,
  }

  if (modes.includes('git-diff')) {
    changeTracking.diff = {
      text: diffLinesToText(event.diffLines),
    }
  }

  if (modes.includes('json')) {
    const json: Record<string, { previous: string | null; current: string | null }> = {}
    event.fieldDiffs
      .filter((d) => d.kind !== 'unchanged')
      .forEach((d) => {
        json[d.field] = { previous: d.previous, current: d.current }
      })
    changeTracking.json = json
  }

  const response = {
    success: true,
    data: {
      markdown:
        snapshot.markdown.length > 220
          ? snapshot.markdown.slice(0, 220) + '...'
          : snapshot.markdown,
      changeTracking,
    },
  }

  return JSON.stringify(response, null, 2)
}

// Build the webhook / Slack alert payload the monitor would fire on a change.
export function buildAlertPayload(event: ChangeEvent): string {
  const fieldChanges = event.fieldDiffs
    .filter((d) => d.kind === 'modified' || d.kind === 'added')
    .map((d) => ({
      field: d.field,
      previous: d.previous,
      current: d.current,
    }))

  const payload = {
    event: 'page.changed',
    page: {
      label: event.pageLabel,
      url: event.url,
      category: event.category,
    },
    changeStatus: event.changeStatus,
    detectedAt: event.currentScrapeAt,
    previousScrapeAt: event.previousScrapeAt,
    summary: event.summary,
    fieldChanges,
    diffStats: {
      linesAdded: event.addedCount,
      linesRemoved: event.removedCount,
    },
    slack: {
      channel: '#monitoring-alerts',
      text: `:rotating_light: *${event.pageLabel}* changed — ${event.summary}`,
    },
  }

  return JSON.stringify(payload, null, 2)
}

// ─── Time / formatting helpers ──────────────────────────────────────────────

export function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Format a countdown of seconds as "2h 14m 03s" / "14m 03s" / "03s".
export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`
  if (m > 0) return `${m}m ${pad(s)}s`
  return `${pad(s)}s`
}

export const STATUS_META: Record<
  ChangeStatus,
  { label: string; tone: string }
> = {
  new: { label: 'New', tone: 'blue' },
  same: { label: 'Unchanged', tone: 'zinc' },
  changed: { label: 'Changed', tone: 'amber' },
  removed: { label: 'Removed', tone: 'red' },
}
