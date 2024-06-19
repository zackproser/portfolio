import Head from "next/head";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from '../../auth'
import { Container } from "@/components/Container";
import Newsletter from "@/components/NewsletterWrapper";
import CV from "@/components/CV";
import {
	GitHubIcon,
	InstagramIcon,
	LinkedInIcon,
	TwitterIcon,
	YouTubeIcon,
	SocialLink,
} from "@/components/SocialIcons";
import { MailIcon } from '@/components/icons'
import RenderNumYearsExperience from "@/components/NumYearsExperience";
import RandomImage from '@/components/RandomImage'
import { generateOgUrl } from "@/utils/ogUrl";

const data = {
	title: "About Zachary Proser",
	description:
		"Full-stack open-source hacker, technical writer and developer advocate.",
};

const ogUrl = generateOgUrl(data);

export const metadata = {
	openGraph: {
		title: data.title,
		description: data.description,
		url: ogUrl,
		siteName: "Zack Proser&apos;s portfolio",
		images: [
			{
				url: ogUrl,
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default async function About() {

	const session = await auth();

	return (
		<>
			<Head>
				<title>About - Zachary Proser</title>
				<meta
					name="description"
					content="I’m Zachary Proser, a staff developer advocate, open-source developer, and technical writer"
				/>
			</Head>
			<Container className="mt-16 sm:mt-32">
				<div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
					<div className="lg:pl-20">
						<div className="max-w-xs px-2.5 lg:max-w-none">
							<Suspense>
								<RandomImage />
							</Suspense>
						</div>
					</div>
					<div className="lg:order-first lg:row-span-2">
						{session?.user && (
							<div className="flex items-center space-x-2">
								<span role="img" aria-label="wave">👋</span>
								<span className="text-green-500 font-bold">Nice to see you again! You are signed in.</span>
							</div>
						)}
						<h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-100 sm:text-5xl">
							Hi, I&apos;m Zachary
						</h1>
						<div className="mt-6 space-y-7 text-base text-black dark:text-zinc-400">
							<p>
								I&apos;m a staff developer advocate at{" "}
								<Link
									className="font-bold text-green-500"
									href="https://pinecone.io"
								>
									Pinecone
								</Link>
								, where we build the best-in-class cloud-native vector database
								at the heart of the Generative AI boom.
							</p>
							<Newsletter />
							<p>
								I have been a full-stack software engineer, technical writer and
								open-source contributor for{" "}
								<span className="text-green-500 font-bold">
									{RenderNumYearsExperience()} years
								</span>
								.
							</p>
							<div className="mt-8">
								<CV />
							</div>
						</div>
					</div>
					<div className="lg:pl-20">
						<ul role="list">
							<SocialLink
								href="https://twitter.com/zackproser"
								icon={TwitterIcon}
								className="mt-4"
							>
								Follow me on Twitter
							</SocialLink>
							<SocialLink
								href="https://youtube.com/@zackproser"
								icon={YouTubeIcon}
								className="mt-4"
							>
								Subscribe to my YouTube channel
							</SocialLink>
							<SocialLink
								href="https://instagram.com/zackproser"
								icon={InstagramIcon}
								className="mt-4"
							>
								Follow me on Instagram
							</SocialLink>
							<SocialLink
								href="https://github.com/zackproser"
								icon={GitHubIcon}
								className="mt-4"
							>
								Follow me on GitHub
							</SocialLink>
							<SocialLink
								href="https://linkedin.com/in/zackproser"
								icon={LinkedInIcon}
								className="mt-4"
							>
								Follow me on LinkedIn
							</SocialLink>
							<SocialLink
								href="mailto:zackproser@gmail.com"
								icon={MailIcon}
								className="mt-4 dark:border-zinc-700/40"
							>
								Drop me an email
							</SocialLink>
						</ul>
					</div>
				</div>
			</Container>
		</>
	);
}
