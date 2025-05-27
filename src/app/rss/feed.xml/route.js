import { Feed } from 'feed'
import { getAllContent } from '@/lib/content-handlers'
import { getAllTools } from '@/actions/tool-actions'

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
  try {
    // Ensure we have a valid URL with protocol
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Make sure the URL has a protocol
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`
    }
    
    // Ensure the URL doesn't end with a slash
    siteUrl = siteUrl.replace(/\/$/, '')

    const author = {
      name: 'Zachary Proser',
      email: 'zackproser@gmail.com',
    }

    // Create feed with required properties
    const feed = new Feed({
      title: author.name,
      description: 'AI engineer',
      author,
      id: siteUrl,
      link: siteUrl,
      image: `${siteUrl}/favicon.ico`,
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}`,
      feedLinks: {
        rss2: `${siteUrl}/rss/feed.xml`,
        json: `${siteUrl}/rss/feed.json`,
      },
    })

    // Focus on content-heavy sections that are regularly updated
    const contentFocusedDirs = ['blog', 'videos', 'newsletter'];

    // Get all content for each content-focused type
    for (const contentType of contentFocusedDirs) {
      try {
        const contents = await getAllContent(contentType, undefined);
        for (const content of contents) {
          if (content.slug) {
            try {
              // Remove any leading slashes to avoid double slashes
              const cleanSlug = content.slug.replace(/^\/+/, '');
              const publicUrl = `${siteUrl}/${cleanSlug}`;
              
              // Ensure we have valid content properties
              const itemData = {
                title: content.title || 'Untitled',
                id: publicUrl,
                link: publicUrl,
                author: [author],
                contributor: [author],
                date: new Date(content.date || new Date()),
                description: content.description || '',
              };
              
              // Only add image if it exists and is valid
              if (content.image && typeof content.image === 'string' && content.image.trim() !== '') {
                // Ensure image URL is absolute
                itemData.image = content.image.startsWith('http') 
                  ? content.image 
                  : `${siteUrl}${content.image.startsWith('/') ? '' : '/'}${content.image}`;
              }
              
              feed.addItem(itemData);
            } catch (itemError) {
              console.error(`Error adding item ${content.slug}:`, itemError);
              // Continue with other items
            }
          }
        }
      } catch (contentError) {
        console.error(`Error processing content type ${contentType}:`, contentError);
        // Continue with other content types
      }
    }

    // Add comparison routes to feed
    try {
      console.log('Adding comparison routes to XML feed...');
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
      comparisonEntries.forEach(entry => {
        try {
          feed.addItem(entry);
        } catch (itemError) {
          console.error(`Error adding comparison item ${entry.title}:`, itemError);
        }
      });
      console.log(`Added ${comparisonEntries.length} canonical comparison entries to XML feed`);
    } catch (error) {
      console.error('Error adding comparison routes to XML feed:', error);
    }

    // Generate XML with error handling
    try {
      console.log('Generating XML feed...');
      const xml = feed.rss2();
      console.log('XML Generation succeeded');
      
      return new Response(xml, {
        status: 200,
        headers: {
          'content-type': 'application/xml',
          'cache-control': 's-maxage=31556952'
        }
      });
    } catch (xmlError) {
      console.error('Error generating XML feed:', xmlError);
      return new Response(JSON.stringify({
        error: 'Error generating XML feed',
        message: xmlError.message,
        stack: xmlError.stack
      }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Unexpected error in RSS feed generation:', error);
    return new Response(JSON.stringify({
      error: 'Unexpected error in RSS feed generation',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}