import Link from "next/link"

export default async function ModuleBrowser({ segments, currentSegment, children }) {
  return (
    <>
      <div className="flex flex-grow">
        <div className="flex flex-col w-64 h-screen bg-zinc-800 border-r overflow-auto">
          <nav className="mt-2">
            {segments.map((segment, index) => (
              <div key={index} className="px-4 py-2">
                <Link href="#" passHref>
                  <span className={`block rounded-md p-2 text-sm font-medium ${index === currentSegment ? 'text-green-500' : 'text-zinc-400'}`}>
                    {segment.title}
                    {index < currentSegment && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        {/* children is the markdown content for this segment */}
        <div
          className="flex flex-grow items-start justify-center pl-8 pr-8 pt-2"
        >
          {children}
        </div>
      </div>
    </>
  );
}

