import { ContentCard } from '@/components/ContentCard'
import { getAllContent } from '@/lib/content-handlers'
import { ExtendedMetadata } from '@/types'

export default async function CourseIndex() {
  const courses = await getAllContent('learn/courses');

  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {courses.map((course: ExtendedMetadata, index: number) => {
        const uniqueKey = course._id || (course.slug ? `${course.slug}-${index}` : `course-${index}`);
        return (
          <ContentCard key={uniqueKey} article={course} />
        );
      })}
    </div>
  );
}
