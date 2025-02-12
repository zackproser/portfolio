import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'
import { promises as fs } from 'fs'

export async function importCourse(
  articleFilename: string,
): Promise<Course> {
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

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...metadata,
    type: 'course' as const,
    status: status || 'published',
    isPaid: true, // Courses are always paid content
  }
}

export type Course = {
  slug: string
  title: string
  description: string
  date: string
  image?: any
  author?: string
  type: 'course'
  status?: string
  isPaid?: boolean
  price?: number
}

export async function getAllCourses(matchingSlugs?: string[]): Promise<Course[]> {
  let courseFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'learn/courses'),
  })

  let courses = await Promise.all(courseFilenames.map(importCourse))

  // If we have specific slugs to match, filter by them
  if (matchingSlugs && matchingSlugs.length > 0) {
    courses = courses.filter(course => matchingSlugs.includes(course.slug))
  }

  return courses.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getSegmentContent(course: string, segment: string) {
  const { default: content } = await import(`@/app/learn/courses/${course}/${segment}/page.mdx`)
  return content
}

export interface ArticleWithHeader extends Article {
  header?: string;
  dir?: string;
  status?: 'draft' | 'published' | 'archived';
}

type GroupedSegments = {
  [header: string]: ArticleWithHeader[];
};

export async function getCourseSegments(course: string): Promise<GroupedSegments> {
  const coursesDir = path.join(process.cwd(), 'src', 'app', 'learn', 'courses')
  const segmentDirs = await fs.readdir(path.join(coursesDir, course))
  const filteredSegmentDirs = segmentDirs.filter((dir: string) => dir.match(/^\d+$/))

  const segments = await Promise.all(filteredSegmentDirs.map(async (dir: string) => {
    try {
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
