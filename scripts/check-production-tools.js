const { PrismaClient } = require('@prisma/client');

async function checkProductionTools() {
  console.log('🔍 Checking production database tools...\n');
  
  const prisma = new PrismaClient();
  
  try {
    const tools = await prisma.tool.findMany({
      select: {
        name: true,
        category: true,
        websiteUrl: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`📊 Found ${tools.length} tools in production database:\n`);
    
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.category})`);
    });
    
    console.log('\n🔗 Testing slug generation for problematic URLs:');
    
    const problematicSlugs = [
      'anthropic-claude-api',
      'mistral-ai',
      'cursor',
      'github-copilot'
    ];
    
    for (const slug of problematicSlugs) {
      // Generate search patterns (same logic as in getToolBySlug)
      const patterns = [
        slug,
        slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      ];
      
      const tool = await prisma.tool.findFirst({
        where: {
          OR: patterns.flatMap(pattern => [
            { name: { equals: pattern, mode: 'insensitive' } },
            { name: { contains: pattern, mode: 'insensitive' } }
          ])
        }
      });
      
      console.log(`  ${slug}: ${tool ? '✅ ' + tool.name : '❌ Not found'}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking production tools:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionTools(); 