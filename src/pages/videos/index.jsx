import Head from 'next/head'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllVideos } from '@/lib/getAllVideos'

import { BlogPostCard } from '@/components/BlogPostCard'

export default function VideosIndex({ videos }) {
  return (
    <>
      <Head>
        <title>Videos - Zachary Proser</title>
        <meta
          name="description"
          content="All of my technical videos, Twitch live streams, demos, and code walkthroughs"
        />
      </Head>
      <SimpleLayout
        title="I write to learn and discover, and I publish to share knowledge."
        intro="All of my technical tutorials, deep-dives, developer rants and video walkthroughs"
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {videos.map((video) => (
              <BlogPostCard key={video.slug} article={video} />
            ))}
          </div>
        </div>
      </SimpleLayout >
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      videos: (await getAllVideos()).map(({ component, ...meta }) => ({
        ...meta,
        type: 'video',
      })),
    },
  }
}


