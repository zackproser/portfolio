const fs = require('fs');
const path = require('path');

const collections = require('../schema/data/collections.json'); 

const collectionNameDir  = (collectionName) => {
  const parts = collectionName.split('-')
  if (parts.length > 0) {
    return parts[0]
  }
  return collectionName 
}

function generateCollectionPages() {
  Object.entries(collections).forEach(([collectionName, collection]) => {
    const title = collectionName.replace(/-/g, ' ');
    const collectionDir = collectionNameDir(collectionName)
    const dir = path.join(process.env.PWD, `/src/app/collections/${collectionDir}`);
    const filename = `${dir}/page.jsx`;

    const formattedTitle = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const content = `
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { getAllContent } from '@/lib/content-handlers'

export const metadata = {
  title: "${formattedTitle}",
  description: "${collection.description}"
}

export default async function CollectionPage() {
  let articles = await getAllContent('blog', ${JSON.stringify(collection.slugs)})

  return (
    <SimpleLayout title="${formattedTitle} Collection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <ContentCard key={article.slug} article={article} />
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

function generateCollectionIndexPage() {
  Object.entries(collections).forEach(([collectionName, slugs]) => {
    const title = "Writing collections"
    const name = collectionNameDir(collectionName)
    const dir = path.join(process.env.PWD, '/src/app/collections')
    const filename = path.join(dir, 'page.jsx')

    const content = `
import { SimpleLayout } from '@/components/SimpleLayout'
import { CollectionCard } from '@/components/CollectionCard'
import { getAllCollections } from '@/lib/collections'

export default async function CollectionPage() {
  let collections = await getAllCollections()

  return (
    <SimpleLayout title="${title}">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(collection => (
          <CollectionCard key={collection.slug} collection={collection} />
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
    console.log(`Generated collection index page at ${filename}`);
  })
}

generateCollectionPages();
generateCollectionIndexPage();
