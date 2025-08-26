// Import logos the same way as CV.jsx
import logoWorkOS from '@/images/logos/workos.svg'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoCloudflare from '@/images/logos/cloudflare.svg'
import logoCloudmark from '@/images/logos/cloudmark.png'
import logoBrightContext from '@/images/logos/brightcontext.png'

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  location?: string;
  logo: any;
  description: string;
  achievements: string[];
  technologies: string[];
  url?: string;
}

export const appliedAiExperience: ExperienceData[] = [
  {
    company: "WorkOS",
    role: "Developer Education",
    duration: "2024–Present",
    location: "Remote",
    logo: logoWorkOS,
    description: "Built internal RAG pipelines and chatbots, shipped public-facing MCP servers secured with AuthKit, created starter kits, led developer tooling research, and taught internal AI workshops on neural networks, embeddings, semantic search, RAG, hallucinations, and how to learn and create content with AI.",
    achievements: [],
    technologies: []
  },
  {
    company: "Pinecone",
    role: "Senior Software Engineer",
    duration: "2023–2024",
    logo: logoPinecone,
    description: "Shipped production vector database features, drove AI/ML developer adoption, and authored content reaching tens of thousands.",
    achievements: [],
    technologies: []
  },
  {
    company: "Gruntwork",
    role: "Senior Software Engineer",
    duration: "2021–2023",
    logo: logoGrunty,
    description: "Delivered cloud infrastructure automation, open-sourced tooling, and deep technical guides used across industry.",
    achievements: [],
    technologies: []
  },
  {
    company: "Cloudflare",
    role: "Software Engineer",
    duration: "2019–2021",
    location: "San Francisco Bay Area",
    logo: logoCloudflare,
    description: "Developed distributed systems at scale, improved developer platform usability, and contributed to widely used docs.",
    achievements: [],
    technologies: []
  },
  {
    company: "Cloudmark",
    role: "Software Engineer", 
    duration: "2015–2017",
    location: "San Francisco Bay Area",
    logo: logoCloudmark,
    description: "Built cross-team systems across a mixed stack; shipped Golang services, Salesforce‑integrated auth, data visualizations, and Dockerized build pipelines.",
    achievements: [],
    technologies: []
  },
  {
    company: "BrightContext Corporation",
    role: "Software Engineer",
    duration: "2012–2014", 
    location: "Falls Church, VA",
    logo: logoBrightContext,
    description: "Employee #9 at real‑time stream‑processing startup; delivered Node.js SDK demos, automated testing, release QA, and developer documentation.",
    achievements: [],
    technologies: []
  },
  {
    company: "Mind on Fire",
    role: "Independent",
    duration: "Ongoing",
    location: "Remote",
    logo: "https://zackproser.b-cdn.net/images/mind-on-fire.webp" as any,
    url: "https://mindonfire.net",
    description: "Advised startups on AI integration, growth engineering, and developer content; generated six-figure revenue.",
    achievements: [],
    technologies: []
  }
]; 