"use client";
import React, { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { useSession } from "next-auth/react";

import { CourseStatus } from "@/utils/productUtils";

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import { redirect } from "next/navigation";
import { signIn } from "next-auth/react"

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
	const [productId, setProductId] = useState(0);
	const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

	useEffect(() => {
		// If user is signed in, get their email and purchased courses
		if (session) {
			setUserEmail(session.user.email as unknown as string);
			const purchasedCourses = session.user.purchased_courses;
			if (
				Array.isArray(purchasedCourses) &&
				purchasedCourses.every((item) => typeof item === "number")
			) {
				setPurchasedCourses(purchasedCourses);
			} else {
				// Handle the case where purchased_courses is not an array of numbers
				console.error("purchased_courses is not an array of numbers");
			}
		}
	}, [session]);

	// Product validity check: ensure product is available for sale
	// Otherwise, redirect user to the product-specific waitinglist
	useEffect(() => {
		fetch(`/api/products?product=${productSlug}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(`data: ${JSON.stringify(data)}`);

				const { title, status } = data;

				setProductTitle(title);
				setProductStatus(status);
			});
	}, [productSlug]);

	// If user is not signed in, redirect them to sign in page, while passing the 
	// correct callbackUrl so that the user is finally redirected to the checkout
	useEffect(() => {
		if (status === "unauthenticated" || session === null) {
			signIn('', { callbackUrl: `/learn/${productSlug}/0` })
		}
	}, [productSlug, status, session]);


	// If the product is not ready yet, redirect them to the waitinglist page
	if (
		productStatus === CourseStatus.InProgress ||
		productStatus === CourseStatus.ComingSoon
	) {
		redirect(
			`/waitinglist?product=${productSlug}&productName=${productTitle}&email=${userEmail}`,
		);
	}

	useEffect(() => {
		if (!productSlug) return;

		let isSubscribed = true; // To handle potential memory leak

		fetch(`/api/products?product=${productSlug}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (isSubscribed) {
					setProductId(data.course_id);
				}
			});

		// Clean up function to set isSubscribed to false when component unmounts
		return () => {
			isSubscribed = false;
		};
	}, [productSlug]);

	// If user has already purchased the course, redirect them to start learning
	useEffect(() => {
		if (purchasedCourses.includes(productId)) {
			redirect(`/learn/${productSlug}/0`);
		}
	}, [purchasedCourses, productId, productSlug]);

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
