import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'

import { BlogPostCard } from '@/components/BlogPostCard'
import { Newsletter } from '@/components/Newsletter'
import CV from '@/components/CV'

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import wikka from '@/images/photos/wikka.png'
import canyonRunnerImg from '@/images/canyonrunner-screens/CanyonRunner-Title-Screen.png'
import optimizerBlogImg from '@/images/optimizer-blog.png'
import terraformAssocImg from '@/images/terraform-associate.png'
import teaTutorImg from '@/images/teatutor-logo.png'
import { getAllArticles } from '@/lib/articles'
// Instead of needing to constantly update my static site, do the calculation of years that I've been working in tech in JS
import RenderNumYearsExperience from '@/components/NumYearsExperience'

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Photos() {
  const images = [wikka, optimizerBlogImg, canyonRunnerImg, teaTutorImg, terraformAssocImg]
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {images.map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Let's level up!
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I acquire and share knowledge. I <Link href={"https://github.com/zackproser"} className="text-green-500 font-extrabold"> open-source </Link>the majority of my work. You can <Link href={"/about"} className="text-green-500 font-extrabold"> read more about me here</Link>.
          </p>
          <Newsletter />
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com"
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
            <SocialLink
              href="https://instagram.com"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://github.com"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-9">
        <div className="max-w-2xl">
          <p className="mt-6  text-base text-zinc-600 dark:text-zinc-400">
            On this site, I share open-source software, terminal tricks, demo videos, software career advice, advanced command line techniques and hotkeys, and
            I blog about things I&apos;ve learned the hard way while working in the industry for {RenderNumYearsExperience()} years.
          </p>
          <Newsletter />
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <BlogPostCard key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <CV />
          </div>
        </div>
      </Container>
    </>
  )
}
