import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const baseDir = 'src/app';
const dynamicDirs = ['blog', 'videos', 'newsletter', 'demos', 'vectordatabases', 'devtools', 'comparisons'];
const excludeDirs = ['api', 'rss'];
const excludeFiles = ['[name]'];
const dynamicDetailDirs = [
  { base: 'devtools', detail: 'detail', jsonFile: 'ai-assisted-developer-tools.json', key: 'tools' },
  { base: 'vectordatabases', detail: 'detail', jsonFile: 'vectordatabases.json', key: 'databases' }
];

function getRoutes() {
  const fullPath = path.join(process.cwd(), baseDir);
  let routes = new Set(); // Use a Set to store unique routes

  function addRoutesRecursively(currentPath, relativePath = '') {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach(entry => {
      const entryPath = path.join(currentPath, entry.name);
      const entryRelativePath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        addRoutesRecursively(entryPath, entryRelativePath);
      } else if (entry.isFile()) {
        if ((entry.name === 'page.jsx' || entry.name === 'page.tsx' || entry.name.endsWith('.mdx')) 
            && !excludeFiles.some(exclude => entryRelativePath.includes(exclude))) {
          const routePath = `/${relativePath.replace(/\\/g, '/')}`;
          routes.add(routePath.replace(/\/page$/, '')); // Add to Set
        }
      }
    });
  }

  // Read the entries of the base directory
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  entries.forEach(entry => {
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      routes.add(`/${entry.name}`); // Add to Set

      if (dynamicDirs.includes(entry.name)) {
        const subDir = path.join(fullPath, entry.name);
        addRoutesRecursively(subDir, entry.name);
      }
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

function sitemap() {
  return getRoutes();
}

export default sitemap;
