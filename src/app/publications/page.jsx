import { createMetadata } from '@/utils/createMetadata'
import PublicationsClient from './publications-client'

export const metadata = createMetadata({
  title: "Zachary Proser's publications",
  description: "A searchable list of Zachary Proser's publications on AI, security, authentication, vector databases, and developer tools across leading tech blogs.",
  author: "Zachary Proser",
  type: "website",
});

// Combine existing publication data with new structure
const publications = [
  {
    id: 50,
    title: "Ruby SAML CVE-2024-45409",
    date: "October 2024",
    publisher: "WorkOS Blog",
    category: "Security",
    tags: ["Ruby", "SAML", "CVE", "Security Vulnerabilities"],
    url: "https://workos.com/blog/ruby-saml-cve-2024-45409",
    abstract: "Analysis of the Ruby SAML vulnerability CVE-2024-45409 and how to mitigate it in your applications.",
    featured: true,
  },
  {
    id: 49,
    title: "How to Secure RAG Applications with Fine-Grained Authorization: Tutorial with Code",
    date: "January 2025",
    publisher: "WorkOS Blog",
    category: "Security",
    tags: ["RAG", "Fine-Grained Authorization", "Security", "Tutorial"],
    url: "https://workos.com/blog/how-to-secure-rag-applications-with-fine-grained-authorization-tutorial-with-code",
    abstract: "A practical guide to implementing fine-grained authorization in Retrieval Augmented Generation applications.",
    featured: false,
  },
  {
    id: 48,
    title: "Top 5 Google Zanzibar Open Source Implementations in 2024",
    date: "January 2025",
    publisher: "WorkOS Blog",
    category: "Authorization",
    tags: ["Google Zanzibar", "Open Source", "Authorization"],
    url: "https://workos.com/blog/top-5-google-zanzibar-open-source-implementations-in-2024",
    abstract: "A comparison of the top open source implementations of Google's Zanzibar authorization system.",
    featured: true,
  },
  {
    id: 47,
    title: "Best Practices for CLI Authentication: A Technical Guide",
    date: "December 2024",
    publisher: "WorkOS Blog",
    category: "Authentication",
    tags: ["CLI", "Authentication", "Security"],
    url: "https://workos.com/blog/best-practices-for-cli-authentication-a-technical-guide",
    abstract: "Technical best practices for implementing secure authentication in command-line interfaces.",
    featured: false,
  },
  {
    id: 46,
    title: "How to Build Browser-Based OAuth into Your CLI with WorkOS",
    date: "February 2025",
    publisher: "WorkOS Blog",
    category: "Authentication",
    tags: ["OAuth", "CLI", "Browser Authentication"],
    url: "https://workos.com/blog/how-to-build-browser-based-oauth-into-your-cli-with-workos",
    abstract: "A step-by-step guide to implementing browser-based OAuth authentication in command-line tools.",
    featured: true,
  },
  {
    id: 1,
    title: "Accelerating Legal Discovery and Analysis with Pinecone and Voyage AI",
    date: "August 2024",
    publisher: "Pinecone Learning Center",
    category: "AI",
    tags: ["Legal Tech", "Vector Search", "AI"],
    url: "https://www.pinecone.io/learn/legal-semantic-search/",
    abstract: "An exploration of how vector databases and AI can transform legal discovery processes.",
    featured: true,
  },
  {
    id: 16,
    title: "Introducing cf-terraforming",
    date: "February 2019",
    publisher: "Cloudflare Blog",
    category: "DevOps",
    tags: ["Terraform", "Cloudflare", "Infrastructure as Code"],
    url: "https://blog.cloudflare.com/introducing-cf-terraform",
    abstract: "Introducing a tool to convert Cloudflare configurations to Terraform code.",
    featured: true,
  },
  {
    id: 17,
    title: "Dogfooding Cloudflare Workers",
    date: "May 2018",
    publisher: "Cloudflare Blog",
    category: "Edge Computing",
    tags: ["Cloudflare Workers", "Serverless", "Edge Computing"],
    url: "https://blog.cloudflare.com/dogfooding-edge-workers/",
    abstract: "How Cloudflare uses its own Workers platform to build and improve its services.",
    featured: false,
  },
]

// Extract unique categories and years for filters
const categories = [...new Set(publications.map((pub) => pub.category))].sort()
const years = [...new Set(publications.map((pub) => {
  const dateParts = pub.date.split(" ");
  return dateParts[dateParts.length - 1]; // Get the year part
}))].sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
const allTags = [...new Set(publications.flatMap((pub) => pub.tags))].sort()

export default function PublicationsPage() {
  return (
    <PublicationsClient 
      publications={publications}
      categories={categories}
      years={years}
      allTags={allTags}
    />
  )
}

