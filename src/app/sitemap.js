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
  const routes = new Map();

  // Add homepage
  routes.set('/', {
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

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
        const route = prefix ? `/${prefix}` : '/';
        if (!routes.has(route)) {
          routes.set(route, {
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    });
  };
  scanDir(appDir);

  const addContentRoutes = async (contentType) => {
    const items = await getAllContent(contentType);
    items.forEach(item => {
      if (item.hiddenFromIndex) {
        return;
      }
      const lastModified = item.date ? new Date(item.date).toISOString() : new Date().toISOString();
      if (!routes.has(item.slug)) {
        routes.set(item.slug, {
          lastModified,
          changeFrequency: 'weekly',
          priority: contentType === 'newsletter' ? 0.6 : 0.9,
        });
      }
    });
  };

  // Get all dynamic content routes (blog, videos, newsletter, etc.)
  await addContentRoutes('blog');
  await addContentRoutes('videos');
  await addContentRoutes('newsletter');

  // Get all product routes
  const products = await getAllProducts();
  products.forEach(product => {
    if (!routes.has(product.slug)) {
      routes.set(product.slug, {
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  });

  // Get all top-level pages dynamically using the replacement function
  const topLevelPages = await getAppPageRoutesPaths();
  topLevelPages.forEach(page => {
    if (!routes.has(page)) {
      routes.set(page, {
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  // Manually add dynamic routes for /devtools/detail and /vectordatabases/detail
  dynamicDetailDirs.forEach(({ base, detail, jsonFile, key }) => {
    const jsonFilePath = path.join(process.cwd(), 'schema/data', jsonFile);
    if (fs.existsSync(jsonFilePath)) {
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
      const detailNames = jsonData[key].map(item => item.name);

      detailNames.forEach(name => {
        const encodedName = encodeURIComponent(name);
        const route = `/${base}/${detail}/${encodedName}`;
        if (!routes.has(route)) {
          routes.set(route, {
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      });
    }
  });

  // Add all comparison routes
  try {
    console.log('Generating comparison routes for sitemap...');
    const tools = await getAllTools();
    console.log(`Found ${tools.length} tools for comparison routes`);
    
    // Generate combinations in canonical order only (alphabetical by slug) to avoid duplicates
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const tool1 = tools[i];
        const tool2 = tools[j];
        
        const tool1Slug = createSlug(tool1.name);
        const tool2Slug = createSlug(tool2.name);
        
        // Only add the alphabetically first combination to avoid duplicates
        if (tool1Slug < tool2Slug) {
          const route = `/comparisons/${tool1Slug}/vs/${tool2Slug}`;
          if (!routes.has(route)) {
            routes.set(route, {
              lastModified: new Date().toISOString(),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          }
        } else {
          const route = `/comparisons/${tool2Slug}/vs/${tool1Slug}`;
          if (!routes.has(route)) {
            routes.set(route, {
              lastModified: new Date().toISOString(),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          }
        }
      }
    }
    
    console.log(`Added canonical comparison routes to sitemap`);
  } catch (error) {
    console.error('Error generating comparison routes for sitemap:', error);
  }

  // Add RSS feed routes
  routes.set('/rss/feed.json', {
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.3,
  });
  routes.set('/rss/feed.xml', {
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.3,
  });

  // Convert Set to Array and log the routes for debugging
  const uniqueRoutes = Array.from(routes.entries());
  console.log(`Generated ${uniqueRoutes.length} total routes for sitemap`);

  return uniqueRoutes.map(([route, data]) => ({
    url: `${baseUrl}${route}`,
    lastModified: data.lastModified || new Date().toISOString(),
    changeFrequency: data.changeFrequency || 'weekly',
    priority: typeof data.priority === 'number' ? data.priority : 0.7,
  }));
}

export default async function sitemap() {
  return getRoutes(); // Revert to original function call
}
