import Link from 'next/link'
import { Tool } from '@/types/Tool'

export default function DevToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
      <div>
        <h3 className="text-xl font-semibold dark:text-zinc-800">{tool.name}</h3>
        <p className="mt-2 text-gray-600">{tool.description}</p>
      </div>
      <div className="mt-4 space-y-2">
        <Link
          href={`/devtools/detail/${encodeURIComponent(tool.name.replace(' ', '-'))}`}
          className="block px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Details
        </Link>
        <Link
          href={`/devtools/compare?tools=${tool.slug}`}
          className="block px-4 py-2 text-center text-blue-500 bg-white border border-blue-500 rounded hover:bg-blue-50"
        >
          Compare
        </Link>
      </div>
    </div>
  )
}