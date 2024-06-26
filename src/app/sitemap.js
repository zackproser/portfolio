import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const baseDir = 'src/app';
const dynamicDirs = ['blog', 'videos', 'newsletter', 'demos', 'vectordatabases'];
const excludeDirs = ['api', 'rss'];
const excludeFiles = ['[name]'];

function getRoutes() {
  const fullPath = path.join(process.cwd(), baseDir);
  let routes = [];

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
          routes.push(`/${relativePath}`);
        }
      }
    });
  }

  // Read the entries of the base directory
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  entries.forEach(entry => {
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      routes.push(`/${entry.name}`);

      if (dynamicDirs.includes(entry.name)) {
        const subDir = path.join(fullPath, entry.name);
        addRoutesRecursively(subDir, entry.name);
      }
    }
  });

  // Add RSS feed routes
  routes.push('/rss/feed.json');
  routes.push('/rss/feed.xml');

  return routes.map(route => ({
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
