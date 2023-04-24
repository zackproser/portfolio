import Head from 'next/head'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import logoAnimaginary from '@/images/logos/animaginary.svg'
import logoCosmos from '@/images/logos/cosmos.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'
import logoHelioStream from '@/images/logos/helio-stream.svg'
import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
import logoCloudflare from '@/images/logos/cloudflare.svg'
import nuke from '@/images/nuke.png'

const projects = [
  {
    name: 'cloud-nuke',
    description: 'Efficiently find and destroy your AWS resources by type, by region and with support for regex based inclusion or exclusion',
    link: { href: 'https://github.com/gruntwork-io/cloud-nuke', label: 'github' },
    logo: nuke,
  },
  {
    name: 'git-xargs',
    description:
      'Make the same change across many GitHub repositories quickly. Run any command or script on multiple repos.',
    link: { href: 'https://github.com/gruntwork-io/git-xargs', label: 'github' },
    logo: logoPlanetaria,
  },
  {
    name: 'procrastiproxy',
    description:
      'A Golang proxy that can be easily deployed to block distracting websites during a time window you configure.',
    link: { href: 'https://github.com/zackproser/procrastiproxy', label: 'github' },
    logo: logoAnimaginary,
  },
  {
    name: 'Teatutor',
    description:
      'Configure and deploy custom quizzes over ssh. Written in Golang and leveraging Terminal User Interface (TUI) library Bubbletea.',
    link: { href: 'https://github.com/zackproser/teatutor', label: 'github.com' },
    logo: logoOpenShuttle,
  },
  {
    name: 'sizeof',
    description:
      'A Golang command line interface (CLI) and experiment - co-authored with ChatGPT4 via Neovim AI plugins that turned me into an AI-enhanced developer.',
    link: { href: 'https://github.com/zackproser/sizeof', label: 'github.com' },
    logo: logoCosmos,
  },
  {
    name: 'cf-terraforming',
    description:
      'While I was an engineer at Cloudflare, I worked on cf-terraforming, an open source "reverse terraform" tool, that can generate valid Terraform configuration based on your existant Cloudflare API settings in your account.',
    link: { href: 'https://github.com/cloudflare/cf-terraforming', label: 'github.com' },
    logo: logoCloudflare,
  },
  {
    name: 'Quake in AWS Fargate',
    description:
      'An Infrastructure as Code tutorial, where I demonstrate how to define and launch a game server as code, and even connect to it from your laptop to game with your co-workers.',
    link: { href: 'https://github.com/zackproser/quake-in-fargate', label: 'github.com' },
    logo: logoOpenShuttle,
  }

]

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects - Zachary Proser</title>
        <meta
          name="description"
          content="Things I've built"
        />
      </Head>
      <SimpleLayout
        title="Things I’ve built"
        intro="I’ve worked on tons of small and large projects over the years but these are the ones that I’m most proud of. I open source most of my code."
      >
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <Card as="li" key={project.name}>
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <Image
                  src={project.logo}
                  alt=""
                  className="h-8 w-8"
                  unoptimized
                />
              </div>
              <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                <Card.Link href={project.link.href}>{project.name}</Card.Link>
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                <LinkIcon className="h-6 w-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          ))}
        </ul>
      </SimpleLayout >
    </>
  )
}
