import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import GiscusWrapper from '@/components/GiscusWrapper';
import FollowButtons from '@/components/FollowButtons'

export function ArticleLayout({
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
            <GiscusWrapper />
            < FollowButtons />
          </div>
        </div>
      </Container>
    </>
  )
}
