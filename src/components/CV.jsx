import Image from 'next/image'

import logoCloudflare from '@/images/logos/cloudflare.svg'
import logoCloudmark from '@/images/logos/cloudmark.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoBrightcontext from '@/images/logos/brightcontext.png'

function BriefcaseIcon (props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

export default function CV () {
  const resume = [
    {
      company: 'Pinecone.io',
      title: 'Staff Developer Advocate',
      logo: logoPinecone,
      start: '2023',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear()
      }
    },
    {
      company: 'Gruntwork.io',
      title: 'Tech Lead & Senior Software Engineer',
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
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">My professional experience</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                aria-label={`${role.start.label ?? role.start} until ${role.end.label ?? role.end
                  }`}
              >
                <time dateTime={role.start.dateTime ?? role.start}>
                  {role.start.label ?? role.start}
                </time>{' '}
                <span aria-hidden="true">—</span>{' '}
                <time dateTime={role.end.dateTime ?? role.end}>
                  {role.end.label ?? role.end}
                </time>
              </dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
