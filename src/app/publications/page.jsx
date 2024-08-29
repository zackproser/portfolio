import Head from 'next/head'
import { SimpleLayout } from '@/components/SimpleLayout'
import { generateOgUrl } from '@/utils/ogUrl'
import Publications from '@/components/PublicationsList'

const data = {
  title: 'Modern Coding - Publications',
  description: 'AI, The future, and how to prepare',
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Modern Coding',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Page() {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <SimpleLayout
        title="Published works"
        intro="">
        <Publications />
      </SimpleLayout>
    </>
  )
}

