import { Article, ArticleWithSlug, PaidArticle } from './shared-types'
import glob from 'fast-glob'
import path from 'path'
import { promises as fs } from 'fs'

export async function importCourse(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata, status } = (await import(`@/app/learn/courses/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string
      price?: number
      previewLength?: number
    }
    status?: string
  }

  const normalizedMetadata: PaidArticle = {
    ...metadata,
    type: 'course',
    status: status || 'published',
    isPaid: true, // Courses are always paid content
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...normalizedMetadata,
  }
}

export async function getAllCourses() {
  let courseFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'learn/courses'),
  })

  let courses = await Promise.all(courseFilenames.map(importCourse))

  return courses.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getSegmentContent(course: string, segment: string) {
  const { default: content } = await import(`@/app/learn/courses/${course}/${segment}/page.mdx`)
  return content
}

export interface ArticleWithHeader extends Article {
  header?: string;
  dir?: string;
  status?: string;
}

type GroupedSegments = {
  [header: string]: ArticleWithHeader[];
};

export async function getCourseSegments(course: string): Promise<GroupedSegments> {
  const coursesDir = path.join(process.cwd(), 'src', 'app', 'learn', 'courses')
  // Use fs.readdir only for getting the list of directories
  const segmentDirs = await fs.readdir(path.join(coursesDir, course))
  const filteredSegmentDirs = segmentDirs.filter((dir: string) => dir.match(/^\d+$/))

  const segments = await Promise.all(filteredSegmentDirs.map(async (dir: string) => {
    try {
      // Use consistent @/ import pattern
      const { meta } = await import(`@/app/learn/courses/${course}/${dir}/page.mdx`) as {
        meta: ArticleWithHeader | undefined
      }
      
      if (!meta) {
        return null
      }
      
      return {
        dir,
        meta,
      }
    } catch (error) {
      console.error(`Error importing segment: ${dir}`, error)
      return null
    }
  }))

  const validSegments = segments.filter((segment): segment is { dir: string; meta: ArticleWithHeader } => segment !== null)

  const groupedSegments = validSegments.reduce<GroupedSegments>((acc, { dir, meta }) => {
    const header = meta.header ?? 'Other'
    if (!acc[header]) {
      acc[header] = []
    }
    acc[header].push({ ...meta, dir })
    return acc
  }, {})

  return groupedSegments
}
