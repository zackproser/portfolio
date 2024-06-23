import Head from 'next/head'
import { SimpleLayout } from '@/components/SimpleLayout'
import { generateOgUrl } from '@/utils/ogUrl'
import Publications from '@/components/PublicationsList'

const data = {
  title: 'My publications',
  description: 'All my publications',
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

export default function Page() {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <SimpleLayout
        title="My publications"
        intro="Links to published works">
        <Publications />
      </SimpleLayout>
    </>
  )
}

