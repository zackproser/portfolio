const fs = require('fs');
const path = require('path');
const databases = require('../schema/data/vectordatabases.json')

const generatePostContent = (db1, db2) => {
  return `
# Comparison: ${db1.name} vs ${db2.name}

## Open Source
- ${db1.name}: ${db1.open_source ? 'Yes' : 'No'}
- ${db2.name}: ${db2.open_source ? 'Yes' : 'No'}

## Run Locally
- ${db1.name}: ${db1.run_locally ? 'Yes' : 'No'}
- ${db2.name}: ${db2.run_locally ? 'Yes' : 'No'}

## Fully Managed
- ${db1.name}: ${db1.fully_managed ? 'Yes' : 'No'}
- ${db2.name}: ${db2.fully_managed ? 'Yes' : 'No'}

## SDKs
- ${db1.name}: ${db1.sdks.join(', ')}
- ${db2.name}: ${db2.sdks.join(', ')}

## Performance
- ${db1.name}: ${db1.performance}
- ${db2.name}: ${db2.performance}

## Scalability
- ${db1.name}: ${db1.scalability}
- ${db2.name}: ${db2.scalability}

## Support
- ${db1.name}: ${db1.support}
- ${db2.name}: ${db2.support}

## Community
- ${db1.name}: ${db1.community}
- ${db2.name}: ${db2.community}
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

combinations.forEach(([db1, db2], _index) => {
  try {
    const content = generatePostContent(db1, db2);
    const dir = path.join(process.env.PWD, `/src/app/blog/${db1.name.toLowerCase()}-vs-${db2.name.toLowerCase()}`)
    const filename = `${dir}/page.mdx`
    console.log(`Create directory: ${dir}`)
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Writing content: ${content} to path: ${filename}`)
    fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
  } catch (error) {
    console.error(`Error generating post for: ${db1.name} vs ${db2.name}`);
  }
});
