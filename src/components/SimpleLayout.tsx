import { Container } from '@/components/Container'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32" size="lg">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-base text-gray-700 dark:text-gray-300">
          {intro}
        </p>
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  )
}
