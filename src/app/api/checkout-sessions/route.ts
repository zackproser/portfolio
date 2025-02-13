import { auth } from '../../../../auth'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { headers } from 'next/headers'
import { importArticleMetadata } from '@/lib/articles'
import { Content } from '@/lib/shared-types'

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16'
})

export async function POST(req: NextRequest) {
	try {
		const session = await auth()
		if (!session?.user?.email || !session?.user?.id) {
			return NextResponse.json(
				{ error: 'Must be signed in to make purchases' },
				{ status: 401 }
			)
		}

		const body = await req.json()
		const { slug, type } = body as { slug: string; type: Content['type'] }

		if (!slug || !type) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			)
		}

		const content = await importArticleMetadata(
			`${slug}/page.mdx`, 
			type === 'course' ? 'learn/courses' : 'blog'
		)
		
		if (!content.commerce?.isPaid) {
			return NextResponse.json(
				{ error: 'Content is not available for purchase' },
				{ status: 400 }
			)
		}

		const params: Stripe.Checkout.SessionCreateParams = {
			mode: 'payment',
			ui_mode: 'embedded',
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: content.title,
							description: content.description || 'Premium Content Access',
						},
						unit_amount: content.commerce.price,
					},
					quantity: 1,
				},
			],
			metadata: {
				userId: String(session.user.id),
				slug,
				type: content.type
			},
			return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
		}

		const checkoutSession = await stripe.checkout.sessions.create(params)
		return NextResponse.json({ clientSecret: checkoutSession.client_secret })
	} catch (error) {
		console.error('Error creating checkout session:', error)
		return NextResponse.json(
			{ error: 'Failed to create checkout session' },
			{ status: 500 }
		)
	}
}

export async function GET(req: Request) {
	const session = await auth()
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Must be signed in to view purchases' }, { status: 401 })
	}

	const { searchParams } = new URL(req.url)
	const sessionId = searchParams.get('session_id')

	if (!sessionId) {
		return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
	}

	try {
		const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

		if (stripeSession.payment_status !== 'paid') {
			return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
		}

		const { userId, slug, type } = stripeSession.metadata as { userId: string; slug: string; type: Content['type'] }

		const userResult = await sql`
			SELECT id::int as id, email, name FROM users WHERE id = ${userId}::int
		`
		if (userResult.rows.length === 0) {
			throw new Error(`No user found with ID ${userId}`)
		}
		const user = userResult.rows[0]

		const content = await importArticleMetadata(
			`${slug}/page.mdx`, 
			type === 'course' ? 'learn/courses' : 'blog'
		)

		return NextResponse.json({
			content,
			user: session.user,
			session: stripeSession,
			payment_status: stripeSession.payment_status
		})
	} catch (error) {
		console.error('Error retrieving checkout session:', error)
		return NextResponse.json({ error: 'Failed to retrieve checkout session' }, { status: 500 })
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
