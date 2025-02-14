import Image from 'next/image'
import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import RandomPortrait from '@/components/RandomPortrait'

interface AuthorProps {
  name: string
}

export function Author({ name }: AuthorProps) {
  return (
    <section
      id="author"
      aria-labelledby="author-title"
      className="relative scroll-mt-14 pb-3 pt-8 sm:scroll-mt-32 sm:pb-16 sm:pt-10 lg:pt-16"
    >
      <div className="absolute inset-0 -z-10 bg-slate-50/50">
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-6xl">
          <SectionHeading number="4" id="author-title">
            Author
          </SectionHeading>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
            <div className="lg:order-2">
              <RandomPortrait width={400} height={400} />
            </div>
            <div className="relative z-10 lg:order-1">
              <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
                Hi, I&apos;m {name}
              </h2>
              <div className="mt-6 space-y-6 text-base text-slate-700">
                <p>
                  I&apos;m a software engineer and AI researcher with over a decade of experience
                  building production systems. I&apos;ve worked extensively with large language
                  models and RAG applications, helping companies implement efficient and
                  scalable solutions.
                </p>
                <p>
                  Through my work, I&apos;ve identified common patterns and best practices
                  that make RAG systems more reliable and cost-effective. This book
                  distills these insights into practical, actionable guidance for
                  developers.
                </p>
                <p>
                  When I&apos;m not coding or writing, I enjoy contributing to open-source
                  projects and sharing knowledge with the developer community through
                  blog posts and conference talks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
} 