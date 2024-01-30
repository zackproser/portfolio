import CourseBrowser from '@/components/CourseBrowser'
import { Container } from '@/components/Container'
import { getCourseSegments, getSegmentContent } from '@/lib/courses'

interface PageProps {
  params: {
    course: string
    segment: string
  }
}

export default async function Page ({ params }: PageProps) {
  console.log(`Page: ${JSON.stringify(params)}`)

  const { course, segment } = params
  const groupedSegments = await getCourseSegments(course)
  const segmentContent = await getSegmentContent(course, segment)

  console.log(`Segments from Page: ${JSON.stringify(groupedSegments)}`)

  return (
    <Container>
      <CourseBrowser
        course={course}
        groupedSegments={groupedSegments}
        currentSegment={segment}>
        <p>{segmentContent()}</p>
      </CourseBrowser>
    </Container>
  )
}
