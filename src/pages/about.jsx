import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Newsletter } from '@/components/Newsletter'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/zachary-proser.png'

function RenderNumYearsExperience() {
  return Math.abs(new Date('January 1 2012').getFullYear() - new Date().getFullYear())
}

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  return (
    <>
      <Head>
        <title>About - Zachary Proser</title>
        <meta
          name="description"
          content="I’m Zachary Proser.  I am an open source developer, senior software engineer, and artist."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              I&apos;m Zachary Proser. I&apos;m  an open source developer, senior software engineer and artist.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                I&apos;m a staff develper advocate at <b><a href="https://pinecone.io">Pinecone</a></b>, a startup
                that builds the most performant cloud-native vector database.

                I love to build, maintain and enhance useful apps, especially those that demonstrate AI and machine learning patterns,
                as well as tools, especially in Golang using the TUI library bubbletea from Charm.sh.

                I&apos;m also a huge fan of Next.js and React.
              </p>
              <p>
                I&apos;ve been a software developer and open-source contributor for {RenderNumYearsExperience()} years.
                All of my open-source work lives at <b><a href="https://github.com/zackproser">https://github.com/zackproser</a></b>.
              </p>
              <p>
                In my free time, I love to research new techniques and to practice keyboard-driven development using tmux, neovim, awesome
                window manager and other powerful open source tools.
              </p>
              <p>
                I believe deeply in sharing knowledge and taking the time out to pass along what you know to others, just as so many developers
                have done for me.
              </p>
              <p>
                This site is a part of the way I give back and say thanks to those who took time out of their day to stop what they were doing
                and show me a better way to accomplish a task, to use a tool, to decompose a problem.
              </p>
              <p>
                If you find shells, command line tools and automation interesting, and if you want to know more about hardening your system and workflow for added security, then you are likely in the right place.
              </p>

              <p>
                If you want to know how to shred text on the keyboard, automate complex
                deployments with custom state machines and cloud infrastructure, and generally level up your devlopment game and career then you&apos;ll <b>probably</b> enjoy my content.
              </p>
              <Newsletter />
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="https://twitter.com/zackproser" icon={TwitterIcon}>
                Follow on Twitter
              </SocialLink>
              <SocialLink href="https://instagram.com/zackproser" icon={InstagramIcon} className="mt-4">
                Follow on Instagram
              </SocialLink>
              <SocialLink href="https://github.com/zackproser" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/zackproser" icon={LinkedInIcon} className="mt-4">
                Follow on LinkedIn
              </SocialLink>
              <SocialLink
                href="mailto:zackproser@gmail.com"
                icon={MailIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                zackproser@gmail.com
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
