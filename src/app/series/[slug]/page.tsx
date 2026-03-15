import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllContent } from '@/lib/content-handlers'
import { Blog } from '@/types/content'
import { BookOpen, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

const FALLBACK_IMG = 'https://zackproser.b-cdn.net/images/wakka.webp'

export async function generateStaticParams() {
  const all = (await getAllContent('blog')) as Blog[]
  const slugs = new Set<string>()
  for (const post of all) {
    if (post.series?.slug) slugs.add(post.series.slug)
  }
  return [...slugs].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const all = (await getAllContent('blog')) as Blog[]
  const posts = all.filter((p) => p.series?.slug === slug)
  if (!posts.length) return { title: 'Series not found' }
  const name = posts[0].series!.name
  return {
    title: `${name} — Series — Zack Proser`,
    description: `All ${posts.length} posts in the "${name}" series.`,
    metadataBase: new URL('https://zackproser.com'),
  }
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params
  const all = (await getAllContent('blog')) as Blog[]
  const posts = all
    .filter((p) => p.series?.slug === slug)
    .sort((a, b) => {
      if (a.series?.order != null && b.series?.order != null) return a.series.order - b.series.order
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  if (!posts.length) notFound()

  const seriesName = posts[0].series!.name

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back link */}
        <Link
          href="/series"
          className="inline-flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All series
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 dark:bg-violet-500 text-white">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
              Series
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-burnt-400 dark:text-amber-400 mb-3">
            {seriesName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} · Read in order or jump to any part
          </p>
        </div>

        {/* Posts grid — same 3-column layout as /blog */}
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post, i) => (
              <SeriesPostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SeriesPostCard({ post, index }: { post: Blog; index: number }) {
  const order = post.series?.order ?? index + 1
  const imgSrc = typeof post.image === 'string' ? post.image : (post.image as any)?.src ?? FALLBACK_IMG
  const formattedDate = new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
      {/* Part number badge */}
      <span className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold shadow-md">
        {order}
      </span>

      <Link href={post.slug as any} className="group w-full">
        <div className="relative w-full">
          <Image
            src={imgSrc}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-t-lg object-cover h-48"
            width={600}
            height={338}
          />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <time className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</time>
            <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300 line-clamp-3">
              {post.description}
            </p>
          </div>
          <div className="mt-4 text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform">
            Read part {order} →
          </div>
        </div>
      </Link>
    </article>
  )
}
