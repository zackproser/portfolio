import fs from 'fs';
import path from 'path';
import { getAllContent, getAllProducts, getAppPageRoutesPaths } from '@/lib/content-handlers';
import { getAllTools } from '@/actions/tool-actions';
// import { siteConfig } from '@/config/site'; // Removed unused import

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const dynamicDirs = ['blog', 'videos', 'newsletter', 'demos', 'vectordatabases', 'devtools', 'comparisons', 'services', 'products'];
const excludeDirs = ['api', 'rss'];
const dynamicDetailDirs = [
  { base: 'devtools', detail: 'detail', jsonFile: 'ai-assisted-developer-tools.json', key: 'tools' },
  { base: 'vectordatabases', detail: 'detail', jsonFile: 'vectordatabases.json', key: 'databases' }
];

// Helper function to create slug from tool name (same logic as in comparison page)
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

async function getRoutes() {
  const routes = new Set();

  // Add homepage
  routes.add('/');

  // Add static pages by scanning src/app directory
  const appDir = path.join(process.cwd(), 'src/app');
  const scanDir = (dir, prefix = '') => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = prefix ? `${prefix}/${item}` : item;
      if (fs.statSync(fullPath).isDirectory()) {
        // Exclude API routes and directories starting with '_'
        if (item !== 'api' && !item.startsWith('_') && !item.startsWith('(')) {
          scanDir(fullPath, relativePath);
        }
      } else if (item === 'page.tsx' || item === 'page.js') {
        // Add the route, removing 'page.tsx' or 'page.js'
        routes.add(prefix ? `/${prefix}` : '/');
      }
    });
  };
  scanDir(appDir);

  // Get all dynamic content routes (blog, videos, etc.)
  const blogContent = await getAllContent('blog');
  blogContent.forEach(item => routes.add(item.slug));

  const videoContent = await getAllContent('videos'); // Assuming 'videos' is a content type
  videoContent.forEach(item => routes.add(item.slug));

  // Get all product routes
  const products = await getAllProducts();
  products.forEach(product => routes.add(product.slug));

  // Get all top-level pages dynamically using the replacement function
  const topLevelPages = await getAppPageRoutesPaths();
  topLevelPages.forEach(page => routes.add(page));

  // Manually add dynamic routes for /devtools/detail and /vectordatabases/detail
  dynamicDetailDirs.forEach(({ base, detail, jsonFile, key }) => {
    const jsonFilePath = path.join(process.cwd(), 'schema/data', jsonFile);
    if (fs.existsSync(jsonFilePath)) {
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
      const detailNames = jsonData[key].map(item => item.name);

      detailNames.forEach(name => {
        const encodedName = encodeURIComponent(name);
        routes.add(`/${base}/${detail}/${encodedName}`);
      });
    }
  });

  // Add all comparison routes
  try {
    console.log('Generating comparison routes for sitemap...');
    const tools = await getAllTools();
    console.log(`Found ${tools.length} tools for comparison routes`);
    
    // For sitemap, we want to include all possible comparison routes for SEO
    // but we'll generate them more efficiently in batches
    const batchSize = 50; // Process tools in batches to avoid memory issues
    let comparisonCount = 0;
    
    for (let i = 0; i < tools.length; i += batchSize) {
      const toolBatch = tools.slice(i, i + batchSize);
      
      for (const tool1 of toolBatch) {
        for (const tool2 of tools) {
          if (tool1.id >= tool2.id) continue; // Avoid duplicates and self-comparisons
          
          const tool1Slug = createSlug(tool1.name);
          const tool2Slug = createSlug(tool2.name);
          
          // Always use canonical order (alphabetical)
          if (tool1Slug < tool2Slug) {
            routes.add(`/comparisons/${tool1Slug}/vs/${tool2Slug}`);
          } else {
            routes.add(`/comparisons/${tool2Slug}/vs/${tool1Slug}`);
          }
          comparisonCount++;
        }
      }
    }
    
    console.log(`Added ${comparisonCount} canonical comparison routes to sitemap`);
  } catch (error) {
    console.error('Error generating comparison routes for sitemap:', error);
  }

  // Add RSS feed routes
  routes.add('/rss/feed.json');
  routes.add('/rss/feed.xml');

  // Convert Set to Array and log the routes for debugging
  const uniqueRoutes = Array.from(routes);
  console.log(`Generated ${uniqueRoutes.length} total routes for sitemap`);

  return uniqueRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 1.0,
  }));
}

export default async function sitemap() {
  return getRoutes(); // Revert to original function call
}
