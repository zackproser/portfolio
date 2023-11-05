import Link from 'next/link';

function renderSegmentLink(segment, index, course, currentSegment) {
  let conditionalStyle, svgElement;

  if (index < currentSegment) {
    // Case 1: Segment has been completed
    conditionalStyle = "bg-green-200 dark:bg-green-700";
    svgElement = (
      <svg
        className="ml-2 h-5 w-5 text-green-500 dark:text-green-300"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  } else if (index === currentSegment) {
    // Case 2: Segment is the current segment
    conditionalStyle = "bg-blue-200 dark:bg-blue-700";
    svgElement = (
      <svg
        className="ml-2 h-5 w-5 text-blue-500 dark:text-blue-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12c.05-.367.177-.714.367-1.034a9.994 9.994 0 011.03-1.524 9.994 9.994 0 011.524-1.03A9.927 9.927 0 014.954 7.67C3.935 8.082 3.03 8.66 2.274 9.347c-.2.181-.388.366-.566.556l-.017.019c-.179.191-.35.388-.514.59-.335.41-.629.853-.882 1.322a12.014 12.014 0 00-.584 1.516c-.22.657-.332 1.339-.332 2.05 0 .71.112 1.394.332 2.05a12.014 12.014 0 00.584 1.516 11.977 11.977 0 008.825 5.527 11.977 11.977 0 008.153-1.482 11.994 11.994 0 003.544-3.545 11.977 11.977 0 001.482-8.153 11.977 11.977 0 00-1.482-8.153A11.976 11.976 0 0012 2.875a11.976 11.976 0 00-8.153 1.482A11.976 11.976 0 00.459 7.901a12.05 12.05 0 00-.001 8.197 11.976 11.976 0 004.272 4.272 11.976 11.976 0 008.153 1.482 11.976 11.976 0 008.153-1.482 11.977 11.977 0 004.272-4.272 12.05 12.05 0 00.001-8.197z" />
      </svg>
    );
  } else {
    // Case 3: Segment is an upcoming segment
    conditionalStyle = "hover:bg-gray-200 dark:hover:bg-gray-700";
  }

  return (
    <li key={index} className="px-4 py-2">
      <Link href={`/learn/${course}/${index}`}>
        <span className={`block p-2 rounded ${conditionalStyle}`}>
          {segment.title}
          {svgElement}
        </span>
      </Link>
    </li>
  );
}

export default function CourseBrowser({
  course,
  segments,
  currentSegment,
  children
}) {
  return (
    <section className="flex mt-12 h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 overflow-auto flex-shrink-0" style={{ minWidth: '16rem' }}>
        <div className="p-6 space-y-2">
          <h2 className="text-xl font-bold">{course}</h2>
          <ul className="space-y-1 text-sm">
            {segments.map((segment, index) => renderSegmentLink(segment, index, course, currentSegment))}
          </ul>
        </div>
      </aside>
      <main className="flex-grow p-6">
        <article className="prose lg:prose-lg dark:prose-dark max-w-none">
          {children}
        </article>
      </main>
    </section>
  )
}

