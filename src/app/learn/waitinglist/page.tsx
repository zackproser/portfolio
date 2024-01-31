import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";

import { SimpleLayout } from '@/components/SimpleLayout';
import GithubSignin from '@/components/github-signin';

import Image from 'next/image';
import { Container } from '@/components/Container'
import { Button } from '@/components/Button';
import CourseIndex from '@/components/CourseIndex';

import zpSchoolForHackers from '@/images/zp-school-for-hackers.webp'

export default async function LearningHome() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <>
        <Container className="mt-9">
          <GithubSignin></GithubSignin>
        </Container>
      </>
    );
  }

  return (
    <SimpleLayout
      title="Join the waiting list"
      intro="We&apos;ll reach out via e-mail as soon as the first course is ready...">

      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{session.user?.name}, you&apos;re in!</h1>
        <div className="p-6">
          <Image src={zpSchoolForHackers} alt="Zachary Proser's School for Hackers" />
        </div>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          <h2 className="text-2l font-bold tracking-tight text-white sm:text-4xl">Under construction</h2>
          We&apos;ll reach out to notify you when the first course is ready!
        </p>

        <p className="mt-6 text-lg leading-8 text-gray-300">
          <h2 className="text-2l font-bold tracking-tight text-white sm:text-4xl">Learn more</h2>
          What is the Zachary Proser School for Hackers?<br />
          <Button
            className="mt-4"
            variant="green"
            href={`/learn/about`}
          >
            Learn more
          </Button>
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          <h2 className="text-2l font-bold tracking-tight text-white sm:text-4xl">Coming soon...</h2>
        </p>
        <CourseIndex />
      </div>
    </SimpleLayout >
  )
}
