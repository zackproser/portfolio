import React from 'react'
import { getAllArticles } from "@/lib/articles"
import { getAllCourses } from "@/lib/courses"
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
    const allArticles = await getAllArticles()
    const allCourses = await getAllCourses()

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
                  {tutorials.map((article) => (
                    <BlogPostCard key={article.slug} article={article} />
                  ))}
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
                  {courses.map((course) => (
                    <BlogPostCard key={course.slug} article={course} />
                  ))}
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