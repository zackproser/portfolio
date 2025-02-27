import { type Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'
import { getAllContentMetadata } from '@/lib/getAllContentMetadata'
import { ExtendedMetadata } from '@/lib/shared-types'

export const metadata: Metadata = createMetadata({
  title: 'Courses',
  description: 'Comprehensive courses on programming, development, and technology topics',
  type: 'course'
})

function CourseGrid({ courses }: { courses: ExtendedMetadata[] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {courses.map((course, index) => {
        const uniqueKey = course._id || (course.slug ? `${course.slug}-${index}` : `course-${index}`);
        return (
          <BlogPostCard 
            key={uniqueKey} 
            article={course} 
          />
        );
      })}
    </div>
  )
}

export default async function CoursesIndex() {
  // Use our helper function to get all course metadata
  const courses = await getAllContentMetadata('learn/courses')

  return (
    <SimpleLayout
      title="Courses"
      intro="Comprehensive courses on programming, development, and technology topics"
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <Suspense fallback={<div>Loading courses...</div>}>
          <CourseGrid courses={courses} />
        </Suspense>
      </div>
    </SimpleLayout>
  )
} 