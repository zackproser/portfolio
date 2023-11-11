import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";

import { SimpleLayout } from '@/components/SimpleLayout';
import GithubSignin from '@/components/github-signin';

import { type ArticleWithSlug } from '@/lib/shared-types';

import Image from 'next/image';


import { Container } from '@/components/Container'


import { getAllCourses } from '@/lib/courses'
import { BlogPostCard } from '@/components/BlogPostCard'


import zpSchoolForHackers from '@/images/zp-school-for-hackers.png'


export default async function LearningHome() {
  const session = await getServerSession(authOptions);
  const courses = session ? await getAllCourses() : [];

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
      title="Learn"
      intro="Zachary Proser&apos;s School for Hackers!">

      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{session.user?.name}, you&apos;re in!</h1>
        <div className="p-6">
          <Image src={zpSchoolForHackers} alt="Zachary Proser's School for Hackers" />
        </div>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          <h2 className="text-2l font-bold tracking-tight text-white sm:text-4xl">Something big is coming...</h2>
        </p>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {courses.map((article: ArticleWithSlug) => (
            <BlogPostCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
