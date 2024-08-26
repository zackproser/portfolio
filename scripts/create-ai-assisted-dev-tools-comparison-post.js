const fs = require('fs');
const path = require('path');
const { categories, tools } = require('../schema/data/ai-assisted-developer-tools.json');
 extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const renderReviewLink = (reviewLink) => {
  if (reviewLink) {
    return `<Link href="${reviewLink}" alt="AI developer tool review">📖 Review</Link>`;
  }
  return 'Coming soon';
}

const generateToolTable = (categoryTools) => {
  const tableHeader = `| Tool | Category | Review | Homepage`;
  const tableSeparator = `|------|------|------|------|`;
  const tableRows = categoryTools.map((tool) => {
    return `| ${tool.name} | ${tool.category} | ${renderReviewLink(tool.review_link)} | ${tool.homepage_link} |`;
  });
  return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
}

const generateAttributeTable = (categoryTools, attribute) => {
  if (attribute === 'ide_support') {
    const ides = ['vs_code', 'jetbrains', 'neovim', 'visual_studio', 'vim', 'emacs', 'intellij'];
    const formattedIDEs = ides.map(ide => ide.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const tableHeader = `| Tool | ${formattedIDEs.join(' | ')} |`;
    const tableSeparator = `|------|${'-|'.repeat(ides.length)}`;
    const tableRows = categoryTools.map((tool) => {
      const rowValues = ides.map((ide) => (tool.ide_support && tool.ide_support[ide]) ? '✅' : '❌').join(' | ');
      return `| ${tool.name} | ${rowValues} |`;
    });

    return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
  } else if (attribute === 'open_source') {
    const openSourceAttributes = ['client', 'backend', 'model'];
    const tableHeader = `| Tool | ${openSourceAttributes.map(attr => attr.charAt(0).toUpperCase() + attr.slice(1)).join(' | ')} |`;
    const tableSeparator = `|------|${'-|'.repeat(openSourceAttributes.length)}`;
    const tableRows = categoryTools.map((tool) => {
      const rowValues = openSourceAttributes.map((attr) => (tool.open_source && tool.open_source[attr]) ? '✅' : '❌').join(' | ');
      return `| ${tool.name} | ${rowValues} |`;
    });

    return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
  } else if (attribute === 'language_support') {
    const languages = ['python', 'javascript', 'java', 'cpp'];
    const tableHeader = `| Tool | ${languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(' | ')} |`;
    const tableSeparator = `|------|${'-|'.repeat(languages.length)}`;
    const tableRows = categoryTools.map((tool) => {
      const rowValues = languages.map((lang) => (tool.language_support && tool.language_support[lang]) ? '✅' : '❌').join(' | ');
      return `| ${tool.name} | ${rowValues} |`;
    });

    return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
  } else if (attribute === 'pricing') {
    const tableHeader = `| Tool | Model | Tiers |`;
    const tableSeparator = `|------|-------|------|`;
    const tableRows = categoryTools.map((tool) => {
      const tiers = tool.pricing && tool.pricing.tiers ? tool.pricing.tiers.map((tier) => `${tier.name}: ${tier.price}`).join(', ') : 'N/A';
      return `| ${tool.name} | ${tool.pricing && tool.pricing.model ? tool.pricing.model : 'N/A'} | ${tiers} |`;
    });

    return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
  } else {
    const formattedAttribute = attribute.replace(/_/g, ' ');
    const tableHeader = `| Tool | ${formattedAttribute.charAt(0).toUpperCase() + formattedAttribute.slice(1)} |`;
    const tableSeparator = `|------|------|`;
    const tableRows = categoryTools.map((tool) => {
      const value = tool[attribute];
      const formattedValue = typeof value === 'boolean' ? (value ? '✅' : '❌') : (value || 'N/A');
      return `| ${tool.name} | ${formattedValue} |`;
    });

    return `
${tableHeader}
${tableSeparator}
${tableRows.join('\n')}
`;
  }
};

const generateCategorySection = (category) => {
  const categoryTools = tools.filter((tool) => tool.category === category.name);

  let attributes;
  if (category.name === 'Code Autocompletion') {
    attributes = ['open_source', 'ide_support', 'pricing', 'free_tier', 'chat_interface', 'creator', 'language_support', 'supports_local_model', 'supports_offline_use'];
  } else if (category.name === 'Intelligent Terminals / Shells') {
    attributes = ['open_source', 'pricing', 'free_tier', 'chat_interface', 'command_completion', 'advanced_history', 'supports_local_model', 'supports_offline_use'];
  } else if (category.name === 'Video Editing') {
    attributes = ['open_source', 'pricing', 'free_tier', 'works_in_browser', 'supports_autotranscribe', 'edit_via_transcription'];
  } else if (category.name === 'Mutation Testing') {
    attributes = ['open_source', 'language_support', 'supports_local_model', 'supports_offline_use', 'pricing'];
  }

  const attributeSections = attributes ? attributes.map((attribute) => {
    if (!attribute) return ''; // Skip if attribute is undefined
    const formattedAttribute = attribute.replace(/_/g, ' ');
    return `
### ${formattedAttribute.charAt(0).toUpperCase() + formattedAttribute.slice(1)}

${generateAttributeTable(categoryTools, attribute)}
`;
  }).filter(section => section !== '') : []; // Filter out empty sections

  return `
## ${category.name}

${category.description}

${attributeSections}
`;
};

const generateTableOfContents = (categories) => {
  return `
## Table of Contents

${categories.map((category, index) => `${index + 1}. [${category.name}](#${category.name.toLowerCase().replace(/ /g, '-')})`).join('\n')}
`;
};

const generatePostContent = (categories, tools, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  const toolTable = generateToolTable(tools);
  const categorySections = categories.map((category) => generateCategorySection(category)).join('\n');
  const tableOfContents = generateTableOfContents(categories);
  return `
import { ArticleLayout } from '@/components/ArticleLayout'
import Image from 'next/image'
import Link from 'next/link'
import aiAssistedDevTools from '@/images/ai-assisted-dev-tools.webp'
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: "The Giant List of AI-Assisted Developer Tools Compared and Reviewed",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A comprehensive comparison and review of AI-assisted developer tools, including code autocompletion, intelligent terminals/shells, and video editing tools.",
  image: aiAssistedDevTools
})

export default (props) => <ArticleLayout metadata={metadata} {...props} />

<Image src={aiAssistedDevTools} alt="AI-Assisted Developer Tools" />

## Introduction

Here's a comprehensive comparison AI-assisted developer tools, including code autocompletion, intelligent terminals/shells, and video editing tools. Reviews are linked when available.

${tableOfContents}

## Tools and reviews

${toolTable}

${categorySections}

## Remember to bookmark and share 

This page will be updated regularly with new information, revisions and enhancements. Be sure to share it and check back frequently.
`;
};

const dir = path.join(process.env.PWD, `/src/app/blog/ai-assisted-dev-tools-compared`);
const filename = `${dir}/page.mdx`;

let existingDate = null;

if (fs.existsSync(filename)) {
  const existingContent = fs.readFileSync(filename, 'utf8');
  existingDate = extractDateFromContent(existingContent);
}

const content = generatePostContent(categories, tools, existingDate);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
console.log(`Generated content for "The Giant List of AI-Assisted Developer Tools Compared and Reviewed" and wrote to ${filename}`);