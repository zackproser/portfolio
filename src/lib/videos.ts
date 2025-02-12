import { ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'
import { StaticImageData } from 'next/image'

export async function importVideo(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`@/app/videos/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string | { src: string } | StaticImageData
      status?: 'draft' | 'published' | 'archived'
    }
  }

  // Handle webpack-imported images
  let imageUrl: string | undefined;
  if (metadata.image) {
    if (typeof metadata.image === 'object' && 'src' in metadata.image) {
      imageUrl = metadata.image.src;
    } else if (typeof metadata.image === 'object' && 'default' in metadata.image) {
      // Handle webpack imports which come as { default: { src: string } }
      imageUrl = (metadata.image as unknown as { default: { src: string } }).default.src;
    } else if (typeof metadata.image === 'string') {
      // Handle both absolute paths and relative paths from src/images
      imageUrl = metadata.image.startsWith('/') ? metadata.image : `/images/${metadata.image}`;
    } else {
      // Handle direct webpack imports
      imageUrl = (metadata.image as unknown as { src: string }).src;
    }
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    title: metadata.title,
    description: metadata.description,
    author: metadata.author || 'Zachary Proser',
    date: metadata.date,
    image: imageUrl,
    type: 'blog' as const,
    status: metadata.status || 'published'
  }
}

export async function getAllVideos(): Promise<ArticleWithSlug[]> {
  let videoFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'videos'),
  })

  let videos = await Promise.all(videoFilenames.map(importVideo))

  return videos.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
