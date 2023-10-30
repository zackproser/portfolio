import { Container } from '@/components/Container'

import {
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon
} from '@/components/SocialIcons'

import { generateOgUrl } from '@/utils/ogUrl'

const data = {
  title: 'Contact me',
  description:
    'Something on your mind? I am easy to find...'
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Zack Proser&apos;s portfolio',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="dark:bg-zinc-900 bg-white py-50 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 pl-4 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              <div>
                <h2 className="text-3xl font-bold tracking-tight dark:text-zinc-400">Something on your mind?</h2>
                <p className="mt-4 leading-7 text-gray-600">
                  I&apos;m easy to find.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Email</h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a className="font-semibold text-indigo-600" href="mailto:zackproser@gmail.com">
                          zackproser@gmail.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900"><LinkedInIcon className="w-6 h-6" fill={"blue"} />LinkedIn</h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">LinkedIn Profile</dt>
                      <dd>
                        <a className="font-semibold text-indigo-600" href="https://linkedin.com/in/zackproser">
                          https://linkedin.com/in/zackproser
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900"><GitHubIcon className="w-6 h-6" fill={"black"} /> GitHub</h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">github.com/zackproser</dt>
                      <dd>
                        <a className="font-semibold text-indigo-600" href="https://github.com/zackproser">
                          github.com/zackproser
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900"><TwitterIcon className="w-6 h-6" fill={"blue"} />Twitter</h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">@zackproser</dt>
                      <dd>
                        <a className="font-semibold text-indigo-600" href="https://twitter.com/zackproser">
                          https://twitter.com/zackproser
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
