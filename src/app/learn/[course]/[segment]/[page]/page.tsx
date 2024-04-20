import { Layout } from '@/components/Layout';
import CourseBrowser from '@/components/CourseBrowser'

import { CourseContainer } from '@/components/CourseContainer'
import { getCourseSegments, getSegmentContent } from '@/lib/courses'

import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/auth-options'

import { getProductDetails, ProductDetails } from '@/utils/productUtils';

import { userPurchasedCourse } from '@/lib/queries'

interface PageProps {
  params: {
    course: string;
    segment: string;
    page: string;
  };
}

export default async function DigitalCourse({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  // Users must be logged in to view this page
  if (!session) {
    redirect('/api/auth/signin');
  }

  const { course, segment, page } = params;

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
  console.log(`groupedSegments: %o`, groupedSegments)

  let currentSegment

  const segmentArrays = Object.values(groupedSegments)
  segmentArrays.reduce((acc, val) => acc.concat(val), []).forEach((seg) => {
    if (seg.segment === segment && seg.page === page) {
      currentSegment = seg
    }
  }) 

  console.log(`currentSegment after filtering: %o`, currentSegment)

  const segmentContent = await getSegmentContent(course, segment, page);
  console.log(`segmentContent: %o`, segmentContent)

  return (
    <CourseContainer>
      <CourseBrowser
        course={course}
        groupedSegments={groupedSegments}
        currentSegment={currentSegment}>
        {segmentContent()}
      </CourseBrowser>
    </CourseContainer>
  )
}
