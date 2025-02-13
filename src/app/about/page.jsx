import Head from "next/head";
import { Suspense } from "react";
import Link from "next/link";
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
import RandomPortrait from '@/components/RandomPortrait'
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
		siteName: "Modern Coding",
		images: [
			{
				url: ogUrl,
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default function About() {
	return (
		<>
			<Head>
				<title>About - Zachary Proser</title>
				<meta
					name="description"
					content="I'm Zachary Proser, a staff developer advocate, open-source developer, and technical writer"
				/>
			</Head>
			<Container className="mt-16 sm:mt-32">
				<div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
					<div className="lg:pl-20">
						<div className="max-w-xs px-2.5 lg:max-w-none">
							<Suspense>
								<RandomPortrait width={600} height={600} />
							</Suspense>
						</div>
					</div>
					<div className="lg:order-first lg:row-span-2">
						<h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-100 sm:text-5xl">
							Hi, I&apos;m Zachary
						</h1>
						<div className="mt-6 space-y-7 text-base text-black dark:text-zinc-400">
							<p>
								I'm a full-stack open source hacker with{" "}
								<span className="text-green-500 font-bold">
									{RenderNumYearsExperience()} years
								</span>{" "}
								of software development experience at top startups and established enterprise companies.
							</p>
							<p>
								I work in Developer Education at{" "}
								<Link
									className="font-bold text-green-500"
									href="https://workos.com"
								>
									WorkOS
								</Link>
								, where we help companies add enterprise features to their apps in minutes, not months.
							</p>
							<Newsletter />
							<p>Read what it&apos;s like to work with me <Link className="text-green-500 font-bold" href="/testimonials">here</Link>.</p>
							<div className="mt-8">
								<CV />
							</div>
						</div>
					</div>
					<div className="lg:pl-20">
						<ul role="list" className="space-y-4">
							<SocialLink href="https://twitter.com/zackproser" icon={TwitterIcon}>
								Follow on Twitter
							</SocialLink>
							<SocialLink href="https://youtube.com/@zackproser" icon={YouTubeIcon}>
								Subscribe to my YouTube channel
							</SocialLink>
							<SocialLink href="https://instagram.com/zackproser" icon={InstagramIcon}>
								Follow me on Instagram
							</SocialLink>
							<SocialLink href="https://github.com/zackproser" icon={GitHubIcon}>
								Follow on GitHub
							</SocialLink>
							<SocialLink href="https://linkedin.com/in/zackproser" icon={LinkedInIcon}>
								Follow on LinkedIn
							</SocialLink>
							<SocialLink
								href="mailto:zackproser@gmail.com"
								icon={MailIcon}
							>
								zackproser@gmail.com
							</SocialLink>
						</ul>
					</div>
				</div>
			</Container>
		</>
	);
}
