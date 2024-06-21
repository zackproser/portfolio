import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleLayout } from '@/components/SimpleLayout'
import { generateOgUrl } from '@/utils/ogUrl'

const data = {
  title: 'My projects',
  description: 'A selection of open-source projects, tools and applications I have built or maintained over the years',
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Zack Proser\'s portfolio',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import RefArch from '@/images/pinecone-refarch-logo.webp'
import NextJSPortfolio from '@/images/zackproser-com-screenshot.webp'
import Panthalia from '@/images/panthalia-logo.webp'
import Automations from '@/images/automations.gif'
import CloudNuke from '@/images/cloud-nuke-intro.webp'
import GitXargs from '@/images/git-xargs-demo.gif'
import Octocat from '@/images/octocat.webp'
import Teatutor from '@/images/teatutor-logo.webp'
import QuakeInFargate from '@/images/quake-in-fargate.webp'
import LegalSemanticSearch from '@/images/legal-semantic-search.webp'

const projects = [
  {
    name: 'Pinecone: Legal semantic search',
    description: 'An official Pinecone sample app demonstrating how to build a custom knowledge base over your data. Leverages Voyage embeddings model for the legal documents.',
    link: 'https://docs.pinecone.io/examples/sample-apps/legal-semantic-search',
    logo: LegalSemanticSearch,
    stacks: ['Next.js', 'React', 'Tailwind CSS']
  },
  {
    name: 'This Next.js site / app',
    description: 'I have been maintaining, upgrading, building features into, and re-styling this portfolio site for the past 12 years for practice and learning. It is now a full-stack e-commerce site, blog, demo garden and learning center with a Stripe integration and auth system.',
    link: 'https://github.com/zackproser/portfolio',
    logo: NextJSPortfolio,
    stacks: ['Next.js', 'React', 'Tailwind CSS']
  },
  {
    name: 'Pinecone\'s first AWS Reference Architecture',
    description: 'The Pinecone AWS Reference Architecture is a production-ready distributed system that demonstrates Pinecone and AWS best practices at scale',
    link: 'https://github.com/pinecone-io/aws-reference-architecture-pulumi',
    logo: RefArch,
    stacks: ['AWS', 'Pulumi', 'Pinecone', 'Infrastructure as Code']
  },
  {
    name: 'panthalia',
    description: 'Panthalia is an AI-assisted mobile blogging platform for creating media-rich posts on the go',
    link: 'https://github.com/zackproser/panthalia',
    logo: Panthalia,
    stacks: ['AI', 'Mobile', 'Blogging']
  },
  {
    name: 'automations',
    description: 'Shell scripts leveraging generative A.I. to make developer workflows buttery smooth and way more fun',
    link: 'https://github.com/zackproser/automations',
    logo: Automations,
    stacks: ['Shell', 'AI', 'Developer Tools']
  },
  {
    name: 'cloud-nuke',
    description: 'Efficiently find and destroy your AWS resources by type, by region and with support for regex based inclusion or exclusion',
    link: 'https://github.com/gruntwork-io/cloud-nuke',
    logo: CloudNuke,
    stacks: ['AWS', 'Cloud Management', 'Go']
  },
  {
    name: 'git-xargs',
    description: 'Make the same change across many GitHub repositories quickly. Run any command or script on multiple repos.',
    link: 'https://github.com/gruntwork-io/git-xargs',
    logo: GitXargs,
    stacks: ['Git', 'Automation', 'DevOps']
  },
  {
    name: 'procrastiproxy',
    description: 'A Golang proxy that can be easily deployed to block distracting websites during a time window you configure.',
    link: 'https://github.com/zackproser/procrastiproxy',
    logo: Octocat,
    stacks: ['Go', 'Proxy', 'Productivity']
  },
  {
    name: 'Teatutor',
    description: 'Configure and deploy custom quizzes over ssh. Written in Golang and leveraging Terminal User Interface (TUI) library Bubbletea.',
    link: 'https://github.com/zackproser/teatutor',
    logo: Teatutor,
    stacks: ['Go', 'SSH', 'TUI']
  },
  {
    name: 'sizeof',
    description: 'A Golang command line interface (CLI) and experiment - co-authored with ChatGPT4 via Neovim AI plugins that turned me into an AI-enhanced developer.',
    link: 'https://github.com/zackproser/sizeof',
    logo: Octocat,
    stacks: ['Go', 'CLI', 'AI']
  },
  {
    name: 'cf-terraforming',
    description: 'While I was an engineer at Cloudflare, I worked on cf-terraforming, an open source "reverse terraform" tool, that can generate valid Terraform configuration based on your existant Cloudflare API settings in your account.',
    link: 'https://github.com/cloudflare/cf-terraforming',
    logo: Octocat,
    stacks: ['Terraform', 'Cloudflare', 'Infrastructure as Code']
  },
  {
    name: 'Quake in AWS Fargate',
    description: 'An Infrastructure as Code tutorial, where I demonstrate how to define and launch a game server as code, and even connect to it from your laptop to game with your co-workers.',
    link: 'https://github.com/zackproser/quake-in-fargate',
    logo: QuakeInFargate,
    stacks: ['AWS', 'Fargate', 'IaC', 'Gaming']
  }
]

function ProjectCard({ project }) {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <Image className="h-48 w-full object-cover" src={project.logo} alt={project.name} width={500} height={300} />
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link href={project.link} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</p>
            <p className="mt-3 text-base text-zinc-600 dark:text-gray-400">{project.description}</p>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap">
          {project.stacks.map((stack) => (
            <span key={stack} className="px-2 py-1 text-sm font-medium text-white bg-emerald-600 rounded-full mr-2 mb-2">
              {stack}
            </span>
          ))}
        </div>
      </div>
    </div>
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
        title="Things I've built"
        intro="I've worked on tons of small and large projects over the years but these are the ones that I'm most proud of. I open source most of my code."
      >
        <div className="mt-6 grid gap-16 pt-10 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </SimpleLayout>
    </>
  )
}
