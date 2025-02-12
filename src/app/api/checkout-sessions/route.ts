import { auth } from '../../../../auth'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { headers } from 'next/headers'
import { importArticleMetadata } from '@/lib/articles'
import { importCourse } from '@/lib/courses'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'
import { ArticleWithSlug, CourseContent, Content } from '@/lib/shared-types'

type StripeMetadata = {
	[key: string]: string;
} & {
	userId: string;
	slug: string;
	type: 'article' | 'course';
}

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16'
})

export async function POST(req: NextRequest) {
	try {
		const headersList = headers()
		const session = await auth()
		if (!session?.user?.email || !session?.user?.id) {
			return NextResponse.json(
				{ error: 'Must be signed in to make purchases' },
				{ status: 401 }
			)
		}

		const body = await req.json()
		const { slug, type } = body as { slug: string; type: 'article' | 'course' }

		if (!slug || !type) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			)
		}

		console.log('Creating checkout session for user:', {
			userId: session.user.id,
			email: session.user.email,
			userIdType: typeof session.user.id
		})

		let content: Content;
		let price: number;

		if (type === 'article') {
			console.log('Fetching article content')
			const articleSlug = slug.replace('blog-', '')
			const articleContent = await importArticleMetadata(`${articleSlug}/page.mdx`)
			if (!articleContent) {
				throw new Error(`No article found with slug ${articleSlug}`)
			}
			if (!articleContent.commerce?.isPaid || !articleContent.commerce?.price) {
				throw new Error(`Article ${articleSlug} is not available for purchase`)
			}
			content = { ...articleContent, slug: articleSlug }
			price = articleContent.commerce.price // Price is already in cents
		} else if (type === 'course') {
			const courseResult = await sql`
				SELECT title, description, slug, price_id FROM courses WHERE slug = ${slug}
			`
			if (courseResult.rows.length === 0) {
				throw new Error(`No course found with slug ${slug}`)
			}
			const courseData = courseResult.rows[0]
			if (!courseData.price_id || !courseData.title || !courseData.description || !courseData.slug) {
				throw new Error('Invalid course data returned from database')
			}
			content = {
				title: courseData.title,
				description: courseData.description,
				slug: courseData.slug,
				price_id: courseData.price_id,
				type: 'course'
			}
			price = 0 // This will be handled by the price_id
		} else {
			throw new Error(`Invalid content type: ${type}`)
		}

		const metadata: StripeMetadata = {
			userId: String(session.user.id),
			slug: content.slug,
			type
		}

		const params: Stripe.Checkout.SessionCreateParams = {
			mode: 'payment',
			ui_mode: 'embedded',
			line_items: [
				{
					...(type === 'article' ? {
						price_data: {
							currency: 'usd',
							product_data: {
								name: content.title,
								description: content.description || 'Premium Article Access',
							},
							unit_amount: price,
						},
					} : {
						price: (content as CourseContent).price_id,
					}),
					quantity: 1,
				},
			],
			metadata,
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

// Called by the /success page to get the payment status when rendering
// the checkout success message
export async function GET(req: Request) {
	const headersList = headers()
	const session = await auth()
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Must be signed in to view purchases' }, { status: 401 })
	}

	const { searchParams } = new URL(req.url)
	const sessionId = searchParams.get('session_id')
	console.log('=== Starting checkout-sessions GET ===')
	console.log('Request URL:', req.url)
	console.log('Search params:', { session_id: sessionId })

	if (!sessionId) {
		return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
	}

	try {
		const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
		console.log('Stripe session retrieved:', {
			payment_status: stripeSession.payment_status,
			metadata: stripeSession.metadata,
			amount_total: stripeSession.amount_total
		})

		if (stripeSession.payment_status !== 'paid') {
			return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
		}

		const { userId, slug, type } = stripeSession.metadata as { userId: string; slug: string; type: string }
		console.log('Processing successful payment for:', { userId, slug, type })

		console.log('userId:', userId)
		const userResult = await sql`
			SELECT id::int as id, email, name FROM users WHERE id = ${userId}::int
		`
		if (userResult.rows.length === 0) {
			throw new Error(`No user found with ID ${userId}`)
		}
		const user = userResult.rows[0]
		console.log('Found user:', { email: user.email, name: user.name })

		console.log('Attempting to get content details:', { type, slug })
		let content: ArticleWithSlug | CourseContent;

		if (type === 'article') {
			console.log('Fetching article content')
			const articleContent = await importArticleMetadata(`${slug}/page.mdx`)
			if (!articleContent) {
				throw new Error(`No article found with slug ${slug}`)
			}
			content = { ...articleContent, slug, type: 'article' }
		} else if (type === 'course') {
			const courseResult = await sql`
				SELECT title, description, slug, price_id FROM courses WHERE slug = ${slug}
			`
			if (courseResult.rows.length === 0) {
				throw new Error(`No course found with slug ${slug}`)
			}
			const courseData = courseResult.rows[0]
			if (!courseData.price_id || !courseData.title || !courseData.description || !courseData.slug) {
				throw new Error('Invalid course data returned from database')
			}
			content = {
				title: courseData.title,
				description: courseData.description,
				slug: courseData.slug,
				price_id: courseData.price_id,
				type: 'course'
			}
		} else {
			throw new Error(`Invalid content type: ${type}`)
		}

		console.log('Successfully found content:', { title: content.title, type, slug: content.slug })

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
