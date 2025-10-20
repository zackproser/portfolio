import fs from 'fs';
import path from 'path';
import { getAllContent, getAllProducts, getAppPageRoutesPaths } from '@/lib/content-handlers';
import { getAllTools } from '@/actions/tool-actions';
import { getValidComparisons } from '@/lib/comparison-categories';
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

  // Get all dynamic content routes (blog, videos, newsletters, etc.)
  const blogContent = await getAllContent('blog');
  blogContent.forEach(item => routes.add(item.slug));

  const videoContent = await getAllContent('videos'); // Assuming 'videos' is a content type
  videoContent.forEach(item => routes.add(item.slug));

  const newsletterContent = await getAllContent('newsletter');
  newsletterContent.forEach(item => routes.add(item.slug));

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

  // Add all comparison routes (only meaningful comparisons)
  try {
    console.log('Generating comparison routes for sitemap...');
    const tools = await getAllTools();
    console.log(`Found ${tools.length} tools for comparison routes`);
    
    // Get only valid comparisons based on categories
    const validComparisons = getValidComparisons(tools);
    console.log(`Found ${validComparisons.length} valid comparisons (down from ${(tools.length * (tools.length - 1)) / 2} total combinations)`);
    
    // Add routes for valid comparisons only
    validComparisons.forEach(({ tool1, tool2 }) => {
      const tool1Slug = createSlug(tool1.name);
      const tool2Slug = createSlug(tool2.name);
      
      // Always use alphabetical order for canonical URLs
      if (tool1Slug < tool2Slug) {
        routes.add(`/comparisons/${tool1Slug}/vs/${tool2Slug}`);
      } else {
        routes.add(`/comparisons/${tool2Slug}/vs/${tool1Slug}`);
      }
    });
    
    console.log(`Added ${validComparisons.length} meaningful comparison routes to sitemap`);
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
