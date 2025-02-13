import { ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importVideo(
  videoPath: string
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`@/app/videos/${videoPath}`)) as {
    default: React.ComponentType
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string
      isPaid?: boolean
      price?: number
      stripe_price_id?: string
      previewLength?: number
    }
  }

  return {
    ...metadata,
    type: 'video',
    slug: path.basename(videoPath, '.mdx'),
    // Add commerce fields if this is a paid video
    ...(metadata.isPaid && {
      commerce: {
        isPaid: true,
        price: metadata.price || 0,
        stripe_price_id: metadata.stripe_price_id,
        previewLength: metadata.previewLength
      }
    })
  }
}

export async function getAllVideos(): Promise<ArticleWithSlug[]> {
  const files = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src/app/videos')
  })

  const videos = await Promise.all(
    files.map(async (file) => {
      return importVideo(file)
    })
  )

  return videos.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
