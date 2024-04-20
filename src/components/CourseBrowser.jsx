import Link from 'next/link';

function renderSegmentLink(segment, course, currentSegment) {
  console.log(`segment: %o`, segment)
  console.log(`currentSegment: %o`, currentSegment)
  let conditionalStyle, svgElement;

  // Construct the full path for the segment using both segment and page
  const segmentPath = `/${segment.segment}/${segment.page}/`;

  console.log(`segmentPath: ${segmentPath}`)

  // Determine if the current segment is active based on the full path
  const isActive = segment.position === currentSegment.position;

  if (isActive) {
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
    // Check if segmentPath is lexically less than currentSegment to determine if it's a past segment
    const isPastSegment = segment.position < currentSegment.position;
    conditionalStyle = isPastSegment ? "bg-green-200 dark:bg-green-700" : "hover:bg-gray-200 dark:hover:bg-gray-700";
    svgElement = isPastSegment ? (
      <svg
        className="ml-2 h-5 w-5 text-green-500 dark:text-green-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : null; // Or an appropriate placeholder if needed
  }

  // Build the full URL path for the link
  const urlPath = `/learn/${course}${segmentPath}`;

  return (
    <li key={segmentPath} className="py-2">
      <Link href={urlPath}>
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
  // Calculate the total number of segments across all groups
  const totalSegments = Object.values(groupedSegments).reduce((acc, segments) => acc + segments.length, 0);

  // If there's 1 or less segments, just return the children
  if (totalSegments <= 1) {
    return <>{children}</>;
  }

  const renderSegments = (segments, header, course, currentSegment) => {
    return (
      <>
        <h3 className="py-2 text-lg font-semibold">{header}</h3>
        <ul className="space-y-1 text-sm">
          {segments.map(segment => renderSegmentLink(segment, course, currentSegment))}
        </ul>
      </>
    );
  };

  return (
    <section className="flex mt-12 h-screen">
      <aside className="w-64 overflow-auto flex-shrink-0" style={{ minWidth: '16rem' }}>
        <div className="p-6 space-y-2">
          <h2 className="text-xl">Course: {course.replaceAll('-', ' ')}</h2>
          <hr />
          {
            Object.entries(groupedSegments).map(([header, segments]) => (
              renderSegments(segments, header, course, currentSegment)
            ))
          }
        </div>
      </aside>
      <main className="flex-grow p-6 overflow-y-scroll">
        <article className="prose lg:prose-lg dark:prose-invert dark:prose-dark max-w-none">
          {children}
        </article>
      </main>
    </section>
  );
}

