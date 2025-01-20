import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllCourses, type Course } from '@/lib/courses'

export default async function CourseIndex() {
  const courses = await getAllCourses();

  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {courses.map((course: Course) => (
        <BlogPostCard key={course.slug} article={course} />
      ))}
    </div>
  );
}
