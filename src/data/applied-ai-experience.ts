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
      "Led AI fundamentals training for 40+ engineering team members on LLMs, embeddings, and semantic search",
      "Built AI-powered developer onboarding tools reducing new hire ramp time by 60%",
      "Designed educational content on enterprise AI authentication and security patterns"
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
      "Architected and launched AWS Reference Architecture for vector databases, adopted by Fortune 500 companies",
      "Spoke at a16z on 'Taking AI Apps to Production' to 125+ AI engineers and VCs",
      "Created RAG tutorials and content consuming by 50,000+ engineers, becoming top-performing devrel content"
    ],
    technologies: ["Python", "LangChain", "Vector Databases", "AWS", "Pulumi", "RAG"],
    aiRelevance: "Led enterprise adoption of vector database technology for production AI systems"
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