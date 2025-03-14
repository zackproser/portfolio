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
					content="I&apos;m Zachary Proser, a staff developer advocate, open-source developer, and technical writer"
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
								I&apos;m a full-stack open source hacker with{" "}
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
							
							<h2 className="text-2xl font-bold text-black dark:text-zinc-100 mt-8">Content Creator</h2>
							<p>
								I create educational content across multiple platforms:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									<Link className="text-green-500 hover:text-green-700" href="/videos">
										Video tutorials
									</Link> on complex technical subjects, published on my{" "}
									<Link className="text-green-500 hover:text-green-700" href="https://youtube.com/@zackproser">
										YouTube channel
									</Link>
								</li>
								<li>
									<Link className="text-green-500 hover:text-green-700" href="/publications">
										Technical articles
									</Link> published in major tech publications like freeCodeCamp, Techatty, and others
								</li>
								<li>
									<Link className="text-green-500 hover:text-green-700" href="/products">
										Premium educational products
									</Link> for developers looking to level up their skills
								</li>
							</ul>
							
							<h2 className="text-2xl font-bold text-black dark:text-zinc-100 mt-8">Business</h2>
							<p>
								I run <a href="https://mindonfire.net" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 font-bold">MIND ON FIRE LLC</a>, a consulting company that helps businesses with technical content, software development, and developer advocacy.
							</p>
							
							<p>
								If you find my work valuable, you can <a href="https://sponsor.zackproser.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">sponsor my open source projects</a> to help me continue creating quality content.
							</p>
							
							<Newsletter />
							
							<p>
								<Link className="text-green-500 hover:text-green-700" href="/testimonials">See what my colleagues say</Link> about working with me.
							</p>
							
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