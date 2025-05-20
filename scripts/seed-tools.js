#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed AI developer tools...');

  // Delete all existing tools
  await prisma.tool.deleteMany({});
  console.log('Cleared existing tools');

  // Sample tools data
  const tools = [
    {
      name: 'GitHub Copilot',
      description: 'AI pair programmer that helps you write code faster with less work',
      category: 'Code Autocompletion',
      websiteUrl: 'https://github.com/features/copilot',
      githubUrl: 'https://github.com/features/copilot',
      pricing: 'Free for students, $10/month individual, $19/user/month for businesses',
      openSource: false,
      features: ['Code completion', 'Function generation', 'Test generation', 'Code explanations', 'Natural language to code'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Ruby', 'Java', 'C#', 'PHP'],
      pros: ['Seamless GitHub integration', 'Multi-IDE support', 'Fast suggestions', 'Context-aware completion'],
      cons: ['Subscription cost', 'Sometimes generates incorrect code', 'May suggest code with security vulnerabilities'],
      reviewCount: 1254,
      logoUrl: 'https://github.githubassets.com/images/modules/site/features/copilot/copilot.png'
    },
    {
      name: 'Codeium',
      description: 'Free AI-powered code completion and chat tool',
      category: 'Code Autocompletion',
      websiteUrl: 'https://codeium.com',
      githubUrl: null,
      pricing: 'Free tier, $12/month Pro',
      openSource: false,
      features: ['Code completion', 'Code chat', 'Context awareness', 'Multi-file understanding', 'API suggestions'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Ruby', 'Rust', 'C++', 'PHP'],
      pros: ['Free tier available', 'Accurate suggestions', 'Good privacy practices', 'Supports many IDEs'],
      cons: ['Newer tool with fewer users', 'Sometimes slower than alternatives'],
      reviewCount: 863,
      logoUrl: 'https://codeium.com/images/landing/codeium-logo.png'
    },
    {
      name: 'Cursor',
      description: 'AI-first code editor built on VSCode with chat, edit, and generation capabilities',
      category: 'AI-Enhanced IDE',
      websiteUrl: 'https://cursor.sh',
      githubUrl: null,
      pricing: 'Free tier, $20/month Pro',
      openSource: false,
      features: ['AI chat', 'Code editing', 'Code generation', 'Codebase understanding', 'Full IDE functionality'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Ruby', 'Rust', 'C++', 'PHP', 'Java'],
      pros: ['Built on VSCode', 'Powerful chat interface', 'Understands your entire codebase', 'Active development'],
      cons: ['Occasionally high resource usage', 'Newer tool still maturing'],
      reviewCount: 742,
      logoUrl: 'https://cursor.sh/cursor.svg'
    },
    {
      name: 'Tabnine',
      description: 'AI-powered code completion assistant that helps developers write code faster',
      category: 'Code Autocompletion',
      websiteUrl: 'https://www.tabnine.com',
      githubUrl: 'https://github.com/codota/tabnine',
      pricing: 'Free tier, $12/month Pro, Team plans available',
      openSource: false,
      features: ['Code completion', 'Whole line completion', 'Local processing option', 'Code snippets'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Ruby'],
      pros: ['Privacy-focused local AI option', 'Good free tier', 'Lightweight', 'Works with many IDEs'],
      cons: ['Sometimes less context-aware than competitors', 'Local model has less advanced capabilities'],
      reviewCount: 917,
      logoUrl: 'https://www.tabnine.com/favicon.ico'
    },
    {
      name: 'Amazon CodeWhisperer',
      description: 'AI coding companion from AWS that provides code suggestions',
      category: 'Code Autocompletion',
      websiteUrl: 'https://aws.amazon.com/codewhisperer/',
      githubUrl: null,
      pricing: 'Free for individual developers, Professional tier for businesses',
      openSource: false,
      features: ['Code completion', 'Security scans', 'Reference tracking', 'AWS service integration'],
      languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C#', 'Go', 'Ruby', 'PHP'],
      pros: ['AWS integration', 'Security scanning', 'Free for individual use', 'Provides references for generated code'],
      cons: ['Less effective outside of AWS context', 'Fewer IDE integrations'],
      reviewCount: 485,
      logoUrl: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png'
    },
    {
      name: 'Aider',
      description: 'Voice and chat-based AI coding assistant that helps edit your code',
      category: 'CLI Tool',
      websiteUrl: 'https://aider.chat',
      githubUrl: 'https://github.com/paul-gauthier/aider',
      pricing: 'Free and open source (requires OpenAI API key)',
      openSource: true,
      features: ['Terminal-based coding', 'Voice control', 'Edit code through chat', 'Git integration'],
      languages: ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Ruby', 'Java', 'C++'],
      pros: ['Open source', 'Works in terminal', 'Voice control option', 'Edits code directly'],
      cons: ['Requires OpenAI API key and costs', 'Less polished UI than IDE alternatives'],
      reviewCount: 312,
      logoUrl: null
    },
    {
      name: 'Warp',
      description: 'Terminal reimagined with AI assistance for commands and workflows',
      category: 'CLI Tool',
      websiteUrl: 'https://www.warp.dev',
      githubUrl: null,
      pricing: 'Free tier, $8.25/month Team plan',
      openSource: false,
      features: ['AI command search', 'Workflow sharing', 'Block-based terminal', 'Command history'],
      languages: ['Bash', 'Zsh', 'Fish', 'PowerShell'],
      pros: ['Modern terminal design', 'Block-based output', 'Command suggestions', 'Workflow sharing'],
      cons: ['macOS only (Linux in beta)', 'Learning curve for terminal power users'],
      reviewCount: 623,
      logoUrl: 'https://warp.dev/static/logo-4a1ade13a372fa822a9fd1b271a61386.svg'
    },
    {
      name: 'Cody',
      description: 'AI coding assistant from Sourcegraph that understands your entire codebase',
      category: 'Code Chat',
      websiteUrl: 'https://sourcegraph.com/cody',
      githubUrl: 'https://github.com/sourcegraph/cody',
      pricing: 'Free tier, $19/month Pro, Enterprise plans',
      openSource: true,
      features: ['Codebase understanding', 'Context-aware answers', 'Multi-repo support', 'Code explanations'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'C#', 'Ruby', 'Rust'],
      pros: ['Understands large codebases', 'Good free tier', 'Context-aware responses', 'Partially open source'],
      cons: ['Pro features require subscription', 'VSCode-focused'],
      reviewCount: 520,
      logoUrl: 'https://sourcegraph.com/.assets/img/sourcegraph-mark.svg'
    },
    {
      name: 'Zed',
      description: 'High-performance code editor with built-in AI pair programming',
      category: 'AI-Enhanced IDE',
      websiteUrl: 'https://zed.dev',
      githubUrl: 'https://github.com/zed-industries/zed',
      pricing: 'Free (currently in alpha)',
      openSource: true,
      features: ['Collaboration', 'AI pair programming', 'High performance', 'Multi-user editing'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Ruby', 'C++', 'PHP'],
      pros: ['Rust-based for speed', 'Real-time collaboration', 'Open source', 'Low resource usage'],
      cons: ['Still in alpha stage', 'Missing some features of mature IDEs', 'macOS only currently'],
      reviewCount: 387,
      logoUrl: 'https://zed.dev/img/logo-black.svg'
    },
    {
      name: 'Descript',
      description: 'AI-powered audio and video editor that lets you edit media like a text document',
      category: 'Visual Editor',
      websiteUrl: 'https://www.descript.com',
      githubUrl: null,
      pricing: 'Free tier, $12/month Creator, $24/month Pro',
      openSource: false,
      features: ['Transcription', 'Text-based editing', 'Voice cloning', 'Screen recording', 'AI generation'],
      languages: ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian'],
      pros: ['Intuitive interface', 'Powerful AI features', 'Text-based editing workflow', 'Good free tier'],
      cons: ['Resource intensive', 'Advanced features require subscription'],
      reviewCount: 934,
      logoUrl: 'https://assets-global.website-files.com/61d7d85891c3310080c170cf/6228a9bf741a11434a14252d_descript-favicon-256.png'
    }
  ];

  // Add tools to database
  for (const tool of tools) {
    await prisma.tool.create({
      data: tool
    });
    console.log(`Added ${tool.name}`);
  }

  const toolCount = await prisma.tool.count();
  console.log(`Database now has ${toolCount} tools`);
}

main()
  .catch((e) => {
    console.error('Error seeding tools:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 