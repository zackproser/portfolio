const fs = require('fs');
const path = require('path');

const vectorDatabasesData = require('../schema/data/vectordatabases.json');
const databases = vectorDatabasesData.databases;

// Add debugging to check the databases array
console.log('Number of databases:', databases.length);
console.log('First database:', JSON.stringify(databases[0], null, 2));

const checkMark = '✅';
const crossMark = '❌';

const extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const featureSupported = (isSupported) => isSupported ? checkMark : crossMark;

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const generatePostContent = (db1, db2, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const slug = `${slugify(db1.name)}-vs-${slugify(db2.name)}`;

  return `
import { ArticleLayout } from '@/components/ArticleLayout'
import CrossLinkCallout from '@/components/CrossLinkCallout'
import Image from 'next/image'
import Link from 'next/link'
import vectorDatabasesCompared from '@/images/vector-databases-compared.webp'
import VectorDBComparison from '@/components/VectorDBComparison'
import { getCategories, getFeatures } from '@/lib/getDatabases'

export const metadata = {
  title: "${db1.name} vs ${db2.name}",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A detailed comparison of the ${db1.name} and ${db2.name} vector databases",
  image: vectorDatabasesCompared,
  type: "comparison",
  slug: "${slug}"
}

export default (props) => <ArticleLayout metadata={metadata} {...props} />

<Image src={vectorDatabasesCompared} alt="vector databases compared" />

<CrossLinkCallout
  title="Compare Vector Databases Dynamically"
  description="Use my interactive tool to compare ${db1.name}, ${db2.name}, and other vector databases side by side."
  linkText="Compare ${db1.name} and ${db2.name} vector databases"
  linkHref="/vectordatabases/compare?dbs=${encodeURIComponent(db1.name)},${encodeURIComponent(db2.name)}"
  variant="info"
/>

# ${db1.name} vs ${db2.name}

This page contains a detailed comparison of the ${db1.name} and ${db2.name} vector databases.

<VectorDBComparison 
  databases={[${JSON.stringify(db1)}, ${JSON.stringify(db2)}]}
  categories={getCategories()}
  features={getFeatures()}
/>

## Links

### ${db1.name}
- [Homepage](${db1.homepage_link})
- [Documentation](${db1.documentation_link})

### ${db2.name}
- [Homepage](${db2.homepage_link})
- [Documentation](${db2.documentation_link})
`;
};

const generateCombinations = (databases) => {
  const combinations = [];
  for (let i = 0; i < databases.length; i++) {
    for (let j = i + 1; j < databases.length; j++) {
      combinations.push([databases[i], databases[j]]);
    }
  }
  return combinations;
};

const combinations = generateCombinations(databases);

// Add debugging to check the generated combinations
console.log('Number of combinations:', combinations.length);
if (combinations.length > 0) {
  console.log('First combination:', JSON.stringify(combinations[0], null, 2));
}

combinations.forEach(([db1, db2], _index) => {
  try {
    const slug = `${slugify(db1.name)}-vs-${slugify(db2.name)}`;
    const dir = path.join(process.env.PWD, `/src/app/comparisons/${slug}`)
    const filename = `${dir}/page.mdx`

    let existingDate = null;

    if (fs.existsSync(filename)) {
      const existingContent = fs.readFileSync(filename, 'utf8');
      existingDate = extractDateFromContent(existingContent);
      console.log(`Existing date for ${db1.name} vs ${db2.name}: ${existingDate}`);
    }

    const content = generatePostContent(db1, db2, existingDate);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
    console.log(`Generated content for ${db1.name} vs ${db2.name} and wrote to ${filename}`);
  } catch (error) {
    console.error(`Error generating post for: ${db1.name} vs ${db2.name}: ${error}`);
  }
});