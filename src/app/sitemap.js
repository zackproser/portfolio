import fs from 'fs';
import path from 'path';
import { getAllContent, getAllProducts, getAppPageRoutesPaths } from '@/lib/content-handlers';
// import { siteConfig } from '@/config/site'; // Removed unused import

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const dynamicDirs = ['blog', 'videos', 'newsletter', 'demos', 'vectordatabases', 'devtools', 'comparisons', 'services', 'products'];
const excludeDirs = ['api', 'rss'];
const dynamicDetailDirs = [
  { base: 'devtools', detail: 'detail', jsonFile: 'ai-assisted-developer-tools.json', key: 'tools' },
  { base: 'vectordatabases', detail: 'detail', jsonFile: 'vectordatabases.json', key: 'databases' }
];

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

  // Add RSS feed routes
  routes.add('/rss/feed.json');
  routes.add('/rss/feed.xml');

  // Convert Set to Array and log the routes for debugging
  const uniqueRoutes = Array.from(routes);
  console.log('Generated routes:', uniqueRoutes);

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
