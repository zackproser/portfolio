import { CalendarIcon, NewspaperIcon } from 'lucide-react';
import Link from 'next/link';

const publications = [
  {
    title: "Accelerating Legal Discovery and Analysis with Pinecone and Voyage AI",
    date: "2024-08-21",
    publication: "Pinecone Learning Center",
    url: "https://www.pinecone.io/learn/legal-semantic-search/"
  },
  {
    title: "When that Adhoc Script Turns Into a Production Pipeline",
    date: "2024-07-23",
    publication: "Prefect.io Blog",
    url: "https://www.prefect.io/blog/when-that-adhoc-script-turns-into-a-production-data-pipeline"
  },
  {
    title: "Building Privacy-Aware AI Software with Vector Databases",
    date: "2024-06-18",
    publication: "The New Stack",
    url: "https://thenewstack.io/building-privacy-aware-ai-software-with-vector-databases/"
  },
  {
    title: "RAG Evaluation: Don't let customers tell you first",
    date: "2024-05-07",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/rag-evaluation/"
  },
  {
    title: "Integrating Cloud-based Vector Databases with CI/CD Pipelines",
    date: "2024-05-05",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/series/vector-databases-in-production-for-busy-engineers/ci-cd"

  },
  {
    title: "Test Pinecone Serverless at Scale with the AWS Reference Architecture",
    date: "2024-01-23",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/scaling-pinecone-serverless/"
  },
  {
    title: "Launch Production-grade architectures using Pinecone's vector database in minutes with the AWS Reference Architecture",
    date: "2023-11-27",
    publication: "Pinecone engineering blog",
    url: "https://www.pinecone.io/blog/aws-reference-architecture/"
  },
  {
    title: "Exploring the Pinecone AWS Reference Architecture",
    date: "2023-11-27",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/aws-reference-architecture/"
  },

  {
    title: "Making it easier to maintain open-source projects with CodiumAI and Pinecone",
    date: "2023-09-27",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/codiumai-pinecone-similar-issues/"
  },
  {
    title: "The Pain and Poetry of Python",
    date: "2023-08-31",
    publication: "Pinecone engineering blog",
    url: "https://www.pinecone.io/blog/pain-poetry-python"
  },
  {
    title: "How to use Jupyter Notebooks for Machine Learning and AI",
    date: "2023-08-23",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/jupyter-notebooks/"
  },

  {
    title: "Retrieval Augmented Generation (RAG)",
    date: "2023-08-03",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/retrieval-augmented-generation",
  },
  {
    title: "AI-powered and built with...JavaScript?",
    date: "2024-08-11",
    publication: "Pinecone learning center",
    url: "https://www.pinecone.io/learn/javascript-ai/",
  },
  {
    title: "How to securely store secrets in BitWarden CLI and load them into your ZSH shell when needed",
    date: "2022-10-27",
    publication: "Gruntwork enginering blog",
    url: "https://blog.gruntwork.io/how-to-securely-store-secrets-in-bitwarden-cli-and-load-them-into-your-zsh-shell-when-needed-f12d4d040df",
  },
  {
    title: "How to write code on Mac or Linux but test on Windows with hot-reloading",
    date: "2022-7-05",
    publication: "Gruntwork enginering blog",
    url: "https://blog.gruntwork.io/how-to-write-code-on-mac-or-linux-but-test-on-windows-with-hot-reloading-b218de5383d1"
  },
  {
    title: "Introducing cf-terraforming",
    date: "2019-02-15",
    publication: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/introducing-cf-terraform"
  },
  {
    title: "Dogfooding Cloudflare Workers",
    date: "2018-05-04",
    publication: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/dogfooding-edge-workers/"
  }
];

export default function Publications() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ul className="space-y-6">
        {publications.map((pub, index) => (
          <Link href={pub.url} target="_blank" rel="noopener noreferrer" key={index}>
            <li key={index} className="bg-white dark:bg-zinc-800 p-3 m-6 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-emerald-400">{pub.title}</h2>
                <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400">
                  <NewspaperIcon className="w-4 h-4 mr-2" />
                  <span>{pub.publication}</span>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
