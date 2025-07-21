// Import logos the same way as CV.jsx
import logoWorkOS from '@/images/logos/workos.svg'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoCloudflare from '@/images/logos/cloudflare.svg'

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  logo: any;
  achievements: string[];
  technologies: string[];
  aiRelevance: string;
}

export const appliedAiExperience: ExperienceData[] = [
  {
    company: "WorkOS",
    role: "Developer Education",
    duration: "Oct 2024 - Present",
    logo: logoWorkOS,
    achievements: [
      "Built production-ready AI applications demonstrating enterprise authentication patterns and RAG security",
      "Architected and developed Vercel MCP WorkOS AuthKit template showcasing secure LLM integrations",
      "Created comprehensive tutorial applications for securing RAG systems with fine-grained authorization",
      "Engineered MCP (Model Context Protocol) server implementations with enterprise-grade security controls",
      "Developed internal AI tooling for content creation, social media automation, and content throughput optimization",
      "Built production-ready AI applications demonstrating enterprise authentication patterns and RAG security",
      "Architected and developed Vercel MCP WorkOS AuthKit template showcasing secure LLM integrations",
      "Created comprehensive tutorial applications for securing RAG systems with fine-grained authorization",
      "Engineered MCP (Model Context Protocol) server implementations with enterprise-grade security controls",
      "Reduced developer implementation time through hands-on code examples and working applications"
    ],
    technologies: ["Next.js", "OpenAI API", "Anthropic Claude", "TypeScript", "Enterprise Auth"],
    aiRelevance: "Leading AI education and building AI-powered developer tools for enterprise customers"
  },
  {
    company: "Pinecone",
    role: "Staff Developer Advocate",
    duration: "Jul 2023 - Oct 2024",
    logo: logoPinecone,
    achievements: [
      "Built Pinecone's first AWS Reference Architecture demonstrating semantic search at enterprise scale",
      "Created comprehensive RAG pipeline tutorials and examples reaching thousands of engineers globally",
      "Developed and maintained open-source Machine Learning notebooks in Jupyter for vector database integrations",
      "Fixed and optimized Python and JavaScript programs for enterprise customers and community developers",
      "Architected sample applications showcasing vector database + LLM integrations for production use cases"
    ],
    technologies: ["Python", "JavaScript", "TypeScript", "LangChain", "LlamaIndex", "OpenAI", "Anthropic Claude", "AWS", "Kubernetes", "Pulumi", "Jupyter", "Semantic Search", "Vector Embeddings"],
    aiRelevance: "Leading vector database education and RAG system development for AI applications"
  },
  {
    company: "Gruntwork",
    role: "Tech Lead",
    duration: "Mar 2020 - Jul 2023",
    logo: logoGrunty,
    achievements: [
      "Led technical strategy for infrastructure-as-code platform serving 100+ enterprise clients",
      "Architected multi-cloud deployment solutions supporting ML/AI workload requirements",
      "Built automated infrastructure pipelines reducing deployment time from days to hours"
    ],
    technologies: ["Terraform", "AWS", "Go", "Docker", "Kubernetes", "Infrastructure as Code"],
    aiRelevance: "Infrastructure expertise directly applicable to AI model deployment, scaling, and MLOps"
  },
  {
    company: "Cloudflare",
    role: "Senior Software Engineer",
    duration: "Apr 2017 - Mar 2020",
    logo: logoCloudflare,
    achievements: [
      "Maintained global CDN infrastructure serving 25+ billion requests daily with 99.99% uptime",
      "Optimized edge computing performance for high-throughput applications and APIs",
      "Implemented security and DDoS protection systems for 15+ million websites"
    ],
    technologies: ["Go", "Rust", "Linux", "DNS", "CDN", "Edge Computing"],
    aiRelevance: "Experience with high-performance distributed systems essential for AI model serving at scale"
  }
]; 