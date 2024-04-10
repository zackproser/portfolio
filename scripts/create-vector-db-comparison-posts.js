const fs = require('fs');
const path = require('path');

const databases = require('../schema/data/vectordatabases.json')

const checkMark = '✅';
const crossMark = '❌';

const featureSupported = (isSupported) => isSupported ? checkMark : crossMark;
const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

const generatePostContent = (db1, db2) => {
  return `

import { ArticleLayout } from '@/components/ArticleLayout'

import Image from 'next/image'
import Link from 'next/link'

export default (props) => <ArticleLayout metadata={metadata} {...props} /> 

export const metadata = {
  title: "${db1.name} vs ${db2.name}",
  author: "Zachary Proser",
  date: "${formattedDate}",
  description: "A detailed comparison of the ${db1.name} and ${db2.name} vector databases",
}

# Comparison: ${db1.name} vs ${db2.name}

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
    console.error(`Error generating post for: ${db1.name} vs ${db2.name}: ${error}`);
  }
});
