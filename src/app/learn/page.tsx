import Image from 'next/image';
import { Metadata } from 'next';
import { createMetadata } from '@/utils/createMetadata';

import { Container } from "@/components/Container";
import CourseIndex from '@/components/CourseIndex';
import { Button } from "@/components/Button";

import advice from '@/images/advice.webp'
import projects from '@/images/projects.webp'
import portfolio from '@/images/portfolio.webp'
import getHired from '@/images/get-hired.webp'
import skills from '@/images/skills.webp'
import community from '@/images/community.webp'
import mentorship from '@/images/mentorship.webp'

export const metadata: Metadata = createMetadata({
  title: "Learn AI Development - School for Hackers",
  description: "Project-based learning program to build real-world AI applications. Develop marketable skills, get mentorship, and build your portfolio to advance your career in AI development.",
});

type Feature = {
  name: string
  description: string
}

type FeaturesProps = {
  features: Feature[];
};

const features: Feature[] = [
  { name: 'Projects', description: 'Real projects designed by a Staff-level software engineer' },
  { name: 'Advice', description: 'Exclusive guidance and career advice available only to students' },
  { name: 'Community', description: 'Learn from and network with other students' },
  { name: 'Portfolio', description: 'Courses are designed to roll up into your portfolio, building your online presence and helping you stand-out to hiring managers' },
  { name: 'Marketable skills', description: 'From Infrastructure as Code to software engineering, CI/CD, automation, deployments, command line tools and more' },
  { name: 'Mentorship', description: 'Get pair-coding and real-time help from teachers' },
  { name: 'Get hired', description: 'Get your next job by leveraging your portfolio and new skills' },
]

function Features({ features }: FeaturesProps) {
  return (
    <div className="">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How it works
          </h2>
          <div className="mt-4 p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
            <p className="text-gray-900 dark:text-white text-lg">
              Zachary Proser&apos;s School for Hackers is a project-based learning program with two goals:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-400">
              <li className="text-sm sm:text-base">
                Help you build real-world software skills
              </li>
              <li className="text-sm sm:text-base">
                Help you demonstrate these skills effectively so you can get hired
              </li>
            </ul>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <dt className="font-medium text-gray-900 dark:text-white">{feature.name}</dt>
                <dd className="mt-2 text-sm text-gray-500 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Replace with your image elements */}
          <Image
            src={projects}
            alt="Real software projects"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <Image
            src={advice}
            alt="High quality advice"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <Image
            src={community}
            alt="Network with other students"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <Image
            src={portfolio}
            alt="Build a real portfolio"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <Image
            src={skills}
            alt="Develop hands-on skills"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <Image
            src={mentorship}
            alt="Mentorship"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />

          <Image
            src={getHired}
            alt="Build a real portfolio"
            className="rounded-lg bg-gray-100 dark:bg-gray-700"
          />

        </div>
      </div>
    </div>
  )
}

export default async function LearnPage() {

  return (
    <Container>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Learn by doing</h2>
            <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
              I know that project-based learning builds real skills, because it is the exact process I followed to get to where I am today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="flex flex-col items-center text-center">
              <svg
                className=" h-16 w-16 mb-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 7 3 5" />
                <path d="M9 6V3" />
                <path d="m13 7 2-2" />
                <circle cx="9" cy="13" r="3" />
                <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
                <path d="M16 16h2" />
              </svg>
              <h3 className="text-2xl font-semibold">Project-Based Learning</h3>
              <p className="mt-2 text-zinc-500">Do project-based learning for real skill-building.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg
                className=" h-16 w-16 mb-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />
                <polyline points="8 10 12 14 16 10" />
              </svg>
              <h3 className="text-2xl font-semibold">Real-World Portfolio</h3>
              <p className="mt-2 text-zinc-500">Use every completed project to create a real-world portfolio.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg
                className=" h-16 w-16 mb-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 className="text-2xl font-semibold">Get Hired</h3>
              <p className="mt-2 text-zinc-500">Use your portfolio and new skills to get hired.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-10">
            <Button
              variant="green"
              href="/waitinglist"
            >
              Join the waiting list
            </Button>
          </div>
        </div>
      </section>
      <h2 className="text-3xl font-semibold mt-5 py-5 text-center">Courses</h2>
      <CourseIndex />
    </Container>
  )
}