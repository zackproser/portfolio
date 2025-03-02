import Image from 'next/image'
import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import RandomPortrait from '@/components/RandomPortrait'
import RenderNumYearsExperience from '@/components/NumYearsExperience'

import logoWorkOS from '@/images/logos/workos.svg'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoCloudflare from '@/images/logos/cloudflare.svg'
import logoCloudmark from '@/images/logos/cloudmark.png'
import logoBrightcontext from '@/images/logos/brightcontext.png'

interface AuthorProps {
  name: string
  bio?: string
}

export function Author({ name, bio }: AuthorProps) {
  const defaultBio = `I'm a software engineer with over ${RenderNumYearsExperience()} years of experience building production systems.`

  const experience = [
    {
      company: 'WorkOS',
      title: 'Developer Education',
      logo: logoWorkOS,
      start: '2024',
      end: 'Present'
    },
    {
      company: 'Pinecone.io',
      title: 'Staff Developer Advocate',
      logo: logoPinecone,
      start: '2023',
      end: '2024'
    },
    {
      company: 'Gruntwork.io',
      title: 'Tech Lead',
      logo: logoGrunty,
      start: '2020',
      end: '2023'
    },
    {
      company: 'Cloudflare',
      title: 'Senior Software Engineer',
      logo: logoCloudflare,
      start: '2017',
      end: '2020'
    },
    {
      company: 'Cloudmark',
      title: 'Software Engineer',
      logo: logoCloudmark,
      start: '2015',
      end: '2017'
    },
    {
      company: 'BrightContext',
      title: 'Software Engineer',
      logo: logoBrightcontext,
      start: '2012',
      end: '2014'
    }
  ]

  return (
    <section
      id="author"
      aria-labelledby="author-title"
      className="relative scroll-mt-14 pb-3 pt-8 sm:scroll-mt-32 sm:pb-16 sm:pt-10 lg:pt-16"
    >
      <div className="absolute inset-0 -z-10 bg-slate-50/50 dark:bg-slate-900/50">
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-6xl">
          <SectionHeading number="4" id="author-title">
            Author
          </SectionHeading>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
            <div className="lg:order-2">
              <RandomPortrait width={400} height={400} />
            </div>
            <div className="relative z-10 lg:order-1">
              <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hi, I&apos;m {name}
              </h2>
              <div className="mt-6 space-y-6 text-base text-slate-700 dark:text-slate-300">
                <p>{bio || defaultBio}</p>
                <div className="mt-8 flex flex-col space-y-5">
                  {experience.map((role, roleIndex) => (
                    <div key={roleIndex} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                          <Image src={role.logo} alt="" className="h-6 w-6" unoptimized />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {role.company}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {role.title}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 min-w-[5rem] text-right">
                        {role.start} — {role.end}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
} 