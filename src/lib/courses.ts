import { compileMDX } from 'next-mdx-remote/rsc'
import path from 'path'
import remarkGfm from 'remark-gfm'

import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import { promises as fs } from 'fs';

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata, status } = (await import(`../app/learn/courses/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article,
    status: string,
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'course',
    status,
    ...metadata,
  }
}

export async function getAllCourses() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/learn/courses',
  })
  let articles = await Promise.all(articleFilenames.map(importArticle))
  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getSegmentContent(course: string, segment: string) {
  try {
    const filename = path.resolve(process.cwd(), 'src', 'app', 'learn', 'courses', course, segment, 'page.mdx')
    const source = await fs.readFile(filename, { encoding: 'utf-8' })
    return await compileMDX({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          // @ts-ignore any
          rehypePlugins: [],
          remarkPlugins: [remarkGfm],
        },
      },
    })
  } catch (error) {
    console.error(`Error fetching course: ${course} and segment '${segment}': `, error)
    throw error
  }
}

export interface ArticleWithHeader extends Article {
  header?: string;
  dir?: string;
  status?: string;
}

// Define a type for the grouped segments
type GroupedSegments = {
  [header: string]: ArticleWithHeader[];
};

export async function getCourseSegments(course: string): Promise<GroupedSegments> {
  const segmentDirs = await fs.readdir(path.join(process.cwd(), `src/app/learn/courses/${course}`));
  const filteredSegmentDirs = segmentDirs.filter((dir) => dir.match(/^\d+$/));

  const segments = await Promise.all(filteredSegmentDirs.map(async (dir) => {
    try {
      const segment = await import(`src/app/learn/courses/${course}/${dir}/page.mdx`);
      const meta: ArticleWithHeader | undefined = segment.meta;
      if (!meta) {
        // Handle the case where meta is undefined
        // You could return null or undefined here, or skip the segment entirely
        return null;
      }
      return {
        dir,
        meta,
      };
    } catch (error) {
      console.error(`Error importing segment: ${dir} `, error);
      // Handle or log the error as needed
      return null;
    }
  }));

  // Filter out null values that may have been returned due to missing meta
  const validSegments = segments.filter((segment): segment is { dir: string; meta: ArticleWithHeader } => segment !== null);

  const groupedSegments = validSegments.reduce<GroupedSegments>((acc, { dir, meta }) => {
    const header = meta.header ?? 'Other'; // Default header if not specified
    if (!acc[header]) {
      acc[header] = [];
    }
    acc[header].push({ ...meta, dir });
    return acc;
  }, {});

  return groupedSegments;
}

