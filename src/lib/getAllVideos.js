import glob from 'fast-glob'
import * as path from 'path'

async function importVideo(videoFilename) {
  let { meta, default: component } = await import(
    `../pages/videos/${videoFilename}`
  )
  return {
    slug: videoFilename.replace(/(\/index)?\.mdx$/, ''),
    ...meta,
    component,
  }
}

export async function getAllVideos() {
  // Get all .mdx files in the pages/videos directory and convert each to a video post
  let videoFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/videos/'),
  })

  let videos = await Promise.all(videoFilenames.map(importVideo))

  // Sort articles by date in descending order
  return videos.sort((a, z) => new Date(z.date) - new Date(a.date))
}
