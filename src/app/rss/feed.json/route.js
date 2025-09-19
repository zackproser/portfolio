import { Feed } from 'feed'
import { getAllContent } from '@/lib/content-handlers'
import { getAllTools } from '@/actions/tool-actions'
import { getValidComparisons, getComparisonTitle, getComparisonDescription } from '@/lib/comparison-categories'

// Helper function to create slug from tool name (same logic as in comparison page)
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

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
    const contents = await getAllContent(contentType, undefined);
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

  // Add comparison routes to feed
  try {
    console.log('Adding comparison routes to JSON feed...');
    const tools = await getAllTools();
    
    // Generate comparison entries (limit to avoid overwhelming the feed, canonical order only)
    const comparisonEntries = [];
    for (let i = 0; i < tools.length && comparisonEntries.length < 50; i++) {
      for (let j = i + 1; j < tools.length && comparisonEntries.length < 50; j++) {
        const tool1 = tools[i];
        const tool2 = tools[j];
        
        const tool1Slug = createSlug(tool1.name);
        const tool2Slug = createSlug(tool2.name);
        
        // Only add the alphabetically first combination to avoid duplicates
        let comparisonUrl;
        let title;
        if (tool1Slug < tool2Slug) {
          comparisonUrl = `${siteUrl}/comparisons/${tool1Slug}/vs/${tool2Slug}`;
          title = `${tool1.name} vs ${tool2.name}`;
        } else {
          comparisonUrl = `${siteUrl}/comparisons/${tool2Slug}/vs/${tool1Slug}`;
          title = `${tool2.name} vs ${tool1.name}`;
        }
        
        comparisonEntries.push({
          title: title,
          id: comparisonUrl,
          link: comparisonUrl,
          author: [author],
          contributor: [author],
          date: new Date(), // Use current date for comparisons
          description: `Compare ${tool1.name} and ${tool2.name} - features, pricing, pros and cons. Find the best tool for your development needs.`,
        });
      }
    }
    
    // Add comparison entries to feed
    comparisonEntries.forEach(entry => feed.addItem(entry));
    console.log(`Added ${comparisonEntries.length} canonical comparison entries to JSON feed`);
  } catch (error) {
    console.error('Error adding comparison routes to JSON feed:', error);
  }

  return new Response(feed.json1(), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=31556952'
    }
  });
}