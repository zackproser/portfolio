'use client'

import Link from 'next/link'
import { Code, FileText, ExternalLink as ExternalIcon, PlayCircle, BookOpen, CheckCircle2 } from 'lucide-react'

type EvidenceLink = { label: string; href: string }
type EvidenceItem = { label: string; links: EvidenceLink[] }
type EvidenceCategory = { title: string; items: EvidenceItem[] }

const evidence: EvidenceCategory[] = [
  {
    title: 'AI & Machine Learning',
    items: [
      {
        label: 'Retrieval-augmented generation (RAG), embeddings, and fine-tuning',
        links: [
          { label: 'What is RAG? (Pinecone)', href: 'https://www.pinecone.io/learn/retrieval-augmented-generation/' },
          { label: 'RAG pipeline tutorial', href: '/blog/langchain-pinecone-chat-with-my-blog' },
          { label: 'Secure RAG with FGA', href: 'https://workos.com/blog/how-to-secure-rag-applications-with-fine-grained-authorization-tutorial-with-code' },
          { label: 'Legal semantic search app', href: 'https://docs.pinecone.io/examples/sample-apps/legal-semantic-search' }
        ]
      },
      {
        label: 'LLM systems integration (Claude, GPT, open-source models)',
        links: [
          { label: 'WorkOS MCP starter', href: 'https://workos.com/blog/vercel-mcp-workos-authkit-template' },
          { label: 'Pinecone Assistant app', href: 'https://docs.pinecone.io/examples/sample-apps/pinecone-assistant' },
          { label: 'Site chat demo', href: '/chat' }
        ]
      },
      {
        label: 'Vector databases (Pinecone, Weaviate, FAISS)',
        links: [
          { label: 'VDBs in Production series', href: 'https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/' },
          { label: 'CI/CD chapter', href: 'https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/ci-cd/' },
          { label: 'RAG evaluation chapter', href: 'https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/rag-evaluation/' },
          { label: 'AWS ref architecture', href: 'https://github.com/pinecone-io/aws-reference-architecture-pulumi' }
        ]
      },
      {
        label: 'Fine-tuning workflows',
        links: [
          { label: 'Llama 3.1 finetune guide', href: 'https://zackproser.com/blog/how-to-fine-tune-llama-3-1-on-lightning-ai-with-torchtune' },
          { label: 'Finetune repo', href: 'https://github.com/zackproser/llama-3-1-8b-finetune-lightning-ai-torchtune' }
        ]
      }
    ]
  },
  {
    title: 'Software Engineering',
    items: [
      {
        label: '13+ years building distributed systems and production SaaS',
        links: [
          { label: 'Projects', href: '/projects' },
          { label: 'Featured builds', href: '#projects' }
        ]
      },
      {
        label: 'Languages: Python, TypeScript/JavaScript, Go, Bash',
        links: [
          { label: 'Finetune repo (Python)', href: 'https://github.com/zackproser/llama-3-1-8b-finetune-lightning-ai-torchtune' },
          { label: 'WorkOS MCP example (TS)', href: 'https://github.com/workos/vercel-mcp-example' },
          { label: 'git-xargs (Go)', href: 'https://github.com/gruntwork-io/git-xargs' }
        ]
      },
      {
        label: 'Cloud: AWS, GCP, Vercel, Docker, Kubernetes',
        links: [
          { label: 'AWS ref architecture', href: 'https://github.com/pinecone-io/aws-reference-architecture-pulumi' },
          { label: 'Site (Vercel)', href: 'https://zackproser.com' }
        ]
      },
      {
        label: 'Infrastructure as code, CI/CD, observability, scaling patterns',
        links: [
          { label: 'CI/CD for vector DBs', href: 'https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/ci-cd/' },
          { label: 'AWS ref architecture', href: 'https://github.com/pinecone-io/aws-reference-architecture-pulumi' }
        ]
      }
    ]
  },
  {
    title: 'Developer Education & Growth',
    items: [
      {
        label: 'Technical writing (50,000+ readers) and newsletter (2,750+ subscribers)',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'Publications', href: '/publications' }
        ]
      },
      {
        label: 'Public speaking and workshops (AI Engineer World’s Fair, MCP Night)',
        links: [
          { label: 'Mastra workshop', href: '/blog/ai-pipelines-and-agents-mastra' }
        ]
      },
      {
        label: 'Growth engineering: landing page optimization, analytics, conversion funnels',
        links: [
          { label: 'Gabbee product', href: 'https://gabbee.io' },
          { label: 'Build write-up', href: '/blog/gabbee-ai-phone-call-app' }
        ]
      },
      {
        label: 'Documentation systems and open-source leadership',
        links: [
          { label: 'WorkOS MCP starter', href: 'https://workos.com/blog/vercel-mcp-workos-authkit-template' },
          { label: 'Sample apps (Pinecone)', href: 'https://docs.pinecone.io/examples/sample-apps' }
        ]
      }
    ]
  }
]

function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

function getHost(href: string): string | null {
  try {
    if (!isExternal(href)) return 'zackproser.com'
    const url = new URL(href)
    return url.hostname.replace('www.', '')
  } catch {
    return null
  }
}

type LinkType = 'article' | 'code' | 'demo' | 'docs' | 'template' | 'site' | 'chatbot'

function getLinkType(href: string, label?: string): LinkType {
  const l = (label || '').toLowerCase()
  if (/github\.com\//.test(href)) return 'code'
  if (/chat/.test(href) || l.includes('chat')) return 'chatbot'
  if (/\/blog\//.test(href) || /pinecone\.io\/learn\//.test(href)) return 'article'
  if (/docs\./.test(href) || /\/examples\//.test(href)) return 'docs'
  if (/vercel|demo|\.app\//.test(href)) return 'demo'
  if (/vercel-mcp-example|starter|template/.test(href)) return 'template'
  return 'site'
}

function isAuthored(href: string): boolean {
  // Treat internal links and personal domains as authored
  if (!isExternal(href)) return true
  if (/zackproser\.com/.test(href)) return true
  if (/gabbee\.io/.test(href)) return true
  if (/workos\.com\/blog\//.test(href)) return true
  // Specific article attribution
  if (href === 'https://www.pinecone.io/learn/retrieval-augmented-generation/') return true
  if (/github\.com\/zackproser\//.test(href)) return true
  return false
}

function LinkTypeIcon({ type }: { type: LinkType }) {
  const className = 'w-3.5 h-3.5'
  switch (type) {
    case 'code':
      return <Code className={className} />
    case 'article':
      return <FileText className={className} />
    case 'docs':
      return <BookOpen className={className} />
    case 'demo':
      return <PlayCircle className={className} />
    case 'chatbot':
      return <PlayCircle className={className} />
    case 'template':
      return <Code className={className} />
    default:
      return <ExternalIcon className={className} />
  }
}

function getTypeStyles(type: LinkType): { classes: string; emoji: string } {
  switch (type) {
    case 'article':
      return { classes: 'border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20', emoji: '📄' }
    case 'docs':
      return { classes: 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20', emoji: '📖' }
    case 'code':
      return { classes: 'border-slate-400/40 bg-slate-500/10 hover:bg-slate-500/20', emoji: '🐙' }
    case 'template':
      return { classes: 'border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20', emoji: '🧩' }
    case 'chatbot':
      return { classes: 'border-fuchsia-400/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20', emoji: '🤖' }
    case 'demo':
      return { classes: 'border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/20', emoji: '🧪' }
    default:
      return { classes: 'border-blue-400/40 bg-blue-500/10 hover:bg-blue-500/20', emoji: '🔗' }
  }
}

export default function SkillsMatrix() {
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Expertise</h2>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            I’m a rare combination of AI theory, practical experimentation, and production implementation — truly full‑stack across research, engineering, and developer education.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          <div className="mb-2 text-center text-blue-200/90">
            I approach applied AI with a safety and reliability mindset: clear evaluation, human-in-the-loop design, and responsible deployment practices.
          </div>
          {evidence.map((category) => (
            <div key={category.title}>
              <h3 className="text-2xl font-semibold text-white mb-4">{category.title}</h3>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="divide-y divide-white/10">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5">
                      {/* Left: statement */}
                      <div className="md:col-span-5 flex items-center">
                        <span className="text-blue-100">{item.label}</span>
                      </div>
                      {/* Right: supporting links */}
                      <div className="md:col-span-7">
                        <div className="flex flex-wrap gap-2">
                          {item.links.map((link, li) => {
                            const type = getLinkType(link.href, link.label)
                            const host = getHost(link.href)
                            const authored = isAuthored(link.href)
                            const typeStyles = getTypeStyles(type)
                            const baseClasses = `inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border ${typeStyles.classes} text-blue-100 transition-colors`
                            const badge = authored ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Mine
                              </span>
                            ) : null
                            const content = (
                              <>
                                <span className="opacity-90">{typeStyles.emoji}</span>
                                <span>{link.label}</span>
                                {host && <span className="text-blue-300/70">· {host}</span>}
                                {badge}
                              </>
                            )
                            return isExternal(link.href) ? (
                              <a key={li} href={link.href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
                                {content}
                              </a>
                            ) : (
                              <Link key={li} href={link.href as any} className={baseClasses}>
                                {content}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}