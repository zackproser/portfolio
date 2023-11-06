import Link from 'next/link';

function renderSegmentLink(segment, course, currentSegment) {
  let conditionalStyle, svgElement;

  // Use segment.dir as the identifier for the segment, not the index in the array
  const segmentDir = segment.dir; // assuming `dir` is a string that corresponds to the segment's directory name or identifier

  // Use the parsed integer of segmentDir for comparison
  const segmentIndex = parseInt(segmentDir, 10);

  if (segmentIndex < currentSegment) {
    conditionalStyle = "bg-green-200 dark:bg-green-700";
    svgElement = (
      <svg
        className="ml-2 h-5 w-5 text-green-500 dark:text-green-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  } else if (segmentIndex === currentSegment) {
    conditionalStyle = "bg-blue-200 dark:bg-blue-700";
    svgElement = (
      <svg
        className="ml-2 h-5 w-5 text-blue-500 dark:text-blue-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2" />
      </svg>
    );
  } else {
    conditionalStyle = "hover:bg-gray-200 dark:hover:bg-gray-700";
    svgElement = null; // Or an appropriate placeholder if needed
  }

  return (
    <li key={segment.dir} className="px-4 py-2">
      <Link href={`/learn/${course}/${segmentIndex}`}>
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
  groupedSegments,
  currentSegment,
  children
}) {

  const currentSegmentNumber = Number(currentSegment)

  const renderSegments = (segments, header, course, currentSegmentNumber) => {
    return (
      <>
        <h3 className="px-4 py-2 text-lg font-semibold">{header}</h3>
        <ul className="space-y-1 text-sm">
          {segments.map(segment => renderSegmentLink(segment, course, currentSegmentNumber))}
        </ul>
      </>
    );
  };

  return (
    <section className="flex mt-12 h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 overflow-auto flex-shrink-0" style={{ minWidth: '16rem' }}>
        <div className="p-6 space-y-2">
          <h2 className="text-xl font-bold">{course}</h2>
          {
            Object.entries(groupedSegments).map(([header, segments]) => (
              renderSegments(segments, header, course, currentSegmentNumber)
            ))
          }
        </div>
      </aside>
      <main className="flex-grow p-6">
        <article className="prose lg:prose-lg dark:prose-dark max-w-none">
          {children}
        </article>
      </main>
    </section>
  );
}
