import React from 'react'
import { Metadata } from 'next'
import { getAllContent } from "@/lib/content-handlers"
import { ContentCard } from '@/components/ContentCard'
import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'
import { Content } from '@/types'
import Link from 'next/link'

// Base metadata using createMetadata
const baseMetadata = createMetadata({
  title: 'Hands-On Project-Based Learning',
  description: 'Master modern development through practical, hands-on projects and in-depth tutorials',
});

// Export final metadata including metadataBase
export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL('https://zackproser.com'),
}

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
    const allArticles = await getAllContent('blog')
    
    // Filter tutorials from blog posts
    const tutorials = allArticles.filter(article => tutorialSlugs.includes(article.slug.split('/').pop() || ''))
    
    // Try to get courses, but handle the case where they don't exist yet
    let courses: Content[] = []
    try {
      const allCourses = await getAllContent('learn/courses')
      courses = allCourses.filter(course => courseSlugs.includes(course.slug.split('/').pop() || ''))
    } catch (courseError) {
      console.warn('Could not load courses:', courseError)
      // Continue without courses
    }

    return (
      <Container className="mt-16 sm:mt-32">
        <header className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
            Tutorials & Learning Paths
          </h1>
          <p className="mt-6 text-base text-gray-700 dark:text-gray-300">
            Here you&apos;ll find in-depth tutorials and learning resources covering various technologies and concepts in software engineering and AI.
          </p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Looking for complete, project-based guides? Browse our{' '}
            <Link href="/products" className="underline font-medium text-blue-700 dark:text-blue-300">digital products</Link>.
          </p>
        </header>
        <div className="mt-16 sm:mt-20">
          {tutorials.length > 0 && (
            <div className="space-y-20">
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                  Featured Tutorials
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {tutorials.map((article, index) => {
                    const uniqueKey = article._id || (article.slug ? `${article.slug}-${index}` : `tutorial-${index}`);
                    return (
                      <ContentCard key={uniqueKey} article={article} />
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {courses.length > 0 && (
            <div className="mt-20 space-y-20">
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                  Featured Courses
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course, index) => {
                    const uniqueKey = course._id || (course.slug ? `${course.slug}-${index}` : `course-${index}`);
                    return (
                      <ContentCard key={uniqueKey} article={course} />
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