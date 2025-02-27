#!/usr/bin/env node

/**
 * This script helps migrate existing content to the simplified MDX-based content system.
 * It scans the src/app directory for content directories and creates the necessary
 * page.mdx files with the appropriate metadata.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Content type mapping
const CONTENT_TYPES = {
  'blog': 'blog',
  'videos': 'video',
  'learn/courses': 'course',
  'demos': 'demo',
};

// Template for the MDX file
const MDX_TEMPLATE = `import { createMetadata } from '@/utils/createMetadata'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleLayout } from '@/components/ArticleLayout'

export const metadata = createMetadata({
  author: "{{author}}",
  date: "{{date}}",
  title: "{{title}}",
  description: "{{description}}",
  type: "{{type}}",
  slug: "{{slug}}"{{commerce}}
})

// Use the ArticleLayout component to render the content
export default (props) => <ArticleLayout metadata={metadata} {...props} />

# {{title}}

{{content}}
`;

/**
 * Extract metadata from a JavaScript/TypeScript file
 * @param {string} filePath Path to the file
 * @returns {Promise<Object|null>} Extracted metadata or null if not found
 */
async function extractMetadata(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    
    // Parse the file
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    
    let metadata = null;
    
    // Traverse the AST to find metadata
    traverse(ast, {
      VariableDeclaration(path) {
        const declarations = path.node.declarations;
        
        for (const declaration of declarations) {
          if (
            declaration.id.type === 'Identifier' && 
            declaration.id.name === 'metadata' &&
            declaration.init
          ) {
            // Found metadata declaration
            if (declaration.init.type === 'ObjectExpression') {
              // Extract metadata from object expression
              metadata = {};
              
              for (const property of declaration.init.properties) {
                if (property.key.type === 'Identifier') {
                  const key = property.key.name;
                  
                  if (property.value.type === 'StringLiteral') {
                    metadata[key] = property.value.value;
                  } else if (property.value.type === 'NumericLiteral') {
                    metadata[key] = property.value.value;
                  } else if (property.value.type === 'ObjectExpression') {
                    // Handle nested objects like commerce
                    metadata[key] = {};
                    
                    for (const nestedProp of property.value.properties) {
                      if (nestedProp.key.type === 'Identifier') {
                        const nestedKey = nestedProp.key.name;
                        
                        if (nestedProp.value.type === 'StringLiteral') {
                          metadata[key][nestedKey] = nestedProp.value.value;
                        } else if (nestedProp.value.type === 'NumericLiteral') {
                          metadata[key][nestedKey] = nestedProp.value.value;
                        } else if (nestedProp.value.type === 'BooleanLiteral') {
                          metadata[key][nestedKey] = nestedProp.value.value;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      
      CallExpression(path) {
        if (
          path.node.callee.type === 'Identifier' && 
          path.node.callee.name === 'createMetadata' &&
          path.parent.type === 'VariableDeclarator' &&
          path.parent.id.name === 'metadata'
        ) {
          // Found createMetadata call
          if (path.node.arguments.length > 0 && path.node.arguments[0].type === 'ObjectExpression') {
            metadata = {};
            
            for (const property of path.node.arguments[0].properties) {
              if (property.key.type === 'Identifier') {
                const key = property.key.name;
                
                if (property.value.type === 'StringLiteral') {
                  metadata[key] = property.value.value;
                } else if (property.value.type === 'NumericLiteral') {
                  metadata[key] = property.value.value;
                } else if (property.value.type === 'ObjectExpression') {
                  // Handle nested objects like commerce
                  metadata[key] = {};
                  
                  for (const nestedProp of property.value.properties) {
                    if (nestedProp.key.type === 'Identifier') {
                      const nestedKey = nestedProp.key.name;
                      
                      if (nestedProp.value.type === 'StringLiteral') {
                        metadata[key][nestedKey] = nestedProp.value.value;
                      } else if (nestedProp.value.type === 'NumericLiteral') {
                        metadata[key][nestedKey] = nestedProp.value.value;
                      } else if (nestedProp.value.type === 'BooleanLiteral') {
                        metadata[key][nestedKey] = nestedProp.value.value;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return metadata;
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return null;
  }
}

/**
 * Create an MDX file from metadata
 * @param {Object} metadata Content metadata
 * @param {string} outputPath Path to write the MDX file
 * @returns {Promise<boolean>} Success status
 */
async function createMdxFile(metadata, outputPath) {
  try {
    // Ensure the directory exists
    const outputDir = path.dirname(outputPath);
    await mkdirAsync(outputDir, { recursive: true });
    
    // Format commerce data if present
    let commerceString = '';
    if (metadata.commerce) {
      commerceString = ',\n  commerce: ' + JSON.stringify(metadata.commerce, null, 2);
    }
    
    // Create the MDX content
    let mdxContent = MDX_TEMPLATE
      .replace('{{author}}', metadata.author || 'Unknown')
      .replace('{{date}}', metadata.date || new Date().toISOString().split('T')[0])
      .replace(/{{title}}/g, metadata.title || 'Untitled')
      .replace('{{description}}', metadata.description || '')
      .replace('{{type}}', metadata.type || 'blog')
      .replace('{{slug}}', metadata.slug || '')
      .replace('{{commerce}}', commerceString)
      .replace('{{content}}', 'Content goes here. Replace this with the actual content.');
    
    // Write the file
    await writeFileAsync(outputPath, mdxContent, 'utf8');
    console.log(`Created ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`Error creating MDX file at ${outputPath}:`, error);
    return false;
  }
}

/**
 * Scan a directory for content
 * @param {string} contentType Content type (blog, videos, etc.)
 * @returns {Promise<void>}
 */
async function scanContentDirectory(contentType) {
  const contentDir = path.join(process.cwd(), 'src', 'app', contentType);
  
  // Check if the directory exists
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}`);
    return;
  }
  
  // Get all directories in the content folder (excluding [slug] and page.tsx)
  const slugs = fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== '[slug]';
    });
  
  console.log(`Found ${slugs.length} content items in ${contentType}`);
  
  // Process each content item
  for (const slug of slugs) {
    const contentItemDir = path.join(contentDir, slug);
    const mdxPath = path.join(contentItemDir, 'page.mdx');
    
    // Skip if MDX file already exists
    if (fs.existsSync(mdxPath)) {
      console.log(`Skipping ${slug} - MDX file already exists`);
      continue;
    }
    
    // Look for existing metadata
    const files = fs.readdirSync(contentItemDir);
    let metadata = null;
    
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = path.join(contentItemDir, file);
        metadata = await extractMetadata(filePath);
        
        if (metadata) {
          break;
        }
      }
    }
    
    // If no metadata found, create default metadata
    if (!metadata) {
      metadata = {
        author: 'Unknown',
        date: new Date().toISOString().split('T')[0],
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: '',
        type: CONTENT_TYPES[contentType] || 'blog',
        slug: slug,
      };
    }
    
    // Ensure type is set correctly
    metadata.type = CONTENT_TYPES[contentType] || 'blog';
    
    // Create the MDX file
    await createMdxFile(metadata, mdxPath);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting migration to simplified content system...');
  
  // Scan each content type
  for (const contentType of Object.keys(CONTENT_TYPES)) {
    await scanContentDirectory(contentType);
  }
  
  console.log('Migration complete!');
}

// Run the script
main().catch(error => {
  console.error('Error running migration script:', error);
  process.exit(1);
}); 