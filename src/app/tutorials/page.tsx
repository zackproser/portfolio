import React from 'react'
import { getAllContentMetadata } from "@/lib/getAllContentMetadata"
import { BlogPostCard } from '@/components/BlogPostCard'
import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: 'Hands-On Project-Based Learning',
  description: 'Master modern development through practical, hands-on projects and in-depth tutorials',
});

export default async function TutorialsPage() {
  const tutorialSlugs = [
    'rag-pipeline-tutorial',
    'multiple-git-profiles-automated'
  ]

  const courseSlugs = [
    'generative-ai-bootcamp'
  ]

  try {
    // Use our new content system to get all content types
    const allArticles = await getAllContentMetadata('blog')
    const allCourses = await getAllContentMetadata('learn/courses')

    const tutorials = allArticles.filter(article => tutorialSlugs.includes(article.slug))
    const courses = allCourses.filter(course => courseSlugs.includes(course.slug))

    return (
      <Container className="mt-16 sm:mt-32">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Hands-On Project-Based Learning
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            There&apos;s no substitute for hands-on learning in software development. Level up your skills through practical, real-world projects and comprehensive tutorials that teach by doing.
          </p>
        </header>
        <div className="mt-16 sm:mt-20">
          {tutorials.length > 0 && (
            <div className="space-y-20">
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                  Featured Tutorials
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {tutorials.map((article, index) => {
                    const uniqueKey = article._id || (article.slug ? `${article.slug}-${index}` : `tutorial-${index}`);
                    return (
                      <BlogPostCard key={uniqueKey} article={article} />
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {courses.length > 0 && (
            <div className="mt-20 space-y-20">
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                  Featured Courses
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course, index) => {
                    const uniqueKey = course._id || (course.slug ? `${course.slug}-${index}` : `course-${index}`);
                    return (
                      <BlogPostCard key={uniqueKey} article={course} />
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>
      </Container>
    )
  } catch (error) {
    console.error('Error in TutorialsPage:', error)
    return null
  }
} 