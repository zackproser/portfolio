import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContent } from '@/lib/content-handlers'
import { Blog } from '@/types/content'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Article Series — Zack Proser',
  description: 'Multi-part deep dives organized into series. Start from the beginning or jump into any part.',
  metadataBase: new URL('https://zackproser.com'),
}

export default async function SeriesIndex() {
  const all = (await getAllContent('blog')) as Blog[]

  // Group by series slug
  const seriesMap = new Map<string, { name: string; slug: string; posts: Blog[] }>()

  for (const post of all) {
    if (!post.series) continue
    const { name, slug } = post.series
    if (!seriesMap.has(slug)) {
      seriesMap.set(slug, { name, slug, posts: [] })
    }
    seriesMap.get(slug)!.posts.push(post)
  }

  // Sort posts within each series by order then date
  for (const series of seriesMap.values()) {
    series.posts.sort((a, b) => {
      if (a.series?.order != null && b.series?.order != null) {
        return a.series.order - b.series.order
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  const allSeries = [...seriesMap.values()].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/50 mb-4">
            <BookOpen className="w-7 h-7 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-5xl font-bold text-burnt-400 dark:text-amber-400 mb-4">
            Series
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Multi-part deep dives, organized. Start from part one or jump in anywhere.
          </p>
        </div>

        {allSeries.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400">No series yet — check back soon.</p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {allSeries.map((series) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SeriesCard({
  series,
}: {
  series: { name: string; slug: string; posts: Blog[] }
}) {
  const latest = series.posts.reduce((mostRecent, post) => {
    return new Date(post.date).getTime() > new Date(mostRecent.date).getTime() ? post : mostRecent
  }, series.posts[0])
  const latestDate = new Date(`${latest.date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-6 py-5 bg-violet-50 dark:bg-violet-950/50 border-b border-violet-200 dark:border-violet-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 dark:bg-violet-500 text-white">
            <BookOpen className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-violet-900 dark:text-violet-100 truncate">{series.name}</h2>
            <p className="text-xs text-violet-500 dark:text-violet-400">
              {series.posts.length} {series.posts.length === 1 ? 'post' : 'posts'} · latest {latestDate}
            </p>
          </div>
        </div>
        <Link
          href={`/series/${series.slug}`}
          className="flex-shrink-0 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Post list */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {series.posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={post.slug as any}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center">
                {post.series?.order ?? i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors line-clamp-1">
                  {post.title}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 line-clamp-1">
                  {post.description}
                </span>
              </span>
              <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
