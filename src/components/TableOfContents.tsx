import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import { SectionHeading } from '@/components/SectionHeading'
import { Content } from '@/types'

interface TableOfContentsProps {
  content?: Content
}

export function TableOfContents({ content }: TableOfContentsProps = {}) {
  // Get the content sections from the content's landing property
  const contentSections = content?.landing?.contentSections;
  
  // Get the title from the content if available
  const title = content?.title || '';

  // If no content sections are provided, don't render the component
  if (!contentSections || contentSections.length === 0) {
    return null;
  }

  return (
    <section
      id="table-of-contents"
      aria-labelledby="table-of-contents-title"
      className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32 dark:bg-slate-900"
    >
      <Container>
        <SectionHeading number="1" id="table-of-contents-title">
          Table of contents
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Get a complete overview of everything you&apos;ll learn.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-300">
          {title && `"${title}" is a comprehensive guide with practical insights and hands-on examples.`}
        </p>
        <Expandable>
          <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
            <ExpandableItems>
              {contentSections.map((section) => (
                <li key={section.title}>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  {section.subsections && section.subsections.length > 0 && (
                    <ol
                      role="list"
                      className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7 dark:bg-slate-800 dark:divide-slate-700/30"
                    >
                      {section.subsections.map((subsection) => (
                        <li
                          key={subsection}
                          className="py-3"
                          aria-label={subsection}
                        >
                          <span
                            className="font-medium text-slate-900 dark:text-white"
                            aria-hidden="true"
                          >
                            {subsection}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ExpandableItems>
          </ol>
          <ExpandableButton>See more</ExpandableButton>
        </Expandable>
      </Container>
    </section>
  )
} 