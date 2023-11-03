'use client';

import { useSession, signIn } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';

import githubSignin from '@/images/github-signin.png';

import { Container } from '@/components/Container'
import LoginButton from '@/components/login-btn'

import zpSchoolForHackers from '@/images/zp-school-for-hackers.png'

export default function LearningHome() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <Container className="mt-9">
          <Link onClick={() => signIn()} href="/learn" className="text-sm font-semibold leading-6 text-white">
            <Image width={1200} src={githubSignin} alt="Github Signin" />
          </Link>
          <LoginButton />
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="mt-9">
        <div className="bg-purple-600 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{session.user?.name}, you&apos;re in!</h1>
            <div className="p-6">
              <Image src={zpSchoolForHackers} alt="Zachary Proser's School for Hackers" />
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              <h2 className="text-2l font-bold tracking-tight text-white sm:text-4xl">Something big is coming...</h2>
            </p>
          </div>
        </div>
        <LoginButton />
      </Container>
    </>
  )
}


