import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'

const resources = [
  {
    title: 'Vector Database Guide',
    description:
      'A comprehensive guide to choosing and using vector databases in RAG applications.',
    image: '/images/resources/vector-db.png',
    href: '/resources/vector-db-guide',
  },
  {
    title: 'Chunking Strategies',
    description:
      'Learn different document chunking strategies and when to use each one.',
    image: '/images/resources/chunking.png',
    href: '/resources/chunking-strategies',
  },
  {
    title: 'Prompt Engineering',
    description:
      'Master the art of crafting effective prompts for RAG applications.',
    image: '/images/resources/prompts.png',
    href: '/resources/prompt-engineering',
  },
  {
    title: 'Cost Optimization',
    description:
      'Strategies for optimizing costs in production RAG deployments.',
    image: '/images/resources/costs.png',
    href: '/resources/cost-optimization',
  },
]

export function Resources() {
  return (
    <section
      id="resources"
      aria-labelledby="resources-title"
      className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32"
    >
      <Container>
        <SectionHeading number="3" id="resources-title">
          Resources
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900">
          Additional resources to help you build better RAG applications.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">
          Dive deeper into specific topics with our comprehensive guides and tutorials.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <div key={resource.href} className="group relative">
              <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={resource.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-slate-900">
                <a href={resource.href}>
                  <span className="absolute inset-0" />
                  {resource.title}
                </a>
              </h3>
              <p className="mt-2 text-base text-slate-600">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 