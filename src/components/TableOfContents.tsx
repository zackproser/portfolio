import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import { SectionHeading } from '@/components/SectionHeading'

const tableOfContents = {
  'Getting started': {
    'Introduction to RAG': 1,
    'Setting up your development environment': 15,
    'Understanding the RAG pipeline': 20,
  },
  'Core Concepts': {
    'Vector databases and embeddings': 21,
    'Document chunking strategies': 22,
    'Retrieval mechanisms': 26,
    'Prompt engineering for RAG': 31,
    'Context injection techniques': 45,
  },
  'Advanced Topics': {
    'Reranking and filtering': 50,
    'Hybrid search approaches': 57,
    'Metadata enrichment': 66,
    'Response generation': 78,
  },
  'Production Deployment': {
    'Scaling RAG systems': 82,
    'Monitoring and evaluation': 88,
    'Cost optimization': 95,
    'Error handling and edge cases': 102,
  },
}

export function TableOfContents() {
  return (
    <section
      id="table-of-contents"
      aria-labelledby="table-of-contents-title"
      className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32"
    >
      <Container>
        <SectionHeading number="1" id="table-of-contents-title">
          Table of contents
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900">
          Get a complete overview of everything you&apos;ll learn in the book.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">
          &ldquo;Build Production-Ready RAG Applications&rdquo; is a comprehensive guide
          with over 300 pages of practical insights and hands-on examples for building
          robust RAG systems.
        </p>
        <Expandable>
          <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
            <ExpandableItems>
              {Object.entries(tableOfContents).map(([title, pages]) => (
                <li key={title}>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                    {title}
                  </h3>
                  <ol
                    role="list"
                    className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7"
                  >
                    {Object.entries(pages).map(([title, pageNumber]) => (
                      <li
                        key={title}
                        className="flex justify-between py-3"
                        aria-label={`${title} on page ${pageNumber}`}
                      >
                        <span
                          className="font-medium text-slate-900"
                          aria-hidden="true"
                        >
                          {title}
                        </span>
                        <span
                          className="font-mono text-slate-400"
                          aria-hidden="true"
                        >
                          {pageNumber}
                        </span>
                      </li>
                    ))}
                  </ol>
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