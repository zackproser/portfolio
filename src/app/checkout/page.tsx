"use client";
import React, { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { useSession } from "next-auth/react";

import { CourseStatus } from "@/utils/productUtils";

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import { redirect } from "next/navigation";

import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const CheckoutPage = () => {
	const searchParams = useSearchParams();
	const { data: session, status } = useSession();
	console.log(`CheckoutPage: session: ${JSON.stringify(session)}`);

	const productSlug = searchParams.get("product");

	const [clientSecret, setClientSecret] = useState("");
	const [productTitle, setProductTitle] = useState("");
	const [productStatus, setProductStatus] = useState("");
	const [userEmail, setUserEmail] = useState("");

	// If user is not signed in, redirect them to sign in page
	useEffect(() => {
		if (status === "unauthenticated" || session === null) {
			return redirect("/api/auth/signin");
		}
	}, [status, session]);

	// If user is signed in, get their email
	useEffect(() => {
		if (session) {
			setUserEmail(session.user.email as unknown as string);
		}
	}, [session]);

	// Product validity check: ensure product is available for sale
	// Otherwise, redirect user to the product-specific waitinglist
	useEffect(() => {
		fetch(`/api/products?product=${productSlug}`).then((res) => {
			res.json().then((data) => {
				console.log(`data: ${JSON.stringify(data)}`);

				const { title, status } = data;

				setProductTitle(title);
				setProductStatus(status);
			});
		});

		console.log(`productStatus: ${productStatus}`);

		if (
			productStatus === CourseStatus.InProgress ||
			productStatus === CourseStatus.ComingSoon
		) {
			return redirect(
				`/waitinglist?product=${productSlug}&productName=${productTitle}&email=${userEmail}`,
			);
		}
	}, [productSlug, productTitle, productStatus, userEmail]);

	// Fetch client secret if logged in and product specified
	useEffect(() => {
		const payload = {
			product: productSlug,
		};

		if (productSlug) {
			fetch("/api/checkout-sessions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})
				.then((res) => res.json())
				.then((data) => setClientSecret(data.clientSecret));
		}
	}, [productSlug]);

	return (
		<Container className="mt-16 sm:mt-32">
			<div id="checkout" className="bg-zinc-50 dark:bg-black">
				{clientSecret && (
					<EmbeddedCheckoutProvider
						stripe={stripePromise}
						options={{ clientSecret }}
					>
						<EmbeddedCheckout />
					</EmbeddedCheckoutProvider>
				)}
			</div>
		</Container>
	);
};

export default CheckoutPage;
