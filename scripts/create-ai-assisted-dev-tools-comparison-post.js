const fs = require('fs');
const path = require('path');

const tools = require('../schema/data/ai-assisted-developer-tools.json');

const extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const generateAttributeTable = (categoryTools, attribute) => {
  const formattedAttribute = attribute.replace(/_/g, ' ');
  const tableHeader = `| Tool | ${formattedAttribute.charAt(0).toUpperCase() + formattedAttribute.slice(1)} |`;
  const tableSeparator = `|------|------|`;
  const tableRows = categoryTools.map((tool) => {
    const value = tool[attribute];
    const formattedValue = typeof value === 'boolean' ? (value ? '✅' : '❌') : value;
    return `| <img src="${tool.icon}" alt="${tool.name}" width="24" height="24" /> ${tool.name} | ${formattedValue} |`;
  });

  return `
### ${formattedAttribute.charAt(0).toUpperCase() + formattedAttribute.slice(1)}

${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
};

const generateCategorySection = (category, tools) => {
  const categoryTools = tools.filter((tool) => tool.category === category.name);
  const attributes = category.attributes;

  const attributeTables = attributes.map((attribute) => {
    return generateAttributeTable(categoryTools, attribute);
  }).join('\n');

  return `
## ${category.name}

${attributeTables}
`;
};

const generatePostContent = (tools, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  const categories = [
    {
      name: 'Code Autocompletion',
      attributes: ['open_source', 'ide_support', 'pricing', 'free_tier', 'chat_interface', 'auto_transcription', 'image_generation']
    },
    {
      name: 'Terminal / Intelligent Shells',
      attributes: ['open_source', 'ide_support', 'pricing', 'free_tier', 'chat_interface', 'auto_transcription', 'image_generation']
    },
    {
      name: 'Video Editing',
      attributes: ['open_source', 'ide_support', 'pricing', 'free_tier', 'chat_interface', 'auto_transcription', 'image_generation']
    }
  ];

  const categorySections = categories.map((category) => {
    return generateCategorySection(category, tools);
  }).join('\n');

  return `
import { ArticleLayout } from '@/components/ArticleLayout'
import Image from 'next/image'
import aiAssistedDevTools from '@/images/ai-assisted-dev-tools.webp'

export const metadata = {
  title: "The Giant List of AI-Assisted Developer Tools Compared and Reviewed",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A comprehensive comparison and review of AI-assisted developer tools, including code autocompletion, terminal tools, and video editing tools.",
  image: aiAssistedDevTools
}

export default (props) => <ArticleLayout metadata={metadata} {...props} />

<Image src={aiAssistedDevTools} alt="AI-Assisted Developer Tools" />

## Table of Contents

${categories.map((category) => `- [${category.name}](#${category.name.toLowerCase().replace(/\s/g, '-')})`).join('\n')}

## Introduction

This post provides a comprehensive comparison and review of various AI-assisted developer tools, including code autocompletion, terminal tools, and video editing tools. We'll explore their features, capabilities, and suitability for different development workflows.

${categorySections}

## Conclusion

In this post, we compared and reviewed several AI-assisted developer tools, highlighting their features, capabilities, and differences. Each tool has its strengths and weaknesses, and the choice of tool depends on factors such as your development environment, programming languages, and specific needs.

Consider trying out these tools to see which one best fits your workflow and enhances your productivity as a developer.
`;
};

const dir = path.join(process.env.PWD, `/src/app/blog/ai-assisted-dev-tools-compared`);
const filename = `${dir}/page.mdx`;

let existingDate = null;

if (fs.existsSync(filename)) {
  const existingContent = fs.readFileSync(filename, 'utf8');
  existingDate = extractDateFromContent(existingContent);
}

const content = generatePostContent(tools, existingDate);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
console.log(`Generated content for "The Giant List of AI-Assisted Developer Tools Compared and Reviewed" and wrote to ${filename}`);
