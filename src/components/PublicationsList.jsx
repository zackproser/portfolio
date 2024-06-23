import { CalendarIcon, NewspaperIcon } from 'lucide-react';

const publications = [
  {
    title: "The Future of Artificial Intelligence",
    date: "2023-05-15",
    publication: "Tech Innovator Magazine"
  },
  {
    title: "Sustainable Energy Solutions for Tomorrow",
    date: "2023-07-22",
    publication: "Green Earth Journal"
  },
  {
    title: "Revolutionizing Healthcare with Nanotech",
    date: "2023-09-10",
    publication: "Medical Frontiers Weekly"
  },
];

export default function Publications() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ul className="space-y-6">
        {publications.map((pub, index) => (
          <li key={index} className="bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-emerald-400">{pub.title}</h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400 mb-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{new Date(pub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-zinc-400">
                <NewspaperIcon className="w-4 h-4 mr-2" />
                <span>{pub.publication}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
