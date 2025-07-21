// Import logos the same way as CV.jsx
import logoWorkOS from '@/images/logos/workos.svg'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoCloudflare from '@/images/logos/cloudflare.svg'

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  location?: string;
  logo: any;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const appliedAiExperience: ExperienceData[] = [
  {
    company: "WorkOS",
    role: "Developer Education",
    duration: "Oct 2024 - Present",
    location: "Remote",
    logo: logoWorkOS,
    description: "Drive developer education and adoption for enterprises building AI-powered applications with secure authentication and authorization.",
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
    technologies: ["Next.js", "React", "Python", "OpenAI API", "Anthropic Claude", "Vector Databases", "Enterprise Authentication", "AWS"]
  },
  {
    company: "Pinecone",
    role: "Staff Developer Advocate",
    duration: "Jul 2023 - Oct 2024",
    logo: logoPinecone,
    description: "Staff Developer Advocate leading enterprise adoption of vector database technology for production AI applications.",
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
    role: "Senior Software Engineer & Tech Lead",
    duration: "Feb 2020 - Jun 2023",
    logo: logoGrunty,
    description: "Lead engineer on Reference Architecture product, building infrastructure-as-code solutions and managing technical teams.",
    achievements: [
      "Led team building including hiring, technical interviews, training, mentoring, and code reviews",
      "Built deployments, tooling, infrastructure and automated testing for Reference Architecture product",
      "Open-sourced git-xargs: https://github.com/gruntwork-io/git-xargs",
      "Provided customer support for Infrastructure as Code library serving enterprise clients",
      "Enhanced Reference Architecture with new features, bug fixes, automation and documentation"
    ],
    technologies: ["Terraform", "Golang", "Bash", "AWS", "Docker", "Python", "Infrastructure as Code"]
  },
  {
    company: "Cloudflare",
    role: "Software Engineer",
    duration: "Apr 2017 - Feb 2020",
    location: "San Francisco Bay Area",
    logo: logoCloudflare,
    description: "Full stack developer on core API team designing and implementing systems, services and web applications at global scale.",
    achievements: [
      "Designed and implemented 2FA backup codes system for Cloudflare dashboard",
      "Built high scale distributed web performance metrics testing system in AWS",
      "Improved Cloudflare API developer stack and provided cross-team documentation and support",
      "Built and open-sourced cf-terraforming tool for extracting Cloudflare setups into Terraform state",
      "Designed distributed error and schema-drift alerting system adopted by all product teams",
      "Wrote the first Cloudflare Workers deployed in front of api.cloudflare.com and www.cloudflare.com",
      "Built first iteration of Project Jengo and handled weekly API releases"
    ],
    technologies: ["Golang", "PHP", "Node.js", "JavaScript", "Python", "Docker", "Kubernetes", "Terraform", "Bash"]
  },
  {
    company: "Cloudmark",
    role: "Software Engineer", 
    duration: "Feb 2015 - Apr 2017",
    location: "San Francisco Bay Area",
    logo: logoCloudflare, // Using cloudflare logo as placeholder since we don't have cloudmark
    description: "Full stack developer designing and implementing solutions across multiple teams and technologies.",
    achievements: [
      "Designed and implemented Golang messaging microservice",
      "Built custom authentication system for protected content integrating with Salesforce",
      "Worked cross-team to implement and publish quarterly threat reports using d3.js",
      "Handled LAMP stack feature development, legacy monolith maintenance and bug fixes",
      "Designed custom build pipeline for Node.js project leveraging Docker"
    ],
    technologies: ["PHP", "Node.js", "JavaScript", "Golang", "CSS", "SASS", "Bash", "Docker", "d3.js"]
  },
  {
    company: "BrightContext Corporation",
    role: "Software Engineer",
    duration: "Apr 2012 - Apr 2014", 
    location: "Falls Church, VA",
    logo: logoGrunty, // Using grunty logo as placeholder since we don't have brightcontext
    description: "Employee #9 at real-time stream processing engine startup, handling diverse responsibilities from engineering to marketing.",
    achievements: [
      "Built web applications in Node.js demonstrating use of JavaScript SDKs",
      "Verified behavior of cloud stream-processing engine following each release",
      "Built and maintained suite of Selenium tests for manager application",
      "Served as primary QA for stream-processing engine and manager app functionality",
      "Wrote and maintained documentation for JavaScript SDKs and cloud stream-processing engine",
      "Created press releases, thought pieces and statements of work"
    ],
    technologies: ["Node.js", "JavaScript", "Selenium", "AWS"]
  }
]; 