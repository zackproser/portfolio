import path from 'path'
import remarkGfm from 'remark-gfm'
import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import { promises as fs } from 'fs';
import dynamic from "next/dynamic";

export interface ArticleWithHeader extends Article {
  header?: string;
  status?: string;
  content?: string;
}

type Segment = {
  title?: string;
  course?: string;  
  segment?: string;
  page?: string;
}

type GroupedSegments = {
  [header: string]: Segment[];
};

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

export async function getSegmentContent(course: string, segment: string, page: string) {
  try {
    return (await import(`src/app/learn/courses/${course}/${segment}/${page}.mdx`)).default;
  } catch (error) {
    console.error(`Error fetching course: ${course}, segment '${segment} and page: ${page}': `, error)
    throw error
  }
}

export async function getCourseSegments(course: string): Promise<GroupedSegments> {
  const courseDir = path.join(process.cwd(), `src/app/learn/courses/${course}`);
  const courseConfigPath = path.join(courseDir, 'course.json');

  try {
    const courseConfig = JSON.parse(await fs.readFile(courseConfigPath, 'utf-8'));
    const groupedSegments: GroupedSegments = {};

    for (const header of courseConfig.headers) {
      groupedSegments[header.title] = [];

      for (const pathEnd of header.segments) {
        const parts = pathEnd.split('/')
        const segment = parts[0]
        const page = parts[1]
        const { meta } = (await import(`src/app/learn/courses/${course}/${segment}/${page}.mdx`))
        try {
          groupedSegments[header.title].push({
            title: meta.title,
            course,
            segment,
            page
          });
        } catch (error) {
          console.error(`Error loading segment ${segment} for course ${course}:`, error);
          // You can skip the segment or handle the error as needed
          continue;
        }
      }
    }

    return groupedSegments;
  } catch (error) {
    if (error instanceof Error && error.code === 'ENOENT') {
      console.error(`Course configuration file not found for ${course}`);
      // You can return a default configuration or throw a specific error
      return {};
    } else {
      console.error(`Error loading course configuration for ${course}:`, error);
      throw error;
    }
  }
}
