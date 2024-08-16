const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const readline = require('readline');
const { resolveMetadata } = require('next/dist/lib/metadata/resolve-metadata');

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

function generatePRComment(report) {
  let comment = "# Metadata check results\n\n";

  comment += "## Summary\n\n";
  comment += `✅ Full Metadata: ${report.fullMetadata.length} pages\n`;
  comment += `⚠️ Partial Metadata: ${report.partialMetadata.length} pages\n`;
  comment += `❌ No Metadata: ${report.noMetadata.length} pages\n`;
  comment += `🚫 Errors: ${report.errors.length} pages\n\n`;

  comment += "## Detailed Results\n\n";
  
  if (report.partialMetadata.length > 0 || report.noMetadata.length > 0) {
    comment += "Metadata issues were found in this pull request. Please address them.\n\n";
    
    if (report.partialMetadata.length > 0) {
      comment += "Pages with Partial Metadata:\n";
      report.partialMetadata.forEach(page => {
        comment += `* ${page.file}: Missing ${page.missingFields.join(', ')}\n`;
      });
      comment += "\n";
    }
    
    if (report.noMetadata.length > 0) {
      comment += "Pages with No Metadata:\n";
      report.noMetadata.forEach(page => {
        comment += `* ${page}\n`;
      });
      comment += "\n";
    }
  } else {
    comment += "No metadata issues found in this pull request. Great job!\n";
  }
  
  comment += "For full details, please check the [metadata-report.md](../artifacts/metadata-reports/metadata-report.md) artifact.\n\n";

  comment += "## Artifacts\n\n";
  comment += "* metadata-report.md\n";
  comment += "* metadata-report.json\n";
  
  return comment;
}

async function debugMetadata(report) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const allPages = [
    ...report.fullMetadata.map(file => ({ file, status: 'full' })),
    ...report.partialMetadata.map(item => ({ file: item.file, status: 'partial', missingFields: item.missingFields })),
    ...report.noMetadata.map(file => ({ file, status: 'none' })),
    ...report.errors.map(item => ({ file: item.file, status: 'error', error: item.error }))
  ];

  for (const page of allPages) {
    console.clear();
    console.log(`File: ${page.file}`);
    console.log(`Status: ${page.status}`);
    
    if (page.status === 'partial') {
      console.log(`Missing fields: ${page.missingFields.join(', ')}`);
    } else if (page.status === 'error') {
      console.log(`Error: ${page.error}`);
    }

    if (page.status !== 'error') {
      try {
        const filePath = path.join(appDir, page.file);
        console.log(`Full file path: ${filePath}`);
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log('\nFile content (first 500 characters):');
        console.log(fileContent.slice(0, 500) + '...');

        // Attempt to parse metadata
        const metadata = parseMetadata(fileContent);
        console.log('\nParsed Metadata:');
        console.log(JSON.stringify(metadata, null, 2));

      } catch (error) {
        console.log(`Error resolving metadata: ${error.message}`);
        console.log(`Stack trace: ${error.stack}`);
      }
    }

    await new Promise(resolve => {
      rl.question('Press Enter to continue, or type "q" to quit: ', (answer) => {
        if (answer.toLowerCase() === 'q') {
          rl.close();
          process.exit(0);
        }
        resolve();
      });
    });
  }

  rl.close();
}

function parseMetadata(fileContent) {
  const metadataRegex = /export\s+(const\s+metadata\s*=|async\s+function\s+generateMetadata\s*\(\s*\)\s*{[\s\S]*?return)\s*({[\s\S]*?})/;
  const match = fileContent.match(metadataRegex);
  
  if (match) {
    const metadataString = match[2];
    // Simple parsing, this might need to be more robust
    return JSON.parse(metadataString.replace(/'/g, '"'));
  }
  
  return null;
}

function writeReportAndLog(report) {
  const markdownReport = generatePRComment(report);
  fs.writeFileSync('metadata-report.md', markdownReport);

  const jsonReport = JSON.stringify(report, null, 2);
  fs.writeFileSync('metadata-report.json', jsonReport);

  console.log(markdownReport);
}

if (process.argv.includes('--debug')) {
  const report = generateReport();
  debugMetadata(report);
} else {
  const report = generateReport();
  writeReportAndLog(report);
}