import Image from 'next/image';

import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid'

import { BoltIcon, CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/outline'

import Callout from '@/components/Callout'
import CV from '@/components/CV'
import RenderNumYearsExperience from '@/components/NumYearsExperience'

import genAIHero from '@/images/gen-ai-hero.webp'
import genAIScreenshot1 from '@/images/generative-ai-screenshot-1.webp'
import genAIScreenshot2 from '@/images/generative-ai-screenshot-2.webp'
import zacharyProser from '@/images/zachary-proser.webp'
import a16z2 from '@/images/a16z-2.webp'
const learnings = [
  {
    name: 'Generative AI',
    description:
      'You will be able to speak intelligently about Generative AI, and its many opportunities and challenges',
    href: '#',
    icon: BoltIcon,
  },
  {
    name: 'Large Language Models (LLMs)',
    description:
      'You will be able to understand and discusss Large Language Models and the role they play in Generative AI',
    href: '#',
    icon: BoltIcon,
  },
  {
    name: 'Developer-facing tools',
    description:
      'You will understand how Generative AI is appearing in developer-facing tools and Integrated Development Environments (IDEs)',
    href: '#',
    icon: BoltIcon,
  },
]
const primaryFeatures = [
  {
    name: 'Staff level developer on the front lines',
    description:
      'I build Generative AI apps and pipelines in my day job, and maintain Pinecone&apos;s many open- source libraries and clients',
    href: '#',
    icon: BoltIcon,
  },
  {
    name: 'Intro to Generative AI',
    description:
      'I provide a clear and complete introduction to Generative AI, how it works, why it is having a moment right now, and its many opportunities and challenges',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Developer tooling and IDEs',
    description:
      'I also explain Developer tooling and Integrated Developer Environments (IDEs) to help you understand this unique opportunity',
    href: '#',
    icon: CalendarDaysIcon,
  },
]
const secondaryFeatures = [
  {
    name: 'Hands-on information',
    description: 'I code for work and for fun nearly every single day. I know which tools are working and which are struggling to find product market fit.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Read my ChatGPT4 chats',
    description: 'In this course, I share several long-running chats I have had with ChatGPT, demonstrating how a Staff developer interfaces with AI for development tasks',
    icon: LockClosedIcon,
  },
  {
    name: 'Key insights explained simply',
    description: 'You do not need a technical background to benefit from this course. It is designed to be clear even if you are not in a technical role.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Critical opportunities',
    description: 'What I pay for now, what I am still looking for, and what I would pay for in the future.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Serious challenges',
    description: 'GenAI is not a silver bullet and it comes with plenty of challenges. I have experienced all of these directly in the course of building AI apps and pipelines',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Insight from an experienced coder',
    description: 'I have been a full-stack open-source developer since 2012, and have worked across the stack doing frontend, backend and infrastructure / cloud development',
    icon: ServerIcon,
  },
]

const stats = [
  { id: 1, name: 'Source repositories', value: '101' },
  { id: 2, name: 'Languages used', value: '7+' },
  { id: 3, name: 'Years of development experience', value: RenderNumYearsExperience() },
  { id: 4, name: 'Pages of high-quality content', value: '18+' },
]

export default function GenAILandingPage() {
  return (
    <div className="bg-zinc">
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
          </svg>
          <div
            className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
            <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Tackle Generative AI with confidence
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                The Generative AI bootcamp is the fastest way to get up to speed with the basics, opportunities and challenges of Generative AI, even if you&apos;re not technical.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href='/checkout?product=generative-ai-bootcamp'
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-lg transition duration-300 ease-in-out hover:bg-indigo-500 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:ring-opacity-50"
                  style={{ transform: 'translateY(-2px)' }}
                >
                  Buy now
                </a>
              </div>
            </div>
          </div>
        </div>

        <Image src={genAIHero} alt="Gen AI" />

        {/* What you will learn */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What you will learn
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              When you are finished with this course, you will understand:
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {learnings.map((learning) => (
                <div key={learning.name} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                      <learning.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {learning.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{learning.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>


        {/* Feature section */}
        <div className="mt-32 sm:mt-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">Simple but powerful explanations</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Not technical? No problem.</p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                I have gone out of my way to ensure this course is accessible even to non-technical folks, using simple language and metaphors across 18+ pages of
                high-quality content.<br /><br />

                I have also linked off to several of my personal long-running chats with ChatGPT4, so that you can see how a Staff developer interacts with GenAI while coding.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              {/* Screenshots container */}
              <div className="flex justify-center space-x-4">
                <Image src={genAIScreenshot1} alt="Generative AI bootcamp" />
                <Image src={genAIScreenshot2} alt="Generative AI bootcamp" />
              </div>
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {secondaryFeatures.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-white">
                    <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-500" aria-hidden="true" />
                    {feature.name}
                  </dt>{' '}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">

            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Information-dense</p>
            <p>I have packed the Generative AI bootcamp course with the following types of information:</p>
            <Callout type={"PracticalInsights"} title={"Things I have figured out from first-hand experience"} body={"Reading high-level reports from analysts is helpful, but there is no substitute for first-hand experience. I experiment with and code alongside AI-assisted developer tools each and every day. I'm always experimenting with new workflows and entrants. Expect to find things I have learned the hard way from hands-on experience in Practical Insights."} />
            <Callout type={"Focus"} title={"The main idea in the current section"} body={"To help you understand the key ideas more quickly, I call them out in advance and reinforce them throughout. You'll find these focus widgets throughout, keeping you on track."} />
            <Callout type={"GoDeeper"} title={"Links to further reading, videos, and deployed examples"} body={"In my various travels and many research experiments, I come across a great deal of primary sources and excellent in-depth content. Wherever there's an option to take a detour and learn more, I'll call out the links in these Go Deeper sections."} />
            <Callout type={"Metaphor"} title={"Understand complex concepts more quickly with helpful metaphors"} body={"In order to facillitate your learning, I include helpful metaphors to demystify complex-sounding concepts."} />
          </div>
        </div>

        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          {/* Flex container */}
          <div className="flex flex-col lg:flex-row">

            {/* Text content */}
            <div className="flex-1">
              <h2 className="text-base font-semibold leading-8 text-indigo-400">Introducing your instructor</h2>

              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                I eat, sleep and breathe code.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">

                Hi, I'm Zachary, a Staff Developer Advocate at Pinecone.io. Pinecone offers the most performant cloud-native vector database
                that provides long-term memory for AI applications.

              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">

                My full title at Pinecone is "Staff Developer Advocate (open-source)". I build AI applications and pipelines in public to demonstrate the power and flexibility of Pinecone's vector database.

              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                I also maintain our many open-source examples such as Jupyter Notebooks and TypeScript / Next.js applications, which demonstrate machine learning and AI techniques such as semantic search and Retrieval Augmented Generation (RAG).
              </p>
            </div>

            {/* Profile photo */}
            <div className="flex-1 ml-20">
              <Image src={zacharyProser} alt="Zachary Proser" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <Image src={a16z2} alt="Zachary Proser" />
          <figcaption className="mt-6">Me speaking at Andreesen Horowitz about the distributed semantic search system I built on AWS using Infrastructure as Code.</figcaption>
        </div>


        {/* Stats */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          {/* Flex container */}
          <div className="flex flex-col lg:flex-row">

            {/* Text content */}
            <div className="flex-1">
              <h2 className="text-base font-semibold leading-8 text-indigo-400">My track record</h2>

              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trustworthy information from someone who knows what they are doing
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                I have been a full-stack open-source developer since 2012. I have built everything from command line tools to web applications, e-commerce sites, and distributed systems.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Along the way, I have specialized in DevOps, Infrastructure as Code and application development and have worked on core teams at Silicon Valley startups such as Cloudflare, Proofpoint,
                Gruntwork, and Pinecone.
              </p>
            </div>

            {/* CV Component */}
            <div className="flex-1">
              <CV />
            </div>
          </div>

          {/* Stats */}
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
                <dt className="text-sm leading-6">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA section */}
        <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1d4240dd-898f-445f-932d-e2872fd12de3"
                width={200}
                height={200}
                x="50%"
                y={0}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={0} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)" />
          </svg>
          <div
            className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <br />
              Get your piece of the Generative AI boom today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              There are two types of people in AI:
            </p>
            <ol>
              <li>1. The informed</li>
              <li>2. The left-behind</li>
            </ol>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href='/checkout?product=generative-ai-bootcamp'
                className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-lg transition duration-300 ease-in-out hover:bg-indigo-500 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:ring-opacity-50"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </main >
    </div >
  )
}

