'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { track } from "@vercel/analytics";
import { sendGTMEvent } from '@next/third-parties/google';
import clsx from 'clsx';

function MailIcon(props) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="#21fc0d"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path
				d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
				className="fill-green-100 stroke-green-400 dark:fill-green-100/10 dark:stroke-green-500"
			/>
			<path
				d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
				className="stroke-green-400 dark:stroke-green-500"
			/>
		</svg>
	);
}

export default function Newsletter({ title, body, successMessage, onSubscribe = () => {}, className, position = "content", tags = [] }) {
	const referrer = usePathname()
	const [formSuccess, setSuccess] = useState(false);
	const [formError, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const sendFormSubmissionEvent = () => {
		console.log('Tracking newsletter signup event with:', { method: "newsletter", source: referrer, position, tags });
		
		// Send to GTM for conversion tracking
		sendGTMEvent({
			event: "newsletter-signup-conversion",
			method: "newsletter",
			source: referrer,
			position: position,
			tags: tags?.join(',') || '',
			slug: referrer?.split('/').pop() || 'homepage'
		});

		// Send to Vercel Analytics
		track("newsletter-signup", {
			method: "newsletter",
			source: referrer,
			position: position,
			tags: tags,
			slug: referrer?.split('/').pop() || 'homepage'
		});
	};

	// Handle the submit event on form submit.
	const handleSubmit = async (event) => {
		// Stop the form from submitting and refreshing the page.
		event.preventDefault();

		// Reset error state
		setError(false);
		setErrorMessage("");

		const form = event.target;

		// Get data from the form.
		const data = {
			email: form.email.value,
			referrer,
			tags,
		};

		// Track the event first to ensure it's always called
		sendFormSubmissionEvent();
		
		// Call the onSubscribe callback if provided
		if (typeof onSubscribe === 'function') {
			onSubscribe();
		}

		// Send the form data to our API and get a response.
		try {
			const response = await fetch("/api/form", {
				// Body of the request is the JSON data we created above.
				body: JSON.stringify(data),
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				// The method is POST because we are sending data.
				method: "POST",
			});
				
			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.data || "Failed to subscribe");
			}
				
			// Update the form UI to show the user their subscription was successful
			setSuccess(true);
		} catch (e) {
			console.error("Newsletter submission error:", e);
			setError(true);
			setErrorMessage(e.message || "Something went wrong. Please try again.");
		}
	};

	return formSuccess ? (
		<div className="flex flex-col mt-6 mb-6 p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
			<h2 className="flex items-center text-lg">
				<span className="mr-2">🧠</span>
				<span>Neural Network Activated! 🤖❗</span>
			</h2>
			<p className="mt-2">
				{successMessage || "Thank you for joining our AI research community! More AI engineering wisdom coming your way soon."}
			</p>
		</div>
	) : formError ? (
		<div className="flex flex-col mt-6 mb-6 p-4 text-sm font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
			<h2 className="flex items-center text-lg">
				<span className="mr-2">⚠️</span>
				<span>Something went wrong</span>
			</h2>
			<p className="mt-2">
				{errorMessage || "We couldn't process your subscription."}
			</p>
			<p className="mt-2">
				Please email <a href="mailto:zackproser@gmail.com" className="underline text-blue-600 dark:text-blue-400">zackproser@gmail.com</a> for support.
			</p>
		</div>
	) : (
		<form
			onSubmit={handleSubmit}
			className={clsx(
				"rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 tracer-glow",
				"bg-white dark:bg-zinc-900",
				className
			)}
		>
			<h2 className="flex text-sm font-semibold !text-zinc-900 dark:!text-zinc-100 not-prose">
				<MailIcon className="h-6 w-6 flex-none" />
				<span className="ml-3">{title ?? 'Supercharge your development skills'} ⚡</span>
			</h2>
			<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
				{body ?? 'I publish technical content for developers who want to skill up'}
			</p>
			<div className="mt-6 flex">
				<input
					type="email"
					name="email"
					placeholder="Email address"
					aria-label="Email address"
					required
					className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400/10 sm:text-sm"
				/>
				<Button variant="solid" color="orange" type="submit" className="ml-4 flex-none">
					Count me in
				</Button>
			</div>
		</form>
	);
};
