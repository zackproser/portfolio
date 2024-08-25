const fs = require('fs');
const path = require('path');
const { generateComparison } = require('../src/templates/comparison-tool-prose.jsx');

const { tools } = require('../schema/data/ai-assisted-developer-tools.json');

console.log(tools)

const extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const generateComparisonPageContent = (tool1, tool2, existingDate) => {
  console.log(`generateComparisonPageContent: %o, %o`,tool1, tool2);
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const slug = `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`;

  const proseParagraphs = generateComparison(tool1, tool2);

  return `
import ComparisonPageLayout from '@/components/ComparisonPageLayout'
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: "${tool1.name} vs ${tool2.name}",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A detailed comparison of ${tool1.name} and ${tool2.name}, two AI-assisted developer tools.",
  type: "comparison",
  slug: "${slug}"
})

export default function Page() {
  const tool1 = ${JSON.stringify(tool1)}
  const tool2 = ${JSON.stringify(tool2)}
  const proseParagraphs = ${JSON.stringify(proseParagraphs)}

  return <ComparisonPageLayout tool1={tool1} tool2={tool2} proseParagraphs={proseParagraphs} />
}
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

const debug = process.argv.includes('--debug');

combinations.forEach(([tool1, tool2], _index) => {
  try {
    const slug = `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`;
    const dir = path.join(process.env.PWD, `/src/app/comparisons/${slug}`);
    const filename = `${dir}/page.mdx`;

    let existingDate = null;

    if (fs.existsSync(filename)) {
      const existingContent = fs.readFileSync(filename, 'utf8');
      existingDate = extractDateFromContent(existingContent);
      if (debug) {
        console.log(`Existing date for ${tool1.name} vs ${tool2.name}: ${existingDate}`);
      }
    }

    const content = generateComparisonPageContent(tool1, tool2, existingDate);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
    if (debug) {
      console.log(`Generated comparison page for ${tool1.name} vs ${tool2.name} and wrote to ${filename}`);
    }
  } catch (error) {
    console.error(`Error generating comparison page for: ${tool1.name} vs ${tool2.name}: ${error}`);
  }
});

if (debug) {
  console.log(`Generated ${combinations.length} comparison pages`);
}

module.exports = {
  generateCombinations,
  slugify,
};