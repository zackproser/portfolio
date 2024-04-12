const fs = require('fs');
const path = require('path');

const { categories, tools } = require('../schema/data/ai-assisted-developer-tools.json');

const extractDateFromContent = (content) => {
  const dateRegex = /date: "(\d{4}-\d{1,2}-\d{1,2})"/;
  const match = content.match(dateRegex);
  return match ? match[1] : null;
};

const generateAttributeTable = (categoryTools, attribute) => {
  if (attribute === 'ide_support') {
    const ides = ['vs_code', 'jetbrains', 'neovim', 'visual_studio', 'vim', 'emacs', 'intellij'];
    const formattedIDEs = ides.map(ide => ide.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const tableHeader = `| Tool | ${formattedIDEs.join(' | ')} |`;
    const tableSeparator = `|------|${'-|'.repeat(ides.length)}`;
    const tableRows = categoryTools.map((tool) => {
      const rowValues = ides.map((ide) => tool.ide_support[ide] ? '✅' : '❌').join(' | ');
      const reviewLink = tool.review_link ? `<Link href="${tool.review_link}">📚 review</Link>` : '';
      const homepageLink = tool.homepage_link ? `<Link href="${tool.homepage_link}">🏠 homepage</Link>` : '';
      return `| ${tool.name} ${reviewLink} ${homepageLink} | ${rowValues} |`;
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
      const rowValues = openSourceAttributes.map((attr) => tool.open_source[attr] ? '✅' : '❌').join(' | ');
      const reviewLink = tool.review_link ? `<Link href="${tool.review_link}">📚 review</Link>` : '';
      const homepageLink = tool.homepage_link ? `<Link href="${tool.homepage_link}">🏠 homepage</Link>` : '';
      return `| ${tool.name} ${reviewLink} ${homepageLink} | ${rowValues} |`;
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
      const rowValues = languages.map((lang) => tool.language_support[lang] ? '✅' : '❌').join(' | ');
      const reviewLink = tool.review_link ? `<Link href="${tool.review_link}">📚 review</Link>` : '';
      const homepageLink = tool.homepage_link ? `<Link href="${tool.homepage_link}">🏠 homepage</Link>` : '';
      return `| ${tool.name} ${reviewLink} ${homepageLink} | ${rowValues} |`;
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
      const tiers = tool.pricing.tiers.map((tier) => `${tier.name}: ${tier.price}`).join(', ');
      const reviewLink = tool.review_link ? `<Link href="${tool.review_link}">📚 review</Link>` : '';
      const homepageLink = tool.homepage_link ? `<Link href="${tool.homepage_link}">🏠 homepage</Link>` : '';
      return `| ${tool.name} ${reviewLink} ${homepageLink} | ${tool.pricing.model} | ${tiers} |`;
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
      const formattedValue = typeof value === 'boolean' ? (value ? '✅' : '❌') : value;
      const reviewLink = tool.review_link ? `<Link href="${tool.review_link}">📚 review</Link>` : '';
      const homepageLink = tool.homepage_link ? `<Link href="${tool.homepage_link}">🏠 homepage</Link>` : '';
      return `| ${tool.name} ${reviewLink} ${homepageLink} | ${formattedValue} |`;
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
  }

  const attributeSections = attributes.map((attribute) => {
    const formattedAttribute = attribute.replace(/_/g, ' ');
    return `
### ${formattedAttribute.charAt(0).toUpperCase() + formattedAttribute.slice(1)}

${generateAttributeTable(categoryTools, attribute)}
`;
  }).join('\n');

  return `
## ${category.name}

${category.description}

${attributeSections}
`;
};

const generatePostContent = (categories, tools, existingDate) => {
  const dateToUse = existingDate || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

  const categorySections = categories.map((category) => {
    return generateCategorySection(category);
  }).join('\n');

  const tableOfContents = categories.map((category) => {
    const attributes = category.name === 'Code Autocompletion'
      ? ['open_source', 'ide_support', 'pricing', 'free_tier', 'chat_interface', 'creator', 'language_support', 'supports_local_model', 'supports_offline_use']
      : category.name === 'Intelligent Terminals / Shells'
        ? ['open_source', 'pricing', 'free_tier', 'chat_interface', 'command_completion', 'advanced_history', 'supports_local_model', 'supports_offline_use']
        : ['open_source', 'pricing', 'free_tier', 'works_in_browser', 'supports_autotranscribe', 'edit_via_transcription'];

    const formattedAttributes = attributes.map((attr) => attr.replace(/_/g, ' '));
    const attributeLinks = formattedAttributes.map((attr) => `  - [${attr.charAt(0).toUpperCase() + attr.slice(1)}](#${attr.replace(/\s/g, '-').toLowerCase()})`).join('\n');

    return `
- [${category.name}](#${category.name.replace(/\s/g, '-').toLowerCase()})
${attributeLinks}
`;
  }).join('\n');

  return `
import { ArticleLayout } from '@/components/ArticleLayout'
import Image from 'next/image'
import Link from 'next/link'
import aiAssistedDevTools from '@/images/ai-assisted-dev-tools.webp'

export const metadata = {
  title: "The Giant List of AI-Assisted Developer Tools Compared and Reviewed",
  author: "Zachary Proser",
  date: "${dateToUse}",
  description: "A comprehensive comparison and review of AI-assisted developer tools, including code autocompletion, intelligent terminals/shells, and video editing tools.",
  image: aiAssistedDevTools
}

export default (props) => <ArticleLayout metadata={metadata} {...props} />

<Image src={aiAssistedDevTools} alt="AI-Assisted Developer Tools" />

## Introduction

This post provides a comprehensive comparison and review of various AI-assisted developer tools, including code autocompletion, intelligent terminals/shells, and video editing tools. We'll explore their features, capabilities, and suitability for different development workflows.

## Table of Contents

${tableOfContents}

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

const content = generatePostContent(categories, tools, existingDate);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filename, content, { encoding: 'utf-8', flag: 'w' });
console.log(`Generated content for "The Giant List of AI-Assisted Developer Tools Compared and Reviewed" and wrote to ${filename}`);
