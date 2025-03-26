import fs from 'fs';
import path from 'path';
import { getAllContent, getAllProducts, getTopLevelPages } from '@/lib/content-handlers';

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const dynamicDirs = ['blog', 'videos', 'newsletter', 'demos', 'vectordatabases', 'devtools', 'comparisons', 'services', 'products'];
const excludeDirs = ['api', 'rss'];
const dynamicDetailDirs = [
  { base: 'devtools', detail: 'detail', jsonFile: 'ai-assisted-developer-tools.json', key: 'tools' },
  { base: 'vectordatabases', detail: 'detail', jsonFile: 'vectordatabases.json', key: 'databases' }
];

async function getRoutes() {
  let routes = new Set(); // Use a Set to store unique routes

  // Get all top-level pages dynamically
  const topLevelPages = await getTopLevelPages();
  topLevelPages.forEach(page => routes.add(page));

  // Get all content for each content type
  for (const contentType of dynamicDirs) {
    if (!excludeDirs.includes(contentType)) {
      const contents = await getAllContent(contentType);
      contents.forEach(content => {
        if (content.slug) {
          // Remove any leading slashes to avoid double slashes
          const cleanSlug = content.slug.replace(/^\/+/, '');
          routes.add(`/${cleanSlug}`);
        }
      });
    }
  }

  // Get all products
  const products = await getAllProducts();
  products.forEach(product => {
    if (product.slug) {
      // Remove any leading slashes to avoid double slashes
      const cleanSlug = product.slug.replace(/^\/+/, '');
      routes.add(`/${cleanSlug}`);
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
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  }));
}

export default async function sitemap() {
  return getRoutes();
}
