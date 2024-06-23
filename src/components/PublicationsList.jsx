import { CalendarIcon, NewspaperIcon } from 'lucide-react';
import Link from 'next/link';

const publications = [
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
