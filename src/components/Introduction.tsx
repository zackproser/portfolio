import Link from 'next/link'

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'

interface IntroductionProps {
  title: string;
  description: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export function Introduction({ title, description, features = [] }: IntroductionProps) {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pt-20 pb-16 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </p>
        <p className="mt-4">
          {description}
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {features.map((feature) => (
            <li key={feature.title} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <div className="ml-4">
                <p className="font-medium text-slate-900">{feature.title}</p>
                <p className="mt-1 text-slate-600">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link
            href="#free-chapters"
            className="text-base font-medium text-blue-600 hover:text-blue-800"
          >
            Get two free chapters straight to your inbox{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </Container>
    </section>
  )
} 