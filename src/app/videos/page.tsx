import { type Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { createMetadata } from '@/utils/createMetadata'
import { getAllContent } from '@/lib/content-handlers'
import { ExtendedMetadata } from '@/types'
import VideosTheaterClient, { type TheaterVideo } from './VideosTheaterClient'

export const metadata: Metadata = createMetadata({
  title: 'Zack Proser Videos - AI Tutorials, Streams & Coding Demos',
  description:
    'All of my latest Twitch streams, YouTube videos, how-tos, talks, webinars, demos, and code walkthroughs',
})

const YT_ID_RE = /(?:youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/
const THUMB_STYLES = ['t-warm', 't-cool', 't-plate', 't-mono'] as const

function extractYouTubeId(slug: string): string | null {
  const directorySlug = slug.replace(/^\/videos\//, '')
  const mdx = path.join(process.cwd(), 'src/content/videos', directorySlug, 'page.mdx')
  if (!fs.existsSync(mdx)) return null
  try {
    const body = fs.readFileSync(mdx, 'utf8')
    const m = body.match(YT_ID_RE)
    return m ? m[1] : null
  } catch {
    return null
  }
}

function kindOf(v: ExtendedMetadata): string {
  const t = (v.tags || []).map(s => s.toLowerCase())
  const slug = (v.slug || '').toLowerCase()
  const title = (v.title || '').toLowerCase()
  const hay = `${slug} ${title} ${t.join(' ')}`
  if (/keynote|talk|meetup|webinar/.test(hay)) return 'Talk'
  if (/playthrough|demo/.test(hay)) return 'Demo'
  if (/walkthrough|how-to|how to|tutorial/.test(hay)) return 'Tutorial'
  if (/stream|twitch/.test(hay)) return 'Stream'
  if (/intro|introduction|overview/.test(hay)) return 'Intro'
  return 'Video'
}

function seriesOf(v: ExtendedMetadata): { series: string | null; part: number | null } {
  const slug = (v.slug || '').toLowerCase().replace(/^\/videos\//, '')
  const m1 = slug.match(/^typescript-rag-twitch-part(\d+)/)
  if (m1) return { series: 'TypeScript RAG', part: Number(m1[1]) }
  const m2 = slug.match(/^pinecone-pulumi-webinar-?(\d+)/)
  if (m2) return { series: 'Pinecone + Pulumi', part: Number(m2[1]) }
  const m3 = slug.match(/^pinecone-ref-arch-deployment-(\d+)/)
  if (m3) return { series: 'Pinecone Ref Arch', part: Number(m3[1]) }
  return { series: null, part: null }
}

function glyphFor(title: string): string {
  const letters = title.replace(/[^A-Za-z]/g, '')
  return letters ? letters[0].toUpperCase() : '§'
}

function thumbStyleFor(idx: number, kind: string): TheaterVideo['thumbStyle'] {
  if (kind === 'Talk') return 't-plate'
  if (kind === 'Demo') return 't-warm'
  if (kind === 'Tutorial') return 't-cool'
  return THUMB_STYLES[idx % THUMB_STYLES.length]
}

export default async function VideosIndex() {
  const videos = (await getAllContent('videos')) as ExtendedMetadata[]

  const payload: TheaterVideo[] = videos
    .filter(v => !v.hiddenFromIndex)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((v, i) => {
      const kind = kindOf(v)
      const { series, part } = seriesOf(v)
      const imageRaw = v.image
      const image =
        typeof imageRaw === 'string'
          ? imageRaw
          : imageRaw && typeof imageRaw === 'object' && 'src' in imageRaw
            ? imageRaw.src
            : null
      return {
        slug: v.slug,
        title: v.title,
        description: v.description || '',
        date: v.date,
        durSec: v.durSec || 0,
        views: v.views || 0,
        kind,
        tags: v.tags || [],
        series,
        seriesPart: part,
        glyph: glyphFor(v.title),
        ytId: extractYouTubeId(v.slug),
        image,
        thumbStyle: thumbStyleFor(i, kind),
      }
    })

  return <VideosTheaterClient videos={payload} />
}
