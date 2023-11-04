import ModuleBrowser from '@/components/module-browser'
import { getCourseSegments } from '@/lib/courses'

interface PageProps {
  params: {
    course: string;
    segment: string;
  };
}

export default async function Page({ params }: PageProps) {
  console.log(`Page: ${JSON.stringify(params)}`);

  const { course, segment } = params;
  const segments = await getCourseSegments(course);

  console.log(`Segments from Page: ${JSON.stringify(segments)}`);

  return (
    <ModuleBrowser course={course} segments={segments} currentSegment={segment} />
  )
}
