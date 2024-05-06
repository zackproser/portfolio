const fs = require('fs');
const path = require('path');

const collections = require('../schema/data/collections.json'); // Ensure the path to your collections JSON is correct

const collectionNameDir  = (collectionName) => {
  const parts = collectionName.split('-')
  if (parts.length > 0) {
    return parts[0]
  }
  return 'unknown'
}

function generateCollectionPages() {
  Object.entries(collections).forEach(([collectionName, slugs]) => {
    const title = collectionName.replace(/-/g, ' ');
    const collectionDir = collectionNameDir(collectionName)
    const dir = path.join(process.env.PWD, `/src/app/collections/${collectionDir}`);
    const filename = `${dir}/page.jsx`;

    const content = `
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllArticles } from '@/lib/articles'

export default async function CollectionPage() {
  let articles = await getAllArticles(${JSON.stringify(slugs)})

  return (
    <SimpleLayout title="${title}">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <BlogPostCard key={article.slug} article={article} />
        ))}
      </div>
    </SimpleLayout>
  );
}
    `;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`Generated collection page for ${collectionName} with posts at ${filename}`);
  });
}

generateCollectionPages();

