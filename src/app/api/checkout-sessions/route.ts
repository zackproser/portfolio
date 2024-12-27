import { auth } from '../../../../auth'
import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { importArticleMetadata } from '@/lib/articles'

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: 'Must be signed in to make purchases' },
				{ status: 401 }
			)
		}

		const { product } = await req.json()

		// Get user ID from email
		const { rows: userRows } = await sql`
			SELECT id FROM users WHERE email = ${session.user.email}
		`

		if (!userRows.length) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		const userId = userRows[0].id

		// Handle article purchases
		if (product.startsWith('blog-')) {
			const articleSlug = product.replace('blog-', '')
			
			try {
				const article = await importArticleMetadata(`${articleSlug}/page.mdx`)

				if (!article.price) {
					return NextResponse.json(
						{ error: 'Article price not set' },
						{ status: 400 }
					)
				}

				const checkoutSession = await stripe.checkout.sessions.create({
					mode: 'payment',
					payment_method_types: ['card'],
					ui_mode: 'embedded',
					line_items: [
						{
							price_data: {
								currency: 'usd',
								product_data: {
									name: article.title,
									description: article.description,
									metadata: {
										type: 'article',
										slug: articleSlug,
										userId: userId.toString()
									},
								},
								unit_amount: article.price,
							},
							quantity: 1,
						},
					],
					metadata: {
						type: 'article',
						slug: articleSlug,
						userId: userId.toString()
					},
					return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
				})

				return NextResponse.json({ clientSecret: checkoutSession.client_secret })
			} catch (error) {
				console.error('Error creating checkout session for article:', error)
				return NextResponse.json(
					{ error: 'Article not found or invalid' },
					{ status: 404 }
				)
			}
		}

		return NextResponse.json(
			{ error: 'Invalid product type' },
			{ status: 400 }
		)

	} catch (error) {
		console.error('Error creating checkout session:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to create checkout session' },
			{ status: 500 }
		)
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
