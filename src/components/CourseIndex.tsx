import { BlogPostCard } from '@/components/BlogPostCard'
import { getAllCourses } from '@/lib/courses'

import { type ArticleWithSlug } from '@/lib/shared-types';

export default async function CourseIndex() {
  const courses = await getAllCourses();

  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {courses.map((article: ArticleWithSlug) => (
        <BlogPostCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
