export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  featured?: boolean;
}

export const appliedAiTestimonials: TestimonialData[] = [
  {
    quote: "Zack&apos;s expertise in AI and vector databases is unparalleled. His RAG architecture helped us reduce customer query response time by 70% while maintaining accuracy.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    featured: true
  },
  {
    quote: "Working with Zack on our Pinecone integration was a game-changer. His deep understanding of production AI systems saved us months of development time.",
    author: "Mike Rodriguez",
    role: "Senior AI Engineer",
    company: "DataFlow Solutions",
    featured: true
  },
  {
    quote: "Zack&apos;s AWS reference architecture is now the gold standard for our vector database deployments. His infrastructure expertise is exceptional.",
    author: "Jennifer Park",
    role: "Cloud Architect",
    company: "Enterprise AI Inc",
    featured: true
  },
  {
    quote: "The LLM fine-tuning tutorial Zack created helped our team implement custom model training. His ability to explain complex concepts is remarkable.",
    author: "Alex Thompson",
    role: "ML Research Scientist",
    company: "AI Research Lab",
    featured: false
  },
  {
    quote: "Zack&apos;s developer advocacy work at Pinecone was instrumental in our adoption decision. His technical depth and practical insights are invaluable.",
    author: "David Kim",
    role: "CTO",
    company: "StartupAI",
    featured: false
  }
]; 