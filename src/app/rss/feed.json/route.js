import { Feed } from 'feed'
import { getAllContent } from '@/lib/content-handlers'

export async function GET() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw Error('Missing NEXT_PUBLIC_SITE_URL environment variable')
  }

  let author = {
    name: 'Zachary Proser',
    email: 'zackproser@gmail.com',
  }

  let feed = new Feed({
    title: author.name,
    description: 'AI engineer',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
      json: `${siteUrl}/feed.json`,
    },
  })

  // Focus on content-heavy sections that are regularly updated
  const contentFocusedDirs = ['blog', 'videos', 'newsletter'];

  // Get all content for each content-focused type
  for (const contentType of contentFocusedDirs) {
    const contents = await getAllContent(contentType);
    for (const content of contents) {
      if (content.slug) {
        // Remove any leading slashes to avoid double slashes
        const cleanSlug = content.slug.replace(/^\/+/, '');
        const publicUrl = `${siteUrl}/${cleanSlug}`;
        
        feed.addItem({
          title: content.title,
          id: publicUrl,
          link: publicUrl,
          author: [author],
          contributor: [author],
          date: new Date(content.date),
          description: content.description,
          image: content.image ? `${siteUrl}${content.image}` : undefined
        });
      }
    }
  }

  return new Response(feed.json1(), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=31556952'
    }
  });
}