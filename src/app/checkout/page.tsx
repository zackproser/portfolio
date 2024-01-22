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
	const [productId, setProductId] = useState(0);
	const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

	// If user is not signed in, redirect them to sign in page
	useEffect(() => {
		if (status === "unauthenticated" || session === null) {
			return redirect("/api/auth/signin");
		}
	}, [status, session]);

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

	if (
		productStatus === CourseStatus.InProgress ||
		productStatus === CourseStatus.ComingSoon
	) {
		return redirect(
			`/waitinglist?product=${productSlug}&productName=${productTitle}&email=${userEmail}`,
		);
	}

	// If user has already purchased the course, redirect them to start learning
	useEffect(() => {
		if (productSlug) {
			fetch(`/api/products?product=${productSlug}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					setProductId(data.course_id);
				});
		}
		if (purchasedCourses.includes(productId)) {
			return redirect(`/learn/${productSlug}/0`);
		}
	});

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
