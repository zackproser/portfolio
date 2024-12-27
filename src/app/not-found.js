import { Container } from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';

import wizard404 from '@/images/404-wizard.webp';

import { generateOgUrl } from '@/utils/ogUrl'

const data = {
  title: 'Whoops! 404',
  description: 'There is nothing here!'
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


export default function Custom404() {
  return (
    <Container className="mt-16 lg:mt-32">
      <h1 className="mb-8 text-4xl sm:text-7xl lg:text-9xl text-center leading-none dark:text-zinc-400">404</h1>
      <h2 className="mb-8 text-xl sm:text-2xl lg:text-3xl text-center leading-tight dark:text-zinc-400">
        Whoops - we couldn&apos;t find that page!
      </h2>
      <div className="w-full">
        <Image src={wizard404} alt="404 wizard" />
      </div>
      <Link href="/" className="block mt-8 mb-4 text-xl sm:text-2xl lg:text-3xl text-center leading-tight dark:text-zinc-400">
        Go Home?
      </Link>
    </Container>
  );
}

