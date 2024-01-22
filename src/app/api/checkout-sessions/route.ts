import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { getProductDetails, ProductDetails } from "@/utils/productUtils";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2023-10-16",
});

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";

// POST creates a new Stripe Checkout session, which results in the Checkout
// embedded form being rendered
export async function POST(req: NextRequest) {
	console.log("checkout-sessions POST");

	const nextSession = await getServerSession(authOptions);

	if (!nextSession) {
		return new NextResponse(
			JSON.stringify({
				error: "Must be signed into GitHub to purchase courses",
			}),
			{
				status: 403,
			},
		);
	}

	// Get the user's email address
	const userEmail = nextSession.user.email as unknown as string;

	// Look up the product information based on the slug that was passed into this route
	// from the frontend
	const data = await req.json();
	const productSlug: string = data.product ?? "unknown";
	const productDetails: ProductDetails | null =
		await getProductDetails(productSlug);

	if (!productDetails) {
		return new NextResponse(
			JSON.stringify({
				error: "Invalid product provided.",
			}),
			{
				status: 400,
			},
		);
	}

	// If the course status is either 'in-progress' or 'coming-soon', then it's not actually finished,
	// so we can't actually sell anything yet. Instead, we redirect the user to a waitinglist capture
	// page specifically for that course
	if (
		productDetails.status === "in-progress" ||
		productDetails.status === "coming-soon"
	) {
		redirect(
			`/waitinglist?product=${productSlug}&productName=${productDetails.title}&email=${userEmail}`,
		);
	}

	// If we reach this point, it means:
	// 1. The user is signed into GitHub, so we have a valid session that we can get their info from
	// 2. The product exists
	// 3. The product is available for purchase (it's not still under development)
	//
	// Therefore, we can create a new Stripe Checkout session for the given product, which will result
	// in the Stripe Checkout embedded form being rendered for the user to enter their payment details
	try {
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			line_items: [
				{
					price: productDetails.price_id,
					quantity: 1,
				},
			],
			mode: "payment",
			return_url: `${req.headers.get(
				"origin",
			)}/success?session_id={CHECKOUT_SESSION_ID}&product=${productSlug}`,
		});

		return new NextResponse(
			JSON.stringify({ clientSecret: session.client_secret }),
			{
				status: 200,
			},
		);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return new NextResponse(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
		return new NextResponse(JSON.stringify({ error: "Unknown Error" }), {
			status: 500,
		});
	}
}

// Called by the /success page to get the payment status when rendering
// the checkout success message
export async function GET(req: NextRequest) {
	console.log("checkout-sessions GET");

	try {
		const sessionId = req.nextUrl.searchParams.get("session_id");
		if (!sessionId) {
			throw new Error("Session ID is missing");
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		console.log(`session: ${JSON.stringify(session)}`);

		const product = req.nextUrl.searchParams.get("product");

		if (!session.customer_details) {
			throw new Error("Customer details are missing in the session");
		}

		return new NextResponse(
			JSON.stringify({
				status: session.payment_status,
				customer_email: session.customer_details.email,
				product: product,
			}),
			{
				status: 200,
			},
		);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return new NextResponse(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
		return new NextResponse(JSON.stringify({ error: "Unknown Error" }), {
			status: 500,
		});
	}
}

export async function OPTIONS() {
	const respHeaders = new Headers();
	respHeaders.set("Allow", "POST, GET");
	respHeaders.set("Content-Type", "application/json");

	return NextResponse.next({
		request: {
			headers: respHeaders,
		},
	});
}
