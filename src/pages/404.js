import { Container } from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';

import wizard404 from '@/images/404-wizard.jpeg';

export default function Custom404() {
  return (
    <Container className="mt-16 sm:mt-32">
      <h1 className="m-12 leading-7 dark:text-zinc-400 text-9xl text-center">404</h1>
      <h2 className="m-12 leading-3 dark:text-zinc-400 text-3xl text-center">Whoops - we couldn&apos;t find that page!</h2>
      <Image src={wizard404} alt="404 wizard" />
      <Link href={'/'} className="m-12 leading-3 dark:text-zinc-400 text-3xl text-center"
      >
        <h1 className="m-12 leading-7 dark:text-zinc-400 text-9xl text-center">Go Home?</h1>
      </Link>

    </Container>
  );
}
