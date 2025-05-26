const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Removed static comparison generation - now using dynamic database-driven system

const appDir = path.join(process.cwd(), 'src', 'app');
const expectedMetadataFields = ['title', 'description', 'openGraph', 'twitter', 'author', 'date', 'image'];

// Add verbose flag
const isVerbose = process.argv.includes('--verbose');

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
        
        if (createMetadataMatch) {
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
                definedFields = declaration.init.properties
                  .filter(prop => prop.key)
                  .map(prop => prop.key.name);
              }
            }
          }
        },
        ExportDeclaration(path) {
          if (path.node.declaration && path.node.declaration.id && path.node.declaration.id.name === 'generateMetadata') {
            hasMetadata = true;
            definedFields = ['dynamic'];
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

// Removed handleDynamicPages - no longer generating static comparison pages

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

  // No longer checking dynamic comparison pages - using database-driven system

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
  
  comment += "For full details, please check the metadata-report.md artifact.\n\n";

  comment += "## Artifacts\n\n";
  comment += "* metadata-report.md\n";
  comment += "* metadata-report.json\n";
  
  return comment;
}

function writeReportAndLog(report) {
  const markdownReport = generatePRComment(report);
  fs.writeFileSync('metadata-report.md', markdownReport);

  const jsonReport = JSON.stringify(report, null, 2);
  fs.writeFileSync('metadata-report.json', jsonReport);

  // Only output full report when verbose flag is enabled
  if (isVerbose) {
    console.log(markdownReport);
  } else {
    // Print a concise summary instead
    const totalPages = report.fullMetadata.length + report.partialMetadata.length + 
                      report.noMetadata.length + report.errors.length;
    
    console.log(`Metadata check: ${report.fullMetadata.length} complete, ${report.partialMetadata.length} partial, ${report.noMetadata.length} missing, ${report.errors.length} errors (${totalPages} total)`);
    
    // Only show issues if there are any
    if (report.partialMetadata.length > 0 || report.noMetadata.length > 0 || report.errors.length > 0) {
      console.log('For details, see metadata-report.md and metadata-report.json');
    }
  }
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

if (process.argv.includes('--debug')) {
  const report = generateReport();
  debugMetadata(report);
} else {
  const report = generateReport();
  writeReportAndLog(report);
}