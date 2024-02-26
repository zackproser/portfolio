-- Populate test (dev/staging) courses
INSERT INTO Courses (title, description, slug, status, price_id)
VALUES
  (
    'Generative AI Bootcamp: Dev Tools',
    'Generative AI - and its opportunities and challenges - explained simply, even if you are not technical',
    'generative-ai-bootcamp',
    'available',
    'price_1OoCXBEDHFkvZ1e9OYVKDvh8',

  ),
  (
    'Emotional Intelligence for Developers',
    'Develop emotional intelligence skills specifically tailored for software developers',
    'emotional-intelligence-for-developers', 'coming-soon',
    'price_1OZK3DEDHFkvZ1e9wO7luQv7'
  ),
  (
    'Git Going',
    'The only course you need to become proficient using git',
    'git-going',
    'available',
    'price_1OYr2DEDHFkvZ1e9ZYPj31GO'
  ),
  (
    'Coming Out of Your Shell',
    'Mastering the shell for effective software development',
    'coming-out-of-your-shell',
    'coming-soon',
    'price_1OYdHGEDHFkvZ1e9vZ3l3eoX' 
  ),
  (
    'GitHub Automations',
    'Automate your workflow with GitHub Actions and more',
    'github-automations',
    'coming-soon',
    'price_1OYdGtEDHFkvZ1e9ROX5hHDj' 
  ),
  (
    'Infrastructure as Code',
    'Leveraging IaC for efficient and reliable software deployment',
    'infrastructure-as-code',
    'coming-soon',
    'price_1OYcgfEDHFkvZ1e9Y3hMbnff' 
  ),
  (
    'Pair Coding with AI',
    'Enhancing your coding skills with AI assistance',
    'pair-coding-with-ai',
    'coming-soon',
    'price_1OYaktEDHFkvZ1e9OIvcUsdD' 
  ),
  (
    'Taking Command',
    'Command line proficiency for modern developers',
    'taking-command',
    'coming-soon',
    'price_1OZKFCEDHFkvZ1e96lcLdQAG' 
  ),
  (
    'Your First Full-Stack App',
    'Building a full-stack application from scratch',
    'your-first-full-stack-app',
    'coming-soon',
    'price_1OZKGREDHFkvZ1e92Jb4Mq5K' 
  );
