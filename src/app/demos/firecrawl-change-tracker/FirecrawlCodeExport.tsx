'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, Code2 } from 'lucide-react'
import { track } from '@vercel/analytics'

import { type DiffMode } from './utils'

// CODE EXPORT: turns the current demo config (URL, diff modes, json schema)
// into real, copy-pasteable change-tracking code for both SDKs.

type Lang = 'node' | 'python'

type Props = {
  url: string
  modes: DiffMode[]
  schema: string
}

function parseSchema(schema: string): unknown | null {
  try {
    return JSON.parse(schema)
  } catch {
    return null
  }
}

// Indent a multiline JSON blob by `spaces` for embedding inside generated code.
function indentBlock(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n')
}

function buildNode(url: string, modes: DiffMode[], schemaObj: unknown | null): string {
  const includeJson = modes.includes('json') && schemaObj !== null
  const modesArray = `[${modes.map((m) => `'${m}'`).join(', ')}]`

  const schemaLine = includeJson
    ? `,\n        schema: ${indentBlock(JSON.stringify(schemaObj, null, 2), 8)}`
    : ''

  return `import FirecrawlApp from '@mendable/firecrawl-js'

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

const result = await app.scrapeUrl('${url}', {
  formats: [
    'markdown',
    {
      type: 'changeTracking',
      modes: ${modesArray}${schemaLine},
    },
  ],
})

const { changeStatus, previousScrapeAt, diff, json } = result.changeTracking

// First scrape of a URL is the baseline: changeStatus === 'new',
// previousScrapeAt === null. The diff is populated on the next scrape.
if (changeStatus === 'changed') {
  await fetch(process.env.ALERT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: '${url}', changeStatus, previousScrapeAt, diff, json }),
  })
}`
}

function buildPython(url: string, modes: DiffMode[], schemaObj: unknown | null): string {
  const includeJson = modes.includes('json') && schemaObj !== null
  const modesArray = `[${modes.map((m) => `"${m}"`).join(', ')}]`

  // Render the schema as a Python dict literal (JSON is valid Python here aside
  // from booleans/None, which JSON schemas for this demo don't use).
  const schemaLine = includeJson
    ? `,\n            "schema": ${indentBlock(JSON.stringify(schemaObj, null, 2), 12)}`
    : ''

  return `from firecrawl import FirecrawlApp
import os, json, urllib.request

app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

result = app.scrape_url(
    "${url}",
    {
        "formats": [
            "markdown",
            {
                "type": "changeTracking",
                "modes": ${modesArray}${schemaLine},
            },
        ]
    },
)

ct = result["changeTracking"]

# First scrape of a URL is the baseline: changeStatus == "new",
# previousScrapeAt is None. The diff is populated on the next scrape.
if ct["changeStatus"] == "changed":
    payload = json.dumps({
        "url": "${url}",
        "changeStatus": ct["changeStatus"],
        "previousScrapeAt": ct["previousScrapeAt"],
        "diff": ct.get("diff"),
        "json": ct.get("json"),
    }).encode()
    req = urllib.request.Request(
        os.environ["ALERT_WEBHOOK_URL"],
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    urllib.request.urlopen(req)`
}

export default function FirecrawlCodeExport({ url, modes, schema }: Props) {
  const [lang, setLang] = useState<Lang>('node')
  const [copied, setCopied] = useState(false)

  const schemaObj = useMemo(() => parseSchema(schema), [schema])

  const code = useMemo(() => {
    const target = url.trim() || 'https://example.com/pricing'
    return lang === 'node'
      ? buildNode(target, modes, schemaObj)
      : buildPython(target, modes, schemaObj)
  }, [lang, url, modes, schemaObj])

  function handleCopy() {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    track('demo_code_copy', { demo: 'change-tracker', lang })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/5 text-zinc-700 dark:bg-zinc-100/10 dark:text-zinc-200">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Export this as code</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Your current URL, diff modes, and schema as a runnable monitor.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {(['node', 'python'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  lang === l
                    ? 'bg-white text-orange-600 shadow-sm dark:bg-zinc-700 dark:text-orange-400'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {l === 'node' ? 'Node.js' : 'Python'}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-2 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
          {lang === 'node' ? 'npm i @mendable/firecrawl-js' : 'pip install firecrawl-py'}
        </p>
        <pre className="max-h-[460px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-[11px] leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          {code}
        </pre>
        {modes.includes('json') && schemaObj === null && (
          <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
            The schema editor has invalid JSON, so json mode is shown without a schema. Fix it in the inspector to include the schema here.
          </p>
        )}
      </div>
    </div>
  )
}
