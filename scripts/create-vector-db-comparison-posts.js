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

const generatePostContent = (db1, db2, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  return `

import { ArticleLayout } from '@/components/ArticleLayout'
import  CrossLinkCallout from '@/components/CrossLinkCallout'

import Image from 'next/image'
import Link from 'next/link'

import vectorDatabasesCompared from '@/images/vector-databases-compared.webp'

export const metadata = {
  title: "${db1.name} vs ${db2.name}",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A detailed comparison of the ${db1.name} and ${db2.name} vector databases",
  image: vectorDatabasesCompared
}

export default (props) => <ArticleLayout metadata={metadata} {...props} /> 

<Image src={vectorDatabasesCompared} alt="vector databases compared" />

<CrossLinkCallout
  title="Compare Vector Databases Dynamically"
  description="Use my interactive tool to compare ${db1.name}, ${db2.name}, and other vector databases side by side."
  linkText="Compare Vector Databases"
  linkHref="/vectordatabases/compare"
  variant="info"
/>

## Table of contents

## vector database comparison: ${db1.name} vs ${db2.name}

This page contains a detailed comparison of the ${db1.name} and ${db2.name} vector databases.

You can also check out my [detailed breakdown of the most popular vector databases here](/blog/vector-databases-compared). 

## Deployment Options
  | Feature | ${db1.name} | ${db2.name} |
| ---------| -------------| -------------|
| Local Deployment | ${featureSupported(db1.deployment.local)} | ${featureSupported(db2.deployment.local)} |
| Cloud Deployment | ${featureSupported(db1.deployment.cloud)} | ${featureSupported(db2.deployment.cloud)} |
| On - Premises Deployment | ${featureSupported(db1.deployment.on_premises)} | ${featureSupported(db2.deployment.on_premises)} |

## Scalability
  | Feature | ${db1.name} | ${db2.name} |
| ---------| -------------| -------------|
| Horizontal Scaling | ${featureSupported(db1.scalability.horizontal)} | ${featureSupported(db2.scalability.horizontal)} |
| Vertical Scaling | ${featureSupported(db1.scalability.vertical)} | ${featureSupported(db2.scalability.vertical)} |
| Distributed Architecture | ${featureSupported(db1.scalability.distributed)} | ${featureSupported(db2.scalability.distributed)} |

## Data Management
  | Feature | ${db1.name} | ${db2.name} |
| ---------| -------------| -------------|
| Data Import | ${featureSupported(db1.data_management.import)} | ${featureSupported(db2.data_management.import)} |
| Data Update / Deletion | ${featureSupported(db1.data_management.update_deletion)} | ${featureSupported(db2.data_management.update_deletion)} |
| Data Backup / Restore | ${featureSupported(db1.data_management.backup_restore)} | ${featureSupported(db2.data_management.backup_restore)} |

## Security
  | Feature | ${db1.name} | ${db2.name} |
| ---------| -------------| -------------|
| Authentication | ${featureSupported(db1.security.authentication)} | ${featureSupported(db2.security.authentication)} |
| Data Encryption | ${featureSupported(db1.security.encryption)} | ${featureSupported(db2.security.encryption)} |
| Access Control | ${featureSupported(db1.security.access_control)} | ${featureSupported(db2.security.access_control)} |

## Vector Similarity Search
| Feature | ${db1.name} | ${db2.name} |
|---------|-------------|-------------|
| Distance Metrics | ${db1.vector_similarity_search.distance_metrics.join(', ')} | ${db2.vector_similarity_search.distance_metrics.join(', ')} |
| ANN Algorithms | ${db1.vector_similarity_search.ann_algorithms.join(', ')} | ${db2.vector_similarity_search.ann_algorithms.join(', ')} |
| Filtering | ${featureSupported(db1.vector_similarity_search.filtering)} | ${featureSupported(db2.vector_similarity_search.filtering)} |
| Post-Processing | ${featureSupported(db1.vector_similarity_search.post_processing)} | ${featureSupported(db2.vector_similarity_search.post_processing)} |

## Integration and API
| Feature | ${db1.name} | ${db2.name} |
|---------|-------------|-------------|
| Language SDKs | ${db1.integration_api.sdks.join(', ')} | ${db2.integration_api.sdks.join(', ')} |
| REST API | ${featureSupported(db1.integration_api.rest_api)} | ${featureSupported(db2.integration_api.rest_api)} |
| GraphQL API | ${featureSupported(db1.integration_api.graphql_api)} | ${featureSupported(db2.integration_api.graphql_api)} |
| GRPC API | ${featureSupported(db1.integration_api.grpc_api)} | ${featureSupported(db2.integration_api.grpc_api)} |

## Community and Ecosystem
| Feature | ${db1.name} | ${db2.name} |
|---------|-------------|-------------|
| Open-Source | ${featureSupported(db1.community_ecosystem.open_source)} | ${featureSupported(db2.community_ecosystem.open_source)} |
| Community Support | ${featureSupported(db1.community_ecosystem.community_support)} | ${featureSupported(db2.community_ecosystem.community_support)} |
| Integration with Frameworks | ${featureSupported(db1.community_ecosystem.integration_frameworks)} | ${featureSupported(db2.community_ecosystem.integration_frameworks)} |

## Pricing
| Feature | ${db1.name} | ${db2.name} |
|---------|-------------|-------------|
| Free Tier | ${featureSupported(db1.pricing.free_tier)} | ${featureSupported(db2.pricing.free_tier)} |
| Pay-as-you-go | ${featureSupported(db1.pricing.pay_as_you_go)} | ${featureSupported(db2.pricing.pay_as_you_go)} |
| Enterprise Plans | ${featureSupported(db1.pricing.enterprise_plans)} | ${featureSupported(db2.pricing.enterprise_plans)} |
  `
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
    const dir = path.join(process.env.PWD, `/src/app/blog/${db1.name.toLowerCase()}-vs-${db2.name.toLowerCase()}`)
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
