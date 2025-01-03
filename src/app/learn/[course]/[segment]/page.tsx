import CourseBrowser from '@/components/CourseBrowser'
import { Container } from '@/components/Container'
import { getCourseSegments, getSegmentContent } from '@/lib/courses'

import { redirect } from 'next/navigation'

import { auth } from '../../../../../auth'

import { getProductDetails, ProductDetails } from '@/utils/productUtils';

import { userPurchasedCourse } from '@/lib/queries'

interface PageProps {
  params: Promise<{
    course: string;
    segment: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const session = await auth();

  // Users must be logged in to view this page
  if (!session) {
    redirect('/api/auth/signin');
  }

  const { course, segment } = params;

  const userEmail = session.user.email as unknown as string

  // Determine if user has bought the course they are trying to access 
  // If they have not, redirect them to to the checkout page for that product
  // 
  // First, fetch the product details for the current course
  const productDetails: ProductDetails | null = await getProductDetails(course);

  // If the requested course doesn't exist, return the 404 page
  if (!productDetails) {
    redirect('/not-found')
  }

  // If the user is requesting a course they didn't purchase, redirect them to buy it 
  const userDidPurchase = await userPurchasedCourse(userEmail, Number(productDetails.course_id));

  if (!userDidPurchase) {
    redirect(`/checkout?product=${course}`)
  }

  // Fetch the content segments that assemble into the digital course
  const groupedSegments = await getCourseSegments(course);
  const segmentContent = await getSegmentContent(course, segment);

  console.log(`Segments from Page: ${JSON.stringify(groupedSegments)}`);

  return (
    <Container>
      <CourseBrowser
        course={course}
        groupedSegments={groupedSegments}
        currentSegment={segment}>
        {segmentContent()}
      </CourseBrowser>
    </Container>
  )
}
