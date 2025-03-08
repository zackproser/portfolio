import { createMetadata } from '@/utils/createMetadata'
import ProjectsClient from './projects-client'

export const metadata = createMetadata({
  title: "Zachary Proser's projects",
  description: "Searchable list of Zachary Proser's projects and contributions",
  author: "Zachary Proser",
  type: "website",
});

// Import all project images
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
import PineconeAssistant from '@/images/pinecone-assistant.webp'
import Bubbletea from '@/images/bubbletea-stages.gif'
import SponsorMe from '@/images/sponsor-me.webp'
import Pageripper from '@/images/pageripper-bot.webp'
import OfficeOracle from '@/images/office-oracle-screenshot.webp'
import CanyonRunner from '@/images/canyonrunner-screens/CanyonRunner-Title-Screen.webp'
import CLIProject from '@/images/open-source-cli-project.webp'
import GolangProject from '@/images/open-source-golang-project.webp'
import ToxIndexChat from '@/images/tox-index-chat.webp'
import logoWorkOS from '@/images/logos/workos.svg'
import DigitalDetective from '@/images/digital-detective.webp'

// Define project categories
const categories = [
  "AI & Machine Learning",
  "Infrastructure & DevOps",
  "Web Development",
  "CLI Tools",
  "Gaming",
  "Open Source",
  "Tutorials & Examples",
  "Security"
]

// Define companies
const companies = [
  "Pinecone",
  "WorkOS",
  "Gruntwork",
  "Cloudflare",
  "Personal"
]

// Define all possible technology tags
const allTags = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Pinecone",
  "AWS",
  "Pulumi",
  "Infrastructure as Code",
  "Phaser.js",
  "Game",
  "Javascript",
  "HTML5",
  "Chromium",
  "Puppeteer",
  "Golang",
  "TUI",
  "DevOps",
  "CLI",
  "Automation",
  "AI",
  "Mobile",
  "Blogging",
  "Shell",
  "Developer Tools",
  "RAG",
  "OpenAI",
  "Chatbot",
  "Cloud Management",
  "Go",
  "Git",
  "SSH",
  "Proxy",
  "Productivity"
]

const projects = [
  {
    name: 'Digital Detective Browser Fingerprinting Demo',
    description: 'A multiplayer demonstration of browser fingerprinting for use in webinars, and for folks trying to learn about fingerprinting techniques and protections.',
    link: 'https://v0-web-fingerprinting-demo.vercel.app/',
    logo: DigitalDetective,
    stacks: ['Next.js', 'Vercel', 'Security', 'Web Development'],
    category: "Security",
    company: "Personal"
  },
  {
    name: 'WorkOS CLI OAuth Authentication',
    description: 'A tutorial and example repository demonstrating how to build browser-based OAuth into CLI tools using WorkOS AuthKit, including secure token storage and retrieval.',
    link: 'https://github.com/zackproser-workos/cli-auth-example',
    logo: logoWorkOS,
    stacks: ['WorkOS', 'OAuth', 'CLI', 'Security'],
    category: "Security",
    company: "WorkOS"
  },
  {
    name: 'WorkOS S3 Document Access Control',
    description: 'A proof of concept demonstrating fine-grained authorization for AWS S3 using WorkOS FGA and AWS Lambda authorizers, showcasing secure document access control with serverless infrastructure.',
    link: 'https://github.com/zackproser-workos/aws-lambda-authorizer-fga-cdk',
    logo: logoWorkOS,
    stacks: ['WorkOS', 'AWS', 'CDK', 'Lambda', 'S3', 'Infrastructure as Code'],
    category: "Infrastructure & DevOps",
    company: "WorkOS"
  },
  {
    name: 'Tox Index Chat',
    description: 'Instantly analyze chemicals for toxicity risk using advanced AI and real-time chemical analysis.',
    link: 'https://tox-index-chat.vercel.app/',
    logo: ToxIndexChat,
    stacks: ['Next.js', 'Vercel', 'Vercel AI SDK', 'OpenAI'],
    category: "AI & Machine Learning",
    company: "Personal"
  },
  {
    name: 'WorkOS Fine-grained access control for RAG pipelines',
    description: 'A proof of concept demonstrating how to secure RAG applications using WorkOS Fine-Grained Authorization to ensure users only see results from documents they have permission to access.',
    link: 'https://github.com/zackproser-workos/fga-pinecone-poc',
    logo: logoWorkOS,
    stacks: ['WorkOS', 'Pinecone', 'RAG', 'Authorization'],
    category: "Security",
    company: "WorkOS"
  },
  {
    name: 'Pinecone: Assistant sample application',
    description: 'An official Pinecone sample app demonstrating how to build a chat UI to connect to your existing assistant for RAG-backed Q&A',
    link: 'https://docs.pinecone.io/examples/sample-apps/pinecone-assistant',
    logo: PineconeAssistant,
    stacks: ['Next.js', 'React', 'Tailwind CSS', 'Pinecone'],
    category: "AI & Machine Learning",
    company: "Pinecone"
  },
  {
    name: 'Pinecone: Legal semantic search',
    description: 'An official Pinecone sample app demonstrating how to build a custom knowledge base over your data. Leverages Voyage embeddings model for the legal documents.',
    link: 'https://docs.pinecone.io/examples/sample-apps/legal-semantic-search',
    logo: LegalSemanticSearch,
    stacks: ['Next.js', 'React', 'Tailwind CSS', 'Pinecone'],
    category: "AI & Machine Learning",
    company: "Pinecone"
  },
  {
    name: 'This Next.js site / app',
    description: 'I have been maintaining, upgrading, building features into, and re-styling this portfolio site for the past 12 years for practice and learning. It is now a full-stack e-commerce site, blog, demo garden and learning center with a Stripe integration and auth system.',
    link: 'https://github.com/zackproser/portfolio',
    logo: NextJSPortfolio,
    stacks: ['Next.js', 'React', 'Tailwind CSS'],
    category: "Web Development",
    company: "Personal"
  },
  {
    name: 'Sponsorship site',
    description: 'I built a site allowing folks to hire me, sponsor my projects and learn about the kind of work I do.',
    link: 'https://sponsor.zackproser.com',
    logo: SponsorMe,
    stacks: ['Next.js', 'React', 'Tailwind CSS'],
    category: "Web Development",
    company: "Personal"
  },
  {
    name: 'Pinecone\'s first AWS Reference Architecture',
    description: 'The Pinecone AWS Reference Architecture is a production-ready distributed system that demonstrates Pinecone and AWS best practices at scale',
    link: 'https://github.com/pinecone-io/aws-reference-architecture-pulumi',
    logo: RefArch,
    stacks: ['AWS', 'Pulumi', 'Pinecone', 'Infrastructure as Code'],
    category: "Infrastructure & DevOps",
    company: "Pinecone"
  },
  {
    name: 'CanyonRunner HTML5 game',
    description: 'A complete game with multple levels, endings, mobile and desktop modes and a story.',
    link: '/blog/canyonrunner-html5-game',
    logo: CanyonRunner,
    stacks: ['Phaser.js', 'Game', 'Javascript', 'HTML5'],
    category: "Gaming",
    company: "Personal"
  },
  {
    name: 'Pageripper API',
    description: 'A productionized commercial API that uses Chromium and Puppeteer to scrape data from websites and return it in a structured format.',
    link: '/blog/introducing-pageripper-api',
    logo: Pageripper,
    stacks: ['Chromium', 'Puppeteer', 'Javascript'],
    category: "Web Development",
    company: "Personal"
  },
  {
    name: 'Bubbletea State Machine pattern',
    description: 'Bubbletea is a Golang Terminal UI (TUI) library. While working at the DevOps automation startup Gruntwork.io, I found and popularized the Bubbletea State Machine pattern for complex deployments.',
    link: '/blog/bubbletea-state-machine',
    logo: Bubbletea,
    stacks: ['Golang', 'TUI', 'DevOps', 'CLI', 'Automation'],
    category: "CLI Tools",
    company: "Gruntwork"
  },
  {
    name: 'panthalia',
    description: 'Panthalia is an AI-assisted mobile blogging platform for creating media-rich posts on the go',
    link: 'https://github.com/zackproser/panthalia',
    logo: Panthalia,
    stacks: ['AI', 'Mobile', 'Blogging'],
    category: "Web Development",
    company: "Personal"
  },
  {
    name: 'automations',
    description: 'Shell scripts leveraging generative A.I. to make developer workflows buttery smooth and way more fun',
    link: 'https://github.com/zackproser/automations',
    logo: Automations,
    stacks: ['Shell', 'AI', 'Developer Tools'],
    category: "CLI Tools",
    company: "Personal"
  },
  {
    name: 'Office oracle',
    description: 'A Retrieval Augmented Generation chatbot trained on the entire Office television series',
    link: 'https://github.com/zackproser/office-oracle',
    logo: OfficeOracle,
    stacks: ['RAG', 'OpenAI', 'Chatbot', 'Next.js'],
    category: "AI & Machine Learning",
    company: "Personal"
  },
  {
    name: 'cloud-nuke',
    description: 'Efficiently find and destroy your AWS resources by type, by region and with support for regex based inclusion or exclusion',
    link: 'https://github.com/gruntwork-io/cloud-nuke',
    logo: CLIProject,
    stacks: ['AWS', 'Cloud Management', 'Go'],
    category: "Infrastructure & DevOps",
    company: "Gruntwork"
  },
  {
    name: 'git-xargs',
    description: 'Make the same change across many GitHub repositories quickly. Run any command or script on multiple repos.',
    link: 'https://github.com/gruntwork-io/git-xargs',
    logo: GitXargs,
    stacks: ['Git', 'Automation', 'DevOps'],
    category: "CLI Tools",
    company: "Gruntwork"
  },
  {
    name: 'cf-terraforming',
    description: 'While at Cloudflare, I helped build cf-terraforming, a tool that reads your Cloudflare API configuration and generates valid Terraform to match it, allowing rapid adoption of Infrastructure as Code.',
    link: 'https://github.com/cloudflare/cf-terraforming',
    logo: GolangProject,
    stacks: ['Golang', 'Automation', 'DevOps'],
    category: "Infrastructure & DevOps",
    company: "Cloudflare"
  },
  {
    name: 'procrastiproxy',
    description: 'A Golang proxy that can be easily deployed to block distracting websites during a time window you configure.',
    link: 'https://github.com/zackproser/procrastiproxy',
    logo: Octocat,
    stacks: ['Go', 'Proxy', 'Productivity'],
    category: "CLI Tools",
    company: "Personal"
  },
  {
    name: 'Teatutor',
    description: 'Configure and deploy custom quizzes over ssh. Written in Golang and leveraging Terminal User Interface (TUI) library Bubbletea.',
    link: 'https://github.com/zackproser/teatutor',
    logo: Teatutor,
    stacks: ['Go', 'SSH', 'TUI'],
    category: "CLI Tools",
    company: "Personal"
  },
  {
    name: 'sizeof',
    description: 'A Golang command line interface (CLI) and experiment - co-authored with ChatGPT4 via Neovim AI plugins that turned me into an AI-enhanced developer.',
    link: 'https://github.com/zackproser/sizeof',
    logo: Octocat,
    stacks: ['Go', 'CLI', 'AI'],
    category: "CLI Tools",
    company: "Personal"
  },
  {
    name: 'Quake in AWS Fargate',
    description: 'An Infrastructure as Code tutorial, where I demonstrate how to define and launch a game server as code, and even connect to it from your laptop to game with your co-workers.',
    link: 'https://github.com/zackproser/quake-in-fargate',
    logo: QuakeInFargate,
    stacks: ['AWS', 'Fargate', 'IaC', 'Gaming'],
    category: "Tutorials & Examples",
    company: "Personal"
  }
]

export default function Projects() {
  return (
    <ProjectsClient
      projects={projects}
      categories={categories}
      allTags={allTags}
      companies={companies}
    />
  )
}
