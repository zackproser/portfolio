const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

const { generateCombinations, slugify } = require('./create-ai-assisted-dev-tools-comparison-pages');
const { tools } = require('../schema/data/ai-assisted-developer-tools.json');

const appDir = path.join(process.cwd(), 'src', 'app');
const expectedMetadataFields = ['title', 'description', 'openGraph', 'twitter', 'author', 'date', 'image'];

// Add a debug flag
const debug = process.argv.includes('--debug');

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileExtension = path.extname(filePath);

    if (fileExtension === '.mdx') {
      const directMetadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})/);
      const createMetadataMatch = content.match(/export\s+const\s+metadata\s*=\s*createMetadata\(({[\s\S]*?})\)/);
      
      if (directMetadataMatch || createMetadataMatch) {
        const metadataString = directMetadataMatch ? directMetadataMatch[1] : createMetadataMatch[1];
        const definedFields = metadataString.match(/(\w+):/g).map(field => field.replace(':', ''));
        
        // Check if createMetadata is used
        if (createMetadataMatch) {
          // Add fields that are always included in createMetadata
          definedFields.push('openGraph', 'twitter');
        }
        
        return { hasMetadata: true, definedFields };
      }
      return { hasMetadata: false, definedFields: [] };
    } else {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      let hasMetadata = false;
      let definedFields = [];

      traverse(ast, {
        ExportNamedDeclaration(path) {
          if (path.node.declaration && path.node.declaration.declarations) {
            const declaration = path.node.declaration.declarations[0];
            if (declaration.id.name === 'metadata') {
              hasMetadata = true;
              if (declaration.init.properties) {
                definedFields = declaration.init.properties.map(prop => prop.key.name);
              }
            }
          }
        },
        ExportDeclaration(path) {
          if (path.node.declaration && path.node.declaration.id && path.node.declaration.id.name === 'generateMetadata') {
            hasMetadata = true;
            definedFields = ['dynamic']; // Assume dynamic metadata covers all fields
          }
        },
      });

      return { hasMetadata, definedFields };
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}: ${error.message}`);
    return { hasMetadata: false, definedFields: [] };
  }
}

function handleDynamicPages() {
  const dynamicPages = [];

  // Handle vector database comparison pages
  const vectorDbDir = path.join(process.cwd(), 'src', 'app', 'comparisons', 'vector-databases');
  dynamicPages.push(path.join(vectorDbDir, 'page.mdx'));

  // Handle AI-assisted dev tools comparison pages
  const combinations = generateCombinations(tools);
  combinations.forEach(([tool1, tool2]) => {
    const slug = `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`;
    const comparisonDir = path.join(process.cwd(), 'src', 'app', 'comparisons', slug);
    dynamicPages.push(path.join(comparisonDir, 'page.mdx'));
  });

  // Handle the main AI-assisted dev tools comparison post
  const mainComparisonDir = path.join(process.cwd(), 'src', 'app', 'blog', 'ai-assisted-dev-tools-compared');
  dynamicPages.push(path.join(mainComparisonDir, 'page.mdx'));

  return dynamicPages;
}

function generateReport() {
  const report = {
    fullMetadata: [],
    partialMetadata: [],
    noMetadata: [],
    errors: [],
  };

  function traverseDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDir(filePath);
      } else if (file === 'page.js' || file === 'page.tsx' || file === 'page.mdx' || file === 'layout.js' || file === 'layout.tsx') {
        analyzeAndAddToReport(filePath, report);
      }
    }
  }

  traverseDir(appDir);

  // Handle dynamic pages
  const dynamicPages = handleDynamicPages();
  dynamicPages.forEach(pagePath => {
    analyzeAndAddToReport(pagePath, report);
  });

  return report;
}

function analyzeAndAddToReport(filePath, report) {
  const relativePath = path.relative(appDir, filePath);
  try {
    if (!fs.existsSync(filePath)) {
      report.noMetadata.push(relativePath);
      return;
    }

    const { hasMetadata, definedFields } = analyzeFile(filePath);

    if (!hasMetadata) {
      report.noMetadata.push(relativePath);
    } else if (definedFields.includes('dynamic') || expectedMetadataFields.every(field => definedFields.includes(field))) {
      report.fullMetadata.push(relativePath);
    } else {
      report.partialMetadata.push({
        file: relativePath,
        missingFields: expectedMetadataFields.filter(field => !definedFields.includes(field)),
      });
    }
  } catch (error) {
    report.errors.push({ file: relativePath, error: error.message });
  }
}

function writeReport(report) {
  const reportPath = path.join(process.cwd(), 'metadata-report.md');
  
  let reportContent = `# Metadata Coverage Summary\n\n`;
  reportContent += `✅ Full metadata: ${report.fullMetadata.length} pages\n`;
  reportContent += `⚠️ Partial metadata: ${report.partialMetadata.length} pages\n`;
  reportContent += `❌ No metadata: ${report.noMetadata.length} pages\n`;
  reportContent += `🚫 Errors: ${report.errors.length} pages\n\n`;

  if (report.partialMetadata.length > 0) {
    reportContent += `## Partial Metadata Pages (${report.partialMetadata.length} total)\n\n`;
    reportContent += `| Page | Missing Fields |\n`;
    reportContent += `|------|----------------|\n`;
    report.partialMetadata.forEach(page => {
      reportContent += `| ${page.file} | ${page.missingFields.join(', ')} |\n`;
    });
    reportContent += `\n`;
  }

  if (report.noMetadata.length > 0) {
    reportContent += `## No Metadata Pages (${report.noMetadata.length} total)\n\n`;
    report.noMetadata.forEach(page => {
      reportContent += `- ${page}\n`;
    });
    reportContent += `\n`;
  }

  // Add detailed lists
  reportContent += `## Detailed Report\n\n`;
  reportContent += `### Full Metadata Pages (${report.fullMetadata.length} total)\n\n`;
  report.fullMetadata.forEach(page => {
    reportContent += `- ${page}\n`;
  });

  reportContent += `\n### Partial Metadata Pages (${report.partialMetadata.length} total)\n\n`;
  report.partialMetadata.forEach(page => {
    reportContent += `- ${page.file} (Missing: ${page.missingFields.join(', ')})\n`;
  });

  reportContent += `\n### No Metadata Pages (${report.noMetadata.length} total)\n\n`;
  report.noMetadata.forEach(page => {
    reportContent += `- ${page}\n`;
  });

  reportContent += `\n### Pages with Errors (${report.errors.length} total)\n\n`;
  report.errors.forEach(error => {
    reportContent += `- ${error.file}: ${error.error}\n`;
  });

  fs.writeFileSync(reportPath, reportContent);

  // Log the summary first
  console.log(`\n`)
  console.log('Metadata Coverage Summary:');
  console.log(`==========================`);
  console.log(`✅ Full metadata: ${report.fullMetadata.length} pages`);
  console.log(`⚠️ Partial metadata: ${report.partialMetadata.length} pages`);
  console.log(`❌ No metadata: ${report.noMetadata.length} pages`);
  console.log(`🚫 Errors: ${report.errors.length} pages`);

  // Add a separation line
  console.log('\n---');

  // Log the report generation details
  console.log(`\nMetadata report generated: ${reportPath}`);
}

const report = generateReport();
writeReport(report);