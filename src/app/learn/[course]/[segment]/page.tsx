import ModuleBrowser from '@/components/module-browser'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getCourseSegments, getSegmentContent } from '@/lib/courses'

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
  const segmentContent = await getSegmentContent(course, segment);

  console.log(`Segments from Page: ${JSON.stringify(segments)}`);

  return (
    <SimpleLayout
      title={course}
      intro={''}
    >
      <ModuleBrowser
        segments={segments}
        currentSegment={segment}
      >
        {segmentContent()}
      </ModuleBrowser>
    </SimpleLayout>
  )
}
