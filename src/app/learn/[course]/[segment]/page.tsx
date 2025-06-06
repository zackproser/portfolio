import CourseBrowser from '@/components/CourseBrowser'
import { Container } from '@/components/Container'
import { redirect } from 'next/navigation'
import { auth } from '../../../../../auth'
import { getProductDetails, ProductDetails } from '@/utils/productUtils'
import { hasUserPurchased } from '@/lib/purchases'
import fs from 'fs'
import path from 'path'

interface PageProps {
  params: Promise<{
    course: string;
    segment: string;
  }>;
}

/**
 * Get all segments for a course
 * @param course The course slug
 * @returns Grouped segments
 */
async function getCourseSegments(course: string) {
  const coursesDir = path.join(process.cwd(), 'src', 'app', 'learn', 'courses', course)
  
  // Check if the directory exists
  if (!fs.existsSync(coursesDir)) {
    return {}
  }
  
  // Get all directories in the course folder
  const segmentDirs = fs.readdirSync(coursesDir)
    .filter(dir => {
      // Only include numeric directories (segments)
      return dir.match(/^\d+$/) && fs.statSync(path.join(coursesDir, dir)).isDirectory()
    })
  
  // Load metadata from each segment
  const segments = await Promise.all(segmentDirs.map(async (dir) => {
    try {
      // Check if the directory contains a page.mdx file
      const mdxPath = path.join(coursesDir, dir, 'page.mdx')
      if (!fs.existsSync(mdxPath)) {
        return null
      }
      
      // Dynamic import of the MDX file to get its metadata
      const mdxModule = await import(`@/app/learn/courses/${course}/${dir}/page.mdx`)
      
      if (!mdxModule.meta) {
        console.warn(`No meta found for segment: ${dir}`)
        return null
      }
      
      return {
        dir,
        meta: mdxModule.meta
      }
    } catch (error) {
      console.error(`Error loading segment: ${dir}`, error)
      return null
    }
  }))
  
  // Filter out null values
  const validSegments = segments.filter((segment): segment is { dir: string; meta: any } => segment !== null)
  
  // Group segments by header
  const groupedSegments = validSegments.reduce<Record<string, Array<{ dir: string; meta: any }>>>((acc, { dir, meta }) => {
    const header = meta.header ?? 'Other'
    if (!acc[header]) {
      acc[header] = []
    }
    acc[header].push({ ...meta, dir })
    return acc
  }, {})
  
  return groupedSegments
}

/**
 * Get content for a specific segment
 * @param course The course slug
 * @param segment The segment number
 * @returns The segment content component
 */
async function getSegmentContent(course: string, segment: string) {
  try {
    const { default: content } = await import(`@/app/learn/courses/${course}/${segment}/page.mdx`)
    return content
  } catch (error) {
    console.error(`Error loading segment content: ${segment}`, error)
    const NotFoundComponent = () => <div>Content not found</div>
    NotFoundComponent.displayName = 'NotFoundComponent'
    return NotFoundComponent
  }
}

/**
 * Check if a user has purchased a specific course
 * @param userEmail The user's email
 * @param courseId The course ID
 * @returns Whether the user has purchased the course
 */
async function userPurchasedCourse(userEmail: string, courseId: number): Promise<boolean> {
  try {
    // Use the hasUserPurchased function to check if the user has purchased the course
    return await hasUserPurchased(userEmail, courseId.toString());
  } catch (error) {
    console.error('Error checking if user purchased course:', error);
    return false;
  }
}

export default async function Page(props: PageProps) {
  // Courses are disabled, redirect to a message page
  redirect('/courses-disabled');

  // The code below will not execute due to the redirect above
  const params = await props.params;
  const session = await auth();

  // Users must be logged in to view this page
  if (!session) {
    redirect('/api/auth/signin');
  }

  const { course, segment } = params;

  // TypeScript knows session is not null here because of the check above
  const userEmail = session?.user?.email as string;

  // Determine if user has bought the course they are trying to access 
  // If they have not, redirect them to to the checkout page for that product
  // 
  // First, fetch the product details for the current course
  const productDetails: ProductDetails | null = await getProductDetails(course);

  // If the requested course doesn't exist, return the 404 page
  if (!productDetails) {
    redirect('/not-found')
  }

  // At this point, productDetails is guaranteed to be non-null
  const productDetailsNonNull = productDetails as ProductDetails;

  // If the user is requesting a course they didn't purchase, redirect them to buy it 
  const userDidPurchase = await userPurchasedCourse(userEmail, Number(productDetailsNonNull.course_id));

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

Page.displayName = 'CourseSegmentPage';
