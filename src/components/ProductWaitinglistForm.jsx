"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { track } from "@vercel/analytics";

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

export const ProductWaitinglistForm = ({
	userEmail,
	productSlug,
	productName,
}) => {
	const [formSuccess, setSuccess] = useState(false);
	const [email, setEmail] = useState(userEmail);

	useEffect(() => {
		setEmail(userEmail);
	}, [userEmail]);

	const sendFormSubmissionEvent = () => {
		// Adjust the event for waiting list sign-up
		gtag("event", "sign_up", {
			method: "waitinglist",
			product: productSlug,
		});
		track("waitinglist-signup", {
			method: "waitinglist",
			product: productSlug,
		})
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;

		const data = {
			email: form.email.value,
			productSlug,
		};

		await fetch("/api/waitinglist-subscribe", {
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		})
			.then(() => {
				sendFormSubmissionEvent();
				setSuccess(true);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	return formSuccess ? (
		<h2 className="flex mt-6 mb-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
			<span className="ml-3">
				🔥 Thank you for joining the waiting list! 🥳
				<br />
				We&apos;ll let you know as soon as the {productName} course is
				available.
			</span>
		</h2>
	) : (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
		>
			<div className="mt-6 flex">
				<input
					type="email"
					name="email"
					placeholder={userEmail}
					aria-label="Email address"
					required
					className="flex-auto w-9/12 appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
					value={email}
					onChange={handleEmailChange}
				/>
				<Button variant="solid" color="green" type="submit" className="w-3/12 ml-4 flex-none">
					Count me in
				</Button>
			</div>
		</form>
	);
};

export default ProductWaitinglistForm;
