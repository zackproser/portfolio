export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  impact?: string;
  links: {
    demo?: string;
    code?: string;
    article?: string;
    cicd?: string;
    ragEval?: string;
  };
  image?: string;
  featured?: boolean;
  premier?: boolean;
}

export const appliedAiProjects: ProjectData[] = [
  {
    title: "Gabbee.io – AI BDR & Lead Qualifier",
    description: "A fully self-built product: market research, UX, full-stack app, telephony/voice AI integration, deployment, analytics, and ongoing maintenance. Connects to Zoho CRM via OAuth, auto-syncs leads, configures qualification campaigns in minutes, and programmatically qualifies leads.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Bland AI", "Vercel", "WorkOS Auth"],
    links: {
      demo: "https://gabbee.io",
      article: "/blog/gabbee-ai-phone-call-app"
    },
    image: "https://zackproser.b-cdn.net/images/gabbee-landing.webp",
    featured: true,
    premier: true,
    impact: "Completed ~85% of qualification calls • Dozens of active demo users • Clear PMF pivot based on transcript analysis"
  },
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
    featured: true,
    impact: "3,000+ developers trained • Dozens of paid tutorial purchases"
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
    title: "ToxIndex Chat Application",
    description: "AI-powered chat application built with Vercel AI SDK, demonstrating real-time conversation capabilities and modern web development patterns.",
    technologies: ["Next.js", "Vercel AI SDK", "TypeScript", "AI Chat", "Real-time"],
    links: {
      article: "/blog/vercel-ai-sdk",
      demo: "https://tox-index-chat.vercel.app/"
    },
    featured: true
  },
  {
    title: "Pinecone Legal Semantic Search Example App",
    description: "Official Pinecone sample application demonstrating semantic search over legal documents using Voyage embeddings and RAG architecture. Featured in Pinecone documentation.",
    technologies: ["Next.js", "Pinecone", "Voyage AI", "LangChain", "Vector Search", "RAG"],
    links: {
      demo: "https://docs.pinecone.io/examples/sample-apps/legal-semantic-search",
      code: "https://github.com/pinecone-io/sample-apps/tree/main/legal-semantic-search"
    },
    featured: true,
    impact: "Spins up semantic search in <10 minutes • Starred/forked by hundreds • Used by at least one major city tech team in prototyping • Used in trainings"
  },
  {
    title: "Pinecone Assistant Example Application",
    description: "Official Pinecone sample application showcasing chat interface integration with Pinecone Assistant API for answering complex questions on proprietary data.",
    technologies: ["Next.js", "Pinecone Assistant API", "Chat Interface", "Document Processing", "RAG"],
    links: {
      demo: "https://docs.pinecone.io/examples/sample-apps/pinecone-assistant",
      code: "https://github.com/pinecone-io/sample-apps/tree/main/pinecone-assistant"
    },
    featured: true
  },
  {
    title: "Vector Databases in Production Book Chapters",
    description: "Author of key chapters in Pinecone's 'Vector Databases in Production for Busy Engineers' series, covering CI/CD for vector databases and RAG evaluation methodologies.",
    technologies: ["Technical Writing", "Vector Databases", "CI/CD", "RAG Evaluation", "Production Systems"],
    links: {
      article: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/",
      cicd: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/ci-cd/",
      ragEval: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/rag-evaluation/"
    },
    featured: true
  },
  {
    title: "WorkOS Vercel MCP Starter Template",
    description: "Created official WorkOS template demonstrating MCP server secured with AuthKit, enabling secure AI agent integrations with enterprise authentication.",
    technologies: ["MCP", "WorkOS AuthKit", "Vercel", "AI Agents", "Enterprise Auth", "TypeScript"],
    links: {
      article: "https://workos.com/blog/vercel-mcp-workos-authkit-template",
      demo: "https://vercel-mcp-example.vercel.app/",
      code: "https://github.com/workos/vercel-mcp-example"
    },
    featured: true
  },
  {
    title: "Secure RAG with Fine-Grained Authorization",
    description: "Tutorial and POC demonstrating how to secure RAG applications with fine-grained authorization, ensuring users only see documents they have access to.",
    technologies: ["RAG", "Fine-Grained Auth", "Pinecone", "WorkOS", "Security", "Authorization"],
    links: {
      article: "https://workos.com/blog/how-to-secure-rag-applications-with-fine-grained-authorization-tutorial-with-code",
      code: "https://github.com/zackproser-workos/fga-pinecone-poc"
    },
    featured: true
  },
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
    title: "Chat with WorkOS Docs",
    description: "RAG-backed documentation assistant for WorkOS built with Next.js, Python/Jupyter, and Pinecone. Supports chat over guides, APIs, and announcements with cited sources.",
    technologies: ["Next.js", "Python", "Jupyter", "RAG Pipeline", "Pinecone"],
    links: {
      demo: "https://workos-rag-demo-one.vercel.app/"
    },
    image: "https://zackproser.b-cdn.net/images/workos-rag-mcp.webp",
    featured: true,
    impact: "Repos reused by multiple teams • Helped drive MCP ecosystem adoption • Presented to 400–500 engineers at MCP Night"
  }
]; 