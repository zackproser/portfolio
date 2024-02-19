import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://zackproser.com';
const baseDir = 'src/app';
const dynamicDirs = ['blog', 'videos']
const excludeDirs = ['api'];

function getRoutes() {
  const fullPath = path.join(process.cwd(), baseDir);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  let routes = [];

  entries.forEach(entry => {
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      // Handle 'static' routes at the baseDir
      routes.push(`/${entry.name}`);

      // Handle dynamic routes 
      if (dynamicDirs.includes(entry.name)) {
        const subDir = path.join(fullPath, entry.name);
        const subEntries = fs.readdirSync(subDir, { withFileTypes: true });

        subEntries.forEach(subEntry => {
          if (subEntry.isDirectory()) {
            routes.push(`/${entry.name}/${subEntry.name}`);
          }
        });
      }
    }
  });

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

