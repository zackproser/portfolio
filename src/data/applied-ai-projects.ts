export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  impact?: string;
  links: {
    demo?: string;
    code?: string;
    article?: string;
  };
  image?: string;
  featured?: boolean;
}

export const appliedAiProjects: ProjectData[] = [
  {
    title: "Llama 3.1 Fine-tuning with Torchtune",
    description: "Complete production workflow for fine-tuning Llama 3.1-8B-Instruct using Lightning.ai, LoRA, and Weights & Biases integration.",
    technologies: ["Python", "Torchtune", "Lightning.ai", "LoRA", "QLoRA", "W&B"],
    links: {
      article: "https://zackproser.com/blog/how-to-fine-tune-llama-3-1-on-lightning-ai-with-torchtune",
      code: "https://github.com/zackproser/llama-3-1-8b-finetune-lightning-ai-torchtune"
    },
    featured: true
  },
  {
    title: "RAG Pipeline with LangChain & Pinecone",
    description: "Production-ready Retrieval Augmented Generation system with custom embeddings, vector search, and conversational memory.",
    technologies: ["TypeScript", "LangChain", "Pinecone", "OpenAI", "Next.js", "RAG"],
    links: {
      article: "/blog/langchain-pinecone-chat-with-my-blog",
      demo: "https://zackproser.com/chat"
    },
    featured: true
  },
  {
    title: "AI Pipelines & Agents Workshop with Mastra.ai", 
    description: "Led 70+ engineers through building complete agentic workflows in TypeScript at AI Engineer World Fair in San Francisco.",
    technologies: ["TypeScript", "Mastra.ai", "OpenAI", "Zod", "Vercel AI SDK", "Workflows"],
    links: {
      article: "/blog/ai-pipelines-and-agents-mastra",
      code: "https://github.com/workos/mastra-agents-meme-generator"
    },
    featured: true
  },
  {
    title: "MNIST Neural Network & Digit Recognizer",
    description: "Hand-drawn digit recognition system with custom neural network implementation, interactive canvas, and real-time predictions.",
    technologies: ["PyTorch", "Python", "Neural Networks", "Computer Vision", "Flask", "Canvas API"],
    links: {
      article: "/blog/mnist-pytorch-hand-drawn-digit-recognizer",
      demo: "https://mnist.zackproser.com"
    },
    featured: true
  },
  {
    title: "Pinecone AWS Reference Architecture",
    description: "Enterprise-grade Infrastructure as Code template for deploying Pinecone applications on AWS with Pulumi.",
    technologies: ["Pulumi", "AWS", "TypeScript", "Infrastructure as Code", "Pinecone", "Docker"],
    links: {
      article: "/blog/a16z-sf-dec-2023-ai-apps-production",
      code: "https://github.com/pinecone-io/aws-reference-architecture-pulumi"
    },
    featured: true
  },
  {
    title: "Office Oracle AI Chatbot",
    description: "Complete RAG chatbot with custom knowledge base, demonstrating conversational AI patterns and retrieval systems.",
    technologies: ["LangChain", "OpenAI", "Pinecone", "Next.js", "Vector Embeddings", "RAG"],
    links: {
      article: "/blog/office-oracle-overview",
      demo: "https://office-oracle.zackproser.com"
    },
    featured: true
  },
  {
    title: "Cloud GPU Services Comparison",
    description: "Comprehensive analysis and hands-on testing of cloud GPU providers for AI workloads with Jupyter notebook implementations.",
    technologies: ["Jupyter", "PyTorch", "GPU Computing", "Cloud Infrastructure", "Python", "Analysis"],
    links: {
      article: "/blog/cloud-gpu-services-jupyter-notebook-reviewed"
    },
    featured: true
  },
  {
    title: "AI-Assisted Developer Tools Analysis",
    description: "In-depth comparison and review framework for evaluating AI coding assistants and developer productivity tools.",
    technologies: ["Developer Tools", "AI Analysis", "Productivity", "Code Review", "Evaluation"],
    links: {
      article: "/blog/ai-assisted-dev-tools-compared"
    },
    featured: true
  }
]; 