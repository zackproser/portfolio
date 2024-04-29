import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import Newsletter from '@/components/Newsletter'
import FollowButtons from '@/components/FollowButtons'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CourseLayout({
  children,
  metadata,
}: {
  children: React.ReactNode
  metadata: {
    title: string
    description: string
    date: string
    image?: {
      src: string
    },
    type?: string
    slug?: string
  }
}) {

  return (
    <>
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <Button
              variant="primary"
            >
              <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
            </Button>
            <article>
              <header className="flex flex-col">
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  {metadata.title}
                </h1>
                <time
                  dateTime={metadata.date}
                  className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{metadata.date}</span>
                </time>
              </header>
              <Prose className="mt-8">{children}</Prose>
            </article>
            <Newsletter title={'Be notified when the next course drops!'} body={'I build project-based learning courses for developers who want to level up'} />
            <FollowButtons />
          </div>
        </div>
      </Container>
    </>
  )
}
