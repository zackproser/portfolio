const fs = require('fs');
const path = require('path');

const { tools } = require('../schema/data/ai-assisted-developer-tools.json');

const checkMark = '✅';
const crossMark = '❌';

const extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const featureSupported = (isSupported) => isSupported ? checkMark : crossMark;

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const generateComparisonPageContent = (tool1, tool2, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const slug = `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`;

  return `
import { ArticleLayout } from '@/components/ArticleLayout'
import Image from 'next/image'
import Link from 'next/link'
import aiAssistedDevTools from '@/images/ai-assisted-dev-tools.webp'

export const metadata = {
  title: "${tool1.name} vs ${tool2.name}",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A detailed comparison of ${tool1.name} and ${tool2.name}, two AI-assisted developer tools.",
  image: aiAssistedDevTools,
  type: "comparison",
  slug: "${slug}"
}

export default (props) => <ArticleLayout metadata={metadata} {...props} />

<Image src={aiAssistedDevTools} alt="AI-Assisted Developer Tools" />

# ${tool1.name} vs ${tool2.name}

This page contains a detailed comparison of ${tool1.name} and ${tool2.name}, two AI-assisted developer tools.

## Overview

| Feature | ${tool1.name} | ${tool2.name} |
| ------- | ------------- | ------------- |
| Category | ${tool1.category} | ${tool2.category} |
| Pricing Model | ${tool1.pricing.model} | ${tool2.pricing.model} |
| Free Tier | ${featureSupported(tool1.free_tier)} | ${featureSupported(tool2.free_tier)} |
| Chat Interface | ${featureSupported(tool1.chat_interface)} | ${featureSupported(tool2.chat_interface)} |
| Supports Local Model | ${featureSupported(tool1.supports_local_model)} | ${featureSupported(tool2.supports_local_model)} |
| Supports Offline Use | ${featureSupported(tool1.supports_offline_use)} | ${featureSupported(tool2.supports_offline_use)} |

## IDE Support

| IDE | ${tool1.name} | ${tool2.name} |
| --- | ------------- | ------------- |
${Object.keys(tool1.ide_support).map(ide => `| ${ide.replace('_', ' ')} | ${featureSupported(tool1.ide_support[ide])} | ${featureSupported(tool2.ide_support[ide])} |`).join('\n')}

## Language Support

| Language | ${tool1.name} | ${tool2.name} |
| -------- | ------------- | ------------- |
${Object.keys(tool1.language_support).map(lang => `| ${lang} | ${featureSupported(tool1.language_support[lang])} | ${featureSupported(tool2.language_support[lang])} |`).join('\n')}

## Descriptions

### ${tool1.name}

${tool1.description}

### ${tool2.name}

${tool2.description}

## Business Information

| Aspect | ${tool1.name} | ${tool2.name} |
| ------ | ------------- | ------------- |
| Funding | ${tool1.business_info?.funding || 'N/A'} | ${tool2.business_info?.funding || 'N/A'} |
| Revenue | ${tool1.business_info?.revenue || 'N/A'} | ${tool2.business_info?.revenue || 'N/A'} |
| Employees | ${tool1.business_info?.employee_count || 'N/A'} | ${tool2.business_info?.employee_count || 'N/A'} |
| Founded | ${tool1.business_info?.founding_year || 'N/A'} | ${tool2.business_info?.founding_year || 'N/A'} |
| Headquarters | ${tool1.business_info?.headquarters || 'N/A'} | ${tool2.business_info?.headquarters || 'N/A'} |

## User Reviews

| Aspect | ${tool1.name} | ${tool2.name} |
| ------ | ------------- | ------------- |
| Average Rating | ${tool1.user_reviews?.average_rating || 'N/A'} | ${tool2.user_reviews?.average_rating || 'N/A'} |
| Number of Reviews | ${tool1.user_reviews?.number_of_reviews || 'N/A'} | ${tool2.user_reviews?.number_of_reviews || 'N/A'} |

## Performance

| Aspect | ${tool1.name} | ${tool2.name} |
| ------ | ------------- | ------------- |
| Latency | ${tool1.performance?.latency || 'N/A'} | ${tool2.performance?.latency || 'N/A'} |
| Uptime | ${tool1.performance?.uptime || 'N/A'} | ${tool2.performance?.uptime || 'N/A'} |
| Scalability | ${tool1.performance?.scalability || 'N/A'} | ${tool2.performance?.scalability || 'N/A'} |

## Links

### ${tool1.name}
- [Homepage](${tool1.homepage_link})
- [Review](${tool1.review_link || 'Coming soon'})

### ${tool2.name}
- [Homepage](${tool2.homepage_link})
- [Review](${tool2.review_link || 'Coming soon'})
`;
};

const generateCombinations = (tools) => {
  const combinations = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      combinations.push([tools[i], tools[j]]);
    }
  }
  return combinations;
};

const combinations = generateCombinations(tools);

console.log('Number of combinations:', combinations.length);
if (combinations.length > 0) {
  console.log('First combination:', JSON.stringify(combinations[0], null, 2));
}

combinations.forEach(([tool1, tool2], _index) => {
  try {
    const slug = `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`;
    const dir = path.join(process.env.PWD, `/src/app/comparisons/${slug}`);
    const filename = `${dir}/page.mdx`;

    let existingDate = null;

    if (fs.existsSync(filename)) {
      const existingContent = fs.readFileSync(filename, 'utf8');
      existingDate = extractDateFromContent(existingContent);
      console.log(`Existing date for ${tool1.name} vs ${tool2.name}: ${existingDate}`);
    }

    const content = generateComparisonPageContent(tool1, tool2, existingDate);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
    console.log(`Generated comparison page for ${tool1.name} vs ${tool2.name} and wrote to ${filename}`);
  } catch (error) {
    console.error(`Error generating comparison page for: ${tool1.name} vs ${tool2.name}: ${error}`);
  }
});