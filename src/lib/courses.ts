import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'

// For filesystem operations only, not for imports
const courseDir = path.join(process.cwd(), 'src/app/learn/courses')

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  const { metadata, status } = await import(`@/app/learn/courses/${articleFilename}`) as {
    metadata: Article,
    status?: string,
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'course',
    status: status || 'published',
    ...metadata,
  }
}

export async function getAllCourses() {
  const articleFilenames = await glob('*/page.mdx', {
    cwd: courseDir
  })
  const articles = await Promise.all(articleFilenames.map(importArticle))
  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
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
  // Use fs.readdir only for getting the list of directories
  const segmentDirs = await fs.readdir(path.join(courseDir, course));
  const filteredSegmentDirs = segmentDirs.filter((dir) => dir.match(/^\d+$/));

  const segments = await Promise.all(filteredSegmentDirs.map(async (dir) => {
    try {
      // Use consistent @/ import pattern
      const { meta } = await import(`@/app/learn/courses/${course}/${dir}/page.mdx`) as {
        meta: ArticleWithHeader | undefined
      };
      
      if (!meta) {
        return null;
      }
      
      return {
        dir,
        meta,
      };
    } catch (error) {
      console.error(`Error importing segment: ${dir}`, error);
      return null;
    }
  }));

  const validSegments = segments.filter((segment): segment is { dir: string; meta: ArticleWithHeader } => segment !== null);

  const groupedSegments = validSegments.reduce<GroupedSegments>((acc, { dir, meta }) => {
    const header = meta.header ?? 'Other';
    if (!acc[header]) {
      acc[header] = [];
    }
    acc[header].push({ ...meta, dir });
    return acc;
  }, {});

  return groupedSegments;
}
