// Generates src/data/corpus.json for the Mind on Fire hero.
// Scans src/content/blog/*/metadata.json, keeps posts that are not
// hiddenFromIndex, and extracts the opening paragraph from page.mdx.
// Runs at the start of `npm run build`, so the hero's star count,
// previews, and links stay correct as posts are added.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'src', 'content', 'blog')
const outFile = path.join(root, 'src', 'data', 'corpus.json')

function extractExcerpt(mdxPath, fallback) {
  let ex = ''
  try {
    const lines = fs.readFileSync(mdxPath, 'utf8').split('\n')
    let buf = []
    for (const line of lines) {
      const s = line.trim()
      if (!s) {
        if (buf.join(' ').length > 100) break
        continue
      }
      if (/^(import|export|#|<|@|!\[|\{|-|\*|\||```|>)/.test(s)) {
        if (buf.length > 0) break
        continue
      }
      buf.push(s)
      if (buf.join(' ').length > 400) break
    }
    ex = buf
      .join(' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    /* no page.mdx — fall through to description */
  }
  if (ex.length < 60 && fallback) ex = fallback
  if (ex.length > 220) ex = ex.slice(0, 217).replace(/\s+\S*$/, '') + '…'
  return ex
}

/* ------------------------------------------------------------------
 * Cluster assignment — the hero's constellation labels are a promise:
 * every dot under a heading must genuinely belong to it. Resolution
 * order: explicit overrides → tag map → keyword rules (most specific
 * first) → CAREER & ENABLEMENT for general/personal essays.
 * Indices match CLUSTERS in MindOnFireHero.tsx:
 * 0 RAG & RETRIEVAL · 1 VOICE & TOOLS · 2 AI-ASSISTED DEV
 * 3 EVALS & FINE-TUNING · 4 INFRASTRUCTURE · 5 CAREER & ENABLEMENT
 * ------------------------------------------------------------------ */
const OVERRIDES = {
  /* seeded from the homepage's curated rail slugs */
  'cloud-gpu-services-jupyter-notebook-reviewed': 3,
  'how-to-create-a-custom-alpaca-dataset': 3,
  'how-to-fine-tune-llama-3-1-on-lightning-ai-with-torchtune': 3,
  'mnist-pytorch-hand-drawn-digit-recognizer': 3,
  'langchain-pinecone-chat-with-my-blog': 0,
  'rag-evaluation': 0,
  'automations-project': 2,
  'autocomplete-is-not-all-you-need': 2,
  'codeium-analysis-4-2024': 2,
  'pinecone-reference-architecture-launch': 0,
  'pinecone-reference-architecture-scaling': 0,
  'pinecone-reference-architecture-technical-walkthrough': 0,
  'run-your-own-tech-blog': 5,
  'wash-three-walls-with-one-bucket': 5,
  'you-get-to-keep-the-neural-connections': 5,
  /* audited corrections — every dot under a label belongs there */
  'cursor-review': 2,
  'pain-poetry-python': 5,
  'how-to-use-jupyter-notebooks': 3,
  'portfolio-that-pays-rent': 5,
  'in-the-llm-i-saw-myself': 5,
  'beat-coding-interview-anxiety': 5,
  'the-interface-matters-most': 2,
  'how-my-ai-assistant-ships-blog-posts': 2,
  'my-ai-agent-has-a-mechanic-agent': 2,
  'webhook-bridge-pattern': 2,
  'openai-codex-review-2026': 2,
  'warp-ai-terminal-review': 2,
  'gabbee-ai-phone-call-app': 1,
  'how-to-generate-images-with-ai': 2,
  'canyonrunner-html5-game': 4,
  'why-my-site-has-a-rate-card-now': 5,
  'javascript-ai': 2,
  'executive-function-as-a-service': 5,
  'failed-to-kill-me': 5,
  'how-developers-evaluate-ai-coding-tools': 2,
  'top-ai-dev-tools-bugs': 2,
  'inbox-classifier-going-guerilla': 2,
  'two-agents-one-phone': 2,
  'building-always-on-ai-assistant': 2,
  'the-best-thing-about-being-a-developer': 5,
  'why-ive-been-successful': 5,
  'google-jules-review': 2,
  'astronvim-overview': 2,
  'inbound-classifier-trigger-dev': 2,
  'how-my-blog-bot-reviews-its-own-writing': 2,
  'stop-slop-scrub-pass': 2,
  'evolving-web-scraping-pageripper-api': 4,
  'bubbletea-state-machine': 4,
  'working-with-circleci': 4,
  'catfacts': 4,
  'building-nuxt-portfolio': 4,
  'play-steam-link-vision-pro-while-watching-tv': 1,
}
const TAG_MAP = [
  [/^(rag|vector|pinecone|embedding|semantic)/i, 0],
  [/^(voice|wisprflow|voice-typing|voice-ai|dictation|granola|transcription|meetings?|whisper)$/i, 1],
  [/^(fine-?tun|eval|dataset|pytorch|llama|training|machine-learning|deep-learning)/i, 3],
  [/^(developer-tools|ai-tools|copilot|cursor|codeium|web-scraping|firecrawl|mcp|agents?)$/i, 2],
  [/^(aws|terraform|pulumi|infrastructure|docker|kubernetes|devops|cloud)$/i, 4],
  [/^(career|writing|blogging|advice)$/i, 5],
]
const KEYWORD_RULES = [
  [/rag\b|retriev|vector|pinecone|embedding|semantic.search|langchain|chat.?with.?your|knowledge.base/i, 0],
  [/eval|fine-?tun|llama|mistral|lora|qlora|dataset|alpaca|pytorch|mnist|jupyter|neural.net|machine.learning|deep.learning|gpu/i, 3],
  [/voice|whisper|wisprflow|talon|dictation|granola|transcri|meeting.notes|speech/i, 1],
  [/copilot|cursor|codeium|windsurf|aider|claude|chatgpt|gpt-|gemini|llm|coding.assist|ai-assisted|autocomplete|agent|mcp\b|prompt/i, 2],
  [/terraform|pulumi|aws|ec2|docker|kubernetes|infrastructur|linux|cli\b|git\b|github|next.?js|vercel|database|postgres|architect|security|yubikey|system.?76/i, 4],
  [/career|job|interview|advice|salary|manager|blog|writing|reader|routine|habit|keynote|talk\b|conference|speaking|workshop|enablement/i, 5],
]
function assignCluster(dir, meta, excerpt) {
  if (dir in OVERRIDES) return OVERRIDES[dir]
  const tags = Array.isArray(meta.tags) ? meta.tags : []
  for (const tag of tags) {
    for (const [re, c] of TAG_MAP) {
      if (re.test(String(tag))) return c
    }
  }
  /* two passes: the title/slug/tags are what a post IS; description and
     excerpt are how it's told (he mentions voice workflows everywhere, so
     prose only breaks ties when identity says nothing) */
  const hay1 = [meta.title, dir, tags.join(' ')].join(' ')
  for (const [re, c] of KEYWORD_RULES) {
    if (re.test(hay1)) return c
  }
  const hay2 = [meta.description || '', excerpt || ''].join(' ')
  for (const [re, c] of KEYWORD_RULES) {
    if (re.test(hay2)) return c
  }
  return 5 /* general/personal essays live under CAREER & ENABLEMENT */
}

const posts = []
let hidden = 0
for (const dir of fs.readdirSync(blogDir)) {
  const metaPath = path.join(blogDir, dir, 'metadata.json')
  if (!fs.existsSync(metaPath)) continue
  let meta
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  } catch {
    continue
  }
  if (!meta.title) continue
  if (meta.hiddenFromIndex === true) {
    hidden++
    continue
  }
  const e = extractExcerpt(path.join(blogDir, dir, 'page.mdx'), meta.description)
  posts.push({
    t: meta.title,
    s: dir,
    d: (meta.date || '').slice(0, 7),
    e,
    img: meta.image || '',
    fullDate: meta.date || '',
    c: assignCluster(dir, meta, e),
  })
}

posts.sort((a, b) => (b.fullDate || '').localeCompare(a.fullDate || ''))
fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify({ count: posts.length, posts }))
console.log(`corpus: ${posts.length} indexable posts (${hidden} hidden) → src/data/corpus.json`)
const LABELS = ['RAG & RETRIEVAL', 'VOICE & TOOLS', 'AI-ASSISTED DEV', 'EVALS & FINE-TUNING', 'INFRASTRUCTURE', 'CAREER & ENABLEMENT']
if (process.argv.includes('--audit')) {
  for (let c = 0; c < LABELS.length; c++) {
    console.log(`\n== ${LABELS[c]} (${posts.filter((p) => p.c === c).length}) ==`)
    posts.filter((p) => p.c === c).forEach((p) => console.log('  ' + p.t))
  }
} else {
  console.log('clusters:', LABELS.map((l, c) => `${l.split(' ')[0]}=${posts.filter((p) => p.c === c).length}`).join(' '))
}
