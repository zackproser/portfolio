"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Container } from "@/components/Container";
import { useSession } from "next-auth/react";
import { CourseStatus } from "@/utils/productUtils";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react"
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout
} from "@stripe/react-stripe-js";

// Initialize Stripe outside component to avoid re-initialization
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutPage = () => {
	const searchParams = useSearchParams();
	const { data: session, status } = useSession();
	console.log(`CheckoutPage: session:`, session);

	const productSlug = searchParams.get("product");

	const [clientSecret, setClientSecret] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [productTitle, setProductTitle] = useState("");
	const [productStatus, setProductStatus] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [productId, setProductId] = useState<number | null>(0);
	const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

	useEffect(() => {
		// If user is signed in, get their email and purchased courses
		if (session?.user?.email) {
			setUserEmail(session.user.email);
			const courses = (session.user as any).purchased_courses;
			if (Array.isArray(courses) && courses.every((item) => typeof item === "number")) {
				setPurchasedCourses(courses);
			} else {
				console.error("purchased_courses is not an array of numbers");
			}
		}
	}, [session]);

	// Product validity check: ensure product is available for sale
	useEffect(() => {
		if (!productSlug) return;

		const type = searchParams.get('type') || 'blog';
		
		fetch(`/api/products?product=${productSlug}&type=${type}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(`Product data:`, data);
				const { title, status } = data;
				setProductTitle(title);
				setProductStatus(status);
			});
	}, [productSlug, searchParams]);

	// If user is not signed in, redirect them to sign in page
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

	// Fetch client secret if logged in and product specified
	useEffect(() => {
		if (!productSlug || !session?.user?.email) return;

		setLoading(true);
		setError("");

		const type = searchParams.get('type') || 'blog';
		const payload = {
			slug: productSlug,
			type
		};

		fetch("/api/checkout-sessions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Checkout session response:", data);
				if (data.error) {
					throw new Error(data.error);
				}
				if (!data.clientSecret) {
					throw new Error("No client secret returned");
				}
				setClientSecret(data.clientSecret);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error creating checkout session:", err);
				setError(err.message || "Failed to initialize checkout");
				setLoading(false);
			});
	}, [productSlug, session, searchParams]);

	if (error) {
		return (
			<Container className="mt-16 sm:mt-32">
				<div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4">
					<h3 className="text-sm font-medium text-red-800 dark:text-red-200">
						Error initializing checkout
					</h3>
					<p className="mt-2 text-sm text-red-700 dark:text-red-300">
						{error}
					</p>
				</div>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container className="mt-16 sm:mt-32">
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
					<span className="ml-3">Initializing checkout...</span>
				</div>
			</Container>
		);
	}

	return (
		<Container className="mt-16 sm:mt-32">
			<div id="checkout" className="bg-zinc-50 dark:bg-black min-h-[500px] p-4 rounded-lg">
				{clientSecret ? (
					<EmbeddedCheckoutProvider
						stripe={stripePromise}
						options={{ clientSecret }}
					>
						<EmbeddedCheckout />
					</EmbeddedCheckoutProvider>
				) : (
					<div className="text-center text-gray-500">
						Waiting for checkout initialization...
					</div>
				)}
			</div>
		</Container>
	);
}

export default function CheckoutPageWrapper() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CheckoutPage />
		</Suspense>
	);
}
