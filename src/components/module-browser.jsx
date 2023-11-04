import Link from "next/link"

export default function ModuleBrowser({ course, segments, currentSegment }) {
  return (
    <div className="flex flex-col w-64 h-screen bg-zinc-800 border-r overflow-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-100">{course}</h2>
        {segment.title}
        {index < currentSegment && (
          <span className="ml-auto text-green-500">✓</span>
        )}
      </Link>
    </div>
  ))
}
      </nav >
    </div >
  )
}

