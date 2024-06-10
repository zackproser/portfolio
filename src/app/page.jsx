import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { SignIn } from "@/components/sign-in";

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
import RenderNumYearsExperience from "@/components/NumYearsExperience";

import portraitImage from '@/images/zachary-proser.webp'

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

function MailIcon(props) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				fillRule="evenodd"
				d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
			/>
		</svg>
	);
}

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
							<Image
								src={portraitImage}
								alt=""
								sizes="(min-width: 1024px) 32rem, 20rem"
								className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
							/>
						</div>
					</div>
					<div className="lg:order-first lg:row-span-2">
						{session?.user && (
							<div className="flex items-center space-x-2">
								<span role="img" aria-label="wave">👋</span>
								<span className="text-green-500 font-bold">Nice to see you again! You are signed in.</span>
							</div>
						)}
						<h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
							Hi, I&apos;m Zachary
						</h1>
						<div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
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
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Areas of expertise
							</h2>
							You can get a sense of my work on{" "}
							<Link className="font-extrabold text-green-500" href={"/blog/"}>
								my blog
							</Link>{" "}
							and by watching{" "}
							<Link href={"/videos/"} className="font-extrabold text-green-500">
								my videos
							</Link>
							.
							<ul className="list-disc">
								<li className="font-bold ml-4">Generative AI</li>
								<li className="font-bold ml-4">
									Application and web development
								</li>
								<li className="font-bold ml-4">Infrastructure as Code (IaC)</li>
								<li className="font-bold ml-4">
									Developer tooling and AI-coding assistants
								</li>
								<li className="font-bold ml-4">Developer experience</li>
								<li className="font-bold ml-4">DevOps</li>
								<li className="font-bold ml-4">
									Command line interfaces (CLIs)
								</li>
								<li className="font-bold ml-4">REST APIs</li>
								<li className="font-bold ml-4">Technical writing</li>
							</ul>
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Technologies
							</h2>
							<ul className="list-disc">
								<li className="font-bold ml-4">JavaScript / Node / Next.js</li>
								<li className="font-bold ml-4">Golang</li>
								<li className="font-bold ml-4">Python</li>
								<li className="font-bold ml-4">Terraform</li>
								<li className="font-bold ml-4">AWS</li>
								<li className="font-bold ml-4">Vercel</li>
								<li className="font-bold ml-4">Cloudflare</li>
								<li className="font-bold ml-4">GitHub</li>
								<li className="font-bold ml-4">
									Coding assistants: CoPilot, Codium, Cody, etc
								</li>
							</ul>
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Hacker for hire
							</h2>
							<p className="">
								I advise investors, startups, product managers and technical
								leaders on everything from AI-assisted developer tooling to
								security best practices, team dynamics and improving velocity.
							</p>
							<p>
								I can provide product feedback, hands-on stress testing and
								marketing amplification, and a staff-level developer perspective
								on your product or strategy.
							</p>
							<div className="ml-22 p-8 mt-6 mb-3 z-50">
								<Button
									variant="blue"
									className="bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-500"
									href={"https://calendly.com/zackproser/60min"}
								>
									Book a consultation - $500 per hour
								</Button>
							</div>
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Open-source work and maintenance
							</h2>
							<p>
								I&apos;ve been a software developer and open-source contributor
								for{" "}
								<span className="text-green-500 font-bold">
									{RenderNumYearsExperience()} years
								</span>
								. All of my open-source work lives at{" "}
								<Link
									className="font-bold text-green-500"
									href="https://github.com/zackproser"
								>
									https://github.com/zackproser
								</Link>
							</p>
							<p>
								In my free time, I love to research new techniques and to
								practice keyboard-driven development using tmux, neovim, awesome
								window manager and other powerful open source tools.
							</p>
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Where I&apos;m coming from
							</h2>
							<p>
								I believe deeply in sharing knowledge and taking the time out to
								pass along what you know to others. I am a self-taught
								developer, and I brought myself up mostly through unceasing
								practice, study and consumption of free learning materials that
								other developers made available on the internet.
							</p>
							<p>
								This site is a part of the way I give back and say thanks to
								those who took time out of their day to stop what they were
								doing and show me a better way to accomplish a task, to use a
								tool, to decompose a problem.
							</p>
							<h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
								Available for limited consulting and advisory work
							</h2>
							<p>
								I advise companies and investors on AI, machine learning, and
								developer tooling, so long as there&apos;s no conflict of
								interest with my primary work at Pinecone.
							</p>
							<p>
								If you have questions about emerging technologies, best
								practices or want feedback or insight from someone who codes and
								writes every day,{" "}
								<Link
									className="text-bold text-green-500"
									href={"mailto:zackproser@gmail.com"}
								>
									{" "}
									feel free to reach out
								</Link>
								.
							</p>
							<Newsletter />
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
							<Button
								variant="blue"
								className="p-4 rounded-full mt-8 font-extrabold text-white"
								href="https://calendly.com/zackproser/60min"
							>
								Book a call with me - $500 per hour
							</Button>
							<SocialLink
								href="mailto:zackproser@gmail.com"
								icon={MailIcon}
								className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
							>
								Drop me an email
							</SocialLink>
						</ul>
						<div className="mt-8">
							<CV />
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
