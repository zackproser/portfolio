import { ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importVideo(
  videoPath: string
): Promise<ArticleWithSlug> {
  console.log('Importing video from path:', videoPath)
  const imported = await import(`@/app/videos/${videoPath}`)
  const metadata = imported.metadata

  if (!metadata) {
    throw new Error(`No metadata found in video ${videoPath}`)
  }

  // Extract slug from the directory name (remove /page.mdx and get just the directory name)
  const slug = videoPath.split('/')[0]
  console.log('Extracted slug:', slug)

  return {
    author: metadata.author || 'Unknown',
    date: metadata.date || new Date().toISOString(),
    title: typeof metadata.title === 'string' ? metadata.title : metadata.title?.default || 'Untitled',
    description: metadata.description || '',
    image: metadata.image,
    type: 'video',
    slug,
    ...(metadata.commerce && { commerce: metadata.commerce })
  }
}

export async function getAllVideos(): Promise<ArticleWithSlug[]> {
  try {
    console.log('Getting all videos...')
    const files = await glob('*/page.mdx', {
      cwd: path.join(process.cwd(), 'src/app/videos')
    })
    console.log('Found video files:', files)

    const videos = await Promise.all(
      files.map(async (file) => {
        try {
          return await importVideo(file)
        } catch (error) {
          console.error(`Error importing video ${file}:`, error)
          return null
        }
      })
    )

    // Filter out any failed imports and sort by date
    const validVideos = videos.filter((video): video is ArticleWithSlug => video !== null)
    console.log('Valid videos:', validVideos.length)
    return validVideos.sort((a, z) => +new Date(z.date) - +new Date(a.date))
  } catch (error) {
    console.error('Error in getAllVideos:', error)
    return []
  }
}
