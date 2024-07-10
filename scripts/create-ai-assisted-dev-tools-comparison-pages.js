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
import AIToolComparison from '@/components/AIToolComparison'

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

<AIToolComparison tools={[${JSON.stringify(tool1)}, ${JSON.stringify(tool2)}]} />

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