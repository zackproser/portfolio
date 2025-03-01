import { type Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'
import { getAllContent } from '@/lib/content-handlers'
import { ExtendedMetadata } from '@/lib/shared-types'

export const metadata: Metadata = createMetadata({
  title: 'Zack Proser - Videos',
  description: 'All of my latest Twitch streams, YouTube videos, how-tos, talks, webinars, demos, and code walkthroughs'
})

function VideoGrid({ videos }: { videos: ExtendedMetadata[] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {videos.map((video, index) => {
        const uniqueKey = video._id || (video.slug ? `${video.slug}-${index}` : `video-${index}`);
        return (
          <ContentCard 
            key={uniqueKey} 
            article={video}
          />
        );
      })}
    </div>
  )
}

export default async function VideosIndex() {
  // Use our helper function to get all video metadata
  const videos = await getAllContent('videos')

  return (
    <SimpleLayout
      title="Videos"
      intro="All of my latest Twitch streams, YouTube videos, how-tos, talks, webinars, demos, and code walkthroughs"
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <Suspense fallback={<div>Loading videos...</div>}>
          <VideoGrid videos={videos} />
        </Suspense>
      </div>
    </SimpleLayout>
  )
}
